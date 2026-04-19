// ═══ PET ═══
// ─── PET MODÜLÜ ───────────────────────────────────────────────────────────────
function petPd(s){var p=s.split('.');return new Date(+p[2],+p[1]-1,+p[0]);}
function petFmt(d){var t=d instanceof Date?d:new Date(d);return('0'+t.getDate()).slice(-2)+'.'+('0'+(t.getMonth()+1)).slice(-2)+'.'+t.getFullYear();}
function petDu(s){return Math.round((petPd(s).setHours(0,0,0,0)-new Date().setHours(0,0,0,0))/864e5);}
function petAd(s,n){var d=petPd(s);d.setDate(d.getDate()+n);return petFmt(d);}
function petTd(){return petFmt(new Date());}
function petAge(s){var b=petPd(s),t=new Date(),mo=(t.getFullYear()-b.getFullYear())*12+t.getMonth()-b.getMonth();if(mo<1)return Math.round((t-b)/864e5)+' günlük';if(mo<12)return mo+' aylık';var y=Math.floor(mo/12),m=mo%12;return m?y+' yaş '+m+' ay':y+' yaş';}
function petVst(days){if(days<0)return{c:'#DC2626',bg:'#FEF2F2',bd:'#FECACA',lbl:Math.abs(days)+' gün geçti!'};if(days<=7)return{c:'#DC2626',bg:'#FEF2F2',bd:'#FECACA',lbl:days+' gün kaldı'};if(days<=30)return{c:'#B45309',bg:'#FFFBEB',bd:'#FDE68A',lbl:days+' gün kaldı'};return{c:'#15803D',bg:'#F0FDF4',bd:'#86EFAC',lbl:days+' gün kaldı'};}
function petCatIco(c){return{'Veteriner':'🏥','İlaç':'💊','Mama':'🍖','Aksesuar':'🎀','Kum':'🪣','Diğer':'📦'}[c]||'💰';}
function petUrgent(pid){return(S.PET.v[pid]||[]).filter(function(v){return petDu(petAd(v.last,v.ev))<=7;}).length;}
function petSvUniq(arr){return arr.filter(function(v,i,a){return a.indexOf(v)===i;});}

function petH(){
var tab=S.PET.tab||'waffle';
var uw=petUrgent('waffle'),um=petUrgent('mayis'),ut=uw+um;
var tabs=[['waffle','🐕 Waffle',uw>0],['mayis','🐈 Mayıs',um>0],['exp','💰 Harcama',false]];
return'<div class="app">'+
'<div class="hdr" style="background:linear-gradient(135deg,#F97316,#C2410C);display:block;padding-bottom:0">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'+
'<div style="display:flex;align-items:center;gap:8px"><div onclick="go(\'home\')" style="cursor:pointer;color:#fff;font-size:20px;min-width:44px;min-height:44px;display:flex;align-items:center">◀</div>'+
'<div><h1>🐾 Eraylar Pet</h1><small>Waffle & Mayıs sağlık takibi</small></div></div>'+
(ut>0?'<div style="background:#DC2626;color:#fff;border-radius:16px;padding:5px 11px;font-size:11px;font-weight:800;box-shadow:0 3px 10px rgba(220,38,38,.4)">⚠️ '+ut+' acil!</div>':'')+
'</div>'+
'<div style="display:flex;background:rgba(0,0,0,.2);border-radius:11px 11px 0 0;overflow:hidden">'+
tabs.map(function(t){var id=t[0],lbl=t[1],dot=t[2],act=tab===id;return'<button onclick="S.PET.tab=\''+id+'\';sv(\'PET\');rn()" style="flex:1;border:none;padding:10px 4px;font-size:12px;font-weight:800;font-family:\'Nunito\';background:'+(act?'#fff':'transparent')+';color:'+(act?'#F97316':'rgba(255,255,255,.88)')+';border-radius:'+(act?'10px 10px 0 0':'0')+';cursor:pointer;position:relative">'+lbl+(dot?'<span style="position:absolute;top:4px;right:6px;width:6px;height:6px;border-radius:50%;background:#DC2626"></span>':'')+' </button>';}).join('')+
'</div></div>'+
'<div class="cnt fi">'+
(tab==='exp'?petExpH():petDetailH(tab))+
'</div></div>';}

function petDetailH(pid){
var P=S.PET,pet=PETMETA[pid];
var vs=P.v[pid]||[];
var weights=((P.w&&P.w[pid])||[]).slice().sort(function(a,b){return petPd(a.d)-petPd(b.d);});
var visits=(P.vi&&P.vi[pid])||[];
var lastW=weights[weights.length-1];
return'<div class="fi">'+
// Profil kartı
'<div style="background:'+pet.grad+';border-radius:18px;padding:20px;color:#fff;position:relative;overflow:hidden;margin-bottom:10px">'+
'<div style="position:absolute;right:-15px;top:-15px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.1)"></div>'+
'<div style="position:relative">'+
'<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">'+
'<span style="font-size:50px;line-height:1;filter:drop-shadow(0 3px 8px rgba(0,0,0,.2))">'+pet.emoji+'</span>'+
'<div><div style="font-family:\'Fraunces\',serif;font-size:28px;font-weight:900;line-height:1">'+pet.name+'</div>'+
'<div style="font-size:11px;opacity:.8;margin-top:2px;font-style:italic">'+pet.breed+'</div></div></div>'+
'<div>'+[['🎂',petAge(pet.birth)],['👤',pet.gender],['🎨',pet.color]].map(function(r){return'<span style="background:rgba(255,255,255,.22);border-radius:14px;padding:4px 10px;font-size:11px;font-weight:700;display:inline-block;margin:2px 2px 0 0">'+r[0]+' '+r[1]+'</span>';}).join('')+
'</div></div></div>'+
// Kimlik
'<div class="cd" style="margin-bottom:10px">'+
'<h3>🪪 Kimlik</h3>'+
'<div class="g2" style="gap:6px">'+
[['Pasaport',pet.passport],['Mikroçip',pet.chip],['Çip Tarihi',pet.chipDate],['Çip Yeri',pet.chipLoc]].map(function(r){return'<div style="background:var(--bg);border-radius:10px;padding:8px 10px"><div class="fl">'+r[0]+'</div><div style="font-size:11px;font-weight:700;word-break:break-all">'+r[1]+'</div></div>';}).join('')+
'</div></div>'+
// Aşı takvimi
'<div class="cd" style="margin-bottom:10px">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h3 style="margin:0">💉 Aşı Takvimi</h3>'+
'<button class="ubtn" style="background:#F97316" onclick="petMVacc(\''+pid+'\')">+ Kaydet</button></div>'+
vs.map(function(v){
var next=petAd(v.last,v.ev),days=petDu(next),st=petVst(days);
var pct=Math.min(100,Math.max(0,((v.ev-Math.max(0,days))/v.ev)*100));
return'<div style="border-radius:11px;border:1.5px solid '+st.bd+';overflow:hidden;margin-bottom:8px">'+
'<div style="background:'+st.bg+';padding:11px 13px">'+
'<div style="display:flex;justify-content:space-between;align-items:flex-start">'+
'<div><div style="font-weight:800;font-size:14px">'+v.n+'</div>'+
'<div style="font-size:10px;color:var(--txtL);margin-top:1px">Son: <b>'+v.last+'</b> · Sonraki: <b style="color:'+st.c+'">'+next+'</b></div></div>'+
'<div style="text-align:right"><div style="font-weight:800;font-size:13px;color:'+st.c+'">'+st.lbl+'</div>'+
'<div style="font-size:10px;color:var(--txtL)">Her '+v.ev+' günde bir</div></div></div>'+
'<div style="height:6px;background:rgba(0,0,0,.1);border-radius:9px;overflow:hidden;margin-top:8px">'+
'<div style="height:100%;width:'+pct+'%;background:'+st.c+';border-radius:9px;transition:width .5s"></div></div></div></div>';
}).join('')+'</div>'+
// Kilo
'<div class="cd" style="margin-bottom:10px">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h3 style="margin:0">⚖️ Kilo'+(lastW?' <span style="color:#F97316;font-size:16px">'+lastW.kg+' kg</span>':'')+' </h3>'+
'<button class="ubtn" style="background:#F97316" onclick="petMWeight(\''+pid+'\')">+ Ekle</button></div>'+
(weights.length===0?'<div style="text-align:center;padding:20px;color:var(--txtL);font-size:13px">📊 Henüz kilo kaydı yok</div>':
'<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px">'+
weights.slice().reverse().slice(0,8).map(function(w){return'<div style="flex-shrink:0;background:var(--bg);border-radius:10px;padding:7px 10px;text-align:center;min-width:60px"><div style="font-weight:800;font-size:14px;color:#F97316">'+w.kg+'<span style="font-size:9px"> kg</span></div><div style="font-size:9px;color:var(--txtL)">'+w.d.slice(0,5)+'</div></div>';}).join('')+'</div>')+
'</div>'+
// Veteriner
'<div class="cd" style="margin-bottom:10px">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h3 style="margin:0">🏥 Veteriner</h3>'+
'<button class="ubtn" style="background:#F97316" onclick="petMVisit(\''+pid+'\')">+ Ekle</button></div>'+
(visits.length===0?'<div style="text-align:center;padding:20px;color:var(--txtL);font-size:13px">🩺 Henüz ziyaret kaydı yok</div>':
'<div style="position:relative;padding-left:18px">'+
'<div style="position:absolute;left:6px;top:0;bottom:0;width:2px;background:#FED7AA;border-radius:2px"></div>'+
visits.slice().sort(function(a,b){return petPd(b.d)-petPd(a.d);}).map(function(v){
return'<div style="position:relative;margin-bottom:14px">'+
'<div style="position:absolute;left:-18px;top:3px;width:10px;height:10px;border-radius:50%;background:#F97316;border:2px solid #fff;box-shadow:0 0 0 2px #FED7AA"></div>'+
'<div style="display:flex;justify-content:space-between;align-items:flex-start">'+
'<div style="flex:1"><div style="font-weight:800;font-size:13px">'+v.r+'</div>'+
(v.cl?'<div style="font-size:11px;color:var(--txtL)">📍 '+v.cl+'</div>':'')+
(v.nt?'<div style="font-size:11px;color:var(--txtL);font-style:italic;margin-top:3px;background:var(--bg);padding:5px 8px;border-radius:7px">'+v.nt+'</div>':'')+
(v.c?'<div style="font-size:12px;font-weight:800;color:#F97316;margin-top:3px">💳 '+Number(v.c).toLocaleString('tr-TR')+' ₺</div>':'')+
'</div><span class="badge" style="background:var(--bg);color:var(--txtL);flex-shrink:0;margin-left:8px;font-size:9px">'+v.d+'</span></div></div>';}).join('')+
'</div>')+
'</div></div>';}

function petExpH(){
var data=S.PET.e||[];
var now=new Date();
var total=data.reduce(function(s,e){return s+Number(e.am||0);},0);
var mTot=data.filter(function(e){var d=petPd(e.d);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();}).reduce(function(s,e){return s+Number(e.am||0);},0);
var wTot=data.filter(function(e){return e.pet==='Waffle'||e.pet==='Her İkisi';}).reduce(function(s,e){return s+Number(e.am||0);},0);
var myTot=data.filter(function(e){return e.pet==='Mayıs'||e.pet==='Her İkisi';}).reduce(function(s,e){return s+Number(e.am||0);},0);
return'<div class="fi">'+
'<div class="g2" style="margin-bottom:10px">'+
[['💰 Toplam',total],['📅 Bu Ay',mTot],['🐕 Waffle',wTot],['🐈 Mayıs',myTot]].map(function(r){return'<div class="cd" style="text-align:center;padding:13px"><div style="font-size:10px;color:var(--txtL);margin-bottom:3px">'+r[0]+'</div><div style="font-family:\'Fraunces\',serif;font-size:20px;font-weight:800;color:#F97316">'+r[1].toLocaleString('tr-TR')+' ₺</div></div>';}).join('')+
'</div>'+
'<div class="cd">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h3 style="margin:0">Harcamalar</h3>'+
'<button class="ubtn" style="background:#F97316" onclick="petMExp()">+ Ekle</button></div>'+
(data.length===0?'<div style="text-align:center;padding:20px;color:var(--txtL);font-size:13px">💳 Henüz harcama kaydı yok</div>':
'<div class="fc">'+
data.slice().sort(function(a,b){return petPd(b.d)-petPd(a.d);}).map(function(e,i){return'<div style="display:flex;align-items:center;gap:9px;padding:9px 11px;background:var(--bg);border-radius:10px"><span style="font-size:18px">'+petCatIco(e.cat)+'</span><div style="flex:1;min-width:0"><div style="font-weight:700;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+e.desc+'</div><div style="font-size:10px;color:var(--txtL)">'+e.d+' · '+e.pet+' · '+e.cat+'</div></div><div style="font-weight:800;font-size:13px">'+Number(e.am).toLocaleString('tr-TR')+' ₺</div><button class="del" onclick="S.PET.e.splice('+i+',1);sv(\'PET\');rn()">🗑️</button></div>';}).join('')+
'</div>')+
'</div></div>';}

function petMVacc(pid){
var pet=PETMETA[pid];var vs=S.PET.v[pid]||[];
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>💉 '+pet.name+' — Aşı Kaydet</h3><div class="fc">'+
'<div><div class="fl">Aşı Türü</div><select id="pvn" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)">'+vs.map(function(v){return'<option>'+v.n+'</option>';}).join('')+'</select></div>'+
'<div><div class="fl">Yapıldığı Tarih</div><input id="pvd" value="'+petTd()+'"></div>'+
'<button class="btn" style="background:#F97316;color:#fff" onclick="petDoVacc(\''+pid+'\')">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';
document.body.appendChild(e);}

function petDoVacc(pid){
var n=document.getElementById('pvn').value,d=document.getElementById('pvd').value;
if(!n||!d)return;
S.PET.v[pid]=S.PET.v[pid].map(function(v){
if(v.n!==n)return v;
var h=petSvUniq([].concat(v.h,[d])).sort(function(a,b){return petPd(a)-petPd(b);});
return{n:v.n,last:h[h.length-1],ev:v.ev,h:h};});
sv('PET');var m=document.querySelector('.mo');if(m)m.remove();rn();}

function petMWeight(pid){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>⚖️ '+PETMETA[pid].name+' — Kilo Ekle</h3><div class="fc">'+
'<div><div class="fl">Tarih</div><input id="pwd" value="'+petTd()+'"></div>'+
'<div><div class="fl">Kilo (kg)</div><input id="pwk" type="number" step=".1" min="0" placeholder="ör: 8.5"></div>'+
'<button class="btn" style="background:#F97316;color:#fff" onclick="petDoW(\''+pid+'\')">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';
document.body.appendChild(e);}

function petDoW(pid){
var d=document.getElementById('pwd').value,k=document.getElementById('pwk').value;
if(!d||!k)return;
if(!S.PET.w)S.PET.w={waffle:[],mayis:[]};
if(!S.PET.w[pid])S.PET.w[pid]=[];
S.PET.w[pid].push({d:d,kg:parseFloat(k)});
sv('PET');var m=document.querySelector('.mo');if(m)m.remove();rn();}

function petMVisit(pid){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🏥 '+PETMETA[pid].name+' — Veteriner</h3><div class="fc">'+
'<div><div class="fl">Tarih</div><input id="vvd" value="'+petTd()+'"></div>'+
'<div><div class="fl">Klinik / Veteriner</div><input id="vvcl" placeholder="Klinik veya doktor adı"></div>'+
'<div><div class="fl">Ziyaret Sebebi *</div><input id="vvr" placeholder="Kontrol, aşı, tedavi..."></div>'+
'<div><div class="fl">Notlar</div><textarea id="vvnt" placeholder="Doktor notları..."></textarea></div>'+
'<div><div class="fl">Ücret (₺)</div><input id="vvc" type="number" min="0" placeholder="0"></div>'+
'<button class="btn" style="background:#F97316;color:#fff" onclick="petDoVi(\''+pid+'\')">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';
document.body.appendChild(e);}

function petDoVi(pid){
var d=document.getElementById('vvd').value,r=document.getElementById('vvr').value;
if(!d||!r)return;
if(!S.PET.vi)S.PET.vi={waffle:[],mayis:[]};
if(!S.PET.vi[pid])S.PET.vi[pid]=[];
S.PET.vi[pid].push({d:d,cl:document.getElementById('vvcl').value,r:r,nt:document.getElementById('vvnt').value,c:document.getElementById('vvc').value});
sv('PET');var m=document.querySelector('.mo');if(m)m.remove();rn();}

function petMExp(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>💰 Harcama Ekle</h3><div class="fc">'+
'<div><div class="fl">Tarih</div><input id="ped" value="'+petTd()+'"></div>'+
'<div><div class="fl">Evcil Hayvan</div><select id="pept" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>Waffle</option><option>Mayıs</option><option>Her İkisi</option></select></div>'+
'<div><div class="fl">Kategori</div><select id="pecat" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>Veteriner</option><option>İlaç</option><option>Mama</option><option>Aksesuar</option><option>Kum</option><option>Diğer</option></select></div>'+
'<div><div class="fl">Açıklama *</div><input id="pedesc" placeholder="Ne için?"></div>'+
'<div><div class="fl">Tutar (₺) *</div><input id="peam" type="number" min="0" placeholder="0"></div>'+
'<button class="btn" style="background:#F97316;color:#fff" onclick="petDoExp()">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';
document.body.appendChild(e);}

function petDoExp(){
var d=document.getElementById('ped').value,desc=document.getElementById('pedesc').value,am=document.getElementById('peam').value;
if(!d||!desc||!am)return;
if(!S.PET.e)S.PET.e=[];
S.PET.e.push({d:d,pet:document.getElementById('pept').value,cat:document.getElementById('pecat').value,desc:desc,am:parseFloat(am)});
if(!S.GIDER)S.GIDER=[];
S.GIDER.push({id:Date.now(),dt:d,amt:parseFloat(am),cat:document.getElementById('pecat').value,mod:'PET',desc:desc+' ('+document.getElementById('pept').value+')',usr:S.user||'Görkem'});
sv('PET');sv('GIDER');var m=document.querySelector('.mo');if(m)m.remove();rn();}
// ─── PET MODÜLÜ SONU ──────────────────────────────────────────────────────────
