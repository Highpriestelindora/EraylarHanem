// ═══ ARACIM ═══
// ARACIM
function aracEvSt(ev){if(ev.tp==='km'){const l=ev.kmL||0;if(l<=0)return{bg:'var(--dangerL)',bl:'var(--danger)',tc:'#791F1F',badge:'GECİKMİŞ',txt:Math.abs(l)+' km geçti!'};if(l<1000)return{bg:'var(--warnL)',bl:'var(--warn)',tc:'#7D6608',badge:'YAKINDA',txt:l+' km kaldı'};return{bg:'var(--sL)',bl:'var(--sec)',tc:'#085041',badge:'İYİ',txt:l+' km kaldı'}}else{const diff=Math.round((new Date(ev.dt)-new Date())/864e5);if(diff<0)return{bg:'var(--dangerL)',bl:'var(--danger)',tc:'#791F1F',badge:'GECİKMİŞ',txt:Math.abs(diff)+' gün geçti!'};if(diff<30)return{bg:'var(--warnL)',bl:'var(--warn)',tc:'#7D6608',badge:'YAKINDA',txt:diff+' gün kaldı'};return{bg:'var(--sL)',bl:'var(--sec)',tc:'#085041',badge:'İYİ',txt:diff+' gün kaldı'}}}
function aracAnaH(){const c=S.C;const evSorted=(c.ev||[]).map(ev=>({...ev,...{st:aracEvSt(ev)}})).sort((a,b)=>a.st.badge==='GECİKMİŞ'?-1:b.st.badge==='GECİKMİŞ'?1:a.st.badge==='YAKINDA'?-1:b.st.badge==='YAKINDA'?1:0);
return'<div class="cc" style="background:linear-gradient(135deg,#34495E,#5D6D7E)"><div style="font-size:9px;opacity:.5;text-transform:uppercase;letter-spacing:1px">TOYOTA HYBRID</div><div style="font-size:20px;font-weight:800;font-family:Fraunces,serif;margin:2px 0">'+esc(c.md||'C-HR Hybrid')+'</div><div style="font-size:11px;opacity:.65;margin-bottom:12px">'+c.yr+' · '+esc(c.cl||'Beyaz')+'</div><div style="display:flex;gap:20px"><div><div style="font-size:8px;opacity:.5;text-transform:uppercase">Plaka</div><div style="font-size:14px;font-weight:800;letter-spacing:1.5px">'+esc(c.pl||'34 GNK 437')+'</div></div><div><div style="font-size:8px;opacity:.5;text-transform:uppercase">Güncel KM</div><div style="font-size:14px;font-weight:800">'+(c.km||0).toLocaleString('tr-TR')+'</div></div><div><div style="font-size:8px;opacity:.5;text-transform:uppercase">Yıl</div><div style="font-size:14px;font-weight:800">'+c.yr+'</div></div></div></div>'+
'<div class="g2" style="margin-bottom:12px"><button class="btn ba" onclick="let k=prompt(\'Güncel km?\',S.C.km);if(k&&!isNaN(k)){const newKm=Number(k);const diff=newKm-(S.C.km||0);S.C.km=newKm;(S.C.ev||[]).forEach(ev=>{if(ev.tp===\'km\'&&ev.kmL!=null)ev.kmL=Math.max(0,ev.kmL-diff)});sv(\'C\');toast(\'KM güncellendi!\',\'succ\');rn()}">🔢 KM Güncelle</button><button class="btn bg" onclick="oAracEkle()">+ Bakım Ekle</button></div>'+
'<div class="cd"><h3>📋 Yaklaşan İşlemler</h3>'+evSorted.map(ev=>'<div style="padding:10px;background:'+ev.st.bg+';border-left:3px solid '+ev.st.bl+';border-radius:8px;margin-bottom:8px"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:12px;font-weight:700;color:'+ev.st.tc+'">'+ev.ic+' '+esc(ev.nm)+'</div><div style="font-size:10px;color:'+ev.st.tc+';opacity:.8">'+esc(ev.st.txt)+'</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><span style="background:'+ev.st.bl+';color:#fff;font-size:8px;padding:3px 8px;border-radius:8px;font-weight:700">'+ev.st.badge+'</span><span style="font-size:8px;cursor:pointer;color:'+ev.st.tc+';opacity:.6" onclick="if(confirm(\'Bu işlemi tamamlandı olarak işaretle?\')){}">Düzenle›</span></div></div></div>').join('')+'</div>'+
'<div class="cd" style="margin-top:2px"><h3>🔧 Hızlı Not Ekle</h3><div style="display:flex;gap:6px"><input id="arcnot" placeholder="Bakım notu veya hatırlatma..." style="flex:1;font-size:12px"><button class="btn ba" style="width:auto;padding:8px 12px;font-size:11px" onclick="const v=$(\'arcnot\').value;if(v){if(!S.C.hs)S.C.hs=[];S.C.hs.unshift({id:Date.now(),dt:tISO(),km:S.C.km,tp:\'Not\',ds:v,co:0});sv(\'C\');$(\'arcnot\').value=\'\';toast(\'Not eklendi!\',\'succ\');rn()}">Ekle</button></div></div>'}
function aracHistH(){const hs=(S.C.hs||[]).slice().sort((a,b)=>new Date(b.dt)-new Date(a.dt));const total=hs.reduce((a,h)=>a+(h.co||0),0);
return'<div class="cd" style="margin-bottom:10px;text-align:center;padding:14px"><div style="display:flex;justify-content:space-around"><div><div style="font-size:20px;font-weight:800;color:var(--arac)">'+hs.length+'</div><div style="font-size:9px;color:var(--txtL)">işlem</div></div><div><div style="font-size:16px;font-weight:800;color:var(--arac)">'+fmt(total)+'</div><div style="font-size:9px;color:var(--txtL)">toplam maliyet</div></div></div></div>'+
(hs.length===0?'<div class="cd" style="text-align:center;padding:20px;color:var(--txtL)">Henüz bakım kaydı yok</div>':hs.map((h,i)=>'<div class="cd" style="padding:12px;margin-bottom:8px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="flex:1"><div style="font-size:12px;font-weight:700">'+esc(h.tp)+'</div><div style="font-size:10px;color:var(--txtL);margin-top:2px">'+esc(h.ds)+'</div><div style="font-size:9px;color:var(--txtL);margin-top:4px">📅 '+esc(h.dt)+' · 🔢 '+(h.km||0).toLocaleString('tr-TR')+' km</div></div><div style="text-align:right;flex-shrink:0"><div style="font-size:13px;font-weight:800;color:var(--arac)">'+(h.co>0?fmt(h.co):'-')+'</div><button class="del" style="display:block;margin-top:4px" onclick="if(confirm(\'Kaydı sil?\')){}">✕</button></div></div></div>').join(''))+
'<button class="btn ba" style="margin-top:4px" onclick="oAracEkle()">+ Yeni Bakım Kaydı</button>'}
function aracAyarH(){const c=S.C;
const aracAchs=ACHS.filter(a=>['km_guncelle','bakim_eklendi'].includes(a.id));
return'<div class="cd"><h3>🏅 Araç Rozetleri</h3><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px">'+(aracAchs.map(a=>{const earned=(S.ACH||[]).includes(a.id);return'<div style="padding:8px 12px;border-radius:10px;background:'+(earned?'var(--sL)':'var(--bg)')+';border:1px solid '+(earned?'var(--sec)':'var(--brd)')+';text-align:center;opacity:'+(earned?1:0.45)+'"><div style="font-size:20px">'+a.ic+'</div><div style="font-size:9px;font-weight:700;color:'+(earned?'var(--sec)':'var(--txtL)')+'">'+a.n+'</div></div>'})).join('')+'</div></div>'+
'<div class="cd fc"><h3>🚗 Araç Bilgileri</h3><div><div class="fl">ARAÇ MODELİ</div><input id="cmod" value="'+esc(c.md||'Toyota C-HR Hybrid')+'"></div><div class="g2"><div><div class="fl">YIL</div><input id="cyr" type="number" value="'+(c.yr||2021)+'" style=""></div><div><div class="fl">RENK</div><input id="ccl" value="'+esc(c.cl||'Beyaz')+'"></div></div><div><div class="fl">PLAKA</div><input id="cpl" value="'+esc(c.pl||'34 GNK 437')+'"></div><div><div class="fl">GÜNCEL KM</div><input id="ckm" type="number" value="'+(c.km||0)+'"></div><button class="btn ba" onclick="const _oldKm=S.C.km||0;S.C.md=$(\'cmod\').value;S.C.yr=Number($(\'cyr\').value);S.C.cl=$(\'ccl\').value;S.C.pl=$(\'cpl\').value;S.C.km=Number($(\'ckm\').value);const _diff=S.C.km-_oldKm;if(_diff!==0)(S.C.ev||[]).forEach(ev=>{if(ev.tp===\'km\'&&ev.kmL!=null)ev.kmL=Math.max(0,ev.kmL-_diff)});sv(\'C\');toast(\'Araç bilgileri güncellendi!\',\'succ\');rn()">💾 Kaydet</button></div>'+
'<div class="cd fc" style="margin-top:10px"><h3>📅 Yaklaşan İşlem Ekle</h3><div><div class="fl">İŞLEM ADI</div><input id="cevnm" placeholder="Muayene, Kasko..."></div><div class="g2"><div><div class="fl">TÜRÜ</div><select id="cevtp"><option value="date">Tarih bazlı</option><option value="km">KM bazlı</option></select></div><div><div class="fl">EMOJI</div><input id="cevic" value="🔧" style="width:60px"></div></div><div><div class="fl">SON TARİH / KM KALDI</div><input id="cevdt" placeholder="2026-12-31 veya 5000"></div><button class="btn ba" onclick="const nm=$(\'cevnm\').value;if(!nm)return;const tp=$(\'cevtp\').value;const dt=$(\'cevdt\').value;const ev={id:Date.now(),ic:$(\'cevic\').value||\'🔧\',nm,tp};if(tp===\'date\')ev.dt=dt;else ev.kmL=Number(dt)||0;if(!S.C.ev)S.C.ev=[];S.C.ev.push(ev);sv(\'C\');toast(\'İşlem eklendi!\',\'succ\');rn()">Ekle</button></div>'}
function aracGiderKaydet(dt,tp,desc,amt){
if(amt>0){if(!S.GIDER)S.GIDER=[];S.GIDER.push({id:Date.now(),dt:dt,amt:amt,cat:tp,mod:'ARAC',desc:tp+(desc?' — '+desc:''),usr:S.user||'Görkem'});sv('GIDER');}}
function oAracEkle(){const e=document.createElement('div');e.className='mo';e.onclick=()=>e.remove();e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>🔧 Bakım Kaydı Ekle</h3><div class="fc"><div><div class="fl">BAKIM TÜRÜ</div><input id="htp" placeholder="Yağ Değişimi, Lastik..."></div><div><div class="fl">ÇIKAŞMA</div><input id="hds" placeholder="Detay..."></div><div class="g2"><div><div class="fl">TARİH</div><input id="hdt" type="date" value="'+tISO()+'"></div><div><div class="fl">MALİYET ₺</div><input id="hco" type="number" placeholder="0"></div></div><div><div class="fl">KM</div><input id="hkm" type="number" value="'+(S.C.km||0)+'"></div><div class="g2"><button class="btn bg" onclick="this.closest(\'.mo\').remove()">İptal</button><button class="btn ba" onclick="const tp=$(\'htp\').value;if(!tp)return;if(!S.C.hs)S.C.hs=[];const hco=Number($(\'hco\').value)||0;S.C.hs.unshift({id:Date.now(),dt:$(\'hdt\').value,km:Number($(\'hkm\').value),tp:tp,ds:$(\'hds\').value,co:hco});aracGiderKaydet($(\'hdt\').value,tp,$(\'hds\').value,hco);sv(\'C\');chkAch(\'bakim_eklendi\');this.closest(\'.mo\').remove();toast(\'Bak\u0131m kayd\u0131 eklendi!\',\'succ\');rn()">&#x1F4BE; Kaydet</button></div></div></div>';document.body.appendChild(e)}
function aracimH(){const cs=S.C.cs||'ana';const tabs=[{id:'ana',l:'🚗 Ana'},{id:'hist',l:'📋 Geçmiş'},{id:'ayar',l:'⚙️ Ayarlar'}];let content=cs==='ana'?aracAnaH():cs==='hist'?aracHistH():aracAyarH();
return'<div class="app"><div class="hdr" style="background:var(--arac)"><div style="display:flex;align-items:center;gap:8px"><div style="font-size:14px;color:rgba(255,255,255,.7);cursor:pointer;min-width:44px;min-height:44px;display:flex;align-items:center" onclick="go(\'home\')">◀</div><div><h1>Eraylar Aracım</h1></div></div><button class="ubtn" onclick="pu(null)">'+onlineDot()+(S.user==='Görkem'?'👨':'👩')+' '+S.user+'</button></div><div class="cnt fi"><div style="display:flex;gap:6px;margin-bottom:14px">'+tabs.map(t=>'<div style="flex:1;padding:9px 4px;border-radius:10px;background:'+(cs===t.id?'var(--arac)':'var(--card)')+';color:'+(cs===t.id?'#fff':'var(--txtL)')+';font-weight:700;font-size:10px;text-align:center;cursor:pointer;border:1px solid '+(cs===t.id?'var(--arac)':'var(--brd)')+';min-height:36px;display:flex;align-items:center;justify-content:center" onclick="S.C.cs=\''+t.id+'\';sv(\'C\');rn()">'+t.l+'</div>').join('')+'</div>'+content+'</div></div>'}


// FAZ 8 — #20: Sonsuz Animasyonlu Random Seçici
function oRandAnim(dt,ml,tp){
const ik=ml==='k';
let pool=S.R.filter(r=>ik?r.c==='kahvalti':r.c!=='kahvalti');
if(tp==='e')pool=pool.filter(r=>r.t<=30);else pool=pool.filter(r=>r.t>30);
const is=pool.filter(r=>chk(r));if(is.length)pool=is;
if(!pool.length)pool=S.R.filter(r=>ik?r.c==='kahvalti':r.c!=='kahvalti');
const used=recentR();let fresh=pool.filter(r=>!used.has(r.n));if(fresh.length<2)fresh=pool;
const weighted=[];fresh.forEach(r=>{weighted.push(r);if(isSeas(r))weighted.push(r)});
const final=weighted.length?weighted:fresh;
let current=final[Math.floor(Math.random()*final.length)];
const e=document.createElement('div');e.className='mo';e.onclick=()=>e.remove();
function showResult(r){
const seas=isSeas(r);
e.innerHTML='<div class="md" onclick="event.stopPropagation()" style="text-align:center;padding:28px 20px">'+
'<div style="font-size:10px;font-weight:800;color:var(--txtL);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px">'+(tp==='h'?'🥇 ŞANSLIM BUGÜN':'⚡ PRATİK SEÇİM')+'</div>'+
'<div style="font-size:56px;margin-bottom:10px;animation:fi .3s">'+r.e+'</div>'+
'<div style="font-size:18px;font-weight:800;color:var(--txt);margin-bottom:8px">'+esc(r.n)+'</div>'+
'<div style="display:flex;gap:6px;justify-content:center;margin-bottom:14px">'+
(seas?'<span style="background:var(--sL);color:var(--sec);font-size:9px;padding:3px 8px;border-radius:8px;font-weight:700">🍅 Mevsim</span>':'')+
'<span style="background:var(--pL);color:var(--primary);font-size:9px;padding:3px 8px;border-radius:8px;font-weight:700">⏱ '+r.t+'dk</span>'+
'<span style="background:var(--bg);color:var(--txtL);font-size:9px;padding:3px 8px;border-radius:8px;font-weight:700">🔥 '+r.p+'×</span>'+
'</div>'+
'<div style="margin-bottom:16px"><div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center">'+
(r.ig||[]).slice(0,5).map(i=>{const nm=i.split(':')[0].trim().toLowerCase();const ok=S.F.some(f=>f.n.toLowerCase()===nm&&f.cr>0)||S.P.some(p=>p.n.toLowerCase()===nm&&p.cr>0);const frozen=!ok&&isDonuk(nm);return'<span style="font-size:9px;padding:3px 7px;border-radius:6px;background:'+(ok?'var(--sL)':frozen?'#EBF5FB':'var(--dangerL)')+';color:'+(ok?'var(--sec)':frozen?'#2980B9':'var(--danger)')+';cursor:pointer" onclick="oMalDetay(\''+esc(i.split(':')[0].trim())+'\')">'+esc(i.split(':')[0].trim())+'</span>'}).join('')+
((r.ig||[]).length>5?'<span style="font-size:9px;padding:3px 7px;border-radius:6px;background:var(--bg);color:var(--txtL)">+'+((r.ig||[]).length-5)+' daha</span>':'')+
'</div></div>'+
'<div class="g2" style="gap:8px">'+
'<button class="btn bg" id="rnd_retry" style="flex-direction:column;padding:12px"><span style="font-size:18px">🔄</span><span style="font-size:10px;margin-top:2px">Beğenmedim</span></button>'+
'<button class="btn" style="background:var(--sec);color:#fff;flex-direction:column;padding:12px" onclick="sm(\''+dt+'\',\''+ml+'\',\''+esc(r.n)+'\');document.querySelector(\'.mo\').remove()"><span style="font-size:18px">✅</span><span style="font-size:10px;margin-top:2px">Seçiyorum!</span></button>'+
'</div>'+
'<button class="btn bg" style="margin-top:8px;font-size:11px" onclick="this.closest(\'.mo\').remove()">İptal</button>'+
'</div>';
// A3 FIX: querySelector kullan, DOM'da olması garantili
const retryBtn=e.querySelector('#rnd_retry');
if(retryBtn)retryBtn.onclick=()=>{
// Farklı bir tarif seç
let next;let tries=0;
do{next=final[Math.floor(Math.random()*final.length)];tries++}while(next.n===current.n&&tries<10&&final.length>1);
current=next;showResult(current)}}
document.body.appendChild(e);
showResult(current);}

// FAZ 8 — #19: Menüye Ekle (tarif detayından)
function oMenueEkle(id,mf){
const r=S.R.find(x=>x.id===id);if(!r)return;
const days=gw(S.wo);
const e=document.createElement('div');e.className='mo';e.onclick=()=>e.remove();
const DN=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
e.innerHTML='<div class="md" onclick="event.stopPropagation()">'+
'<h3>📋 Menüye Ekle</h3>'+
'<p style="font-size:11px;color:var(--txtL);margin-bottom:14px"><strong>'+r.e+' '+esc(r.n)+'</strong> hangi öğüne?</p>'+
'<div style="font-size:10px;font-weight:800;color:var(--txtL);text-transform:uppercase;margin-bottom:8px">HAFTA SEÇ</div>'+
'<div style="display:flex;gap:6px;margin-bottom:14px">'+
'<div style="flex:1;padding:8px;border-radius:10px;border:2px solid '+(S.wo===0?'var(--mutfak)':'var(--brd)')+';text-align:center;cursor:pointer;font-size:10px;font-weight:700" onclick="S.wo=0;this.closest(\'.mo\').remove();oMenueEkle('+id+',null)">Bu Hafta</div>'+
'<div style="flex:1;padding:8px;border-radius:10px;border:2px solid '+(S.wo===1?'var(--mutfak)':'var(--brd)')+';text-align:center;cursor:pointer;font-size:10px;font-weight:700" onclick="S.wo=1;this.closest(\'.mo\').remove();oMenueEkle('+id+',null)">Gelecek Hafta</div>'+
'</div>'+
days.map(d=>{const m=S.M[d.dt]||{};const hk=!!m.k,ha=!!m.a||!!m.sp;
return'<div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--brd)">'+
'<div style="width:38px;text-align:center"><div style="font-size:11px;font-weight:800;color:'+(d.td?'var(--mutfak)':'var(--txtL)')+'">'+d.s+'</div><div style="font-size:9px;color:var(--txtL)">'+d.dy+'/'+d.mo+'</div></div>'+
'<div style="flex:1;display:flex;gap:6px">'+
(r.c==='kahvalti'?
'<button class="btn" style="flex:1;padding:7px;font-size:10px;background:'+(hk?'var(--sL)':'var(--pL)')+';color:'+(hk?'var(--sec)':'var(--primary)')+'" onclick="sm(\''+d.dt+'\',\'k\',\''+esc(r.n)+'\');this.closest(\'.mo\').remove();toast(\'✅ '+d.s+' kahvaltıya eklendi!\',\'succ\')">'+(hk?'✏️ '+esc((m.k||'').slice(0,12)):'☀️ Kahvaltıya Ekle')+'</button>':
'<button class="btn" style="flex:1;padding:7px;font-size:10px;background:'+(ha?'var(--sL)':'var(--pL)')+';color:'+(ha?'var(--sec)':'var(--primary)')+'" onclick="sm(\''+d.dt+'\',\'a\',\''+esc(r.n)+'\');this.closest(\'.mo\').remove();toast(\'✅ '+d.s+' akşamına eklendi!\',\'succ\')">'+(ha?'✏️ '+esc((m.a||'').slice(0,12)):'🌙 Akşama Ekle')+'</button>')+
'</div></div>'}).join('')+
'<button class="btn bg" style="margin-top:14px" onclick="this.closest(\'.mo\').remove()">Kapat</button>'+
'</div>';
document.body.appendChild(e)}

// FAZ 8 — #16: Aylık Takvim Görünümü
function oTakvim(){
const now=new Date();const y=now.getFullYear();const mn=now.getMonth();
const MN=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const DN=['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];
// Ayın ilk günü ve gün sayısı
const first=new Date(y,mn,1);const days=new Date(y,mn+1,0).getDate();
let startDow=first.getDay();if(startDow===0)startDow=7;// Pazartesi=1
const pad=startDow-1;
const e=document.createElement('div');e.className='mf';
function dayCell(day){
const dt=y+'-'+String(mn+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');
const m=S.M[dt]||{};const hk=!!m.k,ha=!!m.a||!!m.sp;
const isToday=dt===tISO();
const isPast=new Date(dt)<new Date(tISO());
let bg='var(--bg)';let brd='var(--brd)';let dot='';
if(m.sp){bg='#EBF5FB';brd='#2E86C1';dot='<div style="width:6px;height:6px;border-radius:50%;background:#2E86C1;margin:1px auto"></div>'}
else if(hk&&ha){bg='var(--sL)';brd='var(--sec)';dot='<div style="width:6px;height:6px;border-radius:50%;background:var(--sec);margin:1px auto"></div>'}
else if(hk||ha){bg='var(--warnL)';brd='var(--warn)';dot='<div style="width:6px;height:6px;border-radius:50%;background:var(--warn);margin:1px auto"></div>'}
else if(isPast&&day<now.getDate()){bg='var(--dangerL)';brd='var(--danger)';dot='<div style="width:6px;height:6px;border-radius:50%;background:var(--danger);margin:1px auto"></div>'}
return'<div onclick="oTakvimGun(\''+dt+'\')" style="min-height:48px;padding:4px;border-radius:8px;background:'+bg+';border:1px solid '+brd+';cursor:pointer;display:flex;flex-direction:column;align-items:center">'+
'<div style="font-size:10px;font-weight:'+(isToday?'900':'700')+';color:'+(isToday?'var(--mutfak)':isPast?'var(--txtL)':'var(--txt)')+'">'+day+'</div>'+
dot+'</div>'}
const cells=[];for(let i=0;i<pad;i++)cells.push('<div></div>');
for(let d=1;d<=days;d++)cells.push(dayCell(d));
// Toplam istatistik
const filled=Object.entries(S.M).filter(([dt2])=>dt2.startsWith(y+'-'+String(mn+1).padStart(2,'0'))).filter(([,m])=>m.k&&m.a).length;
const orders=Object.entries(S.M).filter(([dt2])=>dt2.startsWith(y+'-'+String(mn+1).padStart(2,'0'))).filter(([,m])=>m.sp).length;
e.innerHTML='<div style="background:var(--mutfak);padding:calc(14px + env(safe-area-inset-top,0px)) 18px 14px;display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:8px"><div style="cursor:pointer;color:#fff;font-size:14px;min-width:44px;min-height:44px;display:flex;align-items:center" onclick="this.closest(\'.mf\').remove()">◀</div><div style="color:#fff;font-weight:700;font-size:14px">📅 '+MN[mn]+' '+y+'</div></div><div style="font-size:11px;color:rgba(255,255,255,.8)">'+filled+' gün ✅</div></div>'+
'<div style="padding:14px">'+
'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px">'+DN.map(d=>'<div style="text-align:center;font-size:9px;font-weight:800;color:var(--txtL);padding:4px">'+d+'</div>').join('')+'</div>'+
'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px">'+cells.join('')+'</div>'+
'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">'+
'<div style="display:flex;align-items:center;gap:4px;font-size:10px"><div style="width:10px;height:10px;border-radius:50%;background:var(--sec)"></div>İkisi var</div>'+
'<div style="display:flex;align-items:center;gap:4px;font-size:10px"><div style="width:10px;height:10px;border-radius:50%;background:var(--warn)"></div>Biri var</div>'+
'<div style="display:flex;align-items:center;gap:4px;font-size:10px"><div style="width:10px;height:10px;border-radius:50%;background:var(--danger)"></div>Boş geçti</div>'+
'<div style="display:flex;align-items:center;gap:4px;font-size:10px"><div style="width:10px;height:10px;border-radius:50%;background:#2E86C1"></div>Sipariş</div>'+
'</div>'+
'<div class="g3"><div class="cd" style="text-align:center;padding:10px"><div style="font-size:20px;font-weight:800;color:var(--sec)">'+filled+'</div><div style="font-size:9px;color:var(--txtL)">İkisi tamam</div></div>'+
'<div class="cd" style="text-align:center;padding:10px"><div style="font-size:20px;font-weight:800;color:#2E86C1">'+orders+'</div><div style="font-size:9px;color:var(--txtL)">Sipariş</div></div>'+
'<div class="cd" style="text-align:center;padding:10px"><div style="font-size:20px;font-weight:800;color:var(--mutfak)">'+days+'</div><div style="font-size:9px;color:var(--txtL)">Gün toplam</div></div>'+
'</div></div>';
document.body.appendChild(e)}

function oTakvimGun(dt){
const m=S.M[dt]||{};
const e=document.createElement('div');e.className='mo';e.onclick=()=>e.remove();
const d=new Date(dt);const DN2=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];const dow=d.getDay()===0?6:d.getDay()-1;
e.innerHTML='<div class="md" onclick="event.stopPropagation()" style="text-align:center;padding:24px">'+
'<div style="font-size:12px;font-weight:800;color:var(--txtL);margin-bottom:4px">'+DN2[dow]+' '+dt+'</div>'+
(m.sp?'<div style="font-size:32px;margin:12px 0">🚚</div><div style="font-weight:700">Dışarıdan Sipariş</div>':
'<div style="padding:10px;background:var(--sL);border-radius:10px;margin-bottom:8px;text-align:left">'+
'<div style="font-size:9px;font-weight:800;color:var(--txtL)">☀️ KAHVALTI</div>'+
'<div style="font-size:13px;font-weight:700">'+(m.k||'—')+'</div>'+
'</div>'+
'<div style="padding:10px;background:var(--pL);border-radius:10px;text-align:left">'+
'<div style="font-size:9px;font-weight:800;color:var(--txtL)">🌙 AKŞAM</div>'+
'<div style="font-size:13px;font-weight:700">'+(m.a||'—')+'</div>'+
'</div>')+
'<button class="btn bm" style="margin-top:16px" onclick="S.wo=Math.round((new Date(\''+dt+'\')-new Date(tISO()))/604800000);rn();this.closest(\'.mo\').remove();document.querySelector(\'.mf\')&&document.querySelector(\'.mf\').remove()">📋 Bu Haftaya Git</button>'+
'<button class="btn bg" style="margin-top:6px" onclick="this.closest(\'.mo\').remove()">Kapat</button></div>';
document.body.appendChild(e)}

// FAZ 8 — #21: Tarif Silme Bağımlılık Kontrolü
function delTarif(id,mf){
const r=S.R.find(x=>x.id===id);if(!r)return;
const inMenu=Object.entries(S.M).filter(([,m])=>m.k===r.n||m.a===r.n);
if(inMenu.length>0){
if(!confirm('"'+r.n+'" menüde '+inMenu.length+' günde kullanılıyor.\n\n'+inMenu.slice(0,3).map(([dt])=>dt).join('\n')+(inMenu.length>3?'\n...':'')+'\n\nYine de silmek istiyor musun?'))return}
else if(!confirm('"'+r.n+'" tarifi silinecek. Emin misin?'))return;
S.R=S.R.filter(x=>x.id!==id);sv('R');if(mf)mf.remove();else{const m=document.querySelector('.mf');if(m)m.remove()}rn()}


function tatMig(){
if(!S.TAT)S.TAT=JSON.parse(JSON.stringify(ITAT));
if(!S.TAT.trips)S.TAT.trips=[];
if(!S.TAT.passport)S.TAT.passport={gorkem:{},esra:{}};
if(!S.TAT.passport.gorkem)S.TAT.passport.gorkem={};
if(!S.TAT.passport.esra)S.TAT.passport.esra={};
if(!S.TAT.visas)S.TAT.visas=[];
if(!S.TAT.wishlist)S.TAT.wishlist=[];
if(!S.TAT.dtab)S.TAT.dtab={};
if(!S.TAT.passport.gorkem.no)S.TAT.passport.gorkem={no:'U22343986',exp:'17.09.2029',name:'Görkem Eray'};
if(!S.TAT.passport.esra.no)S.TAT.passport.esra={no:'U27087135',exp:'24.08.2032',name:'Esra Eray'};
var defTrips=[
{id:'t1',title:'Marsilya',country:'Fransa',city:'Marsilya',startDate:'03.02.2023',endDate:'07.02.2023',type:'yurtdisi',who:'ikisi',schengen:true,status:'tamamlandi',notes:'İlk yurt dışı gezimiz ❤️',budget:{estimated:0},expenses:[],flights:[],hotels:[{name:'New Hotel Le Quai - Vieux Port',address:'Vieux Port, Marsilya, Fransa'}],todos:[],insurance:{},car:{},currency:{}},
{id:'t2',title:'Londra',country:'İngiltere',city:'Londra',startDate:'02.02.2024',endDate:'08.02.2024',type:'yurtdisi',who:'ikisi',schengen:false,status:'tamamlandi',notes:'',budget:{estimated:0},expenses:[],flights:[],hotels:[{name:'AirBnb',address:'Piccadilly Circus, Londra'}],todos:[],insurance:{},car:{},currency:{}},
{id:'t3',title:'Saraybosna & Kotor',country:'Bosna Hersek',city:'Saraybosna',startDate:'19.09.2024',endDate:'21.09.2024',type:'yurtdisi',who:'ikisi',schengen:false,status:'tamamlandi',notes:'Ucakla gidip araba kiralayip Kotora gectik.',budget:{estimated:0},expenses:[],flights:[],hotels:[{name:'AirBnb',address:'Bascarsı, Saraybosna'},{name:'AirBnb',address:'Old Town, Kotor, Karadağ'}],todos:[],insurance:{},car:{company:'Kiralik Arac',notes:'Saraybosnadan Kotora'},currency:{}},
{id:'t4',title:'Berlin',country:'Almanya',city:'Berlin',startDate:'23.05.2025',endDate:'26.05.2025',type:'yurtdisi',who:'ikisi',schengen:true,status:'tamamlandi',notes:'',budget:{estimated:0},expenses:[],flights:[],hotels:[{name:'Hotel Motel One Berlin',address:'Alexanderplatz, Berlin, Almanya'}],todos:[],insurance:{},car:{},currency:{}},
{id:'t5',title:'Kavala & Selanik',country:'Yunanistan',city:'Kavala',startDate:'31.10.2025',endDate:'02.11.2025',type:'yurtdisi',who:'ikisi',schengen:true,status:'tamamlandi',notes:'',budget:{estimated:0},expenses:[],flights:[],hotels:[{name:'Hotel Galaxy',address:'Kavala, Yunanistan'},{name:'AirBnb',address:'Selanik, Yunanistan'}],todos:[],insurance:{},car:{},currency:{}},
{id:'t6',title:'Sofya',country:'Bulgaristan',city:'Sofya',startDate:'15.01.2026',endDate:'16.01.2026',type:'yurtdisi',who:'ikisi',schengen:true,status:'tamamlandi',notes:'',budget:{estimated:0},expenses:[],flights:[],hotels:[{name:'Hotel Coop',address:'Sofya, Bulgaristan'}],todos:[],insurance:{},car:{},currency:{}},
{id:'t7',title:'Viyana',country:'Avusturya',city:'Viyana',startDate:'21.05.2026',endDate:'24.05.2026',type:'yurtdisi',who:'ikisi',schengen:true,status:'planlandi',notes:'Booking: 6371.194.805 | PNR: 1TG17K',budget:{estimated:0},expenses:[],flights:[{dir:'gidis',date:'21.05.2026',time:'15:35',from:'SAW',to:'VIE',no:'PC903',terminal:'Ana'},{dir:'donus',date:'24.05.2026',time:'13:40',from:'VIE',to:'SAW',no:'PC902',terminal:'1A'}],hotels:[{name:'Austria Trend Hotel Europa Wien',address:'Karntnerstrasse 18, 1010 Viyana, Avusturya'}],todos:[],insurance:{},car:{},currency:{code:'EUR',amount:547.71}}
];
defTrips.forEach(function(dt){if(!S.TAT.trips.find(function(t){return t.id===dt.id;}))S.TAT.trips.push(dt);});
if(!S.TAT.visas.find(function(v){return v.id==='v1';}))S.TAT.visas.push({id:'v1',country:'Schengen (Almanya)',who:'gorkem',validFrom:'11.03.2024',validTo:'10.03.2029',schengen:true,notes:'MULT · 90 gun'});
if(!S.TAT.visas.find(function(v){return v.id==='v2';}))S.TAT.visas.push({id:'v2',country:'Schengen (Almanya)',who:'esra',validFrom:'23.04.2025',validTo:'22.04.2029',schengen:true,notes:'MULT · 90 gun'});}
