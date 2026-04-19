// ═══ KASA ═══
// ─── ERAYLAR KASA ───────────────────────────────────────────────────────────
function kasaTab(t){S.kasaTab=t;rn();}
function kasaH(){
var K=S.KASA||{gorkem:0,esra:0,ortak:0,gecmis:[]};
var tab=S.kasaTab||'bakiye';
var out='<div class="app">';
out+='<div class="hdr" style="background:linear-gradient(135deg,#2C3E50,#1a252f)">';
out+='<div style="display:flex;align-items:center;gap:8px">';
out+='<button onclick="go(\'home\')" style="background:rgba(255,255,255,.15);border:none;border-radius:8px;padding:6px 10px;color:#fff;font-size:13px;cursor:pointer;font-family:Nunito;font-weight:700">&#8592; Geri</button>';
out+='<div><h1 style="font-size:16px">&#x1F9FE; Eraylar Kasa</h1></div></div></div>';
out+='<div class="cnt fi">';
// Tab bar
out+='<div style="display:flex;gap:6px;margin-bottom:14px">';
var tabs=[{id:'bakiye',l:'&#x1F4B0; Bakiye'},{id:'gecmis',l:'&#x1F4CB; Ge&#xE7;mi&#x15F;'}];
tabs.forEach(function(t){
  var active=tab===t.id;
  out+='<button onclick="kasaTab(\''+t.id+'\')" style="flex:1;padding:9px;border-radius:10px;border:none;font-family:Nunito;font-size:12px;font-weight:700;cursor:pointer;background:'+(active?'var(--primary)':'var(--bg)')+';color:'+(active?'#fff':'var(--txtL)')+'">'+t.l+'</button>';
});
out+='</div>';
if(tab==='bakiye'){
  var total=(K.gorkem||0)+(K.esra||0)+(K.ortak||0);
  out+='<div class="cd" style="text-align:center;padding:20px;background:linear-gradient(135deg,#2C3E50,#1a252f);border-color:transparent">';
  out+='<div style="font-size:11px;color:rgba(255,255,255,.6);font-weight:700;letter-spacing:1px">TOPLAM B&#x130;R&#x130;K&#x130;M</div>';
  out+='<div style="font-size:36px;font-weight:900;color:#fff;margin:6px 0">'+fmt(total)+'</div></div>';
  var kisiler=[{k:'gorkem',l:'&#x1F468; G&#xF6;rkem',cl:'var(--primary)'},{k:'esra',l:'&#x1F469; Esra',cl:'#E91E8C'},{k:'ortak',l:'&#x1F3E1; Ortak',cl:'var(--sec)'}];
  out+='<div class="g3">';
  kisiler.forEach(function(p){
    out+='<div class="cd" style="text-align:center;padding:12px;border-left:3px solid '+p.cl+'">';
    out+='<div style="font-size:9px;color:var(--txtL);font-weight:700">'+p.l+'</div>';
    out+='<div style="font-size:18px;font-weight:900;color:'+p.cl+';margin-top:4px">'+fmt(K[p.k]||0)+'</div>';
    out+='<button onclick="kasaMGir(\''+p.k+'\')" style="margin-top:8px;padding:5px 10px;border-radius:8px;border:none;background:'+p.cl+';color:#fff;font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito">G&#xFC;ncelle</button>';
    out+='</div>';
  });
  out+='</div>';
}else{
  var items=(K.gecmis||[]).slice().sort(function(a,b){return new Date(b.dt)-new Date(a.dt);});
  out+='<div class="cd" style="padding:10px"><h3>Bakiye Ge&#xE7;mi&#x15F;i</h3>';
  if(items.length===0){out+='<p style="color:var(--txtL);font-size:12px;text-align:center;padding:16px">Hen&#xFC;z kay&#x131;t yok</p>';}
  else{items.forEach(function(it){
    var kl=it.kisi==='gorkem'?'&#x1F468; G&#xF6;rkem':it.kisi==='esra'?'&#x1F469; Esra':'&#x1F3E1; Ortak';
    out+='<div style="padding:9px 0;border-bottom:1px solid var(--brd);display:flex;justify-content:space-between;align-items:center">';
    out+='<div><div style="font-size:12px;font-weight:700">'+kl+'</div><div style="font-size:10px;color:var(--txtL)">'+it.dt+(it.not?' &middot; '+esc(it.not):'')+'</div></div>';
    out+='<div style="font-weight:800;font-size:14px;color:'+(it.fark>=0?'var(--succ)':'var(--danger)')+'">'+( it.fark>=0?'+':'')+fmt(it.fark)+'</div></div>';
  });}
  out+='</div>';
}
out+='</div></div>';
return out;
}
function kasaMGir(kisi){
var K=S.KASA||{gorkem:0,esra:0,ortak:0,gecmis:[]};
var lbl=kisi==='gorkem'?'&#x1F468; G&#xF6;rkem':kisi==='esra'?'&#x1F469; Esra':'&#x1F3E1; Ortak';
var e=document.createElement('div');e.className='mo';e.onclick=function(){e.remove();};
e.innerHTML='<div class="md" onclick="event.stopPropagation()"><h3>'+lbl+' &mdash; Bakiye G&uuml;ncelle</h3>'
+'<div class="fc">'
+'<div><div class="fl">G&uuml;ncel Bakiye (&thorn;)</div><input id="kbak" type="number" value="'+(K[kisi]||0)+'"></div>'
+'<div><div class="fl">Not (iste&gcirc;e ba&gcirc;l&#x131;)</div><input id="knot" placeholder="Maa&#x15F;, tasarruf..."></div>'
+'<button class="btn bp" onclick="kasaKaydet(\''+kisi+'\')">&#x1F4BE; Kaydet</button>'
+'<button class="btn bg" onclick="this.closest(\'.mo\').remove()">&#x130;ptal</button>'
+'</div></div>';
document.body.appendChild(e);
}
function kasaKaydet(kisi){
var yeni=Number(document.getElementById('kbak').value)||0;
var not=document.getElementById('knot').value;
if(!S.KASA)S.KASA={gorkem:0,esra:0,ortak:0,gecmis:[]};
var eski=S.KASA[kisi]||0;
S.KASA[kisi]=yeni;
S.KASA.gecmis.push({dt:tISO(),kisi:kisi,bakiye:yeni,fark:yeni-eski,not:not,usr:S.user||'G\u00f6rkem'});
if(S.KASA.gecmis.length>200)S.KASA.gecmis=S.KASA.gecmis.slice(-200);
sv('KASA');
var m=document.querySelector('.mo');if(m)m.remove();
toast('Bakiye g\u00fcncellendi!','succ');rn();
}

