// ═══ SOSYAL ═══
// ERAYLAR SOSYAL — V8.0.0
// Aktivite planlama, rutin takibi, öneri havuzu
// ═══════════════════════════════════════════════════════════════════════════════

function sosyalInitCheck(){
if(!S.SOSYAL)S.SOSYAL={rutinler:[],aktiviteler:[],havuz:[],tab:'hafta'};
if(!S.SOSYAL.rutinler)S.SOSYAL.rutinler=[];
if(!S.SOSYAL.aktiviteler)S.SOSYAL.aktiviteler=[];
if(!S.SOSYAL.havuz)S.SOSYAL.havuz=[];
if(!S.SOSYAL.tab)S.SOSYAL.tab='hafta';}

function sosyalH(){
sosyalInitCheck();
var tab=S.SOSYAL.tab||'hafta';
var tabs=[{id:'hafta',ic:'📅',l:'Bu Hafta'},{id:'rutinler',ic:'🏋️',l:'Rutinler'},{id:'arsiv',ic:'📊',l:'Arşiv'},{id:'havuz',ic:'💡',l:'Havuz'}];
var fn;
if(tab==='hafta')fn=sosyalHaftaH;
else if(tab==='rutinler')fn=sosyalRutinH;
else if(tab==='arsiv')fn=sosyalArsivH;
else fn=sosyalHavuzH;
return'<div class="app"><div class="hdr" style="background:linear-gradient(135deg,#E91E63,#AD1457)"><div style="display:flex;align-items:center;gap:8px"><div style="font-size:14px;color:rgba(255,255,255,.7);cursor:pointer" onclick="go(\'home\')">◀</div><div><h1>Eraylar Sosyal</h1><small>Aktivite & Rutin & Havuz</small></div></div><div style="display:flex;gap:6px;align-items:center">'+onlineDot()+'<button class="ubtn" onclick="pu(null)">'+(S.user==='Görkem'?'👨':'👩')+' '+S.user+'</button></div></div><div class="cnt fi">'+fn()+'</div><div class="nav">'+tabs.map(function(t){return'<button class="'+(tab===t.id?'on':'')+'" onclick="S.SOSYAL.tab=\''+t.id+'\';rn()"><span class="ico">'+t.ic+'</span><span class="lbl" style="color:'+(tab===t.id?'#E91E63':'var(--txtL)')+'">'+t.l+'</span>'+(tab===t.id?'<span class="dot" style="background:#E91E63"></span>':'')+'</button>';}).join('')+'</div></div>';}

// ─── BU HAFTA SEKMESİ ────────────────────────────────────────────────────────
function sosyalHaftaH(){
sosyalInitCheck();
var now=new Date();
var dayOfWeek=now.getDay();var diff=dayOfWeek===0?6:dayOfWeek-1;
var weekStart=new Date(now);weekStart.setDate(now.getDate()-diff);
var weekEnd=new Date(weekStart);weekEnd.setDate(weekStart.getDate()+6);
var ws=weekStart.toISOString().slice(0,10);var we=weekEnd.toISOString().slice(0,10);

var planned=S.SOSYAL.aktiviteler.filter(function(a){return a.tarih>=ws&&a.tarih<=we&&!a.tamamlandi;});
var done=S.SOSYAL.aktiviteler.filter(function(a){return a.tarih>=ws&&a.tarih<=we&&a.tamamlandi;});

var out='<h2>📅 Bu Hafta</h2>';
out+='<div style="font-size:11px;color:var(--txtL);margin-bottom:14px">'+weekStart.toLocaleDateString('tr-TR',{day:'numeric',month:'short'})+' — '+weekEnd.toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'})+'</div>';

// Planlanan aktiviteler
if(planned.length>0){
out+='<div class="cd"><h3>🎯 Planlanan ('+planned.length+')</h3>';
planned.forEach(function(a){
out+='<div class="si" style="padding:10px 0;cursor:pointer" onclick="sosyalDetay('+a.id+')">';
out+='<div style="font-size:22px;min-width:36px;text-align:center">'+(a.tur==='evde'?'🏠':'🌆')+'</div>';
out+='<div style="flex:1"><div style="font-weight:700;font-size:13px">'+esc(a.baslik)+'</div>';
out+='<div style="font-size:10px;color:var(--txtL)">'+new Date(a.tarih).toLocaleDateString('tr-TR',{weekday:'short',day:'numeric',month:'short'})+(a.mekan?' · '+esc(a.mekan):'')+'</div></div>';
out+='<button style="background:var(--sL);color:var(--sec);border:none;border-radius:8px;padding:5px 10px;font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito" onclick="event.stopPropagation();sosyalTamamla('+a.id+')">✓</button>';
out+='</div>';});
out+='</div>';
}else{
// Havuzdan öneri
var havuz=S.SOSYAL.havuz.filter(function(h){return!h.yapildi;});
out+='<div class="cd" style="text-align:center;padding:24px"><div style="font-size:40px;margin-bottom:8px">🤔</div>';
out+='<div style="font-weight:700;margin-bottom:6px">Bu hafta plan yok!</div>';
if(havuz.length>0){
var rand=havuz[Math.floor(Math.random()*havuz.length)];
out+='<div style="font-size:12px;color:var(--txtL);margin-bottom:10px">Havuzdan öneri:</div>';
out+='<div style="background:var(--pL);padding:12px;border-radius:12px;margin-bottom:10px"><div style="font-weight:700;font-size:14px">'+esc(rand.baslik)+'</div>';
if(rand.tur)out+='<div style="font-size:10px;color:var(--txtL);margin-top:4px">'+(rand.tur==='evde'?'🏠 Evde':'🌆 Dışarı')+'</div>';
out+='</div>';
out+='<button class="btn" style="background:#E91E63;color:#fff;font-size:12px" onclick="sosyalHavuzdanPlanla('+rand.id+')">📅 Bu Hafta Planla</button>';
}else{
out+='<div style="font-size:12px;color:var(--txtL)">Havuza fikir ekleyin!</div>';
}
out+='</div>';}

// Tamamlananlar
if(done.length>0){
out+='<div class="cd"><h3>✅ Yapıldı ('+done.length+')</h3>';
done.forEach(function(a){
out+='<div class="si" style="padding:10px 0;opacity:.7;cursor:pointer" onclick="sosyalDetay('+a.id+')">';
out+='<div style="font-size:22px;min-width:36px;text-align:center">'+(a.tur==='evde'?'🏠':'🌆')+'</div>';
out+='<div style="flex:1"><div style="font-weight:700;font-size:13px;text-decoration:line-through">'+esc(a.baslik)+'</div>';
out+='<div style="font-size:10px;color:var(--txtL)">'+new Date(a.tarih).toLocaleDateString('tr-TR',{weekday:'short',day:'numeric',month:'short'})+'</div></div>';
var pg=(a.puan_gorkem||0);var pe=(a.puan_esra||0);
if(pg||pe)out+='<div style="font-size:10px;text-align:center"><div>👨 '+pg+'/5</div><div>👩 '+pe+'/5</div></div>';
out+='</div>';});
out+='</div>';}

out+='<button class="btn" style="background:#E91E63;color:#fff;margin-top:8px" onclick="sosyalAktiviteEkle()">+ Aktivite Planla</button>';
return out;}

// ─── RUTİNLER SEKMESİ ────────────────────────────────────────────────────────
function sosyalRutinH(){
sosyalInitCheck();
var rutinler=S.SOSYAL.rutinler||[];
var gunler=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
var out='<h2>🏋️ Rutinler</h2>';

if(rutinler.length===0){
out+='<div class="cd" style="text-align:center;padding:24px"><div style="font-size:40px;margin-bottom:8px">🏃</div>';
out+='<div style="font-weight:700;margin-bottom:6px">Henüz rutin eklenmedi</div>';
out+='<div style="font-size:12px;color:var(--txtL)">Spor, hobi veya düzenli aktiviteler</div></div>';
}else{
rutinler.forEach(function(r){
out+='<div class="cd" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">';
out+='<div><div style="font-weight:800;font-size:14px">'+esc(r.aktivite)+'</div>';
out+='<div style="font-size:11px;color:var(--txtL)">'+(r.kisi==='Görkem'?'👨':'👩')+' '+esc(r.kisi)+(r.ucret?' · '+fmt(r.ucret)+'/ay':'')+'</div></div>';
out+='<button class="del" onclick="sosyalRutinSil('+r.id+')">🗑️</button></div>';

// Gün chip'leri
out+='<div style="display:flex;gap:4px;flex-wrap:wrap">';
gunler.forEach(function(g,idx){
var aktif=(r.gunler||[]).indexOf(idx)>=0;
out+='<span style="padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;background:'+(aktif?'#E91E63':'var(--bg)')+';color:'+(aktif?'#fff':'var(--txtL)')+'">'+g+'</span>';});
out+='</div>';

// Bu hafta takibi
var now=new Date();var dayOfWeek=now.getDay();var diff2=dayOfWeek===0?6:dayOfWeek-1;
var weekKey=new Date(now);weekKey.setDate(now.getDate()-diff2);
var wk=weekKey.toISOString().slice(0,10);
var kayitlar=r.haftalik||{};var hk=kayitlar[wk]||[];
var planliGunSayisi=(r.gunler||[]).length;
var yapilan=hk.length;
if(planliGunSayisi>0){
out+='<div style="margin-top:8px;display:flex;align-items:center;gap:8px">';
out+='<div style="flex:1;height:6px;background:var(--bg);border-radius:3px"><div style="height:100%;width:'+Math.min(100,Math.round(yapilan/planliGunSayisi*100))+'%;background:#E91E63;border-radius:3px"></div></div>';
out+='<span style="font-size:10px;font-weight:700;color:var(--txtL)">'+yapilan+'/'+planliGunSayisi+'</span></div>';

// Bugün gidildi mi?
var bugun=now.getDay();var bugunIdx=bugun===0?6:bugun-1;
if((r.gunler||[]).indexOf(bugunIdx)>=0){
var bugunYapildi=hk.indexOf(bugunIdx)>=0;
out+='<button style="margin-top:8px;padding:6px 14px;border-radius:8px;border:none;font-family:Nunito;font-size:11px;font-weight:700;cursor:pointer;background:'+(bugunYapildi?'var(--sL)':'#E91E63')+';color:'+(bugunYapildi?'var(--sec)':'#fff')+'" onclick="sosyalRutinIsaretle('+r.id+','+bugunIdx+')">'+(bugunYapildi?'✓ Bugün yapıldı':'Bugün gittim')+'</button>';
}}
out+='</div>';});
}

out+='<button class="btn" style="background:#E91E63;color:#fff;margin-top:8px" onclick="sosyalRutinEkle()">+ Rutin Ekle</button>';
return out;}

// ─── ARŞİV SEKMESİ ──────────────────────────────────────────────────────────
function sosyalArsivH(){
sosyalInitCheck();
var tamamlanan=S.SOSYAL.aktiviteler.filter(function(a){return a.tamamlandi;}).sort(function(a,b){return b.tarih>a.tarih?1:-1;});
var tekrarListesi=tamamlanan.filter(function(a){return a.tekrar;});

var out='<h2>📊 Arşiv</h2>';

if(tamamlanan.length===0){
out+='<div class="cd" style="text-align:center;padding:24px"><div style="font-size:40px;margin-bottom:8px">📭</div>';
out+='<div style="font-weight:700">Henüz tamamlanan aktivite yok</div></div>';
return out;}

// İstatistik
var topHarcama=0;var topPG=0;var topPE=0;var puanSayisi=0;
tamamlanan.forEach(function(a){topHarcama+=(a.harcama||0);if(a.puan_gorkem){topPG+=a.puan_gorkem;puanSayisi++;}if(a.puan_esra)topPE+=a.puan_esra;});
out+='<div class="cd"><div class="g3" style="text-align:center">';
out+='<div><div style="font-size:22px;font-weight:800;color:#E91E63">'+tamamlanan.length+'</div><div style="font-size:9px;color:var(--txtL)">Aktivite</div></div>';
out+='<div><div style="font-size:22px;font-weight:800;color:var(--sec)">'+fmt(topHarcama)+'</div><div style="font-size:9px;color:var(--txtL)">Harcama</div></div>';
out+='<div><div style="font-size:22px;font-weight:800;color:var(--primary)">'+(puanSayisi>0?(topPG/puanSayisi).toFixed(1):'—')+'</div><div style="font-size:9px;color:var(--txtL)">Ort. Puan</div></div>';
out+='</div></div>';

// Tekrar listesi
if(tekrarListesi.length>0){
out+='<div class="cd"><h3>🔁 Tekrar Yapalım ('+tekrarListesi.length+')</h3>';
tekrarListesi.forEach(function(a){
out+='<div class="si" style="padding:8px 0">';
out+='<div style="font-size:18px;min-width:30px;text-align:center">'+(a.tur==='evde'?'🏠':'🌆')+'</div>';
out+='<div style="flex:1"><div style="font-weight:700;font-size:12px">'+esc(a.baslik)+'</div>';
out+='<div style="font-size:10px;color:var(--txtL)">👨 '+(a.puan_gorkem||'—')+' · 👩 '+(a.puan_esra||'—')+'</div></div>';
out+='<button style="background:var(--pL);color:var(--primary);border:none;border-radius:8px;padding:4px 8px;font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito" onclick="sosyalTekrarPlanla('+a.id+')">📅</button>';
out+='</div>';});
out+='</div>';}

// Geçmiş aktiviteler listesi
out+='<div class="cd"><h3>📋 Geçmiş</h3>';
tamamlanan.slice(0,20).forEach(function(a){
out+='<div class="si" style="padding:8px 0;cursor:pointer" onclick="sosyalDetay('+a.id+')">';
out+='<div style="font-size:18px;min-width:30px;text-align:center">'+(a.tur==='evde'?'🏠':'🌆')+'</div>';
out+='<div style="flex:1"><div style="font-weight:700;font-size:12px">'+esc(a.baslik)+'</div>';
out+='<div style="font-size:10px;color:var(--txtL)">'+new Date(a.tarih).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'})+(a.mekan?' · '+esc(a.mekan):'')+(a.harcama?' · '+fmt(a.harcama):'')+'</div></div>';
if(a.tekrar)out+='<span style="font-size:12px">🔁</span>';
out+='</div>';});
out+='</div>';
return out;}

// ─── HAVUZ SEKMESİ ──────────────────────────────────────────────────────────
function sosyalHavuzH(){
sosyalInitCheck();
var havuz=S.SOSYAL.havuz||[];
var bekleyen=havuz.filter(function(h){return!h.yapildi;});
var yapilan=havuz.filter(function(h){return h.yapildi;});

var out='<h2>💡 Öneri Havuzu</h2>';
out+='<div style="font-size:11px;color:var(--txtL);margin-bottom:14px">Yapmak istediğiniz aktiviteleri ekleyin, sistem önersin!</div>';

if(bekleyen.length>0){
out+='<div class="cd"><h3>🎲 Bekleyen Fikirler ('+bekleyen.length+')</h3>';
bekleyen.forEach(function(h){
out+='<div class="si" style="padding:10px 0">';
out+='<div style="font-size:18px;min-width:30px;text-align:center">'+(h.tur==='evde'?'🏠':'🌆')+'</div>';
out+='<div style="flex:1"><div style="font-weight:700;font-size:13px">'+esc(h.baslik)+'</div>';
out+='<div style="font-size:10px;color:var(--txtL)">'+(h.ekleyen?((h.ekleyen==='Görkem'?'👨':'👩')+' '+esc(h.ekleyen)):'')+(h.tahmini_harcama?' · ~'+fmt(h.tahmini_harcama):'')+'</div></div>';
out+='<div style="display:flex;gap:4px">';
out+='<button style="background:#E91E63;color:#fff;border:none;border-radius:6px;padding:4px 8px;font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito" onclick="sosyalHavuzdanPlanla('+h.id+')">📅</button>';
out+='<button class="del" onclick="sosyalHavuzSil('+h.id+')">🗑️</button>';
out+='</div></div>';});
out+='</div>';
}else{
out+='<div class="cd" style="text-align:center;padding:24px"><div style="font-size:40px;margin-bottom:8px">💡</div>';
out+='<div style="font-weight:700">Havuz boş!</div>';
out+='<div style="font-size:12px;color:var(--txtL)">Birlikte yapılacak fikirler ekleyin</div></div>';}

if(yapilan.length>0){
out+='<div class="cd"><h3 style="color:var(--txtL)">✅ Yapılanlar ('+yapilan.length+')</h3>';
yapilan.slice(0,10).forEach(function(h){
out+='<div style="font-size:12px;color:var(--txtL);padding:4px 0;text-decoration:line-through">'+esc(h.baslik)+'</div>';});
out+='</div>';}

out+='<button class="btn" style="background:#E91E63;color:#fff;margin-top:8px" onclick="sosyalHavuzEkle()">+ Fikir Ekle</button>';
return out;}

// ─── MODAL: AKTİVİTE EKLE ──────────────────────────────────────────────────
function sosyalAktiviteEkle(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🎯 Aktivite Planla</h3><div class="fc">'+
'<div><div class="fl">Başlık *</div><input id="saBas" placeholder="ör: Sinema, Piknik, Kutu Oyunu..."></div>'+
'<div><div class="fl">Tarih *</div><input id="saTar" type="date" value="'+tISO()+'"></div>'+
'<div class="g2"><div><div class="fl">Tür</div><select id="saTur"><option value="disari">🌆 Dışarı</option><option value="evde">🏠 Evde</option></select></div>'+
'<div><div class="fl">Mekan</div><input id="saMek" placeholder="opsiyonel"></div></div>'+
'<div><div class="fl">Tahmini Harcama (₺)</div><input id="saHar" type="number" placeholder="0"></div>'+
'<button class="btn" style="background:#E91E63;color:#fff" onclick="sosyalAktiviteKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function sosyalAktiviteKaydet(){
var bas=document.getElementById('saBas').value;
var tar=document.getElementById('saTar').value;
if(!bas||!tar){toast('Başlık ve tarih zorunlu!','warn');return;}
sosyalInitCheck();
S.SOSYAL.aktiviteler.push({
id:Date.now(),baslik:bas,tarih:tar,
tur:document.getElementById('saTur').value,
mekan:document.getElementById('saMek').value,
harcama:parseFloat(document.getElementById('saHar').value)||0,
puan_gorkem:0,puan_esra:0,not_gorkem:'',not_esra:'',
tekrar:null,tamamlandi:false
});
sv('SOSYAL');
// Finans'a da yaz
var har=parseFloat(document.getElementById('saHar').value)||0;
if(har>0&&S.GIDER){S.GIDER.push({id:Date.now()+1,dt:tar,amt:har,cat:'Sosyal',mod:'SOSYAL',desc:bas,usr:S.user||'Görkem'});sv('GIDER');}
var m=document.querySelector('.mo');if(m)m.remove();
toast('Aktivite planlandı!','succ');rn();}

function sosyalTamamla(id){
sosyalInitCheck();
S.SOSYAL.aktiviteler=S.SOSYAL.aktiviteler.map(function(a){
return a.id==id?Object.assign({},a,{tamamlandi:true}):a;});
sv('SOSYAL');toast('Aktivite tamamlandı! 🎉','succ');rn();}

// ─── MODAL: AKTİVİTE DETAY & PUANLAMA ──────────────────────────────────────
function sosyalDetay(id){
sosyalInitCheck();
var a=S.SOSYAL.aktiviteler.find(function(x){return x.id==id;});
if(!a)return;
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
var puanSecG='';var puanSecE='';
for(var i=1;i<=5;i++){
puanSecG+='<button style="width:32px;height:32px;border-radius:50%;border:2px solid '+((a.puan_gorkem||0)>=i?'#E91E63':'var(--brd)')+';background:'+((a.puan_gorkem||0)>=i?'#E91E63':'var(--card)')+';color:'+((a.puan_gorkem||0)>=i?'#fff':'var(--txtL)')+';font-size:12px;font-weight:800;cursor:pointer" onclick="sosyalPuanVer('+id+',\'gorkem\','+i+')">'+i+'</button>';
puanSecE+='<button style="width:32px;height:32px;border-radius:50%;border:2px solid '+((a.puan_esra||0)>=i?'#E91E63':'var(--brd)')+';background:'+((a.puan_esra||0)>=i?'#E91E63':'var(--card)')+';color:'+((a.puan_esra||0)>=i?'#fff':'var(--txtL)')+';font-size:12px;font-weight:800;cursor:pointer" onclick="sosyalPuanVer('+id+',\'esra\','+i+')">'+i+'</button>';
}
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>'+(a.tur==='evde'?'🏠':'🌆')+' '+esc(a.baslik)+'</h3>'+
'<div style="font-size:12px;color:var(--txtL);margin-bottom:12px">'+new Date(a.tarih).toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+(a.mekan?' · '+esc(a.mekan):'')+(a.harcama?' · '+fmt(a.harcama):'')+'</div>'+
(a.tamamlandi?'<div style="margin-bottom:14px"><div class="fl">👨 Görkem Puanı</div><div style="display:flex;gap:4px;margin-bottom:10px">'+puanSecG+'</div>'+
'<div class="fl">👩 Esra Puanı</div><div style="display:flex;gap:4px;margin-bottom:10px">'+puanSecE+'</div>'+
'<div class="fl">Tekrar yapalım mı?</div><div style="display:flex;gap:6px;margin-bottom:10px">'+
'<button style="padding:6px 14px;border-radius:8px;border:2px solid '+(a.tekrar===true?'#E91E63':'var(--brd)')+';background:'+(a.tekrar===true?'#E91E63':'var(--card)')+';color:'+(a.tekrar===true?'#fff':'var(--txtL)')+';font-size:12px;font-weight:700;cursor:pointer;font-family:Nunito" onclick="sosyalTekrarSet('+id+',true)">👍 Evet</button>'+
'<button style="padding:6px 14px;border-radius:8px;border:2px solid '+(a.tekrar===false?'#E91E63':'var(--brd)')+';background:'+(a.tekrar===false?'#E91E63':'var(--card)')+';color:'+(a.tekrar===false?'#fff':'var(--txtL)')+';font-size:12px;font-weight:700;cursor:pointer;font-family:Nunito" onclick="sosyalTekrarSet('+id+',false)">👎 Hayır</button>'+
'</div></div>':'')+
'<div style="display:flex;gap:8px">'+
(!a.tamamlandi?'<button class="btn" style="background:#E91E63;color:#fff;flex:1" onclick="sosyalTamamla('+id+');this.closest(\'.mo\').remove()">✅ Tamamla</button>':'')+
'<button class="btn bd" style="flex:1" onclick="sosyalAktiviteSil('+id+');this.closest(\'.mo\').remove()">🗑️ Sil</button>'+
'</div>'+
'<button class="btn bg" style="margin-top:6px" onclick="this.closest(\'.mo\').remove()">Kapat</button>'+
'</div>';
document.body.appendChild(e);}

function sosyalPuanVer(id,kisi,puan){
sosyalInitCheck();
S.SOSYAL.aktiviteler=S.SOSYAL.aktiviteler.map(function(a){
if(a.id!=id)return a;
var obj={};obj['puan_'+kisi]=puan;
return Object.assign({},a,obj);});
sv('SOSYAL');
var m=document.querySelector('.mo');if(m)m.remove();
sosyalDetay(id);}

function sosyalTekrarSet(id,val){
sosyalInitCheck();
S.SOSYAL.aktiviteler=S.SOSYAL.aktiviteler.map(function(a){
return a.id==id?Object.assign({},a,{tekrar:val}):a;});
sv('SOSYAL');
var m=document.querySelector('.mo');if(m)m.remove();
sosyalDetay(id);}

function sosyalAktiviteSil(id){
sosyalInitCheck();
S.SOSYAL.aktiviteler=S.SOSYAL.aktiviteler.filter(function(a){return a.id!=id;});
sv('SOSYAL');toast('Aktivite silindi','succ');rn();}

// ─── MODAL: RUTİN EKLE ─────────────────────────────────────────────────────
function sosyalRutinEkle(){
var gunler=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
var gunCheckboxes='';
gunler.forEach(function(g,i){
gunCheckboxes+='<label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" class="srGun" value="'+i+'"><span style="font-size:12px">'+g+'</span></label>';});
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🏋️ Rutin Ekle</h3><div class="fc">'+
'<div><div class="fl">Aktivite *</div><input id="srAkt" placeholder="ör: Spor Salonu, Yüzme, Yoga..."></div>'+
'<div class="g2"><div><div class="fl">Kişi</div><select id="srKisi"><option value="Görkem">👨 Görkem</option><option value="Esra">👩 Esra</option></select></div>'+
'<div><div class="fl">Aylık Ücret (₺)</div><input id="srUcr" type="number" placeholder="0"></div></div>'+
'<div><div class="fl">Günler</div><div style="display:flex;gap:8px;flex-wrap:wrap">'+gunCheckboxes+'</div></div>'+
'<button class="btn" style="background:#E91E63;color:#fff" onclick="sosyalRutinKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function sosyalRutinKaydet(){
var akt=document.getElementById('srAkt').value;
if(!akt){toast('Aktivite adı zorunlu!','warn');return;}
var seciliGunler=[];
document.querySelectorAll('.srGun:checked').forEach(function(cb){seciliGunler.push(parseInt(cb.value));});
sosyalInitCheck();
S.SOSYAL.rutinler.push({
id:Date.now(),aktivite:akt,
kisi:document.getElementById('srKisi').value,
ucret:parseFloat(document.getElementById('srUcr').value)||0,
gunler:seciliGunler,
haftalik:{}
});
sv('SOSYAL');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Rutin eklendi!','succ');rn();}

function sosyalRutinSil(id){
sosyalInitCheck();
S.SOSYAL.rutinler=S.SOSYAL.rutinler.filter(function(r){return r.id!=id;});
sv('SOSYAL');toast('Rutin silindi','succ');rn();}

function sosyalRutinIsaretle(id,gunIdx){
sosyalInitCheck();
var now=new Date();var dayOfWeek=now.getDay();var diff=dayOfWeek===0?6:dayOfWeek-1;
var weekStart=new Date(now);weekStart.setDate(now.getDate()-diff);
var wk=weekStart.toISOString().slice(0,10);
S.SOSYAL.rutinler=S.SOSYAL.rutinler.map(function(r){
if(r.id!=id)return r;
var hk=Object.assign({},r.haftalik||{});
var arr=(hk[wk]||[]).slice();
var idx=arr.indexOf(gunIdx);
if(idx>=0)arr.splice(idx,1);else arr.push(gunIdx);
hk[wk]=arr;
return Object.assign({},r,{haftalik:hk});});
sv('SOSYAL');rn();}

// ─── MODAL: HAVUZ FİKİR EKLE ───────────────────────────────────────────────
function sosyalHavuzEkle(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>💡 Fikir Ekle</h3><div class="fc">'+
'<div><div class="fl">Ne yapalım? *</div><input id="shBas" placeholder="ör: Bowling, Doğa Yürüyüşü..."></div>'+
'<div class="g2"><div><div class="fl">Tür</div><select id="shTur"><option value="disari">🌆 Dışarı</option><option value="evde">🏠 Evde</option></select></div>'+
'<div><div class="fl">Tahmini ₺</div><input id="shHar" type="number" placeholder="0"></div></div>'+
'<button class="btn" style="background:#E91E63;color:#fff" onclick="sosyalHavuzKaydet()">💾 Ekle</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function sosyalHavuzKaydet(){
var bas=document.getElementById('shBas').value;
if(!bas){toast('Fikir adı zorunlu!','warn');return;}
sosyalInitCheck();
S.SOSYAL.havuz.push({
id:Date.now(),baslik:bas,
tur:document.getElementById('shTur').value,
tahmini_harcama:parseFloat(document.getElementById('shHar').value)||0,
ekleyen:S.user||'Görkem',
yapildi:false
});
sv('SOSYAL');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Fikir havuza eklendi!','succ');rn();}

function sosyalHavuzSil(id){
sosyalInitCheck();
S.SOSYAL.havuz=S.SOSYAL.havuz.filter(function(h){return h.id!=id;});
sv('SOSYAL');toast('Fikir silindi','succ');rn();}

function sosyalHavuzdanPlanla(havuzId){
sosyalInitCheck();
var h=S.SOSYAL.havuz.find(function(x){return x.id==havuzId;});
if(!h)return;
// Bu haftanın cuma gününü bul
var now=new Date();var dayOfWeek=now.getDay();var diff=dayOfWeek===0?6:dayOfWeek-1;
var weekStart=new Date(now);weekStart.setDate(now.getDate()-diff);
var cuma=new Date(weekStart);cuma.setDate(weekStart.getDate()+4);
var tarih=cuma.toISOString().slice(0,10);
if(tarih<tISO())tarih=tISO();

S.SOSYAL.aktiviteler.push({
id:Date.now(),baslik:h.baslik,tarih:tarih,
tur:h.tur||'disari',mekan:'',
harcama:h.tahmini_harcama||0,
puan_gorkem:0,puan_esra:0,not_gorkem:'',not_esra:'',
tekrar:null,tamamlandi:false
});
// Havuzdakini işaretle
S.SOSYAL.havuz=S.SOSYAL.havuz.map(function(x){
return x.id==havuzId?Object.assign({},x,{yapildi:true}):x;});
sv('SOSYAL');
S.SOSYAL.tab='hafta';
toast('Havuzdan planlandı!','succ');rn();}

function sosyalTekrarPlanla(aktId){
sosyalInitCheck();
var a=S.SOSYAL.aktiviteler.find(function(x){return x.id==aktId;});
if(!a)return;
// Yeni hafta için tekrar planla
var now=new Date();var dayOfWeek=now.getDay();var diff=dayOfWeek===0?6:dayOfWeek-1;
var weekStart=new Date(now);weekStart.setDate(now.getDate()-diff);
var cuma=new Date(weekStart);cuma.setDate(weekStart.getDate()+4);
var tarih=cuma.toISOString().slice(0,10);
if(tarih<tISO())tarih=tISO();

S.SOSYAL.aktiviteler.push({
id:Date.now(),baslik:a.baslik,tarih:tarih,
tur:a.tur,mekan:a.mekan||'',
harcama:0,puan_gorkem:0,puan_esra:0,
not_gorkem:'',not_esra:'',tekrar:null,tamamlandi:false
});
sv('SOSYAL');
S.SOSYAL.tab='hafta';
toast('Tekrar planlandı!','succ');rn();}

// ─── ERAYLAR SOSYAL SONU ────────────────────────────────────────────────────
