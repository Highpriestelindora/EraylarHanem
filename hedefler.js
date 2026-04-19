// ═══ HEDEFLER ═══

// ═══════════════════════════════════════════════════════════════════════════════
// ERAYLAR HEDEFLER — V8.0.0
// ═══════════════════════════════════════════════════════════════════════════════

function hedefInitCheck(){
if(!S.HEDEF)S.HEDEF={liste:[]};
if(!S.HEDEF.liste)S.HEDEF.liste=[];}

// Otomatik ilerleme hesaplama
function hedefIlerleme(h){
if(h.tamamlandi)return 100;
if(h.tip==='manuel')return h.manuel_ilerleme||0;
// Otomatik: modülden veri oku
var now=new Date();var hedefDeger=h.hedef_deger||1;
var mevcut=0;
try{
if(h.mod==='MUTFAK'&&h.metrik==='haftalik_yemek'){
// Son 7 gündeki menü sayısı
var cnt=0;for(var i=0;i<7;i++){var d=new Date();d.setDate(d.getDate()-i);var k=d.toISOString().slice(0,10);if(S.M[k]){if(S.M[k].a)cnt++;if(S.M[k].k)cnt++;}}
mevcut=cnt;
}else if(h.mod==='PET'&&h.metrik==='veteriner_ziyaret'){
if(S.PET&&S.PET.vi){var all=[].concat(S.PET.vi.waffle||[],S.PET.vi.mayis||[]);mevcut=all.length;}
}else if(h.mod==='KASA'&&h.metrik==='birikim'){
if(S.KASA){mevcut=(S.KASA.gorkem||0)+(S.KASA.esra||0)+(S.KASA.ortak||0);}
}else if(h.mod==='SOSYAL'&&h.metrik==='aktivite_sayisi'){
if(S.SOSYAL&&S.SOSYAL.aktiviteler){mevcut=S.SOSYAL.aktiviteler.filter(function(a){return a.tamamlandi;}).length;}
}else if(h.mod==='GIDER'&&h.metrik==='aylik_harcama'){
var ay=now.getMonth();var yil=now.getFullYear();
if(S.GIDER){mevcut=S.GIDER.filter(function(g){var d=new Date(g.dt);return d.getMonth()===ay&&d.getFullYear()===yil;}).reduce(function(s,g){return s+g.amt;},0);}
}
}catch(e){}
var pct=Math.min(100,Math.round((mevcut/hedefDeger)*100));
return pct;}

function hedefKartHTML(h){
var pct=hedefIlerleme(h);
var renk=pct>=100?'var(--succ)':pct>=50?'var(--warn)':'var(--primary)';
var kisiIco=h.kisi==='Görkem'?'👨':h.kisi==='Esra'?'👩':'👫';
var tipBadge=h.tip==='otomatik'?'<span class="badge" style="background:var(--pL);color:var(--primary)">⚡ Otomatik</span>':'<span class="badge" style="background:var(--bg);color:var(--txtL)">✋ Manuel</span>';
var modBadge=h.mod?'<span class="badge" style="background:var(--sL);color:var(--sec)">'+h.mod+'</span>':'';
var bitisStr=h.bitis?'<div style="font-size:10px;color:var(--txtL);margin-top:4px">📅 Bitiş: '+h.bitis+'</div>':'';
return '<div class="cd fi" style="position:relative;'+(h.tamamlandi?'opacity:.7;':'')+'">'+
'<div style="display:flex;justify-content:space-between;align-items:flex-start">'+
'<div style="flex:1"><div style="font-weight:800;font-size:14px">'+kisiIco+' '+esc(h.baslik)+'</div>'+
'<div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap">'+tipBadge+modBadge+'</div>'+
bitisStr+'</div>'+
'<div style="display:flex;gap:4px">'+
(h.tamamlandi?'<span style="font-size:18px">✅</span>':'')+
'<button class="del" onclick="hedefSil('+h.id+')" title="Sil">🗑️</button>'+
'</div></div>'+
'<div style="margin-top:10px">'+
'<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px"><span>İlerleme</span><span style="font-weight:800;color:'+renk+'">%'+pct+'</span></div>'+
'<div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden">'+
'<div style="height:100%;width:'+pct+'%;background:'+renk+';border-radius:4px;transition:width .3s"></div></div></div>'+
(h.tip==='manuel'&&!h.tamamlandi?'<div style="display:flex;gap:6px;margin-top:8px"><input type="range" min="0" max="100" value="'+pct+'" style="flex:1" onchange="hedefManuelGuncelle('+h.id+',this.value)"><button class="btn bp" style="width:auto;padding:6px 12px;font-size:11px" onclick="hedefTamamla('+h.id+')">✓ Tamamla</button></div>':'')+
(h.tip==='otomatik'&&!h.tamamlandi&&pct>=100?'<button class="btn bs" style="margin-top:8px;font-size:11px" onclick="hedefTamamla('+h.id+')">🎉 Tamamlandı Olarak İşaretle</button>':'')+
'</div>';}

function hedefH(){
hedefInitCheck();
var liste=S.HEDEF.liste||[];
var aktif=liste.filter(function(h){return !h.tamamlandi;});
var tamamlanan=liste.filter(function(h){return h.tamamlandi;});

var aktifHTML='';
if(aktif.length===0){
aktifHTML='<div class="cd" style="text-align:center;padding:30px;color:var(--txtL)"><div style="font-size:40px;margin-bottom:8px">🎯</div><div style="font-size:13px">Henüz hedef eklenmemiş</div><div style="font-size:11px;margin-top:4px">Aşağıdan yeni hedef ekleyebilirsin</div></div>';
}else{
aktif.forEach(function(h){aktifHTML+=hedefKartHTML(h);});}

var tamamHTML='';
if(tamamlanan.length>0){
tamamHTML='<h3 style="margin-top:16px">✅ Tamamlanan Hedefler ('+tamamlanan.length+')</h3>';
tamamlanan.forEach(function(h){tamamHTML+=hedefKartHTML(h);});}

return '<div class="app"><div class="hdr" style="background:linear-gradient(135deg,#FF6F00,#E65100)"><div style="display:flex;align-items:center;gap:8px"><div style="font-size:14px;color:rgba(255,255,255,.7);cursor:pointer;min-width:44px;min-height:44px;display:flex;align-items:center" onclick="go(\'home\')">◀</div><div><h1>Eraylar Hedefler</h1><small>Takip & İlerleme</small></div></div><div style="display:flex;gap:6px;align-items:center">'+onlineDot()+'<button class="ubtn" onclick="pu(null)">'+(S.user==='Görkem'?'👨':'👩')+' '+S.user+'</button></div></div><div class="cnt fi">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h2>🏆 Aktif Hedefler ('+aktif.length+')</h2></div>'+
aktifHTML+
'<button class="btn bp" style="margin-top:12px" onclick="hedefEkleModal()">➕ Yeni Hedef Ekle</button>'+
tamamHTML+
'</div></div>';}

function hedefEkleModal(){
var modOpts='<option value="">— Modül Seçin —</option><option value="MUTFAK">🍳 Mutfak</option><option value="PET">🐾 Pet</option><option value="KASA">🧾 Kasa</option><option value="SOSYAL">🎯 Sosyal</option><option value="GIDER">💰 Finans</option>';
var metrikOpts='<option value="">— Önce modül seçin —</option>';

var html='<div class="mo" onclick="if(event.target===this)this.remove()"><div class="md"><h2>🎯 Yeni Hedef</h2><div class="fc">'+
'<div><div class="fl">Hedef Adı</div><input id="hfBas" placeholder="ör: Haftada 5 yemek yap"></div>'+
'<div><div class="fl">Kişi</div><select id="hfKisi"><option value="Görkem">👨 Görkem</option><option value="Esra">👩 Esra</option><option value="İkisi">👫 İkisi</option></select></div>'+
'<div><div class="fl">Tip</div><select id="hfTip" onchange="hedefTipDegisti()"><option value="manuel">✋ Manuel</option><option value="otomatik">⚡ Otomatik</option></select></div>'+
'<div id="hfOtoDiv" style="display:none"><div class="fl">Modül</div><select id="hfMod" onchange="hedefModDegisti()">'+modOpts+'</select></div>'+
'<div id="hfMetrikDiv" style="display:none"><div class="fl">Metrik</div><select id="hfMetrik">'+metrikOpts+'</select></div>'+
'<div id="hfDegerDiv" style="display:none"><div class="fl">Hedef Değer</div><input id="hfDeger" type="number" placeholder="ör: 5"></div>'+
'<div><div class="fl">Bitiş Tarihi (opsiyonel)</div><input id="hfBitis" type="date"></div>'+
'<button class="btn bp" onclick="hedefKaydet()">💾 Kaydet</button>'+
'</div></div></div>';
document.body.insertAdjacentHTML('beforeend',html);}

function hedefTipDegisti(){
var tip=document.getElementById('hfTip').value;
document.getElementById('hfOtoDiv').style.display=tip==='otomatik'?'block':'none';
document.getElementById('hfMetrikDiv').style.display=tip==='otomatik'?'block':'none';
document.getElementById('hfDegerDiv').style.display=tip==='otomatik'?'block':'none';}

function hedefModDegisti(){
var mod=document.getElementById('hfMod').value;
var sel=document.getElementById('hfMetrik');
var opts='';
if(mod==='MUTFAK'){opts='<option value="haftalik_yemek">Haftalık Yemek Sayısı</option>';}
else if(mod==='PET'){opts='<option value="veteriner_ziyaret">Veteriner Ziyaret Sayısı</option>';}
else if(mod==='KASA'){opts='<option value="birikim">Toplam Birikim (₺)</option>';}
else if(mod==='SOSYAL'){opts='<option value="aktivite_sayisi">Tamamlanan Aktivite Sayısı</option>';}
else if(mod==='GIDER'){opts='<option value="aylik_harcama">Aylık Harcama Limiti (₺)</option>';}
else{opts='<option value="">— Önce modül seçin —</option>';}
sel.innerHTML=opts;
document.getElementById('hfDegerDiv').style.display=mod?'block':'none';}

function hedefKaydet(){
hedefInitCheck();
var bas=document.getElementById('hfBas').value.trim();
if(!bas){toast('Hedef adı zorunlu!','warn');return;}
var tip=document.getElementById('hfTip').value;
var kisi=document.getElementById('hfKisi').value;
var bitis=document.getElementById('hfBitis').value||null;
var hedef={
id:Date.now(),
baslik:bas,
kisi:kisi,
tip:tip,
mod:tip==='otomatik'?(document.getElementById('hfMod').value||''):'',
metrik:tip==='otomatik'?(document.getElementById('hfMetrik').value||''):'',
hedef_deger:tip==='otomatik'?parseFloat(document.getElementById('hfDeger').value)||0:0,
bitis:bitis,
tamamlandi:false,
manuel_ilerleme:0
};
S.HEDEF.liste.push(hedef);
sv('HEDEF');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Hedef eklendi!','succ');rn();}

function hedefSil(id){
hedefInitCheck();
if(!confirm('Bu hedefi silmek istediğine emin misin?'))return;
S.HEDEF.liste=S.HEDEF.liste.filter(function(h){return h.id!==id;});
sv('HEDEF');toast('Hedef silindi','succ');rn();}

function hedefTamamla(id){
hedefInitCheck();
S.HEDEF.liste=S.HEDEF.liste.map(function(h){
if(h.id===id)return Object.assign({},h,{tamamlandi:true,manuel_ilerleme:100});
return h;});
sv('HEDEF');toast('🎉 Hedef tamamlandı!','succ');rn();}

function hedefManuelGuncelle(id,val){
hedefInitCheck();
S.HEDEF.liste=S.HEDEF.liste.map(function(h){
if(h.id===id)return Object.assign({},h,{manuel_ilerleme:parseInt(val)||0});
return h;});
sv('HEDEF');rn();}

// ─── ERAYLAR HEDEFLER SONU ──────────────────────────────────────────────────
