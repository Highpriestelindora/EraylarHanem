// ═══ EV ═══
// ─── ERAYLAR EV MODÜLÜ ────────────────────────────────────────────────────────
function evInitCheck(){if(!S.EV)S.EV={faturalar:[],sigortalar:[],bakim:[],tab:'fatura'};if(!S.EV.faturalar)S.EV.faturalar=[];if(!S.EV.sigortalar)S.EV.sigortalar=[];if(!S.EV.bakim)S.EV.bakim=[];if(!S.EV.tab)S.EV.tab='fatura';}
function evTabSec(t){evInitCheck();S.EV.tab=t;sv('EV');rn();}
function evTd(){return new Date().toISOString().slice(0,7);}// YYYY-MM
function evTdFull(){return new Date().toISOString().slice(0,10);}
function evAyFmt(s){if(!s)return'—';try{var p=s.split('-');return p[1]+'/'+p[0];}catch(e){return s;}}
function evFaturaToplam(){evInitCheck();var t=0;(S.EV.faturalar||[]).forEach(function(f){t+=Number(f.tutar)||0;});return t;}
function evOdenmeyen(){evInitCheck();return(S.EV.faturalar||[]).filter(function(f){return!f.odendi;}).length;}
function evSigortaUyari(){evInitCheck();var now=new Date();return(S.EV.sigortalar||[]).filter(function(s){if(!s.bitis)return false;var d=new Date(s.bitis);var diff=(d-now)/(1000*60*60*24);return diff>=0&&diff<=90;}).length;}
function evBakimOncelik(){evInitCheck();return(S.EV.bakim||[]).filter(function(b){return!b.tamamlandi&&b.oncelik==='yüksek';}).length;}

function evH(){
evInitCheck();
var tab=S.EV.tab||'fatura';
var toplamFatura=evFaturaToplam();
var odenmeyen=evOdenmeyen();
var sigUyari=evSigortaUyari();
var bakimYuksek=evBakimOncelik();
var out='<div class="app">';
// HEADER
out+='<div class="hdr" style="background:linear-gradient(135deg,#8E44AD,#6C3483);display:block;padding-bottom:0">';
out+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">';
out+='<div style="display:flex;align-items:center;gap:8px"><div onclick="go(\'home\')" style="cursor:pointer;color:#fff;font-size:20px;min-width:44px;min-height:44px;display:flex;align-items:center">◀</div><div><h1>🏠 Eraylar Ev</h1><small>Fatura · Bakım · Sigorta</small></div></div>';
// Özet badge'ler
var badges='';
if(odenmeyen>0)badges+='<div style="background:#DC2626;color:#fff;border-radius:16px;padding:4px 10px;font-size:11px;font-weight:800">'+odenmeyen+' ödenmemiş</div>';
if(sigUyari>0)badges+='<div style="background:#F39C12;color:#fff;border-radius:16px;padding:4px 10px;font-size:11px;font-weight:800;margin-left:4px">⚠️ '+sigUyari+' sigorta</div>';
if(badges)out+='<div style="display:flex">'+badges+'</div>';
out+='</div>';
// TABS
out+='<div style="display:flex;background:rgba(0,0,0,.2);border-radius:11px 11px 0 0;overflow:hidden">';
[['fatura','💡 Fatura'],['bakim','🔧 Bakım'],['sigorta','🛡️ Sigorta']].forEach(function(t){
  var act=tab===t[0];
  out+='<button onclick="evTabSec(\''+t[0]+'\')" style="flex:1;border:none;padding:9px 3px;font-size:11px;font-weight:800;font-family:\'Nunito\';background:'+(act?'#fff':'transparent')+';color:'+(act?'#8E44AD':'rgba(255,255,255,.88)')+';border-radius:'+(act?'10px 10px 0 0':'0')+';cursor:pointer">'+t[1]+'</button>';
});
out+='</div></div>';
out+='<div class="cnt fi">';
if(tab==='fatura')out+=evFaturaH();
else if(tab==='bakim')out+=evBakimH();
else out+=evSigortaH();
out+='</div></div>';
return out;}

// ─── FATURA SEKME ─────────────────────────────────────────────────────────────
function evFaturaH(){
evInitCheck();
var fats=S.EV.faturalar||[];
var katlar={};
fats.forEach(function(f){var k=f.kategori||'Diğer';if(!katlar[k])katlar[k]=[];katlar[k].push(f);});
var toplam=evFaturaToplam();
var out='';
// Özet kart
out+='<div class="cd" style="background:linear-gradient(135deg,#8E44AD,#6C3483);color:#fff;border:none">';
out+='<div style="display:flex;justify-content:space-between;align-items:center">';
out+='<div><div style="font-size:10px;opacity:.7;font-weight:800">AYLIK TOPLAM</div><div style="font-size:24px;font-weight:900">'+fmt(toplam)+'</div></div>';
var odenmeyen=(fats||[]).filter(function(f){return!f.odendi;}).length;
var odendi=(fats||[]).filter(function(f){return f.odendi;}).length;
out+='<div style="text-align:right"><div style="font-size:11px;opacity:.8">✅ '+odendi+' ödendi</div><div style="font-size:11px;opacity:.8;color:#FCA5A5">⏳ '+odenmeyen+' bekliyor</div></div>';
out+='</div></div>';
// Fatura ekle butonu
out+='<button class="btn" style="background:#8E44AD;color:#fff;margin-bottom:12px" onclick="evMFatura()">➕ Fatura Ekle</button>';
if(fats.length===0){
  out+='<div class="cd" style="text-align:center;padding:32px"><div style="font-size:40px">💡</div><p style="color:var(--txtL);margin-top:8px;font-size:13px">Henüz fatura eklenmedi</p></div>';
  return out;}
// Fatura listesi — kategoriye göre gruplu
var FKAT_IC={'Elektrik':'⚡','Su':'💧','Doğalgaz':'🔥','İnternet':'📶','Aidat':'🏘️','Telefon':'📱','Abonelik':'📺','Diğer':'📋'};
Object.keys(katlar).forEach(function(kat){
  var items=katlar[kat];
  var ktoplam=items.reduce(function(s,f){return s+Number(f.tutar||0);},0);
  out+='<div class="cd" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">';
  out+='<div style="font-weight:800;font-size:14px">'+(FKAT_IC[kat]||'📋')+' '+kat+'</div>';
  out+='<div style="font-size:12px;color:var(--txtL)">'+fmt(ktoplam)+'</div></div>';
  items.forEach(function(f){
    out+='<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--brd)">';
    out+='<div onclick="evOdeTog(\''+f.id+'\')" style="cursor:pointer;font-size:22px">'+(f.odendi?'✅':'⬜')+'</div>';
    out+='<div style="flex:1"><div style="font-size:13px;font-weight:700">'+esc(f.ad)+'</div>';
    out+='<div style="font-size:11px;color:var(--txtL)">'+evAyFmt(f.ay)+(f.periyot==='yillik'?' · Yıllık':f.periyot==='3aylik'?' · 3 Aylık':' · Aylık')+'</div></div>';
    out+='<div style="text-align:right"><div style="font-size:14px;font-weight:800">'+fmt(f.tutar)+'</div>';
    out+='<button class="del" onclick="evFaturaSil(\''+f.id+'\')">🗑️</button></div>';
    out+='</div>';});
  out+='</div>';});
return out;}

// ─── BAKIM SEKME ──────────────────────────────────────────────────────────────
function evBakimH(){
evInitCheck();
var items=S.EV.bakim||[];
var aktif=items.filter(function(b){return!b.tamamlandi;});
var bitmis=items.filter(function(b){return b.tamamlandi;});
var OUT_ONCE={'yüksek':'🔴','orta':'🟡','düşük':'🟢'};
var out='';
out+='<button class="btn" style="background:#8E44AD;color:#fff;margin-bottom:12px" onclick="evMBakim()">➕ Bakım/İş Ekle</button>';
if(aktif.length===0&&bitmis.length===0){
  out+='<div class="cd" style="text-align:center;padding:32px"><div style="font-size:40px">🔧</div><p style="color:var(--txtL);margin-top:8px;font-size:13px">Bekleyen bakım yok 🎉</p></div>';
  return out;}
if(aktif.length>0){
  out+='<h3 style="margin-bottom:8px">⏳ Bekleyen ('+aktif.length+')</h3>';
  aktif.forEach(function(b){
    out+='<div class="cd" style="margin-bottom:10px;border-left:4px solid '+(b.oncelik==='yüksek'?'#DC2626':b.oncelik==='orta'?'#F39C12':'#27AE60')+'">';
    out+='<div style="display:flex;justify-content:space-between;align-items:flex-start">';
    out+='<div style="flex:1"><div style="font-size:14px;font-weight:800">'+(OUT_ONCE[b.oncelik]||'⬜')+' '+esc(b.ad)+'</div>';
    if(b.notlar)out+='<div style="font-size:12px;color:var(--txtL);margin-top:3px">'+esc(b.notlar)+'</div>';
    if(b.tarih)out+='<div style="font-size:11px;color:var(--txtL);margin-top:3px">📅 '+b.tarih+'</div>';
    out+='</div><div style="display:flex;gap:6px;flex-shrink:0">';
    out+='<button class="btn bs" style="padding:6px 12px;font-size:11px;width:auto" onclick="evBakimBit(\''+b.id+'\')">✅ Bitti</button>';
    out+='<button class="del" onclick="evBakimSil(\''+b.id+'\')">🗑️</button>';
    out+='</div></div></div>';});}
if(bitmis.length>0){
  out+='<h3 style="margin-top:16px;margin-bottom:8px">✅ Tamamlanan ('+bitmis.length+')</h3>';
  bitmis.forEach(function(b){
    out+='<div class="cd" style="opacity:.6;margin-bottom:8px">';
    out+='<div style="display:flex;justify-content:space-between;align-items:center">';
    out+='<div><div style="font-size:13px;font-weight:700;text-decoration:line-through">'+esc(b.ad)+'</div>';
    if(b.tarih)out+='<div style="font-size:11px;color:var(--txtL)">'+b.tarih+'</div>';
    out+='</div><button class="del" onclick="evBakimSil(\''+b.id+'\')">🗑️</button>';
    out+='</div></div>';});}
return out;}

// ─── SİGORTA SEKME ────────────────────────────────────────────────────────────
function evSigortaH(){
evInitCheck();
var items=S.EV.sigortalar||[];
var now=new Date();
function sDiff(bitis){if(!bitis)return 9999;return Math.ceil((new Date(bitis)-now)/(1000*60*60*24));}
var out='';
out+='<button class="btn" style="background:#8E44AD;color:#fff;margin-bottom:12px" onclick="evMSig()">➕ Sigorta Ekle</button>';
if(items.length===0){
  out+='<div class="cd" style="text-align:center;padding:32px"><div style="font-size:40px">🛡️</div><p style="color:var(--txtL);margin-top:8px;font-size:13px">Henüz sigorta eklenmedi</p></div>';
  return out;}
items.forEach(function(s){
  var diff=sDiff(s.bitis);
  var urgCol=diff<30?'#DC2626':diff<90?'#F39C12':'#27AE60';
  var urgLbl=diff<0?'⛔ Süresi doldu':diff<30?'🔴 '+diff+' gün':'✅ Geçerli';
  out+='<div class="cd" style="margin-bottom:10px;border-left:4px solid '+urgCol+'">';
  out+='<div style="display:flex;justify-content:space-between;align-items:flex-start">';
  out+='<div style="flex:1"><div style="font-size:14px;font-weight:800">🛡️ '+esc(s.ad)+'</div>';
  if(s.sirket)out+='<div style="font-size:12px;color:var(--txtL)">'+esc(s.sirket)+'</div>';
  out+='<div style="font-size:11px;margin-top:4px">';
  if(s.bas)out+='<span style="color:var(--txtL)">Başlangıç: '+s.bas+'</span> &nbsp;';
  if(s.bitis)out+='<span style="color:'+urgCol+';font-weight:800">Bitiş: '+s.bitis+'</span>';
  out+='</div>';
  if(s.tutar)out+='<div style="font-size:12px;color:var(--txtL);margin-top:2px">'+fmt(s.tutar)+'/yıl</div>';
  if(s.notlar)out+='<div style="font-size:11px;color:var(--txtL);margin-top:3px">'+esc(s.notlar)+'</div>';
  out+='</div><div style="text-align:right;flex-shrink:0">';
  out+='<div style="font-size:11px;font-weight:800;color:'+urgCol+'">'+urgLbl+'</div>';
  out+='<button class="del" onclick="evSigSil(\''+s.id+'\')">🗑️</button>';
  out+='</div></div></div>';});
return out;}

// ─── MODAL: FATURA EKLE ──────────────────────────────────────────────────────
function evMFatura(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>💡 Fatura Ekle</h3><div class="fc">'+
'<div><div class="fl">Fatura Adı *</div><input id="efad" placeholder="ör: Elektrik, Su, İnternet..."></div>'+
'<div><div class="fl">Kategori</div><select id="efkat" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>Elektrik</option><option>Su</option><option>Doğalgaz</option><option>İnternet</option><option>Aidat</option><option>Telefon</option><option>Abonelik</option><option>Diğer</option></select></div>'+
'<div><div class="fl">Tutar (₺) *</div><input id="efamt" type="number" min="0" placeholder="0"></div>'+
'<div><div class="fl">Dönem (Ay)</div><input id="efay" type="month" value="'+new Date().toISOString().slice(0,7)+'"></div>'+
'<div><div class="fl">Periyot</div><select id="efper" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option value="aylik">Aylık</option><option value="3aylik">3 Aylık</option><option value="yillik">Yıllık</option></select></div>'+
'<button class="btn" style="background:#8E44AD;color:#fff" onclick="evFaturaKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';
document.body.appendChild(e);}

function evFaturaKaydet(){
var ad=document.getElementById('efad').value;
var amt=document.getElementById('efamt').value;
if(!ad||!amt){toast('Ad ve tutar zorunlu!','warn');return;}
evInitCheck();
var id=Date.now();
S.EV.faturalar.push({id:id,ad:ad,kategori:document.getElementById('efkat').value,tutar:parseFloat(amt),ay:document.getElementById('efay').value,periyot:document.getElementById('efper').value,odendi:false});
// Finans'a kayıt
if(!S.GIDER)S.GIDER=[];
S.GIDER.push({id:id,dt:evTdFull(),amt:parseFloat(amt),cat:document.getElementById('efkat').value,mod:'EV',desc:ad,usr:S.user||'Görkem'});
sv('EV');sv('GIDER');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Fatura eklendi!','succ');rn();}

function evOdeTog(id){
evInitCheck();
S.EV.faturalar=S.EV.faturalar.map(function(f){return f.id==id?Object.assign({},f,{odendi:!f.odendi}):f;});
sv('EV');rn();}

function evFaturaSil(id){
evInitCheck();
S.EV.faturalar=S.EV.faturalar.filter(function(f){return f.id!=id;});
sv('EV');rn();}

// ─── MODAL: BAKIM EKLE ───────────────────────────────────────────────────────
function evMBakim(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🔧 Bakım/İş Ekle</h3><div class="fc">'+
'<div><div class="fl">İş / Bakım Adı *</div><input id="ebad" placeholder="ör: Boya, Kalorifer, Musluk..."></div>'+
'<div><div class="fl">Öncelik</div><select id="ebonc" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option value="yüksek">🔴 Yüksek</option><option value="orta" selected>🟡 Orta</option><option value="düşük">🟢 Düşük</option></select></div>'+
'<div><div class="fl">Hedef Tarih</div><input id="ebtar" type="date" value="'+evTdFull()+'"></div>'+
'<div><div class="fl">Notlar</div><textarea id="ebnot" placeholder="Detay..."></textarea></div>'+
'<button class="btn" style="background:#8E44AD;color:#fff" onclick="evBakimKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';
document.body.appendChild(e);}

function evBakimKaydet(){
var ad=document.getElementById('ebad').value;
if(!ad){toast('Bakım adı zorunlu!','warn');return;}
evInitCheck();
S.EV.bakim.push({id:Date.now(),ad:ad,oncelik:document.getElementById('ebonc').value,tarih:document.getElementById('ebtar').value,notlar:document.getElementById('ebnot').value,tamamlandi:false});
sv('EV');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Bakım eklendi!','succ');rn();}

function evBakimBit(id){
evInitCheck();
S.EV.bakim=S.EV.bakim.map(function(b){return b.id==id?Object.assign({},b,{tamamlandi:true}):b;});
sv('EV');rn();}

function evBakimSil(id){
evInitCheck();
S.EV.bakim=S.EV.bakim.filter(function(b){return b.id!=id;});
sv('EV');rn();}

// ─── MODAL: SİGORTA EKLE ─────────────────────────────────────────────────────
function evMSig(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🛡️ Sigorta Ekle</h3><div class="fc">'+
'<div><div class="fl">Sigorta Adı *</div><input id="esad" placeholder="ör: Konut Sigortası, DASK..."></div>'+
'<div><div class="fl">Sigorta Şirketi</div><input id="essir" placeholder="Şirket adı"></div>'+
'<div><div class="fl">Başlangıç Tarihi</div><input id="esbas" type="date"></div>'+
'<div><div class="fl">Bitiş Tarihi *</div><input id="esbit" type="date"></div>'+
'<div><div class="fl">Yıllık Prim (₺)</div><input id="esamt" type="number" min="0" placeholder="0"></div>'+
'<div><div class="fl">Notlar</div><textarea id="esnot" placeholder="Poliçe no, vb."></textarea></div>'+
'<button class="btn" style="background:#8E44AD;color:#fff" onclick="evSigKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';
document.body.appendChild(e);}

function evSigKaydet(){
var ad=document.getElementById('esad').value;
var bit=document.getElementById('esbit').value;
if(!ad||!bit){toast('Ad ve bitiş tarihi zorunlu!','warn');return;}
evInitCheck();
var id=Date.now();
var amt=parseFloat(document.getElementById('esamt').value)||0;
S.EV.sigortalar.push({id:id,ad:ad,sirket:document.getElementById('essir').value,bas:document.getElementById('esbas').value,bitis:bit,tutar:amt,notlar:document.getElementById('esnot').value});
if(amt>0){if(!S.GIDER)S.GIDER=[];S.GIDER.push({id:id,dt:evTdFull(),amt:amt,cat:'Sigorta',mod:'EV',desc:ad,usr:S.user||'Görkem'});sv('GIDER');}
sv('EV');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Sigorta eklendi!','succ');rn();}

function evSigSil(id){
evInitCheck();
S.EV.sigortalar=S.EV.sigortalar.filter(function(s){return s.id!=id;});
sv('EV');rn();}
// ─── ERAYLAR EV SONU ─────────────────────────────────────────────────────────
