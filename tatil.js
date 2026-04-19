// ═══ ERAYLAR TATİL MODÜLÜ ═══
// ─── TATIL MODÜLÜ ─────────────────────────────────────────────────────────────
function tatPd(s){if(!s)return new Date(0);var p=s.split('.');return new Date(+p[2],+p[1]-1,+p[0]);}
function tatFmt(d){var t=d instanceof Date?d:new Date(d);return('0'+t.getDate()).slice(-2)+'.'+('0'+(t.getMonth()+1)).slice(-2)+'.'+t.getFullYear();}
function tatDu(s){if(!s)return 9999;return Math.round((tatPd(s).setHours(0,0,0,0)-new Date().setHours(0,0,0,0))/864e5);}
function tatTd(){return tatFmt(new Date());}
function tatSchDays(){
var trips=S.TAT&&S.TAT.trips||[];var now=new Date();var ws=new Date(now);ws.setDate(now.getDate()-180);
function cnt(who){var u=0;trips.forEach(function(t){if(!t.schengen||t.status!=='tamamlandi'||!t.startDate)return;if(t.who!==who&&t.who!=='ikisi')return;var s=tatPd(t.startDate),en=t.endDate?tatPd(t.endDate):s;var cs=s<ws?ws:s,ce=en>now?now:en;if(cs<=ce)u+=Math.round((ce-cs)/864e5)+1;});return Math.min(90,u);}
var g=cnt('gorkem'),e=cnt('esra');return{gorkem:{used:g,left:Math.max(0,90-g)},esra:{used:e,left:Math.max(0,90-e)}};}



function tatH(){
var tab=S.TAT.ttab||'trips';
var P=S.TAT.passport||{};
var pg=P.gorkem,pe=P.esra;
var pgD=pg&&pg.exp?tatDu(pg.exp):999,peD=pe&&pe.exp?tatDu(pe.exp):999;
var passWarn=pgD<180||peD<180;
return'<div class="app">'+
'<div class="hdr" style="background:linear-gradient(135deg,#1E86C8,#1a5276);display:block;padding-bottom:0">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'+
'<div style="display:flex;align-items:center;gap:8px">'+
'<div onclick="go(\'home\')" style="cursor:pointer;color:#fff;font-size:20px;min-width:44px;min-height:44px;display:flex;align-items:center">◀</div>'+
'<div><h1>✈️ Eraylar Tatil</h1><small>Seyahat & Gezi Takibi</small></div></div>'+
(passWarn?'<div style="background:#DC2626;color:#fff;border-radius:16px;padding:5px 11px;font-size:11px;font-weight:800;cursor:pointer" onclick="S.TAT.ttab=\'pasaport\';sv(\'TAT\');rn()">⚠️ Pasaport!</div>':'')+
'</div>'+
'<div style="display:flex;background:rgba(0,0,0,.2);border-radius:11px 11px 0 0;overflow:hidden">'+
[['trips','🌍 Tatiller'],['harita','🗺️ Harita'],['pasaport','🛂 Pasaport'],['hayal','⭐ Hayaller']].map(function(t){var act=tab===t[0];return'<button onclick="S.TAT.ttab=\''+t[0]+'\';sv(\'TAT\');rn()" style="flex:1;border:none;padding:9px 3px;font-size:11px;font-weight:800;font-family:\'Nunito\';background:'+(act?'#fff':'transparent')+';color:'+(act?'#1E86C8':'rgba(255,255,255,.88)')+';border-radius:'+(act?'10px 10px 0 0':'0')+';cursor:pointer">'+t[1]+'</button>';}).join('')+
'</div></div>'+
'<div class="cnt fi">'+(tab==='trips'?tatTripsH():tab==='harita'?tatHaritaH():tab==='pasaport'?tatPassH():tatWishH())+'</div></div>';}

function tatTripsH(){
var trips=S.TAT.trips||[];
var now=new Date();
var upcoming=trips.filter(function(t){return t.status==='planlandi';}).sort(function(a,b){return tatPd(a.startDate)-tatPd(b.startDate);});
var past=trips.filter(function(t){return t.status==='tamamlandi';}).sort(function(a,b){return tatPd(b.startDate)-tatPd(a.startDate);});
var typeClr={yurtdisi:'#1E86C8',yurtici:'#27AE60',aile:'#8E44AD',is:'#5D6D7E'};
var typeLbl={yurtdisi:'✈️ Yurtdışı',yurtici:'🚗 Yurtiçi',aile:'👨‍👩‍👧 Aile',is:'💼 İş'};
var whoLbl={gorkem:'👨 Görkem',esra:'👩 Esra',ikisi:'👫 İkimiz'};
function tripCard(t){
var days=t.startDate?tatDu(t.startDate):null;
var dur=t.startDate&&t.endDate?Math.ceil((tatPd(t.endDate)-tatPd(t.startDate))/864e5)+1:null;
var clr=typeClr[t.type]||'#1E86C8';
var flag=CFLG[t.country]||CFLG[t.city]||'🌍';
var totalExp=(t.expenses||[]).reduce(function(s,e){return s+Number(e.amount||0);},0);
return'<div style="background:var(--card);border-radius:var(--r);border:1px solid var(--brd);overflow:hidden;cursor:pointer;margin-bottom:10px;box-shadow:0 1px 8px rgba(0,0,0,.05)" onclick="tatDetay(\''+t.id+'\')">'+
'<div style="background:'+clr+';padding:12px 14px;display:flex;justify-content:space-between;align-items:center">'+
'<div style="display:flex;align-items:center;gap:10px">'+
'<span style="font-size:28px;line-height:1">'+flag+'</span>'+
'<div><div style="font-weight:800;font-size:15px;color:#fff">'+(t.title||(t.city&&t.country?t.city+', '+t.country:t.city||t.country||'Tatil'))+'</div>'+
'<div style="font-size:10px;color:rgba(255,255,255,.8)">'+typeLbl[t.type]+(t.who?' · '+whoLbl[t.who]:'')+'</div></div></div>'+
(days!==null&&t.status==='planlandi'?'<div style="text-align:right"><div style="font-weight:900;font-size:20px;color:#fff">'+(days===0?'Bugün!':days<0?Math.abs(days)+' gün':days+' gün')+'</div><div style="font-size:9px;color:rgba(255,255,255,.7)">'+(days<0?'önce başladı':'kaldı')+'</div></div>':'')+
'</div>'+
'<div style="padding:10px 14px;display:flex;justify-content:space-between;align-items:center">'+
'<div style="font-size:11px;color:var(--txtL)">'+(t.startDate||'Tarih yok')+(t.endDate?' – '+t.endDate:'')+(dur?' ('+dur+' gün)':'')+'</div>'+
(totalExp?'<div style="font-size:11px;font-weight:700;color:'+clr+'">'+totalExp.toLocaleString('tr-TR')+' ₺</div>':'')+
'</div></div>';}
return'<div>'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h2 style="margin:0;font-size:18px">Tatillerim</h2>'+
'<button class="ubtn" style="background:#1E86C8" onclick="tatMTrip()">+ Tatil Ekle</button></div>'+
(upcoming.length===0&&past.length===0?
'<div class="cd" style="text-align:center;padding:40px"><div style="font-size:52px;margin-bottom:12px">🗺️</div><div style="font-size:14px;font-weight:700;margin-bottom:6px">Henüz tatil yok</div><div style="font-size:12px;color:var(--txtL)">İlk tatilini ekleyelim!</div><button class="btn" style="background:#1E86C8;color:#fff;max-width:200px;margin:16px auto 0" onclick="tatMTrip()">+ Tatil Ekle</button></div>':
(upcoming.length?'<div style="font-size:10px;font-weight:800;color:var(--txtL);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📅 Yaklaşan Tatiller</div>'+upcoming.map(tripCard).join(''):'')+
(past.length?'<div style="font-size:10px;font-weight:800;color:var(--txtL);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px'+(upcoming.length?';margin-top:16px':'')+'">'+'✅ Geçmiş Tatiller</div>'+past.map(tripCard).join(''):'')+
'</div>'
)+'</div>';}

function tatHaritaH(){
var trips=S.TAT.trips||[];
var cm={};
trips.forEach(function(t){if(!t.country&&!t.city)return;var k=t.country||t.city;if(!cm[k])cm[k]={name:k,who:[],visits:0};if(cm[k].who.indexOf(t.who)<0)cm[k].who.push(t.who);cm[k].visits++;});
var countries=Object.values(cm);
var gC=countries.filter(function(c){return c.who.indexOf('gorkem')>=0||c.who.indexOf('ikisi')>=0;}).length;
var eC=countries.filter(function(c){return c.who.indexOf('esra')>=0||c.who.indexOf('ikisi')>=0;}).length;
var toC=countries.filter(function(c){return c.who.indexOf('ikisi')>=0;}).length;
return'<div>'+
'<div class="g3" style="margin-bottom:12px">'+
[['🌍 Toplam',countries.length],['👨 Görkem',gC],['👩 Esra',eC]].map(function(r){return'<div class="cd" style="text-align:center;padding:10px"><div style="font-family:\'Fraunces\',serif;font-size:24px;font-weight:800;color:#1E86C8">'+r[1]+'</div><div style="font-size:9px;color:var(--txtL)">'+r[0]+'</div></div>';}).join('')+'</div>'+
'<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">'+
[['#1E86C8','👨 Görkem'],['#E74C8B','👩 Esra'],['#8E44AD','👫 İkimiz']].map(function(l){return'<div style="display:flex;align-items:center;gap:5px;font-size:11px"><div style="width:10px;height:10px;border-radius:50%;background:'+l[0]+'"></div>'+l[1]+'</div>';}).join('')+'</div>'+
(countries.length===0?
'<div class="cd" style="text-align:center;padding:40px"><div style="font-size:48px;margin-bottom:10px">🗺️</div><div style="font-size:13px;color:var(--txtL)">Tatil ekledikçe ülkeler burada belirir</div></div>':
'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">'+
countries.sort(function(a,b){return b.visits-a.visits;}).map(function(c){
var clr=c.who.indexOf('ikisi')>=0?'#8E44AD':(c.who.indexOf('gorkem')>=0&&c.who.indexOf('esra')>=0)?'#8E44AD':c.who.indexOf('esra')>=0?'#E74C8B':'#1E86C8';
return'<div style="background:var(--bg);border-radius:10px;padding:10px 8px;text-align:center;border-left:3px solid '+clr+'">'+
'<div style="font-size:24px;margin-bottom:4px">'+(CFLG[c.name]||'🌍')+'</div>'+
'<div style="font-size:10px;font-weight:700;line-height:1.2">'+c.name+'</div>'+
'<div style="font-size:9px;color:var(--txtL);margin-top:2px">'+c.visits+'x</div></div>';}).join('')+'</div>')+
'</div>';}

function tatPassH(){
var P=S.TAT.passport||{};
var visas=S.TAT.visas||[];
var sch=tatSchDays();
function schBar(data,who){
var pct=Math.min(100,(data.used/90)*100);
var clr=data.used>75?'var(--danger)':data.used>50?'var(--warn)':'var(--succ)';
return'<div style="margin-bottom:10px">'+
'<div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;margin-bottom:4px">'+
'<span>'+who+'</span><span style="color:'+clr+'">'+data.used+'/90 gün · '+data.left+' kalan</span></div>'+
'<div style="height:7px;background:var(--bg);border-radius:4px;overflow:hidden">'+
'<div style="height:100%;width:'+pct+'%;background:'+clr+';border-radius:4px;transition:width .5s"></div></div></div>';}
function passCard(pid,lbl){
var p=P[pid]||{};var days=p.exp?tatDu(p.exp):null;
var clr=days===null?'var(--txtL)':days<90?'#DC2626':days<365?'#B45309':'#27AE60';
var bgClr=days===null?'var(--bg)':days<90?'var(--dangerL)':days<365?'var(--warnL)':'var(--succL)';
return'<div class="cd" style="margin-bottom:10px">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'+
'<div style="font-weight:800;font-size:14px">🛂 '+lbl+'</div>'+
'<button class="ubtn" style="background:#1E86C8;font-size:11px" onclick="tatMPass(\''+pid+'\')">'+( p.no?'✏️ Düzenle':'+ Ekle')+'</button></div>'+
(p.no?
'<div class="g2" style="gap:6px;margin-bottom:8px">'+
[['Pasaport No',p.no],['Son Kullanma',p.exp||'—']].map(function(r){return'<div style="background:var(--bg);border-radius:10px;padding:8px 10px"><div class="fl">'+r[0]+'</div><div style="font-size:12px;font-weight:700">'+r[1]+'</div></div>';}).join('')+'</div>'+
(days!==null?'<div style="padding:8px 12px;background:'+bgClr+';border-radius:10px;font-size:12px;font-weight:700;color:'+clr+'">'+
(days<0?'❌ Pasaport süresi doldu!':days<90?'⚠️ '+days+' gün kaldı — acil yenile!':days<365?'⏰ '+days+' gün kaldı':'✅ '+days+' gün geçerli')+'</div>':''):
'<div style="color:var(--txtL);font-size:13px;text-align:center;padding:8px">Pasaport bilgisi girilmemiş</div>')+
'</div>';}
return'<div>'+
passCard('gorkem','Görkem Eray')+
passCard('esra','Esra Eray')+
'<div class="cd" style="margin-bottom:10px">'+
'<h3>🇪🇺 Schengen Takibi (Son 180 Gün)</h3>'+
schBar(sch.gorkem,'👨 Görkem')+
schBar(sch.esra,'👩 Esra')+
'<div style="font-size:10px;color:var(--txtL);text-align:center;margin-top:4px">Schengen alanında 180 günde maksimum 90 gün kalınabilir</div>'+
'</div>'+
'<div class="cd">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h3 style="margin:0">🔖 Aktif Vizeler</h3>'+
'<button class="ubtn" style="background:#1E86C8;font-size:11px" onclick="tatMVisa()">+ Vize Ekle</button></div>'+
(visas.length===0?'<div style="text-align:center;padding:20px;color:var(--txtL);font-size:13px">Henüz vize eklenmemiş</div>':
'<div class="fc">'+visas.map(function(v,i){
var dL=v.validTo?tatDu(v.validTo):null;
var clr=dL===null?'var(--txtL)':dL<30?'#DC2626':dL<90?'#B45309':'#27AE60';
var whoLbl={gorkem:'👨',esra:'👩',ikisi:'👫'};
return'<div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg);border-radius:10px">'+
'<span style="font-size:20px">'+(CFLG[v.country]||'🔖')+'</span>'+
'<div style="flex:1"><div style="font-weight:700;font-size:13px">'+v.country+(v.type?' — '+v.type:'')+'</div>'+
'<div style="font-size:10px;color:var(--txtL)">'+(whoLbl[v.who]||'')+(v.validTo?' · '+v.validTo+' tarihine kadar':'')+(v.schengen?' · Schengen':'')+'</div></div>'+
(dL!==null?'<div style="font-size:11px;font-weight:800;color:'+clr+'">'+(dL<0?'Süresi doldu':dL+' gün')+'</div>':'')+
'<button class="del" onclick="S.TAT.visas.splice('+i+',1);sv(\'TAT\');rn()">🗑️</button></div>';}).join('')+
'</div>')+
'</div></div>';}

function tatWishH(){
var list=S.TAT.wishlist||[];
return'<div>'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h2 style="margin:0;font-size:18px">⭐ Hayal Listesi</h2>'+
'<button class="ubtn" style="background:#1E86C8" onclick="tatMWish()">+ Ekle</button></div>'+
(list.length===0?
'<div class="cd" style="text-align:center;padding:40px"><div style="font-size:52px;margin-bottom:12px">⭐</div><div style="font-size:14px;font-weight:700;margin-bottom:6px">Hayaller buraya!</div><div style="font-size:12px;color:var(--txtL)">Gitmek istediğin yerleri ekle</div></div>':
'<div class="fc">'+list.map(function(w,i){
return'<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(135deg,rgba(30,134,200,.08),rgba(30,134,200,.02));border-radius:12px;border-left:3px solid #1E86C8">'+
'<span style="font-size:26px">'+(CFLG[w.place]||'🌍')+'</span>'+
'<div style="flex:1"><div style="font-weight:700;font-size:14px">'+w.place+'</div>'+
(w.notes?'<div style="font-size:11px;color:var(--txtL);margin-top:2px">'+w.notes+'</div>':'')+
'</div>'+
'<div style="display:flex;gap:6px">'+
'<button class="ubtn" style="background:#27AE60;font-size:10px;padding:5px 10px" onclick="tatWishToTrip('+i+')">✈️ Planla</button>'+
'<button class="del" onclick="S.TAT.wishlist.splice('+i+',1);sv(\'TAT\');rn()">🗑️</button></div></div>';}).join('')+
'</div>')+
'</div>';}

function tatDetay(id){
var trip=((S.TAT||{}).trips||[]).find(function(t){return t.id===id;});
if(!trip)return;
var dtab=(S.TAT.dtab&&S.TAT.dtab[id])||'genel';
var typeClr={yurtdisi:'#1E86C8',yurtici:'#27AE60',aile:'#8E44AD',is:'#5D6D7E'};
var typeLbl={yurtdisi:'✈️ Yurtdışı',yurtici:'🚗 Yurtiçi',aile:'👨‍👩‍👧 Aile',is:'💼 İş'};
var whoLbl={gorkem:'👨 Görkem',esra:'👩 Esra',ikisi:'👫 İkimiz'};
var clr=typeClr[trip.type]||'#1E86C8';
var flag=CFLG[trip.country]||CFLG[trip.city]||'🌍';
var tabs=[['genel','📋 Genel'],['ucus','✈️ Uçuş'],['otel','🏨 Otel'],['butce','💰 Bütçe'],['todo','📝 Yapılacak'],['diger','🛡️ Diğer']];
function tc(){
if(dtab==='genel'){
var dur=trip.startDate&&trip.endDate?Math.ceil((tatPd(trip.endDate)-tatPd(trip.startDate))/864e5)+1:null;
return'<div class="fi">'+
'<div class="cd" style="margin-bottom:10px"><div class="g2" style="gap:8px">'+
[['Ülke',trip.country||'—'],['Şehir',trip.city||'—'],['Gidiş',trip.startDate||'—'],['Dönüş',trip.endDate||'—'],['Süre',dur?dur+' gün':'—'],['Kişi',whoLbl[trip.who]||'—'],['Tip',typeLbl[trip.type]||'—'],['Schengen',trip.schengen?'✅ Evet':'❌ Hayır']].map(function(r){return'<div style="background:var(--bg);border-radius:10px;padding:8px 10px"><div class="fl">'+r[0]+'</div><div style="font-size:12px;font-weight:700">'+r[1]+'</div></div>';}).join('')+
'</div></div>'+
(trip.notes?'<div class="cd" style="margin-bottom:10px"><div class="fl">Notlar</div><div style="font-size:13px;line-height:1.6">'+trip.notes+'</div></div>':'')+
(trip.status==='planlandi'&&(trip.city||trip.country)?'<div class="cd" id="tat-weather"><div style="text-align:center;padding:14px;color:var(--txtL);font-size:12px">🌤️ Hava durumu yükleniyor...</div></div>':'')+
'</div>';}
if(dtab==='ucus'){
var fl=trip.flights||[];
return'<div class="fi"><div class="cd">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="margin:0">✈️ Uçuşlar</h3><button class="ubtn" style="background:'+clr+'" onclick="tatMFlight(\''+trip.id+'\')">+ Ekle</button></div>'+
(fl.length===0?'<div style="text-align:center;padding:20px;color:var(--txtL)">Henüz uçuş eklenmemiş</div>':
'<div class="fc">'+fl.map(function(f,i){
return'<div style="background:var(--bg);border-radius:10px;padding:12px">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'+
'<span style="font-weight:800;font-size:12px;color:'+clr+'">'+(f.dir==='gidis'?'🛫 Gidiş':'🛬 Dönüş')+'</span>'+
'<button class="del" onclick="tatDelFlight(\''+trip.id+'\','+i+')">🗑️</button></div>'+
'<div style="font-weight:800;font-size:20px;margin-bottom:2px">'+(f.time||'--:--')+'</div>'+
'<div style="font-size:12px;color:var(--txt);margin-bottom:2px">'+(f.date||'—')+'</div>'+
(f.from||f.to?'<div style="font-size:11px;color:var(--txtL)">'+(f.from||'')+(f.to?' → '+f.to:'')+'</div>':'')+
(f.no||f.terminal?'<div style="font-size:10px;color:var(--txtL);margin-top:4px">'+(f.no||'')+(f.terminal?' · Terminal: '+f.terminal:'')+'</div>':'')+
'</div>';}).join('')+'</div>')+
'</div></div>';}
if(dtab==='otel'){
var hs=trip.hotels||[];
return'<div class="fi"><div class="cd">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="margin:0">🏨 Konaklama</h3><button class="ubtn" style="background:'+clr+'" onclick="tatMHotel(\''+trip.id+'\')">+ Ekle</button></div>'+
(hs.length===0?'<div style="text-align:center;padding:20px;color:var(--txtL)">Henüz otel eklenmemiş</div>':
'<div class="fc">'+hs.map(function(h,i){
return'<div style="background:var(--bg);border-radius:10px;padding:12px">'+
'<div style="display:flex;justify-content:space-between;align-items:flex-start">'+
'<div style="flex:1"><div style="font-weight:800;font-size:14px;margin-bottom:4px">🏨 '+h.name+'</div>'+
(h.address?'<div style="font-size:11px;color:var(--txtL)">📍 '+h.address+'</div>':'')+
'</div><div style="display:flex;gap:6px">'+
(h.address?'<button class="ubtn" style="background:#27AE60;font-size:10px;padding:4px 8px" onclick="window.open(\'https://maps.google.com?q=\'+encodeURIComponent(\''+h.name+' '+h.address+'\'))">🗺️</button>':'')+
'<button class="del" onclick="tatDelHotel(\''+trip.id+'\','+i+')">🗑️</button></div></div></div>';}).join('')+'</div>')+
'</div></div>';}
if(dtab==='butce'){
var bud=trip.budget||{estimated:0};
var exps=trip.expenses||[];
var total=exps.reduce(function(s,e){return s+Number(e.amount||0);},0);
var cats={ucak:'✈️ Uçak',otel:'🏨 Otel',yemek:'🍽️ Yemek',aktivite:'🎭 Aktivite',alisveris:'🛍️ Alışveriş'};
var overBudget=bud.estimated>0&&total>bud.estimated;
return'<div class="fi"><div class="cd">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="margin:0">💰 Bütçe</h3>'+
'<button class="ubtn" style="background:'+clr+'" onclick="tatMExpense(\''+trip.id+'\')">+ Harcama</button></div>'+
'<div class="g2" style="margin-bottom:12px">'+
'<div class="cd" style="text-align:center;padding:10px"><div style="font-size:10px;color:var(--txtL)">Tahmini Bütçe</div><div style="font-family:\'Fraunces\',serif;font-size:18px;font-weight:800;color:#1E86C8">'+(bud.estimated||0).toLocaleString('tr-TR')+' ₺</div></div>'+
'<div class="cd" style="text-align:center;padding:10px"><div style="font-size:10px;color:var(--txtL)">Harcanan</div><div style="font-family:\'Fraunces\',serif;font-size:18px;font-weight:800;color:'+(overBudget?'#E74C3C':'#27AE60')+'">'+total.toLocaleString('tr-TR')+' ₺</div></div>'+
'</div>'+
(exps.length>0?'<div class="fc" style="margin-bottom:10px">'+Object.keys(cats).map(function(cat){var amt=exps.filter(function(e){return e.cat===cat;}).reduce(function(s,e){return s+Number(e.amount||0);},0);if(!amt)return'';return'<div style="display:flex;justify-content:space-between;padding:8px 10px;background:var(--bg);border-radius:8px"><span style="font-size:13px">'+cats[cat]+'</span><span style="font-weight:700;font-size:13px">'+amt.toLocaleString('tr-TR')+' ₺</span></div>';}).filter(Boolean).join('')+'</div>':'')+
(exps.length>0?'<div><div class="fl" style="margin-bottom:6px">Harcama Detayı</div>'+exps.map(function(e,i){return'<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--brd);font-size:12px"><span>'+cats[e.cat]+' '+(e.desc||'')+(e.date?' · '+e.date.slice(0,5):'')+'</span><div style="display:flex;gap:8px;align-items:center"><span style="font-weight:700">'+Number(e.amount).toLocaleString('tr-TR')+' ₺</span><button class="del" onclick="tatDelExp(\''+trip.id+'\','+i+')">🗑️</button></div></div>';}).join('')+'</div>':'')+
'</div></div>';}
if(dtab==='todo'){
var todos=trip.todos||[];
var done=todos.filter(function(t){return t.done;}).length;
return'<div class="fi"><div class="cd">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<h3 style="margin:0">📝 Yapılacaklar '+(todos.length?'('+done+'/'+todos.length+')':'')+'</h3>'+
'<button class="ubtn" style="background:'+clr+'" onclick="tatMTodo(\''+trip.id+'\')">+ Ekle</button></div>'+
(todos.length===0?'<div style="text-align:center;padding:20px;color:var(--txtL)">Yapılacak henüz eklenmemiş</div>':
'<div class="fc">'+todos.map(function(td,i){
return'<div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg);border-radius:10px;'+(td.done?'opacity:.6':'')+'" >'+
'<div onclick="tatToggleTodo(\''+trip.id+'\','+i+')" style="width:24px;height:24px;border-radius:50%;border:2px solid '+(td.done?'#27AE60':clr)+';background:'+(td.done?'#27AE60':'transparent')+';cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+(td.done?'<span style="color:#fff;font-size:13px;font-weight:700">✓</span>':'')+'</div>'+
'<span style="flex:1;font-size:13px;'+(td.done?'text-decoration:line-through;color:var(--txtL)':'')+'">'+td.text+'</span>'+
'<button class="del" onclick="tatDelTodo(\''+trip.id+'\','+i+')">🗑️</button></div>';}).join('')+'</div>')+
'</div></div>';}
if(dtab==='diger'){
var ins=trip.insurance||{},car=trip.car||{},cur=trip.currency||{};
return'<div class="fi">'+
'<div class="cd" style="margin-bottom:10px">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h3 style="margin:0">🛡️ Sigorta & 🚗 Araç</h3>'+
'<button class="ubtn" style="background:'+clr+';font-size:11px" onclick="tatMInscar(\''+trip.id+'\')">✏️ Düzenle</button></div>'+
'<div class="g2" style="gap:8px">'+
'<div style="background:var(--bg);border-radius:10px;padding:10px"><div class="fl">Sigorta</div><div style="font-size:13px;font-weight:700">'+(ins.company||'Yaptırılmadı')+'</div>'+(ins.notes?'<div style="font-size:10px;color:var(--txtL);margin-top:2px">'+ins.notes+'</div>':'')+'</div>'+
'<div style="background:var(--bg);border-radius:10px;padding:10px"><div class="fl">Araç Kiralama</div><div style="font-size:13px;font-weight:700">'+(car.company||'Kiralanmadı')+'</div>'+(car.notes?'<div style="font-size:10px;color:var(--txtL);margin-top:2px">'+car.notes+'</div>':'')+'</div>'+
'</div></div>'+
'<div class="cd">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h3 style="margin:0">💱 Döviz</h3>'+
'<button class="ubtn" style="background:'+clr+';font-size:11px" onclick="tatMCur(\''+trip.id+'\')">✏️ Düzenle</button></div>'+
(cur.code?'<div class="g2" style="gap:8px">'+
[['Para Birimi',cur.code],['Götürülen',cur.amount?(cur.amount.toLocaleString('tr-TR')+' '+cur.code):'—']].map(function(r){return'<div style="background:var(--bg);border-radius:10px;padding:10px"><div class="fl">'+r[0]+'</div><div style="font-size:13px;font-weight:700">'+r[1]+'</div></div>';}).join('')+'</div>':
'<div style="text-align:center;padding:10px;color:var(--txtL);font-size:12px">Döviz bilgisi girilmemiş</div>')+
'</div></div>';}
return'';}
var el=document.createElement('div');el.className='mf';el.id='tat-detay';
el.innerHTML='<div style="display:flex;flex-direction:column;height:100dvh">'+
'<div style="background:'+clr+';padding:calc(12px + env(safe-area-inset-top,0px)) 16px 0;flex-shrink:0">'+
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
'<div style="display:flex;align-items:center;gap:8px">'+
'<div onclick="document.getElementById(\'tat-detay\').remove()" style="cursor:pointer;color:#fff;font-size:20px;min-width:44px;min-height:44px;display:flex;align-items:center">◀</div>'+
'<div><div style="font-family:\'Fraunces\',serif;font-size:17px;font-weight:800;color:#fff">'+(trip.title||(trip.city&&trip.country?trip.city+', '+trip.country:trip.city||trip.country||'Tatil'))+'</div>'+
'<div style="font-size:10px;color:rgba(255,255,255,.7)">'+flag+' '+(trip.country||'')+(trip.city&&trip.country?' · '+trip.city:'')+'</div></div></div>'+
'<div style="display:flex;gap:6px">'+
(trip.status==='planlandi'?'<button class="ubtn" style="background:rgba(255,255,255,.2);font-size:10px;padding:5px 10px" onclick="tatComplete(\''+trip.id+'\')">✅ Tamamlandı</button>':'')+
'<button class="ubtn" style="background:rgba(255,255,255,.15);font-size:10px;padding:5px 10px" onclick="tatEditTrip(\''+trip.id+'\')">✏️</button>'+
'</div></div>'+
'<div style="display:flex;overflow-x:auto;gap:1px;scrollbar-width:none">'+
tabs.map(function(t){var act=dtab===t[0];return'<button onclick="if(!S.TAT.dtab)S.TAT.dtab={};S.TAT.dtab[\''+trip.id+'\']=\''+t[0]+'\';document.getElementById(\'tat-detay\').remove();tatDetay(\''+trip.id+'\')" style="flex-shrink:0;border:none;padding:8px 10px;font-size:10px;font-weight:800;font-family:\'Nunito\';background:'+(act?'#fff':'transparent')+';color:'+(act?clr:'rgba(255,255,255,.88)')+';border-radius:'+(act?'9px 9px 0 0':'0')+';cursor:pointer;white-space:nowrap">'+t[1]+'</button>';}).join('')+
'</div></div>'+
'<div style="flex:1;overflow-y:auto;padding:14px;-webkit-overflow-scrolling:touch;padding-bottom:calc(20px + env(safe-area-inset-bottom,0px))">'+tc()+'</div></div>';
document.body.appendChild(el);
if(dtab==='genel'&&trip.status==='planlandi'&&(trip.city||trip.country)){setTimeout(function(){tatLoadWeather(trip.city||'',trip.country||'');},400);}}

function tatLoadWeather(city,country){
var el=document.getElementById('tat-weather');if(!el)return;
var q=encodeURIComponent((city+' '+country).trim());
fetch('https://nominatim.openstreetmap.org/search?q='+q+'&format=json&limit=1&accept-language=tr')
.then(function(r){return r.json();}).then(function(data){if(!data||!data[0])throw new Error('');
var lat=data[0].lat,lon=data[0].lon;
return fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=5');
}).then(function(r){return r.json();}).then(function(w){
if(!w||!w.daily)throw new Error('');
var ico=function(c){if(c<=1)return'☀️';if(c<=3)return'⛅';if(c<=48)return'🌫️';if(c<=67)return'🌧️';if(c<=77)return'❄️';return'⛈️';};
el.innerHTML='<div><div class="fl" style="margin-bottom:8px">🌤️ '+(city||country)+' Hava Durumu (5 Gün)</div>'+
'<div style="display:flex;gap:6px;overflow-x:auto">'+w.daily.time.slice(0,5).map(function(d,i){
return'<div style="flex-shrink:0;background:var(--bg);border-radius:10px;padding:10px;text-align:center;min-width:56px">'+
'<div style="font-size:18px;margin-bottom:3px">'+ico(w.daily.weathercode[i])+'</div>'+
'<div style="font-size:10px;font-weight:700">'+d.slice(5).replace('-','.')+'</div>'+
'<div style="font-size:12px;color:var(--mutfak);font-weight:700">'+Math.round(w.daily.temperature_2m_max[i])+'°</div>'+
'<div style="font-size:10px;color:var(--txtL)">'+Math.round(w.daily.temperature_2m_min[i])+'°</div></div>';}).join('')+'</div></div>';
}).catch(function(){el.innerHTML='<div style="font-size:11px;color:var(--txtL);padding:6px;text-align:center">🌤️ Hava durumu yüklenemedi</div>';});}

function tatMTrip(id){
var trip=id?(((S.TAT||{}).trips||[]).find(function(t){return t.id===id;})||null):null;
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
var selStyle='width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg);color:var(--txt)';
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>'+(trip?'✏️ Tatil Düzenle':'✈️ Yeni Tatil Ekle')+'</h3><div class="fc">'+
'<div><div class="fl">Başlık</div><input id="tt-tit" value="'+(trip&&trip.title||'')+'" placeholder="Paris Tatili, Roma Gezisi..."></div>'+
'<div class="g2" style="gap:8px"><div><div class="fl">Ülke / Bölge *</div><input id="tt-cou" value="'+(trip&&trip.country||'')+'" placeholder="Fransa, İstanbul..."></div>'+
'<div><div class="fl">Şehir</div><input id="tt-cit" value="'+(trip&&trip.city||'')+'" placeholder="Paris..."></div></div>'+
'<div class="g2" style="gap:8px"><div><div class="fl">Gidiş</div><input id="tt-sd" value="'+(trip&&trip.startDate||'')+'" placeholder="GG.AA.YYYY"></div>'+
'<div><div class="fl">Dönüş</div><input id="tt-ed" value="'+(trip&&trip.endDate||'')+'" placeholder="GG.AA.YYYY"></div></div>'+
'<div class="g2" style="gap:8px"><div><div class="fl">Tip</div><select id="tt-typ" style="'+selStyle+'">'+
[['yurtdisi','✈️ Yurtdışı'],['yurtici','🚗 Yurtiçi'],['aile','👨‍👩‍👧 Aile'],['is','💼 İş']].map(function(o){return'<option value="'+o[0]+'"'+(trip&&trip.type===o[0]?' selected':(!trip&&o[0]==='yurtdisi'?' selected':''))+'>'+o[1]+'</option>';}).join('')+
'</select></div><div><div class="fl">Kişi</div><select id="tt-who" style="'+selStyle+'">'+
[['ikisi','👫 İkimiz'],['gorkem','👨 Görkem'],['esra','👩 Esra']].map(function(o){return'<option value="'+o[0]+'"'+(trip&&trip.who===o[0]?' selected':(!trip&&o[0]==='ikisi'?' selected':''))+'>'+o[1]+'</option>';}).join('')+
'</select></div></div>'+
'<div class="g2" style="gap:8px"><div><div class="fl">Tahmini Bütçe (₺)</div><input id="tt-bud" type="number" min="0" value="'+(trip&&trip.budget&&trip.budget.estimated||'')+'"></div>'+
'<div><div class="fl">Durum</div><select id="tt-sta" style="'+selStyle+'">'+
'<option value="planlandi"'+((!trip||trip.status==='planlandi')?' selected':'')+'>📅 Planlandı</option>'+
'<option value="tamamlandi"'+(trip&&trip.status==='tamamlandi'?' selected':'')+'>✅ Tamamlandı</option>'+
'</select></div></div>'+
'<div style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="tt-sch" style="width:20px;height:20px"'+(trip&&trip.schengen?' checked':'')+'>'+
'<label for="tt-sch" style="font-size:13px;cursor:pointer">Schengen Bölgesi</label></div>'+
'<div><div class="fl">Notlar</div><textarea id="tt-not" placeholder="Serbest notlar...">'+(trip&&trip.notes||'')+'</textarea></div>'+
'<button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoTrip(\''+(id||'')+'\')">💾 Kaydet</button>'+
(trip?'<button class="btn bd" onclick="tatDelTrip(\''+id+'\')">🗑️ Tatili Sil</button>':'')+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div></div>';
document.body.appendChild(e);}

function tatDoTrip(id){
var cou=document.getElementById('tt-cou').value;var cit=document.getElementById('tt-cit').value;
if(!cou&&!cit){alert('En az ülke/bölge gir');return;}
var data={title:document.getElementById('tt-tit').value,country:cou,city:cit,startDate:document.getElementById('tt-sd').value,endDate:document.getElementById('tt-ed').value,type:document.getElementById('tt-typ').value,who:document.getElementById('tt-who').value,schengen:document.getElementById('tt-sch').checked,status:document.getElementById('tt-sta').value,notes:document.getElementById('tt-not').value};
var bud=parseFloat(document.getElementById('tt-bud').value)||0;
if(!S.TAT.trips)S.TAT.trips=[];
if(id){var t=S.TAT.trips.find(function(x){return x.id===id;});if(t){Object.assign(t,data);if(!t.budget)t.budget={};t.budget.estimated=bud;}}
else{S.TAT.trips.push(Object.assign({id:Date.now().toString(),budget:{estimated:bud},expenses:[],flights:[],hotels:[],todos:[],insurance:{},car:{},currency:{}},data));}
sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();rn();}

function tatDelTrip(id){if(!confirm('Bu tatili silmek istediğinden emin misin?'))return;S.TAT.trips=(S.TAT.trips||[]).filter(function(t){return t.id!==id;});sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();var mf=document.getElementById('tat-detay');if(mf)mf.remove();rn();}
function tatComplete(id){var t=(S.TAT.trips||[]).find(function(x){return x.id===id;});if(!t)return;t.status='tamamlandi';sv('TAT');var mf=document.getElementById('tat-detay');if(mf)mf.remove();tatDetay(id);}
function tatEditTrip(id){var mf=document.getElementById('tat-detay');if(mf)mf.remove();tatMTrip(id);}

function tatMFlight(tid){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
var ss='width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg);color:var(--txt)';
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>✈️ Uçuş Ekle</h3><div class="fc">'+
'<div><div class="fl">Yön</div><select id="tf-dir" style="'+ss+'"><option value="gidis">🛫 Gidiş</option><option value="donus">🛬 Dönüş</option></select></div>'+
'<div class="g2" style="gap:8px"><div><div class="fl">Tarih</div><input id="tf-dat" placeholder="GG.AA.YYYY"></div>'+
'<div><div class="fl">Saat</div><input id="tf-tim" placeholder="HH:MM"></div></div>'+
'<div class="g2" style="gap:8px"><div><div class="fl">Nereden</div><input id="tf-frm" placeholder="IST, SAW..."></div>'+
'<div><div class="fl">Nereye</div><input id="tf-to" placeholder="CDG, FCO..."></div></div>'+
'<div class="g2" style="gap:8px"><div><div class="fl">Uçuş No</div><input id="tf-no" placeholder="TK 1234"></div>'+
'<div><div class="fl">Terminal</div><input id="tf-ter" placeholder="T1, T2..."></div></div>'+
'<button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoFlight(\''+tid+'\')">💾 Kaydet</button>'+
'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';
document.body.appendChild(e);}
function tatDoFlight(tid){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;if(!t.flights)t.flights=[];t.flights.push({dir:document.getElementById('tf-dir').value,date:document.getElementById('tf-dat').value,time:document.getElementById('tf-tim').value,from:document.getElementById('tf-frm').value,to:document.getElementById('tf-to').value,no:document.getElementById('tf-no').value,terminal:document.getElementById('tf-ter').value});sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();var mf=document.getElementById('tat-detay');if(mf)mf.remove();if(!S.TAT.dtab)S.TAT.dtab={};S.TAT.dtab[tid]='ucus';tatDetay(tid);}
function tatDelFlight(tid,i){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;t.flights.splice(i,1);sv('TAT');var mf=document.getElementById('tat-detay');if(mf)mf.remove();tatDetay(tid);}

function tatMHotel(tid){var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🏨 Otel Ekle</h3><div class="fc"><div><div class="fl">Otel Adı *</div><input id="th-nam" placeholder="Hotel adı"></div><div><div class="fl">Adres</div><input id="th-adr" placeholder="Otel adresi..."></div><button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoHotel(\''+tid+'\')">💾 Kaydet</button><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';document.body.appendChild(e);}
function tatDoHotel(tid){var nam=document.getElementById('th-nam').value;if(!nam){alert('Otel adı gerekli');return;}var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;if(!t.hotels)t.hotels=[];t.hotels.push({name:nam,address:document.getElementById('th-adr').value});sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();var mf=document.getElementById('tat-detay');if(mf)mf.remove();if(!S.TAT.dtab)S.TAT.dtab={};S.TAT.dtab[tid]='otel';tatDetay(tid);}
function tatDelHotel(tid,i){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;t.hotels.splice(i,1);sv('TAT');var mf=document.getElementById('tat-detay');if(mf)mf.remove();tatDetay(tid);}

function tatMExpense(tid){var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};var ss='width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg);color:var(--txt)';e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>💰 Harcama Ekle</h3><div class="fc"><div><div class="fl">Kategori</div><select id="te-cat" style="'+ss+'"><option value="ucak">✈️ Uçak</option><option value="otel">🏨 Otel</option><option value="yemek">🍽️ Yemek</option><option value="aktivite">🎭 Aktivite</option><option value="alisveris">🛍️ Alışveriş</option></select></div><div><div class="fl">Açıklama</div><input id="te-dsc" placeholder="Ne için?"></div><div class="g2" style="gap:8px"><div><div class="fl">Tutar (₺) *</div><input id="te-amt" type="number" min="0"></div><div><div class="fl">Tarih</div><input id="te-dat" value="'+tatTd()+'"></div></div><button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoExp(\''+tid+'\')">💾 Kaydet</button><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';document.body.appendChild(e);}
function tatDoExp(tid){var amt=document.getElementById('te-amt').value;if(!amt){alert('Tutar gir');return;}var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;if(!t.expenses)t.expenses=[];t.expenses.push({cat:document.getElementById('te-cat').value,desc:document.getElementById('te-dsc').value,amount:parseFloat(amt),date:document.getElementById('te-dat').value});sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();var mf=document.getElementById('tat-detay');if(mf)mf.remove();if(!S.TAT.dtab)S.TAT.dtab={};S.TAT.dtab[tid]='butce';tatDetay(tid);}
function tatDelExp(tid,i){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;t.expenses.splice(i,1);sv('TAT');var mf=document.getElementById('tat-detay');if(mf)mf.remove();tatDetay(tid);}

function tatMTodo(tid){var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>📝 Yapılacak Ekle</h3><div class="fc"><div><div class="fl">Yapılacak *</div><input id="td-txt" placeholder="Vize al, bilet al, sigorta yaptır..."></div><button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoTodo(\''+tid+'\')">+ Ekle</button><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';document.body.appendChild(e);setTimeout(function(){var i=document.getElementById('td-txt');if(i)i.focus();},200);}
function tatDoTodo(tid){var txt=document.getElementById('td-txt').value.trim();if(!txt)return;var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;if(!t.todos)t.todos=[];t.todos.push({text:txt,done:false});sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();var mf=document.getElementById('tat-detay');if(mf)mf.remove();if(!S.TAT.dtab)S.TAT.dtab={};S.TAT.dtab[tid]='todo';tatDetay(tid);}
function tatToggleTodo(tid,i){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t||!t.todos[i])return;t.todos[i].done=!t.todos[i].done;sv('TAT');var mf=document.getElementById('tat-detay');if(mf)mf.remove();tatDetay(tid);}
function tatDelTodo(tid,i){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;t.todos.splice(i,1);sv('TAT');var mf=document.getElementById('tat-detay');if(mf)mf.remove();tatDetay(tid);}

function tatMInscar(tid){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});var ins=(t&&t.insurance)||{},car=(t&&t.car)||{};var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🛡️ Sigorta & 🚗 Araç</h3><div class="fc"><div><div class="fl">Sigorta Şirketi</div><input id="ti-ins" value="'+(ins.company||'')+'" placeholder="Sigorta şirketi"></div><div><div class="fl">Sigorta Notu</div><input id="ti-inn" value="'+(ins.notes||'')+'" placeholder="Poliçe no, notlar..."></div><div><div class="fl">Araç Kiralama Şirketi</div><input id="ti-car" value="'+(car.company||'')+'" placeholder="Hertz, Avis..."></div><div><div class="fl">Araç Notu</div><input id="ti-can" value="'+(car.notes||'')+'" placeholder="Rezervasyon no, notlar..."></div><button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoInscar(\''+tid+'\')">💾 Kaydet</button><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';document.body.appendChild(e);}
function tatDoInscar(tid){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;t.insurance={company:document.getElementById('ti-ins').value,notes:document.getElementById('ti-inn').value};t.car={company:document.getElementById('ti-car').value,notes:document.getElementById('ti-can').value};sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();var mf=document.getElementById('tat-detay');if(mf)mf.remove();if(!S.TAT.dtab)S.TAT.dtab={};S.TAT.dtab[tid]='diger';tatDetay(tid);}

function tatMCur(tid){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});var cur=(t&&t.currency)||{};var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};var ss='width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg);color:var(--txt)';e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>💱 Döviz</h3><div class="fc"><div><div class="fl">Para Birimi</div><select id="tc-cod" style="'+ss+'">'+[['EUR','€ Euro'],['USD','$ Dolar'],['GBP','£ Sterlin'],['JPY','¥ Japon Yeni'],['AED','د.إ Dirhem'],['CHF','₣ İsviçre Frangı'],['SEK','kr İsveç Kronu'],['PLN','zł Polonya Zlotı'],['CZK','Kč Çek Korunası'],['HUF','Ft Macar Forinti'],['DKK','kr Danimarka Kronu'],['NOK','kr Norveç Kronu'],['THB','฿ Baht'],['IDR','Rp Rupisi'],['SGD','S$ Singapur'],['MYR','RM Rınggit']].map(function(o){return'<option value="'+o[0]+'"'+(cur.code===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></div><div><div class="fl">Götürülen Miktar</div><input id="tc-amt" type="number" min="0" value="'+(cur.amount||'')+'"></div><button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoCur(\''+tid+'\')">💾 Kaydet</button><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';document.body.appendChild(e);}
function tatDoCur(tid){var t=(S.TAT.trips||[]).find(function(x){return x.id===tid;});if(!t)return;t.currency={code:document.getElementById('tc-cod').value,amount:parseFloat(document.getElementById('tc-amt').value)||0};sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();var mf=document.getElementById('tat-detay');if(mf)mf.remove();if(!S.TAT.dtab)S.TAT.dtab={};S.TAT.dtab[tid]='diger';tatDetay(tid);}

function tatMPass(pid){var p=(S.TAT.passport&&S.TAT.passport[pid])||{};var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🛂 Pasaport Bilgisi</h3><div class="fc"><div><div class="fl">Ad Soyad</div><input id="tp-nam" value="'+(p.name||'')+'"></div><div><div class="fl">Pasaport No</div><input id="tp-no" value="'+(p.no||'')+'" placeholder="U12345678"></div><div><div class="fl">Son Kullanma Tarihi</div><input id="tp-exp" value="'+(p.exp||'')+'" placeholder="GG.AA.YYYY"></div><button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoPass(\''+pid+'\')">💾 Kaydet</button><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';document.body.appendChild(e);}
function tatDoPass(pid){if(!S.TAT.passport)S.TAT.passport={gorkem:{},esra:{}};if(!S.TAT.passport[pid])S.TAT.passport[pid]={};S.TAT.passport[pid].name=document.getElementById('tp-nam').value;S.TAT.passport[pid].no=document.getElementById('tp-no').value;S.TAT.passport[pid].exp=document.getElementById('tp-exp').value;sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();rn();}

function tatMVisa(){var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};var ss='width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg);color:var(--txt)';e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🔖 Vize Ekle</h3><div class="fc"><div><div class="fl">Ülke / Vize Tipi *</div><input id="tv-cou" placeholder="Schengen, ABD ESTA..."></div><div><div class="fl">Kişi</div><select id="tv-who" style="'+ss+'"><option value="gorkem">👨 Görkem</option><option value="esra">👩 Esra</option><option value="ikisi">👫 İkimiz</option></select></div><div class="g2" style="gap:8px"><div><div class="fl">Geçerlilik Başlangıcı</div><input id="tv-vf" placeholder="GG.AA.YYYY"></div><div><div class="fl">Geçerlilik Sonu</div><input id="tv-vt" placeholder="GG.AA.YYYY"></div></div><div style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="tv-sch" style="width:20px;height:20px"><label for="tv-sch" style="font-size:13px;cursor:pointer">Schengen Vizesi</label></div><div><div class="fl">Not</div><input id="tv-not" placeholder="Notlar..."></div><button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoVisa()">💾 Kaydet</button><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';document.body.appendChild(e);}
function tatDoVisa(){var cou=document.getElementById('tv-cou').value;if(!cou){alert('Ülke/vize tipi gir');return;}if(!S.TAT.visas)S.TAT.visas=[];S.TAT.visas.push({id:Date.now().toString(),country:cou,who:document.getElementById('tv-who').value,validFrom:document.getElementById('tv-vf').value,validTo:document.getElementById('tv-vt').value,schengen:document.getElementById('tv-sch').checked,notes:document.getElementById('tv-not').value});sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();rn();}

function tatMWish(){var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>⭐ Hayal Listesine Ekle</h3><div class="fc"><div><div class="fl">Yer / Ülke *</div><input id="tw-plc" placeholder="Japonya, Maldivler, Kyoto..."></div><div><div class="fl">Not / Neden?</div><textarea id="tw-not" placeholder="Gitmek isteme sebebin..."></textarea></div><button class="btn" style="background:#1E86C8;color:#fff" onclick="tatDoWish()">⭐ Ekle</button><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button></div></div>';document.body.appendChild(e);}
function tatDoWish(){var plc=document.getElementById('tw-plc').value.trim();if(!plc)return;if(!S.TAT.wishlist)S.TAT.wishlist=[];S.TAT.wishlist.push({place:plc,notes:document.getElementById('tw-not').value});sv('TAT');var m=document.querySelector('.mo');if(m)m.remove();rn();}
function tatWishToTrip(i){var w=S.TAT.wishlist&&S.TAT.wishlist[i];if(!w)return;S.TAT.wishlist.splice(i,1);sv('TAT');rn();setTimeout(function(){tatMTrip();setTimeout(function(){var c=document.getElementById('tt-cou');if(c)c.value=w.place;},100);},200);}
// ─── TATIL MODÜLÜ SONU ────────────────────────────────────────────────────────
