// ═══ SAGLIK ═══
// ─── KALAN GÜN HESABI ────────────────────────────────────────────────────────
function kalanGun(tarih){
if(!tarih)return null;
var t=new Date(tarih);var b=new Date();b.setHours(0,0,0,0);
var fark=Math.round((t-b)/(1000*60*60*24));
return fark;
}

// ─── UYARI BADGE ─────────────────────────────────────────────────────────────
function kalanBadge(gun){
if(gun===null)return '';
if(gun<0)return '<span class="badge" style="background:#FDEDEC;color:#E74C3C">Geçti</span>';
if(gun===0)return '<span class="badge" style="background:#FEF9E7;color:#F39C12">Bugün!</span>';
if(gun<=3)return '<span class="badge" style="background:#FEF9E7;color:#F39C12">'+gun+' gün</span>';
if(gun<=7)return '<span class="badge" style="background:#EDE0F5;color:#9B59B6">'+gun+' gün</span>';
return '<span class="badge" style="background:var(--sL);color:var(--sec)">'+gun+' gün</span>';
}

// ─── ANA EKRAN ────────────────────────────────────────────────────────────────
function saglikH(){
saglikInitCheck();
var tab=S.SAGLIK.tab||'randevu';
var tabs=[
{k:'randevu',ic:'📅',lb:'Randevu'},
{k:'ilac',ic:'💊',lb:'İlaç'},
{k:'olcum',ic:'📊',lb:'Ölçüm'},
];
var tabBar='<div style="display:flex;gap:8px;margin-bottom:14px">';
tabs.forEach(function(t){
var on=tab===t.k;
tabBar+='<button onclick="saglikTabSec(\''+t.k+'\')" style="flex:1;padding:9px 0;border-radius:12px;border:none;font-family:Nunito;font-size:12px;font-weight:800;cursor:pointer;background:'+(on?'var(--primary)':'var(--bg)')+';color:'+(on?'#fff':'var(--txtL)')+'">'+t.ic+' '+t.lb+'</button>';
});
tabBar+='</div>';

var body='';
if(tab==='randevu') body=saglikRandevuH();
else if(tab==='ilac') body=saglikIlacH();
else if(tab==='olcum') body=saglikOlcumH();

var btnMap={
'randevu':'<button class="btn" style="background:#16A085;color:#fff" onclick="sgMRandevu()">+ Randevu Ekle</button>',
'ilac':'<button class="btn" style="background:#16A085;color:#fff" onclick="sgMIlac()">+ İlaç Ekle</button>',
'olcum':'<button class="btn" style="background:#16A085;color:#fff" onclick="sgMOlcum()">+ Ölçüm Ekle</button>',
};

var out='<div class="app">';
out+='<div class="hdr" style="background:linear-gradient(135deg,#16A085,#0E6655)">';
out+='<div style="display:flex;align-items:center;gap:8px"><div onclick="go(\'home\')" style="cursor:pointer;color:#fff;font-size:20px;min-width:44px;min-height:44px;display:flex;align-items:center">◀</div>';
out+='<div><h1>🏥 Eraylar Sağlık</h1><small>Randevu · İlaç · Ölçüm</small></div></div>';
out+='<button class="ubtn" onclick="pu(null)">'+(S.user==='Görkem'?'👨':'👩')+' '+S.user+'</button></div>';
out+='<div class="cnt fi">'+tabBar+body+(btnMap[tab]||'')+'</div></div>';
return out;
}

// ─── RANDEVU SEKMESİ ──────────────────────────────────────────────────────────
function saglikRandevuH(){
var list=S.SAGLIK.randevular||[];
var yaklasan=list.filter(function(r){var g=kalanGun(r.tarih+' '+r.saat);return g!==null&&g>=0;});
var gecmis=list.filter(function(r){var g=kalanGun(r.tarih+' '+r.saat);return g!==null&&g<0;});
yaklasan.sort(function(a,b){return a.tarih.localeCompare(b.tarih);});
gecmis.sort(function(a,b){return b.tarih.localeCompare(a.tarih);});

if(list.length===0){
return '<div class="cd" style="text-align:center;padding:28px"><div style="font-size:40px">📅</div><p style="color:var(--txtL);margin-top:8px;font-size:13px">Henüz randevu eklenmedi</p></div>';
}

var out='';
if(yaklasan.length>0){
out+='<h3 style="color:#16A085;margin-bottom:8px">📌 Yaklaşan Randevular</h3>';
yaklasan.forEach(function(r){
var gun=kalanGun(r.tarih);
out+='<div class="cd" style="margin-bottom:8px;border-left:4px solid #16A085">';
out+='<div style="display:flex;justify-content:space-between;align-items:start">';
out+='<div><div style="font-weight:800;font-size:14px">'+(r.kisi==='Görkem'?'👨 ':'👩 ')+r.tip+'</div>';
out+='<div style="font-size:12px;color:var(--txtL);margin-top:3px">🏥 '+(r.klinik||'—')+'</div>';
out+='<div style="font-size:12px;color:var(--txtL)">📅 '+r.tarih+' '+(r.saat||'')+'</div>';
if(r.not)out+='<div style="font-size:11px;color:var(--txtL);margin-top:3px">💬 '+r.not+'</div>';
out+='</div>';
out+='<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">'+kalanBadge(gun)+'<button class="del" onclick="sgRandevuSil('+r.id+')">🗑</button></div>';
out+='</div></div>';
});
}

if(gecmis.length>0){
out+='<h3 style="color:var(--txtL);margin:14px 0 8px;font-size:14px">Geçmiş Randevular</h3>';
gecmis.slice(0,5).forEach(function(r){
out+='<div class="cd" style="margin-bottom:6px;opacity:.7">';
out+='<div style="display:flex;justify-content:space-between;align-items:center">';
out+='<div><div style="font-size:13px;font-weight:700">'+(r.kisi==='Görkem'?'👨 ':'👩 ')+r.tip+'</div>';
out+='<div style="font-size:11px;color:var(--txtL)">'+r.tarih+' · '+(r.klinik||'—')+'</div></div>';
out+='<button class="del" onclick="sgRandevuSil('+r.id+')">🗑</button>';
out+='</div></div>';
});
}
return out;
}

// ─── İLAÇ SEKMESİ ─────────────────────────────────────────────────────────────
function saglikIlacH(){
var list=S.SAGLIK.ilaclar||[];
var aktif=list.filter(function(i){return !i.bitti;});
var bitmis=list.filter(function(i){return i.bitti;});

if(list.length===0){
return '<div class="cd" style="text-align:center;padding:28px"><div style="font-size:40px">💊</div><p style="color:var(--txtL);margin-top:8px;font-size:13px">Henüz ilaç eklenmedi</p></div>';
}

var out='';
if(aktif.length>0){
out+='<h3 style="color:#16A085;margin-bottom:8px">💊 Aktif İlaçlar</h3>';
aktif.forEach(function(il){
var gun=il.bitisTarihi?kalanGun(il.bitisTarihi):null;
out+='<div class="cd" style="margin-bottom:8px;border-left:4px solid #16A085">';
out+='<div style="display:flex;justify-content:space-between;align-items:start">';
out+='<div>';
out+='<div style="font-weight:800;font-size:14px">'+il.ad+'</div>';
out+='<div style="font-size:12px;color:var(--txtL);margin-top:3px">'+(il.kisi==='Görkem'?'👨 ':'👩 ')+il.kisi+' · '+(il.doz||'—')+' · '+(il.kullanim||'—')+'</div>';
if(il.bitisTarihi)out+='<div style="font-size:11px;color:var(--txtL)">📅 Bitiş: '+il.bitisTarihi+'</div>';
if(il.not)out+='<div style="font-size:11px;color:var(--txtL)">💬 '+il.not+'</div>';
out+='</div>';
out+='<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">';
if(gun!==null)out+=kalanBadge(gun);
out+='<button onclick="sgIlacBit('+il.id+')" style="font-size:11px;padding:3px 8px;border-radius:8px;border:none;background:var(--sL);color:var(--sec);cursor:pointer">✓ Bitti</button>';
out+='<button class="del" onclick="sgIlacSil('+il.id+')">🗑</button>';
out+='</div></div></div>';
});
}

if(bitmis.length>0){
out+='<h3 style="color:var(--txtL);margin:14px 0 8px;font-size:14px">Tamamlananlar</h3>';
bitmis.slice(0,3).forEach(function(il){
out+='<div class="cd" style="margin-bottom:6px;opacity:.6">';
out+='<div style="display:flex;justify-content:space-between;align-items:center">';
out+='<div><div style="font-size:13px;font-weight:700;text-decoration:line-through">'+il.ad+'</div>';
out+='<div style="font-size:11px;color:var(--txtL)">'+(il.kisi==='Görkem'?'👨 ':'👩 ')+il.kisi+'</div></div>';
out+='<button class="del" onclick="sgIlacSil('+il.id+')">🗑</button>';
out+='</div></div>';
});
}
return out;
}

// ─── ÖLÇÜM SEKMESİ ────────────────────────────────────────────────────────────
function saglikOlcumH(){
var list=S.SAGLIK.olcumler||[];
if(list.length===0){
return '<div class="cd" style="text-align:center;padding:28px"><div style="font-size:40px">📊</div><p style="color:var(--txtL);margin-top:8px;font-size:13px">Henüz ölçüm eklenmedi</p></div>';
}

// Kilo grupla
var kiloG=list.filter(function(o){return o.tip==='Kilo';});
var tanG=list.filter(function(o){return o.tip==='Tansiyon';});
var kanG=list.filter(function(o){return o.tip==='Kan Şekeri';});
var digerG=list.filter(function(o){return o.tip!=='Kilo'&&o.tip!=='Tansiyon'&&o.tip!=='Kan Şekeri';});

function olcumGrupH(baslik,icon,grup){
if(grup.length===0)return '';
grup.sort(function(a,b){return b.tarih.localeCompare(a.tarih);});
var son=grup[0];
var out='<div class="cd" style="margin-bottom:10px">';
out+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">';
out+='<div style="font-weight:800;font-size:13px">'+icon+' '+baslik+'</div>';
out+='<div style="font-size:11px;color:var(--txtL)">Son: <b>'+son.deger+'</b> · '+son.tarih+'</div></div>';
if(grup.length>1){
var chartData=grup.slice(0,8).reverse();
var vals=chartData.map(function(o){return parseFloat(o.deger)||0;});
var mx=Math.max.apply(null,vals);var mn=Math.min.apply(null,vals);
var rng=mx-mn||1;
out+='<div style="display:flex;align-items:flex-end;gap:3px;height:40px;margin-bottom:6px">';
vals.forEach(function(v,i){
var h=Math.round(((v-mn)/rng)*34)+4;
out+='<div title="'+chartData[i].tarih+': '+v+'" style="flex:1;background:linear-gradient(180deg,#16A085,#0E6655);border-radius:3px 3px 0 0;height:'+h+'px;min-width:6px"></div>';
});
out+='</div>';
}
out+='<div style="display:flex;flex-direction:column;gap:3px">';
grup.slice(0,3).forEach(function(o){
out+='<div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 0;border-bottom:1px solid var(--brd)">';
out+='<span>'+(o.kisi==='Görkem'?'👨 ':'👩 ')+o.tarih+'</span>';
out+='<div style="display:flex;align-items:center;gap:8px"><b>'+o.deger+'</b><button class="del" onclick="sgOlcumSil('+o.id+')">🗑</button></div>';
out+='</div>';
});
out+='</div></div>';
return out;
}

var out='';
out+=olcumGrupH('Kilo','⚖️',kiloG);
out+=olcumGrupH('Tansiyon','❤️',tanG);
out+=olcumGrupH('Kan Şekeri','🩸',kanG);
digerG.forEach(function(o){
out+=olcumGrupH(o.tip,'📏',[o]);
});
return out;
}

// ─── MODAL: RANDEVU EKLE ──────────────────────────────────────────────────────
function sgMRandevu(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>📅 Randevu Ekle</h3><div class="fc">'+
'<div><div class="fl">Kişi</div><select id="sgrkisi" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>Görkem</option><option>Esra</option></select></div>'+
'<div><div class="fl">Randevu Türü *</div><input id="sgrtip" placeholder="ör: Diş, Göz, Dahiliye..."></div>'+
'<div><div class="fl">Klinik / Doktor</div><input id="sgrklinik" placeholder="ör: Özel Klinik, Dr. Mehmet"></div>'+
'<div class="g2">'+
'<div><div class="fl">Tarih *</div><input id="sgrtarih" type="date" value="'+sgTd()+'"></div>'+
'<div><div class="fl">Saat</div><input id="sgrsaat" type="time" value="09:00"></div>'+
'</div>'+
'<div><div class="fl">Not</div><textarea id="sgrnot" placeholder="Hatırlatıcı not..."></textarea></div>'+
'<button class="btn" style="background:#16A085;color:#fff" onclick="sgRandevuKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function sgRandevuKaydet(){
var tip=document.getElementById('sgrtip').value;
var tarih=document.getElementById('sgrtarih').value;
if(!tip||!tarih){toast('Tür ve tarih zorunlu!','warn');return;}
saglikInitCheck();
S.SAGLIK.randevular.push({
id:Date.now(),
kisi:document.getElementById('sgrkisi').value,
tip:tip,
klinik:document.getElementById('sgrklinik').value,
tarih:tarih,
saat:document.getElementById('sgrsaat').value,
not:document.getElementById('sgrnot').value
});
sv('SAGLIK');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Randevu eklendi!','succ');rn();}

function sgRandevuSil(id){
saglikInitCheck();
S.SAGLIK.randevular=S.SAGLIK.randevular.filter(function(r){return r.id!=id;});
sv('SAGLIK');rn();}

// ─── MODAL: İLAÇ EKLE ────────────────────────────────────────────────────────
function sgMIlac(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>💊 İlaç Ekle</h3><div class="fc">'+
'<div><div class="fl">Kişi</div><select id="sgikisi" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>Görkem</option><option>Esra</option></select></div>'+
'<div><div class="fl">İlaç Adı *</div><input id="sgiad" placeholder="ör: Augmentin, Vitamin D..."></div>'+
'<div><div class="fl">Doz / Kullanım</div><input id="sgidos" placeholder="ör: 500mg · Günde 2x"></div>'+
'<div><div class="fl">Kullanım Şekli</div><input id="sgikullanim" placeholder="ör: Yemekten sonra, Sabah aç karnına"></div>'+
'<div><div class="fl">Bitiş Tarihi</div><input id="sgibit" type="date"></div>'+
'<div><div class="fl">Not</div><textarea id="sginot" placeholder="Hatırlatıcı..."></textarea></div>'+
'<button class="btn" style="background:#16A085;color:#fff" onclick="sgIlacKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function sgIlacKaydet(){
var ad=document.getElementById('sgiad').value;
if(!ad){toast('İlaç adı zorunlu!','warn');return;}
saglikInitCheck();
S.SAGLIK.ilaclar.push({
id:Date.now(),
kisi:document.getElementById('sgikisi').value,
ad:ad,
doz:document.getElementById('sgidos').value,
kullanim:document.getElementById('sgikullanim').value,
bitisTarihi:document.getElementById('sgibit').value,
not:document.getElementById('sginot').value,
bitti:false
});
sv('SAGLIK');
var m=document.querySelector('.mo');if(m)m.remove();
toast('İlaç eklendi!','succ');rn();}

function sgIlacBit(id){
saglikInitCheck();
S.SAGLIK.ilaclar=S.SAGLIK.ilaclar.map(function(il){return il.id==id?Object.assign({},il,{bitti:true}):il;});
sv('SAGLIK');rn();}

function sgIlacSil(id){
saglikInitCheck();
S.SAGLIK.ilaclar=S.SAGLIK.ilaclar.filter(function(il){return il.id!=id;});
sv('SAGLIK');rn();}

// ─── MODAL: ÖLÇÜM EKLE ────────────────────────────────────────────────────────
function sgMOlcum(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>📊 Ölçüm Ekle</h3><div class="fc">'+
'<div><div class="fl">Kişi</div><select id="sgokisi" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>Görkem</option><option>Esra</option></select></div>'+
'<div><div class="fl">Ölçüm Türü *</div><select id="sgotip" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>Kilo</option><option>Tansiyon</option><option>Kan Şekeri</option><option>Diğer</option></select></div>'+
'<div><div class="fl">Değer *</div><input id="sgodeger" placeholder="ör: 72.5 kg · 120/80 · 95 mg/dL"></div>'+
'<div><div class="fl">Tarih</div><input id="sgotarih" type="date" value="'+sgTd()+'"></div>'+
'<div><div class="fl">Not</div><input id="sgonot" placeholder="Not..."></div>'+
'<button class="btn" style="background:#16A085;color:#fff" onclick="sgOlcumKaydet()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function sgOlcumKaydet(){
var deger=document.getElementById('sgodeger').value;
if(!deger){toast('Değer zorunlu!','warn');return;}
saglikInitCheck();
S.SAGLIK.olcumler.push({
id:Date.now(),
kisi:document.getElementById('sgokisi').value,
tip:document.getElementById('sgotip').value,
deger:deger,
tarih:document.getElementById('sgotarih').value,
not:document.getElementById('sgonot').value
});
sv('SAGLIK');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Ölçüm eklendi!','succ');rn();}

function sgOlcumSil(id){
saglikInitCheck();
S.SAGLIK.olcumler=S.SAGLIK.olcumler.filter(function(o){return o.id!=id;});
sv('SAGLIK');rn();}

// ─── ERAYLAR SAĞLIK SONU ─────────────────────────────────────────────────────
