// ═══ ALISVERIS ═══
// ─── ERAYLAR ALIŞVERİŞ — FAZ 4 ───────────────────────────────────────────────
var AV_KAT=['Giyim','Elektronik','Ev Eşyası','Kişisel Bakım','Modaring','Diğer'];
var AV_ONCELIK=['Yüksek','Normal','Düşük'];

function alisverisInitCheck(){
if(!S.ALISVERIS)S.ALISVERIS={liste:[],arsiv:[],tab:'liste'};
if(!S.ALISVERIS.liste)S.ALISVERIS.liste=[];
if(!S.ALISVERIS.arsiv)S.ALISVERIS.arsiv=[];
if(!S.ALISVERIS.tab)S.ALISVERIS.tab='liste';}

function alisverisH(){
alisverisInitCheck();
var tab=S.ALISVERIS.tab||'liste';
var tabs=[{id:'liste',ic:'📋',l:'Liste'},{id:'modaring',ic:'💎',l:'Modaring'},{id:'arsiv',ic:'📦',l:'Arşiv'}];
var pg={liste:avListeH,modaring:avModaringH,arsiv:avArsivH};
var fn=pg[tab]||avListeH;
return'<div class="app"><div class="hdr" style="background:linear-gradient(135deg,#E67E22,#CA6F1E)"><div style="display:flex;align-items:center;gap:8px"><div style="font-size:14px;color:rgba(255,255,255,.7);cursor:pointer" onclick="go(\'home\')">◀</div><div><h1>Eraylar Alışveriş</h1><small>Liste & Modaring & Arşiv</small></div></div><div style="display:flex;gap:6px;align-items:center">'+onlineDot()+'<button class="ubtn" onclick="pu(null)">'+(S.user==='Görkem'?'👨':'👩')+' '+S.user+'</button></div></div><div class="cnt fi">'+fn()+'</div><div class="nav">'+tabs.map(function(t){return'<button class="'+(tab===t.id?'on':'')+'" onclick="S.ALISVERIS.tab=\''+t.id+'\';rn()"><span class="ico">'+t.ic+'</span><span class="lbl" style="color:'+(tab===t.id?'var(--acc)':'var(--txtL)')+'">'+t.l+'</span>'+(tab===t.id?'<span class="dot" style="background:var(--acc)"></span>':'')+'</button>';}).join('')+'</div></div>';}

// ─── LISTE SEKMESİ ────────────────────────────────────────────────────────────
function avListeH(){
alisverisInitCheck();
var liste=S.ALISVERIS.liste||[];
var bekleyen=liste.filter(function(i){return!i.tamamlandi;});
var tamamlanan=liste.filter(function(i){return i.tamamlandi;});
function oncelikRenk(o){return o==='Yüksek'?'var(--danger)':o==='Normal'?'var(--warn)':'var(--txtL)';}
function oncelikIco(o){return o==='Yüksek'?'🔴':o==='Normal'?'🟡':'🟢';}
function itemRow(item){
return'<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--brd)'+(item.tamamlandi?';opacity:.5':'')+'">'+
'<input type="checkbox"'+(item.tamamlandi?' checked':'')+' onchange="avTamamla('+item.id+')" style="accent-color:var(--acc);width:18px;height:18px;cursor:pointer;flex-shrink:0">'+
'<div style="flex:1">'+
'<div style="font-size:13px;font-weight:700;'+(item.tamamlandi?'text-decoration:line-through;color:var(--txtL)':'')+'">'+esc(item.baslik)+'</div>'+
'<div style="font-size:10px;color:var(--txtL);margin-top:2px">'+
'<span style="color:'+oncelikRenk(item.oncelik)+'">'+oncelikIco(item.oncelik)+' '+esc(item.oncelik)+'</span>'+
' · <span style="background:var(--bg);padding:2px 6px;border-radius:6px;font-size:9px;font-weight:700">'+esc(item.kategori)+'</span>'+
(item.tahminiF?(' · 💰 '+item.tahminiF+' ₺'):'')+(item.kisi?' · '+(item.kisi==='Görkem'?'👨':'👩')+' '+esc(item.kisi):'')+'</div>'+
(item.not?('<div style="font-size:10px;color:var(--txtL);margin-top:2px;font-style:italic">'+esc(item.not)+'</div>'):'')+'</div>'+
'<button class="del" onclick="avSil('+item.id+')">✕</button></div>';}

var out='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h2 style="margin:0">🛍️ Alışveriş Listesi</h2>'+
'<button class="btn bp" style="width:auto;padding:8px 14px;font-size:12px" onclick="avMEkle()">+ Ekle</button></div>';

if(bekleyen.length===0&&tamamlanan.length===0){
out+='<div class="cd" style="text-align:center;padding:24px"><div style="font-size:36px;margin-bottom:8px">🛍️</div><div style="font-size:13px;font-weight:700;color:var(--txtL)">Liste boş!</div><div style="font-size:11px;color:var(--txtL);margin-top:4px">Yukarıdan ürün ekle</div></div>';
return out;}

if(bekleyen.length>0){
var yuksek=bekleyen.filter(function(i){return i.oncelik==='Yüksek';});
var normal=bekleyen.filter(function(i){return i.oncelik==='Normal';});
var dusuk=bekleyen.filter(function(i){return i.oncelik==='Düşük'||!i.oncelik;});
out+='<div style="font-size:11px;color:var(--txtL);margin-bottom:8px;font-weight:700">'+bekleyen.length+' ürün bekliyor</div>';
out+='<div class="cd" style="padding:8px 14px">';
[{list:yuksek,label:'🔴 Yüksek Öncelik'},{list:normal,label:'🟡 Normal'},{list:dusuk,label:'🟢 Düşük'}].forEach(function(g){
if(g.list.length>0){out+='<div style="font-size:9px;font-weight:800;color:var(--txtL);text-transform:uppercase;letter-spacing:.5px;padding:8px 0 2px">'+g.label+'</div>';
g.list.forEach(function(i){out+=itemRow(i);});}});
out+='</div>';}

if(tamamlanan.length>0){
out+='<div class="cd" style="padding:8px 14px;margin-top:8px"><div style="font-size:9px;font-weight:800;color:var(--txtL);text-transform:uppercase;letter-spacing:.5px;padding:4px 0 8px">✅ Tamamlananlar ('+tamamlanan.length+')</div>';
tamamlanan.forEach(function(i){out+=itemRow(i);});
out+='<button onclick="avArsiveAt()" style="width:100%;margin-top:8px;padding:8px;background:var(--sL);border:none;border-radius:10px;font-size:11px;font-weight:700;color:var(--sec);cursor:pointer;font-family:Nunito">📦 Tamamlananları Arşivle</button>';
out+='</div>';}
return out;}

// ─── MODARİNG SEKMESİ ─────────────────────────────────────────────────────────
function avModaringH(){
alisverisInitCheck();
var liste=S.ALISVERIS.liste||[];
var modaring=liste.filter(function(i){return i.kategori==='Modaring';});
var bekleyen=modaring.filter(function(i){return!i.tamamlandi;});
var tamamlanan=modaring.filter(function(i){return i.tamamlandi;});
var out='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h2 style="margin:0">💎 Modaring</h2>'+
'<button class="btn" style="width:auto;padding:8px 14px;font-size:12px;background:linear-gradient(135deg,#E67E22,#CA6F1E);color:#fff" onclick="avMModaringEkle()">+ Ürün Ekle</button></div>';

out+='<div class="cd" style="background:linear-gradient(135deg,rgba(230,126,34,.1),rgba(202,111,30,.05));border-color:rgba(230,126,34,.3);margin-bottom:12px"><div style="font-size:10px;font-weight:800;color:#E67E22;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">📊 ÖZET</div>';
var toplamAliniyor=bekleyen.reduce(function(s,i){return s+(parseFloat(i.alisF)||0);},0);
var toplamSatilan=tamamlanan.reduce(function(s,i){return s+(parseFloat(i.satisF)||0);},0);
var toplamMaliyet=tamamlanan.reduce(function(s,i){return s+(parseFloat(i.alisF)||0);},0);
var kar=toplamSatilan-toplamMaliyet;
out+='<div class="g3"><div style="text-align:center;padding:6px"><div style="font-size:16px;font-weight:800;color:#E67E22">'+bekleyen.length+'</div><div style="font-size:9px;color:var(--txtL)">Bekleyen</div></div>';
out+='<div style="text-align:center;padding:6px"><div style="font-size:16px;font-weight:800;color:'+(kar>=0?'var(--sec)':'var(--danger)')+'">'+kar.toLocaleString('tr-TR')+'₺</div><div style="font-size:9px;color:var(--txtL)">Net Kâr</div></div>';
out+='<div style="text-align:center;padding:6px"><div style="font-size:16px;font-weight:800;color:var(--primary)">'+tamamlanan.length+'</div><div style="font-size:9px;color:var(--txtL)">Satıldı</div></div></div></div>';

if(bekleyen.length===0&&tamamlanan.length===0){
out+='<div class="cd" style="text-align:center;padding:24px"><div style="font-size:36px;margin-bottom:8px">💎</div><div style="font-size:13px;font-weight:700;color:var(--txtL)">Modaring stoku boş</div><div style="font-size:11px;color:var(--txtL);margin-top:4px">Alınacak ürünleri ekle</div></div>';
return out;}

function modaringRow(item){
return'<div style="padding:10px 0;border-bottom:1px solid var(--brd)">' +
'<div style="display:flex;justify-content:space-between;align-items:flex-start">'+
'<div style="flex:1"><div style="font-size:13px;font-weight:700;'+(item.tamamlandi?'text-decoration:line-through;color:var(--txtL)':'')+'">'+esc(item.baslik)+'</div>'+
'<div style="font-size:10px;color:var(--txtL);margin-top:2px">'+
(item.alisF?'Alış: <b style="color:var(--danger)">'+item.alisF+'₺</b> ':'')+(item.satisF?'· Satış: <b style="color:var(--sec)">'+item.satisF+'₺</b> ':'')+
(item.stok?'· Stok: <b>'+item.stok+'</b>':'')+
'</div>'+
(item.not?('<div style="font-size:10px;color:var(--txtL);margin-top:2px;font-style:italic">'+esc(item.not)+'</div>'):'')+
'</div>'+
'<div style="display:flex;gap:6px;align-items:center">'+
(!item.tamamlandi?('<button onclick="avModaringSat('+item.id+')" style="padding:5px 10px;border:none;border-radius:8px;background:var(--sL);color:var(--sec);font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito">Satıldı ✓</button>'):'<span style="font-size:10px;color:var(--sec);font-weight:700">✅</span>')+
'<button class="del" onclick="avSil('+item.id+')">✕</button></div></div></div>';}

if(bekleyen.length>0){
out+='<div class="cd" style="padding:8px 14px"><div style="font-size:9px;font-weight:800;color:var(--txtL);text-transform:uppercase;letter-spacing:.5px;padding:4px 0 8px">📦 Alınacaklar / Stok ('+bekleyen.length+')</div>';
bekleyen.forEach(function(i){out+=modaringRow(i);});
out+='</div>';}
if(tamamlanan.length>0){
out+='<div class="cd" style="padding:8px 14px;margin-top:8px"><div style="font-size:9px;font-weight:800;color:var(--txtL);text-transform:uppercase;letter-spacing:.5px;padding:4px 0 8px">✅ Satılanlar ('+tamamlanan.length+')</div>';
tamamlanan.slice(0,10).forEach(function(i){out+=modaringRow(i);});
out+='</div>';}
return out;}

// ─── ARŞİV SEKMESİ ────────────────────────────────────────────────────────────
function avArsivH(){
alisverisInitCheck();
var arsiv=(S.ALISVERIS.arsiv||[]).slice().reverse();
var out='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h2 style="margin:0">📦 Arşiv</h2>';
if(arsiv.length>0)out+='<button onclick="if(confirm(\'Arşiv silinsin mi?\'))avArsivTemizle()" style="padding:6px 12px;border:1px solid var(--brd);border-radius:10px;background:var(--bg);font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito;color:var(--txtL)">🗑 Temizle</button>';
out+='</div>';
if(arsiv.length===0){
out+='<div class="cd" style="text-align:center;padding:24px"><div style="font-size:36px;margin-bottom:8px">📦</div><div style="font-size:13px;font-weight:700;color:var(--txtL)">Arşiv boş</div></div>';
return out;}
arsiv.forEach(function(kayit){
out+='<div class="cd" style="padding:10px 14px;margin-bottom:8px">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'+
'<div style="font-size:10px;font-weight:800;color:var(--txtL)">📅 '+esc(kayit.tarih)+'</div>'+
'<div style="font-size:10px;font-weight:700;color:var(--primary)">'+kayit.urunler.length+' ürün</div></div>'+
kayit.urunler.map(function(u){return'<div style="font-size:11px;padding:3px 0;border-bottom:1px solid var(--brd);color:var(--txtL)">'+esc(u.baslik)+(u.kategori?' <span style="background:var(--bg);padding:1px 6px;border-radius:4px;font-size:9px">'+esc(u.kategori)+'</span>':'')+'</div>';}).join('')+'</div>';});
return out;}

// ─── MODAL: ÜRÜN EKLE ─────────────────────────────────────────────────────────
function avMEkle(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🛍️ Ürün Ekle</h3><div class="fc">'+
'<div><div class="fl">Ürün Adı *</div><input id="avad" placeholder="ör: Mavi Kazak, iPhone Kılıf..."></div>'+
'<div class="g2"><div><div class="fl">Kategori</div><select id="avkat" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)">'+AV_KAT.map(function(k){return'<option>'+k+'</option>';}).join('')+'</select></div><div><div class="fl">Öncelik</div><select id="avon" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)">'+AV_ONCELIK.map(function(o){return'<option>'+o+'</option>';}).join('')+'</select></div></div>'+
'<div class="g2"><div><div class="fl">Tahmini Fiyat (₺)</div><input id="avfiy" type="number" placeholder="0.00"></div><div><div class="fl">Kişi</div><select id="avkisi" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>Görkem</option><option>Esra</option><option>İkisi</option></select></div></div>'+
'<div><div class="fl">Not</div><input id="avnot" placeholder="Marka, link, renk bilgisi..."></div>'+
'<button class="btn" style="background:linear-gradient(135deg,#E67E22,#CA6F1E);color:#fff" onclick="avKaydet()">💾 Listeye Ekle</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function avKaydet(){
var ad=document.getElementById('avad').value;
if(!ad){toast('Ürün adı zorunlu!','warn');return;}
alisverisInitCheck();
S.ALISVERIS.liste.push({
id:Date.now(),
baslik:ad,
kategori:document.getElementById('avkat').value,
oncelik:document.getElementById('avon').value,
tahminiF:document.getElementById('avfiy').value,
kisi:document.getElementById('avkisi').value,
not:document.getElementById('avnot').value,
tamamlandi:false,
dt:tISO()
});
sv('ALISVERIS');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Listeye eklendi!','succ');rn();}

// ─── MODAL: MODARİNG ÜRÜN EKLE ────────────────────────────────────────────────
function avMModaringEkle(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>💎 Modaring Ürün Ekle</h3><div class="fc">'+
'<div><div class="fl">Ürün Adı *</div><input id="avmad" placeholder="ör: Gümüş Kolye, Taş Küpe..."></div>'+
'<div class="g2"><div><div class="fl">Alış Fiyatı (₺)</div><input id="avmalis" type="number" placeholder="0.00"></div><div><div class="fl">Satış Fiyatı (₺)</div><input id="avmsatis" type="number" placeholder="0.00"></div></div>'+
'<div><div class="fl">Stok Miktarı</div><input id="avmstok" type="number" placeholder="1" value="1"></div>'+
'<div><div class="fl">Not</div><input id="avmnot" placeholder="Tedarikçi, ürün kodu..."></div>'+
'<button class="btn" style="background:linear-gradient(135deg,#E67E22,#CA6F1E);color:#fff" onclick="avModaringKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function avModaringKaydet(){
var ad=document.getElementById('avmad').value;
if(!ad){toast('Ürün adı zorunlu!','warn');return;}
alisverisInitCheck();
S.ALISVERIS.liste.push({
id:Date.now(),
baslik:ad,
kategori:'Modaring',
oncelik:'Normal',
alisF:document.getElementById('avmalis').value,
satisF:document.getElementById('avmsatis').value,
stok:document.getElementById('avmstok').value,
not:document.getElementById('avmnot').value,
tamamlandi:false,
dt:tISO()
});
sv('ALISVERIS');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Modaring ürünü eklendi!','succ');rn();}

function avTamamla(id){
alisverisInitCheck();
S.ALISVERIS.liste=S.ALISVERIS.liste.map(function(i){
return i.id==id?Object.assign({},i,{tamamlandi:!i.tamamlandi,tamamlanmaTarihi:tISO()}):i;});
sv('ALISVERIS');rn();}

function avModaringSat(id){
alisverisInitCheck();
S.ALISVERIS.liste=S.ALISVERIS.liste.map(function(i){
return i.id==id?Object.assign({},i,{tamamlandi:true,tamamlanmaTarihi:tISO()}):i;});
sv('ALISVERIS');toast('Satıldı olarak işaretlendi!','succ');rn();}

function avSil(id){
alisverisInitCheck();
S.ALISVERIS.liste=S.ALISVERIS.liste.filter(function(i){return i.id!=id;});
sv('ALISVERIS');rn();}

function avArsiveAt(){
alisverisInitCheck();
var tamamlananlar=S.ALISVERIS.liste.filter(function(i){return i.tamamlandi;});
if(tamamlananlar.length===0)return;
S.ALISVERIS.arsiv.push({tarih:new Date().toLocaleDateString('tr-TR'),urunler:tamamlananlar});
if(S.ALISVERIS.arsiv.length>50)S.ALISVERIS.arsiv=S.ALISVERIS.arsiv.slice(-50);
S.ALISVERIS.liste=S.ALISVERIS.liste.filter(function(i){return!i.tamamlandi;});
sv('ALISVERIS');toast(''+tamamlananlar.length+' ürün arşivlendi!','succ');rn();}

function avArsivTemizle(){
alisverisInitCheck();
S.ALISVERIS.arsiv=[];
sv('ALISVERIS');toast('Arşiv temizlendi!','succ');rn();}

// ─── ERAYLAR ALIŞVERİŞ SONU ──────────────────────────────────────────────────
