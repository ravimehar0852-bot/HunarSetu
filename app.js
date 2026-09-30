const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const P=document.body.dataset.page;
const svg=x=>"data:image/svg+xml,"+encodeURIComponent(x);
const avatar=h=>svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="hsl(${h},45%,90%)"/><circle cx="60" cy="46" r="20" fill="hsl(${h},35%,60%)"/><path d="M20 120a40 40 0 0 1 80 0z" fill="hsl(${h},35%,60%)"/></svg>`);
const work=(h,n)=>svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 210"><rect width="320" height="210" fill="hsl(${h},40%,90%)"/><path d="M0 170l90-70 70 50 60-40 100 60v40H0z" fill="hsl(${h},35%,75%)"/><text x="160" y="40" text-anchor="middle" font-family="sans-serif" font-size="15" fill="hsl(${h},40%,30%)">Sample work photo ${n}</text></svg>`);
const catName=id=>(CATS.find(c=>c[0]===id)||[])[1]||"";
const getLoc=()=>{try{return localStorage.getItem("hs_loc")||"Jhalawar"}catch(e){return"Jhalawar"}};
function toast(m){const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2600)}
const LOGO='<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#0e8a7b"/><path d="M5 22h22M8 22v-5m16 5v-5M8 17c4-9 12-9 16 0" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
function layout(){
 const nav=[["index.html","Home","home"],["workers.html","Find a Worker","workers"],["about.html","About","about"],["contact.html","Contact","contact"]];
 const loc=getLoc();
 document.body.insertAdjacentHTML("afterbegin",`<a class="skip" href="#main">Skip to content</a><header class="site"><div class="wrap nav"><a class="logo" href="index.html" aria-label="HunarSetu home">${LOGO}<b>Hunar<span>Setu</span></b></a><button class="menu btn alt" id="menu" aria-expanded="false" aria-controls="links">Menu</button><nav class="links" id="links" aria-label="Main">${nav.map(n=>`<a href="${n[0]}"${n[2]===P?' class="on" aria-current="page"':""}>${n[1]}</a>`).join("")}<a href="workers.html#q">🔍 Search</a><select id="loc" aria-label="Location">${LOCS.map(l=>`<option${l===loc?" selected":""}>${l}</option>`).join("")}</select><a class="btn" href="join.html">Join as a Worker</a></nav></div></header>`);
 document.body.insertAdjacentHTML("beforeend",`<footer><div class="wrap"><div class="grid"><div><h3>HunarSetu</h3><p>Local Skills. Local Work. Local Growth.</p></div><div><h3>Explore</h3><a href="about.html">About</a><a href="contact.html">Contact</a><a href="legal.html#privacy">Privacy Policy</a><a href="legal.html#terms">Terms</a></div><div><h3>Follow (placeholders)</h3><span>Instagram · Facebook · YouTube</span></div></div><small>Frontend prototype. All profiles are fictional demos. © HunarSetu</small></div></footer>`);
 const m=$("#menu"),l=$("#links");m.onclick=()=>{const o=l.classList.toggle("open");m.setAttribute("aria-expanded",o)};
 $("#loc").onchange=e=>{try{localStorage.setItem("hs_loc",e.target.value)}catch(x){}location.reload()};
}
const card=w=>`<article class="card wc"><img src="${avatar(w.hue)}" alt="Sample profile picture placeholder" width="72" height="72"><h3><a href="profile.html?id=${w.id}">${esc(w.name)}</a></h3><p><b>${esc(w.skill)}</b></p><p class="mut">📍 ${esc(w.area)}, ${esc(w.city)}<br>${w.exp} yrs experience · ${esc(w.langs)}<br>${esc(w.price)}</p><span class="tag">Demo Profile</span><span class="tag g">Not verified</span><p><a class="btn alt" href="profile.html?id=${w.id}">View profile</a></p></article>`;
function validate(f,rules){let ok=true;$$(".err",f).forEach(e=>e.remove());rules.forEach(([n,fn,msg])=>{const el=f.elements[n];if(!fn(el.value.trim())){ok=false;el.setAttribute("aria-invalid","true");el.insertAdjacentHTML("afterend",`<small class="err" role="alert">${msg}</small>`)}else el.removeAttribute("aria-invalid")});return ok}
function demoForm(id,rules){const f=$(id),ok=$(id+"-ok");f.addEventListener("submit",e=>{e.preventDefault();ok.hidden=true;if(validate(f,rules)){f.reset();ok.hidden=false;ok.focus()}})}
const phone=v=>/^[6-9]\d{9}$/.test(v),req=v=>v.length>1;
const inits={
 home(){
  $("#cats").innerHTML=CATS.map(c=>`<a class="card cat" href="workers.html?cat=${c[0]}"><i aria-hidden="true">${c[2]}</i>${c[1]}</a>`).join("");
  $("#featured").innerHTML=W.slice(0,6).map(card).join("");
  $("#faq").innerHTML=FAQ.map((f,i)=>`<div class="q"><button aria-expanded="false" aria-controls="a${i}">${f[0]}<span aria-hidden="true">+</span></button><p id="a${i}" hidden>${f[1]}</p></div>`).join("");
  $$("#faq button").forEach(b=>b.onclick=()=>{const p=$("#"+b.getAttribute("aria-controls")),o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",!o);p.hidden=o;b.lastChild.textContent=o?"+":"–"});
  $("#heroSearch").onsubmit=e=>{e.preventDefault();location.href="workers.html?q="+encodeURIComponent(e.target.q.value.trim())};
 },
 workers(){
  const u=new URLSearchParams(location.search),st={q:u.get("q")||"",cat:u.get("cat")||"all",area:"",sort:"rel"},loc=getLoc();
  const q=$("#q"),area=$("#area"),sort=$("#sort"),chips=$("#chips"),grid=$("#grid");
  q.value=st.q;area.innerHTML='<option value="">All localities</option>'+[...new Set(W.map(w=>w.area))].sort().map(a=>`<option>${a}</option>`).join("");
  chips.innerHTML=[["all","All"],...CATS].map(c=>`<button class="chip" data-c="${c[0]}" aria-pressed="${c[0]===st.cat}">${c[1]}</button>`).join("");
  if(location.hash==="#q")q.focus();
  function draw(){
   const t=st.q.toLowerCase();
   let r=W.filter(w=>w.city===loc&&(st.cat==="all"||w.cat===st.cat)&&(!st.area||w.area===st.area)&&(!t||[w.name,w.skill,w.area,catName(w.cat)].join(" ").toLowerCase().includes(t)));
   if(st.sort==="name")r.sort((a,b)=>a.name.localeCompare(b.name));
   $("#count").textContent=`${r.length} demo profile${r.length===1?"":"s"} in ${loc}`;
   grid.innerHTML=r.length?r.map(card).join(""):`<div class="empty card"><h3>No demo profiles found</h3><p class="mut">${loc==="Jhalawar"?"Try a different service or locality.":"Demo data exists only for Jhalawar."}</p><button class="btn" id="reset">Clear filters</button></div>`;
   const rs=$("#reset");if(rs)rs.onclick=()=>{st.q="";st.cat="all";st.area="";q.value="";area.value="";$$(".chip",chips).forEach(c=>c.setAttribute("aria-pressed",c.dataset.c==="all"));draw()};
  }
  q.oninput=e=>{st.q=e.target.value;draw()};area.onchange=e=>{st.area=e.target.value;draw()};sort.onchange=e=>{st.sort=e.target.value;draw()};
  chips.onclick=e=>{const b=e.target.closest(".chip");if(!b)return;st.cat=b.dataset.c;$$(".chip",chips).forEach(c=>c.setAttribute("aria-pressed",c===b));draw()};
  grid.innerHTML='<p class="mut" role="status">Loading…</p>';setTimeout(draw,200);
 },
 profile(){
  const w=W[+new URLSearchParams(location.search).get("id")],el=$("#profile");
  if(!w){el.innerHTML='<div class="card empty"><h2>Profile not found</h2><a class="btn" href="workers.html">Browse workers</a></div>';return}
  document.title=w.name+" (Demo) – HunarSetu";
  el.innerHTML=`<div class="notice" role="note"><b>Demo profile — identity and credentials have not been verified.</b></div><div class="prof" style="margin:22px 0"><img src="${avatar(w.hue)}" alt="Sample profile picture placeholder"><div><h1 style="margin:0">${esc(w.name)}</h1><p style="margin:.2em 0"><b>${esc(w.skill)}</b> · ${catName(w.cat)}</p><span class="tag">Demo Profile</span></div></div>
  <div class="split"><div class="card"><h2>About</h2><p>${esc(w.about)}</p><p class="mut">📍 ${esc(w.area)}, ${w.city}<br>${w.exp} years experience<br>Languages: ${esc(w.langs)}<br>Indicative price: ${esc(w.price)}</p></div>
  <div class="card"><h2>Get in touch</h2><p class="mut">Placeholders only. Nothing is sent.</p><p><button class="btn ph">Call (demo)</button> <button class="btn alt ph">Request service (demo)</button></p></div></div>
  <h2 style="margin-top:28px">Work gallery (sample images)</h2><div class="gal">${[1,2,3].map(n=>`<img src="${work((w.hue+n*25)%360,n)}" alt="Sample work photo placeholder ${n}">`).join("")}</div>`;
  $$(".ph").forEach(b=>b.onclick=()=>toast("Demo only — contact is not enabled yet."));
 },
 join(){
  $("#skill").innerHTML='<option value="">Choose a skill</option>'+CATS.map(c=>`<option>${c[1]}</option>`).join("");
  demoForm("#jf",[["name",req,"Enter your full name."],["skill",v=>v,"Choose a skill."],["area",req,"Enter your locality."],["exp",v=>v!==""&&+v>=0&&+v<=60,"Enter years between 0 and 60."],["phone",phone,"Enter a valid 10-digit mobile number."],["desc",v=>v.length>=20,"Write at least 20 characters."]]);
 },
 contact(){demoForm("#cf",[["name",req,"Enter your name."],["contact",v=>/^\S+@\S+\.\S+$/.test(v)||phone(v),"Enter a valid email or 10-digit mobile number."],["subject",req,"Enter a subject."],["msg",v=>v.length>=10,"Write at least 10 characters."]])}
};
layout();if(inits[P])inits[P]();
