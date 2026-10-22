// ---- Arco de funciones
const icons=["<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\"/><path d=\"M15 18H9\"/><path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\"/><circle cx=\"17\" cy=\"18\" r=\"2\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/>", "<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"/>", "<path d=\"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>", "<path d=\"M4 10a7.31 7.31 0 0 0 10 10Z\"/><path d=\"m9 15 3-3\"/><path d=\"M17 13a6 6 0 0 0-6-6\"/><path d=\"M21 13A10 10 0 0 0 11 3\"/>", "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>", "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M10 13H8\"/><path d=\"M16 17H8\"/>", "<path d=\"M2 12h20\"/><path d=\"M12 2v20\"/><path d=\"m20 16-4-4 4-4\"/><path d=\"m4 8 4 4-4 4\"/><path d=\"m16 4-4 4-4-4\"/><path d=\"m8 20 4-4 4 4\"/>", "<path d=\"m18 2 4 4\"/><path d=\"m17 7 3-3\"/><path d=\"M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5\"/><path d=\"m9 11 4 4\"/><path d=\"m5 19-3 3\"/><path d=\"m14 4 6 6\"/>", "<path d=\"m7.5 4.27 9 5.15\"/><path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\"/><path d=\"m3.3 7 8.7 5 8.7-5\"/><path d=\"M12 22V12\"/>", "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/><path d=\"M12 9v4\"/><path d=\"M12 17h.01\"/>", "<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z\"/><path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\"/><path d=\"M12 17.5v-11\"/>"];
const arc=document.getElementById("arc");
function layoutArc(){
  arc.querySelectorAll(".tile").forEach(t=>t.remove());
  const w=arc.clientWidth,R=Math.min(w*.44,400),cx=w/2,cy=R+20,n=icons.length,s=w<700?48:64;
  icons.forEach((ic,i)=>{
    const a=Math.PI*(1-(i/(n-1)));
    const x=cx+Math.cos(a)*R-s/2,y=cy-Math.sin(a)*R*.85-s/2+ (w<700?10:30);
    const t=document.createElement("div");t.className="tile";t.innerHTML='<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+ic+'</svg>';
    t.style.left=x+"px";t.style.top=(y-R*.5+ (w<700?40:60))+"px";
    t.style.transform="rotate("+(90-a*180/Math.PI)*-1*-1+"deg)";
    arc.appendChild(t);
  });
}
layoutArc();addEventListener("resize",layoutArc);

// ---- Open-Meteo
const $=id=>document.getElementById(id);
const MIN=2,MAX=8;
const fmt=d=>new Date(d+"T12:00").toLocaleDateString("es-AR",{day:"numeric",month:"short"});
async function load(lat,lon,name){
  $("status").textContent="Consultando Open-Meteo…";
  try{
    const u="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+
      "&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=5&forecast_days=2&timezone=auto";
    const r=await fetch(u);if(!r.ok)throw new Error(r.status);
    const d=await r.json();render(d,name,false);
  }catch(e){
    render({current:{temperature_2m:24.1},daily:{time:["2026-10-15","2026-10-16","2026-10-17","2026-10-18","2026-10-19","2026-10-20","2026-10-21"],
      temperature_2m_max:[26,29,31,33,30,28,27],temperature_2m_min:[14,16,18,20,17,15,15],precipitation_sum:[0,0,2.4,0,0,5.1,0]}},name,true);
  }
}
function cargoTemp(max,min){return +(3.2+(max-18)*0.28+(max-min)*0.05).toFixed(1)} // simulada
function render(d,name,offline){
  const t=d.daily.time,mx=d.daily.temperature_2m_max,mn=d.daily.temperature_2m_min,pr=d.daily.precipitation_sum;
  const cargo=t.map((_,i)=>cargoTemp(mx[i],mn[i]));
  const bad=cargo.map(c=>c<MIN||c>MAX);
  $("k1").textContent=d.current.temperature_2m.toFixed(1)+" °C";
  const ti=Math.min(5,t.length-1);
  $("k2").textContent=(pr[ti]??0).toFixed(1)+" mm";
  $("k3").textContent=bad.filter(Boolean).length;
  $("status").textContent=offline?"No se pudo conectar con Open-Meteo: se muestran datos de ejemplo. Abrí el archivo con internet para ver datos reales.":
    "Datos ambientales de Open-Meteo para "+name+". La línea violeta (carga) es una simulación.";
  // gráfico
  const W=520,H=190,p=30,lo=Math.min(0,...mn)-2,hi=Math.max(...mx,MAX)+3;
  const X=i=>p+i*(W-2*p)/(t.length-1),Y=v=>H-p-(v-lo)*(H-2*p)/(hi-lo);
  const line=a=>a.map((v,i)=>(i?"L":"M")+X(i).toFixed(1)+" "+Y(v).toFixed(1)).join(" ");
  let s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Temperatura del aire y de la carga simulada">';
  s+='<rect x="'+p+'" y="'+Y(MAX)+'" width="'+(W-2*p)+'" height="'+(Y(MIN)-Y(MAX))+'" fill="rgba(74,222,128,.1)"/>';
  s+='<text x="'+(p+4)+'" y="'+(Y(MAX)+12)+'" fill="#4ade80" font-size="10">Rango 2–8 °C</text>';
  s+='<path d="'+line(mx)+'" fill="none" stroke="#38bdf8" stroke-width="2"/><path d="'+line(cargo)+'" fill="none" stroke="#a78bfa" stroke-width="2.5"/>';
  cargo.forEach((c,i)=>{s+='<circle cx="'+X(i)+'" cy="'+Y(c)+'" r="4" fill="'+(bad[i]?"#fb7185":"#a78bfa")+'"/>';s+='<text x="'+X(i)+'" y="'+(H-8)+'" fill="#9a93bd" font-size="10" text-anchor="middle">'+fmt(t[i])+'</text>'});
  s+='<text x="'+(W-p)+'" y="14" fill="#38bdf8" font-size="10" text-anchor="end">Aire máx. (Open-Meteo)</text><text x="'+(W-p)+'" y="28" fill="#a78bfa" font-size="10" text-anchor="end">Carga (simulada)</text></svg>';
  $("chart").innerHTML=s;
  // eventos
  const ev=[["Salida del depósito",t[0]],["Control de temperatura",t[2]],["Cruce de frontera",t[4]]];
  const alerts=t.map((x,i)=>bad[i]?["Alerta: carga a "+cargo[i]+" °C (simulada)",x,true]:null).filter(Boolean).slice(-2);
  $("events").innerHTML=[...ev.map(e=>[...e,false]),...alerts].map(e=>'<div class="ev'+(e[2]?" broken":"")+'"><b>'+e[0]+'</b><br><span style="color:var(--mute)">'+fmt(e[1])+' · '+name+'</span></div>').join("");
}
$("city").addEventListener("change",e=>{const[a,b,c]=e.target.value.split(",");load(a,b,c)});
$("geo").addEventListener("click",()=>{
  if(!navigator.geolocation){$("status").textContent="Tu navegador no permite geolocalización.";return}
  navigator.geolocation.getCurrentPosition(p=>load(p.coords.latitude.toFixed(2),p.coords.longitude.toFixed(2),"tu ubicación"),
    ()=>{$("status").textContent="No diste permiso de ubicación. Elegí un punto de la lista."});
});
load(-34.60,-58.38,"Buenos Aires");

// ---- Cadena de hashes
const base=[
  {n:1,txt:"Salida del depósito · 3,9 °C"},
  {n:2,txt:"Control en ruta · 5,2 °C"},
  {n:3,txt:"Entrega al cliente · 6,1 °C"}];
const original=JSON.parse(JSON.stringify(base));
let data=JSON.parse(JSON.stringify(base));
async function sha(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function chain(arr){let prev="0",out=[];for(const e of arr){prev=await sha(prev+e.txt);out.push(prev)}return out}
async function drawChain(){
  try{
    const ref=await chain(original),cur=await chain(data);
    let first=-1;cur.forEach((h,i)=>{if(first<0&&h!==ref[i])first=i});
    $("chain").innerHTML=data.map((e,i)=>'<div class="ev'+(first>=0&&i>=first?" broken":"")+'"><b>Evento '+e.n+'</b> · '+e.txt+'<code>'+cur[i].slice(0,40)+'…</code></div>').join("");
    const st=$("chainState");st.className="tag "+(first<0?"ok":"bad");
    st.textContent=first<0?"Cadena íntegra":"Alteración detectada desde el evento "+(first+1);
  }catch(e){$("chain").textContent="Tu navegador necesita HTTPS o localhost para calcular SHA-256."}
}
$("tamper").onclick=()=>{data[1].txt="Control en ruta · 4,1 °C";drawChain()};
$("restore").onclick=()=>{data=JSON.parse(JSON.stringify(original));drawChain()};
drawChain();


// ---- GPS (Geolocation API del navegador)
let watchId=null,track=[],prevHash="0";
const gs=m=>$("gpsStatus").textContent=m;
function drawTrack(){
  const W=300,H=120,p=14;
  if(!track.length){$("gpsTrack").innerHTML="";return}
  const la=track.map(t=>t.lat),lo=track.map(t=>t.lon);
  const a0=Math.min(...la),a1=Math.max(...la),o0=Math.min(...lo),o1=Math.max(...lo);
  const X=v=>o1===o0?W/2:p+(v-o0)*(W-2*p)/(o1-o0),Y=v=>a1===a0?H/2:H-p-(v-a0)*(H-2*p)/(a1-a0);
  const pts=track.map(t=>X(t.lon).toFixed(1)+","+Y(t.lat).toFixed(1)).join(" ");
  const last=track[track.length-1];
  $("gpsTrack").innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Recorrido registrado por GPS"><polyline points="'+pts+'" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="4 4"/><circle cx="'+X(last.lon)+'" cy="'+Y(last.lat)+'" r="6" fill="#4ade80"/></svg>';
}
async function onFix(pos){
  const c=pos.coords,pt={ts:new Date(pos.timestamp).toISOString(),lat:+c.latitude.toFixed(6),lon:+c.longitude.toFixed(6),acc:Math.round(c.accuracy)};
  try{pt.hash=await sha(prevHash+JSON.stringify([pt.ts,pt.lat,pt.lon,pt.acc]));prevHash=pt.hash}catch(e){pt.hash="n/d"}
  if(!track.length)load(pt.lat.toFixed(2),pt.lon.toFixed(2),"tu posición GPS");
  track.push(pt);
  $("g1").textContent=pt.lat.toFixed(4);$("g2").textContent=pt.lon.toFixed(4);$("g3").textContent="±"+pt.acc+" m";
  $("gpsLog").insertAdjacentHTML("afterbegin",'<div class="ev"><b>Punto '+track.length+'</b> · '+pt.ts.slice(11,19)+'<code>'+pt.hash.slice(0,32)+'…</code></div>');
  $("gpsCsv").disabled=false;drawTrack();
  gs(pt.acc>500?"Precisión baja: probablemente estás en una computadora (ubicación por Wi-Fi/IP). En un celular con GPS mejora mucho.":"GPS activo. Registrando posiciones.");
}
function onErr(e){
  const m={1:"Permiso denegado. Habilitá la ubicación para este sitio en el navegador.",2:"No se pudo determinar la posición del dispositivo.",3:"La consulta tardó demasiado. Reintentá."};
  gs(m[e.code]||"Error de geolocalización.");stopGps(true);
}
function startGps(){
  if(!navigator.geolocation){gs("Tu navegador no permite geolocalización.");return}
  if(!window.isSecureContext&&location.protocol!=="file:"){gs("El GPS requiere HTTPS o localhost.");return}
  gs("Esperando permiso…");
  watchId=navigator.geolocation.watchPosition(onFix,onErr,{enableHighAccuracy:true,maximumAge:5000,timeout:20000});
  $("gpsStart").disabled=true;$("gpsStop").disabled=false;
}
function stopGps(keep){
  if(watchId!==null)navigator.geolocation.clearWatch(watchId);watchId=null;
  $("gpsStart").disabled=false;$("gpsStop").disabled=true;
  if(!keep)gs("GPS detenido. Los puntos siguen disponibles para exportar.");
}
function exportCsv(){
  const rows=["fecha_hora,latitud,longitud,precision_m,hash"].concat(track.map(t=>[t.ts,t.lat,t.lon,t.acc,t.hash].join(",")));
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.join("\n")],{type:"text/csv"}));
  a.download="recorrido-docubridge.csv";a.click();URL.revokeObjectURL(a.href);
}
$("gpsStart").onclick=startGps;$("gpsStop").onclick=()=>stopGps(false);$("gpsCsv").onclick=exportCsv;
