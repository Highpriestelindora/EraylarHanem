// ═══ FINANS ═══
// ─── ERAYLAR FİNANS ─────────────────────────────────────────────────────────
function finansTabSec(t){S.finansTab=t;rn();}
function finansFiltreSec(f){S.finansFiltre=f;rn();}
function finansH(){
var giderler=S.GIDER||[];
var tab=S.finansTab||'aylik';
var filtre=S.finansFiltre||'hepsi';
var out='<div class="app">';
out+='<div class="hdr" style="background:linear-gradient(135deg,#27AE60,#1E8449)">';
out+='<div style="display:flex;align-items:center;gap:8px">';
out+='<button onclick="go(\'home\')" style="background:rgba(255,255,255,.15);border:none;border-radius:8px;padding:6px 10px;color:#fff;font-size:13px;cursor:pointer;font-family:Nunito;font-weight:700">&#8592; Geri</button>';
out+='<div><h1 style="font-size:16px">&#x1F4B0; Eraylar Finans</h1></div></div></div>';
out+='<div class="cnt fi">';
// Tab bar
out+='<div style="display:flex;gap:4px;margin-bottom:10px">';
var tabs=[{id:'aylik',l:'&#x1F4CA; Ayl&#x131;k'},{id:'kategori',l:'&#x1F3F7;&#xFE0F; Kat.'},{id:'modul',l:'&#x1F4E6; Mod&#xFC;l'},{id:'liste',l:'&#x1F4CB; Liste'}];
tabs.forEach(function(t){
  var active=tab===t.id;
  out+='<button onclick="finansTabSec(\''+t.id+'\')" style="flex:1;padding:7px 2px;border-radius:10px;border:none;font-family:Nunito;font-size:10px;font-weight:700;cursor:pointer;background:'+(active?'var(--succ)':'var(--bg)')+';color:'+(active?'#fff':'var(--txtL)')+'">'+t.l+'</button>';
});
out+='</div>';
// Filter bar
out+='<div style="display:flex;gap:5px;margin-bottom:12px">';
var filtreler=[{k:'hepsi',l:'Hepsi'},{k:'G\u00f6rkem',l:'&#x1F468; G\u00f6rkem'},{k:'Esra',l:'&#x1F469; Esra'}];
filtreler.forEach(function(f){
  var active=filtre===f.k;
  out+='<button onclick="finansFiltreSec(\''+f.k+'\')" style="padding:5px 10px;border-radius:8px;border:1px solid '+(active?'var(--succ)':'var(--brd)')+';background:'+(active?'var(--sL)':'var(--card)')+';font-family:Nunito;font-size:11px;font-weight:700;cursor:pointer;color:'+(active?'var(--sec)':'var(--txtL)')+'">'+f.l+'</button>';
});
out+='</div>';
var veri=filtre==='hepsi'?giderler:giderler.filter(function(g){return(g.usr||'').toLowerCase().indexOf(filtre.toLowerCase())>=0;});
if(tab==='aylik'){
  var aylar=[];for(var i=5;i>=0;i--){var d=new Date();d.setMonth(d.getMonth()-i);aylar.push({y:d.getFullYear(),m:d.getMonth()+1,lbl:(d.getMonth()+1)+'/'+(d.getFullYear()%100),toplam:0});}
  veri.forEach(function(g){var gd=new Date(g.dt);aylar.forEach(function(a){if(gd.getFullYear()===a.y&&gd.getMonth()+1===a.m)a.toplam+=g.amt||0;});});
  var maxAmt=Math.max.apply(null,aylar.map(function(a){return a.toplam;}));if(maxAmt===0)maxAmt=1;
  out+='<div class="cd"><h3>&#x1F4CA; Ayl&#x131;k Harcama</h3>';
  out+='<div style="display:flex;align-items:flex-end;gap:6px;height:110px;margin:12px 0">';
  var now2=new Date();
  aylar.forEach(function(a){
    var h=Math.round((a.toplam/maxAmt)*80)+5;
    var isThis=a.m===now2.getMonth()+1&&a.y===now2.getFullYear();
    out+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">';
    out+='<div style="font-size:7px;font-weight:700;color:var(--succ);text-align:center">'+(a.toplam>0?fmt(a.toplam):'')+'</div>';
    out+='<div style="width:100%;background:'+(isThis?'var(--succ)':'#A9D4BC')+';border-radius:4px 4px 0 0;height:'+h+'px"></div>';
    out+='<div style="font-size:8px;color:var(--txtL)">'+a.lbl+'</div>';
    out+='</div>';
  });
  out+='</div></div>';
  out+='<div class="g2">';
  var modList=[{m:'PET',ic:'&#x1F43E;'},{m:'ARAC',ic:'&#x1F697;'},{m:'MUTFAK',ic:'&#x1F373;'},{m:'DIGER',ic:'&#x1F4E6;'}];
  modList.forEach(function(x){
    var mt=veri.filter(function(g){return x.m==='DIGER'?!['PET','ARAC','MUTFAK'].includes(g.mod):g.mod===x.m;}).reduce(function(a,g){return a+(g.amt||0);},0);
    var lbl=x.m==='DIGER'?'Di&#x11F;er':x.m;
    out+='<div class="cd" style="text-align:center;padding:12px"><div style="font-size:22px">'+x.ic+'</div><div style="font-size:10px;color:var(--txtL);font-weight:700">'+lbl+'</div><div style="font-size:15px;font-weight:900;color:var(--sec)">'+fmt(mt)+'</div></div>';
  });
  out+='</div>';
}else if(tab==='kategori'){
  var katMap={};
  veri.forEach(function(g){var k=g.cat||'Di\u011fer';if(!katMap[k])katMap[k]=0;katMap[k]+=g.amt||0;});
  var katlar=Object.keys(katMap).map(function(k){return{k:k,v:katMap[k]};}).sort(function(a,b){return b.v-a.v;});
  var toplamKat=katlar.reduce(function(a,b){return a+b.v;},0)||1;
  out+='<div class="cd"><h3>&#x1F3F7;&#xFE0F; Kategoriye G&ouml;re</h3>';
  if(katlar.length===0){out+='<p style="color:var(--txtL);font-size:12px;text-align:center;padding:20px">Hen\u00fcz harcama yok</p>';}
  else{katlar.forEach(function(k){
    var pct=Math.round(k.v/toplamKat*100);
    out+='<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span style="font-weight:700">'+esc(k.k)+'</span><span style="font-weight:800;color:var(--sec)">'+fmt(k.v)+'</span></div>';
    out+='<div style="background:var(--bg);border-radius:4px;height:6px"><div style="background:var(--succ);border-radius:4px;height:6px;width:'+pct+'%"></div></div></div>';
  });}
  out+='</div>';
}else if(tab==='modul'){
  var modMap={};
  veri.forEach(function(g){var m=g.mod||'D\u0130\u011eER';if(!modMap[m])modMap[m]={toplam:0,sayi:0};modMap[m].toplam+=g.amt||0;modMap[m].sayi++;});
  var modIC={PET:'&#x1F43E;',ARAC:'&#x1F697;',MUTFAK:'&#x1F373;'};
  var modlar=Object.keys(modMap).sort(function(a,b){return modMap[b].toplam-modMap[a].toplam;});
  out+='<div class="cd"><h3>&#x1F4E6; Mod\u00fcle G&ouml;re</h3>';
  if(modlar.length===0){out+='<p style="color:var(--txtL);font-size:12px;text-align:center;padding:20px">Hen\u00fcz harcama yok</p>';}
  else{modlar.forEach(function(m){
    out+='<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--brd)">';
    out+='<div style="display:flex;align-items:center;gap:10px"><div style="font-size:22px">'+(modIC[m]||'&#x1F4E6;')+'</div>';
    out+='<div><div style="font-size:13px;font-weight:700">'+m+'</div><div style="font-size:10px;color:var(--txtL)">'+modMap[m].sayi+' kay&#x131;t</div></div></div>';
    out+='<div style="font-size:15px;font-weight:900;color:var(--sec)">'+fmt(modMap[m].toplam)+'</div></div>';
  });}
  out+='</div>';
}else{
  var son=veri.slice().sort(function(a,b){return new Date(b.dt)-new Date(a.dt);}).slice(0,50);
  out+='<div class="cd" style="padding:10px"><h3>&#x1F4CB; Son Harcamalar</h3>';
  if(son.length===0){out+='<p style="color:var(--txtL);font-size:12px;text-align:center;padding:20px">Hen\u00fcz harcama yok</p>';}
  else{son.forEach(function(g){
    var ic=g.mod==='PET'?'&#x1F43E;':g.mod==='ARAC'?'&#x1F697;':g.mod==='MUTFAK'?'&#x1F373;':'&#x1F4E6;';
    out+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--brd)">';
    out+='<div style="display:flex;align-items:center;gap:8px"><div style="font-size:18px">'+ic+'</div>';
    out+='<div><div style="font-size:11px;font-weight:700">'+esc(g.desc||g.cat||'-')+'</div>';
    out+='<div style="font-size:9px;color:var(--txtL)">'+esc(g.dt)+' &middot; '+(g.usr||'-')+'</div></div></div>';
    out+='<div style="font-weight:800;color:var(--sec);font-size:13px;flex-shrink:0">'+fmt(g.amt||0)+'</div></div>';
  });}
  out+='</div>';
  out+='<button class="btn bp" style="margin-top:8px;font-size:12px" onclick="finansManuelEkle()">+ Manuel Harcama Ekle</button>';
}
out+='</div></div>';
return out;
}
function finansManuelEkle(){
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>&#x1F4B8; Manuel Harcama</h3>'
+'<div class="fc">'
+'<div><div class="fl">Tutar (\u20ba)</div><input id="famt" type="number" placeholder="0"></div>'
+'<div><div class="fl">Kategori</div><input id="fcat" placeholder="Yemek, Giyim, ..."></div>'
+'<div><div class="fl">A\u00e7\u0131klama</div><input id="fdesc" placeholder="Ne i\u00e7in?"></div>'
+'<div><div class="fl">Tarih</div><input id="fdt" type="date" value="'+tISO()+'"></div>'
+'<div><div class="fl">Ki\u015fi</div><select id="fusr" style="width:100%;padding:10px;border:1px solid var(--brd);border-radius:12px;font-family:Nunito;font-size:14px;background:var(--bg)"><option>G\u00f6rkem</option><option>Esra</option></select></div>'
+'<button class="btn bp" onclick="finansKaydet()">&#x1F4BE; Kaydet</button>'
+'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">\u0130ptal</button>'
+'</div></div>';
document.body.appendChild(e);
}
function finansKaydet(){
var amt=Number(document.getElementById('famt').value)||0;
var cat=document.getElementById('fcat').value;
var desc=document.getElementById('fdesc').value;
var dt=document.getElementById('fdt').value;
var usr=document.getElementById('fusr').value;
if(!amt||!cat){toast('Tutar ve kategori zorunlu!','warn');return;}
if(!S.GIDER)S.GIDER=[];
S.GIDER.push({id:Date.now(),dt:dt,amt:amt,cat:cat,mod:'MANUEL',desc:desc,usr:usr});
sv('GIDER');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Harcama eklendi!','succ');rn();
}
// ─── KASA & FİNANS SONU ─────────────────────────────────────────────────────
