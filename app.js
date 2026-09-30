import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import*as A from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import*as F from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import{firebaseConfig}from"./firebase-config.js";
export const app=initializeApp(firebaseConfig),auth=A.getAuth(app),db=F.getFirestore(app);
export{A,F};
const T={hi:{home:"होम",services:"सेवाएँ",workers:"कामगार खोजें",login:"लॉगिन",start:"शुरू करें",logout:"लॉगआउट",dash:"डैशबोर्ड"},
en:{home:"Home",services:"Services",workers:"Find Workers",login:"Login",start:"Get Started",logout:"Logout",dash:"Dashboard"}};
export let lang=localStorage.getItem("lang")||"hi";
export const t=k=>T[lang][k]||k;
export const inr=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
export function toast(m){let e=document.getElementById("toast");if(!e){e=document.createElement("div");e.id="toast";e.setAttribute("role","status");document.body.append(e)}e.textContent=m;e.style.display="block";setTimeout(()=>e.style.display="none",3500)}
export async function getRole(u){const s=await F.getDoc(F.doc(db,"users",u.uid));const tok=await u.getIdTokenResult();return tok.claims.admin?"admin":(s.exists()?s.data().role:null)}
export const home=r=>({admin:"/admin/dashboard.html",worker:"/worker/dashboard.html",customer:"/customer/dashboard.html"}[r]||"/register.html");
export function renderChrome(){
 document.body.insertAdjacentHTML("afterbegin",`<header class="nav"><div class="wrap"><a class="logo" href="/">Hunar<b>Setu</b></a>
 <a href="/">${t("home")}</a><a href="/services.html">${t("services")}</a><a href="/workers.html">${t("workers")}</a>
 <select id="lg" aria-label="Language" style="width:auto"><option value="hi">हिंदी</option><option value="en">English</option></select>
 <span id="au"></span></div></header>`);
 document.body.insertAdjacentHTML("beforeend",`<footer><div class="wrap">HunarSetu — Local Skills. Local Work. Local Growth.<br>
 <a href="/privacy-policy.html">Privacy</a> · <a href="/terms.html">Terms</a> · <a href="/cancellation-refund-policy.html">Cancellation &amp; Refunds</a></div></footer>`);
 const l=document.getElementById("lg");l.value=lang;l.onchange=()=>{localStorage.setItem("lang",l.value);location.reload()};
 A.onAuthStateChanged(auth,async u=>{const el=document.getElementById("au");
  if(!u){el.innerHTML=`<a href="/login.html">${t("login")}</a> <a class="btn gold" href="/register.html">${t("start")}</a>`;return}
  const r=await getRole(u);el.innerHTML=`<a href="${home(r)}">${t("dash")}</a> <a href="#" id="lo">${t("logout")}</a>`;
  document.getElementById("lo").onclick=async e=>{e.preventDefault();await A.signOut(auth);location.href="/"}})}
// Guard for dashboards: pass the role the page needs. Real enforcement is in firestore.rules.
export function guard(need){A.onAuthStateChanged(auth,async u=>{if(!u)return location.href="/login.html";const r=await getRole(u);if(r!==need)location.href=home(r)})}
