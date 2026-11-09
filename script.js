"use strict";
/* ===== EDIT HERE: photos (files live in /images). The hero photo (mi-11.webp) is set in index.html.
   Order is already shuffled and has no dates. Set SHUFFLE_EVERY_LOAD = true to reshuffle on each visit. ===== */
const SIZES={"1":[1080,1080],"2":[1080,1440],"3":[1080,1440],"4":[1080,1080],"5":[1080,1080],"6":[1080,1080],"7":[1080,1080],"8":[1080,1080],"9":[1080,1080],"10":[1080,1080],"11":[1080,1080],"12":[1080,1080],"13":[1080,1080],"14":[1080,1080]};
const ORDER=[6,1,13,4,9,2,12,7,3,14,5,8,10];
const SHUFFLE_EVERY_LOAD=false;
/* Captions: edit freely */
const CAPTIONS=["A moment worth keeping.","Quietly becoming.","A little warmth in a passing moment.","Simply, unmistakably her.","Some moments speak without words.","The art of being oneself.","A frame full of quiet magic.","Soft light, steady heart.","Peace, in a single frame.","Just as she is.","A quiet kind of glow.","Warmth, caught in a frame.","Calm looks good on her."];
const MUSIC_MISSING="The song isn't here yet. Add your file at music/the-older-i-get.mp3 and refresh.";
const $=s=>document.querySelector(s),reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const order=SHUFFLE_EVERY_LOAD?shuffle([...ORDER]):ORDER,caps=shuffle([...CAPTIONS]);
/* TIMELINE */
const tl=$("#timeline"),pat=["l","m","s","m","l","s"],shown=[];
order.forEach((n,i)=>{
 const [w,h]=SIZES[n],src=`images/mi-${String(n).padStart(2,"0")}.webp`,tall=h>w,sz=tall?"sz-m":"sz-"+pat[i%6];
 shown.push({src,cap:caps[i%caps.length]});
 const li=document.createElement("li");li.className=(i%2?"r":"l")+" reveal";
 const rot=[-1.6,1.2,-.8,1.8,-1.2][i%5];
 li.innerHTML=`<svg class="mk" viewBox="0 0 100 100" aria-hidden="true"><use href="#flower"/></svg><button class="ph ${sz}${i%3==1?" mat":""}" data-i="${i}" aria-label="Open photo ${i+1} of ${order.length}" style="${i%3==1?`transform:rotate(${rot}deg)`:""}"><img src="${src}" width="${w}" height="${h}" loading="lazy" decoding="async" alt="Mitchell, moment ${i+1}"></button><p class="cap">${caps[i%caps.length]}</p>`;
 tl.appendChild(li)});
/* SCROLL REVEAL */
const io="IntersectionObserver"in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15}):null;
document.querySelectorAll(".reveal").forEach(el=>io?io.observe(el):el.classList.add("in"));
/* PARALLAX (lighter on phones) */
const layers=[...document.querySelectorAll("[data-speed]")],hero=$("#top"),nav=$("#nav");let tick=false;
function frame(){tick=false;const y=scrollY,hh=hero.offsetHeight,mob=innerWidth<761;
 nav.classList.toggle("show",y>hh*.6);
 if(reduce||y>hh*1.2)return;
 layers.forEach(l=>{const s=+l.dataset.speed*(mob?.6:1);l.style.transform=`translate3d(0,${(y*s).toFixed(1)}px,0)`+(l.classList.contains("f3")?" rotate(-24deg)":"");
  if(l.classList.contains("hero-copy"))l.style.opacity=Math.max(0,1-y/(hh*.85))})}
addEventListener("scroll",()=>{if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});frame();
/* LIGHTBOX */
const lb=$("#lb"),lbImg=$("#lbImg"),lbCap=$("#lbCap");let cur=0,opener=null;
function show(i){cur=(i+shown.length)%shown.length;lbImg.src=shown[cur].src;lbImg.alt="Mitchell, moment "+(cur+1);lbCap.textContent=shown[cur].cap+"  ("+(cur+1)+" / "+shown.length+")"}
function openLb(i,el){opener=el;show(i);lb.hidden=false;document.body.style.overflow="hidden";$("#lbX").focus()}
function closeLb(){lb.hidden=true;document.body.style.overflow="";opener&&opener.focus()}
tl.addEventListener("click",e=>{const b=e.target.closest(".ph");if(b)openLb(+b.dataset.i,b)});
$("#lbX").onclick=closeLb;$("#lbP").onclick=()=>show(cur-1);$("#lbN").onclick=()=>show(cur+1);lb.addEventListener("click",e=>{if(e.target===lb)closeLb()});
addEventListener("keydown",e=>{if(lb.hidden)return;if(e.key==="Escape")closeLb();if(e.key==="ArrowLeft")show(cur-1);if(e.key==="ArrowRight")show(cur+1);
 if(e.key==="Tab"){const f=[...lb.querySelectorAll("button")],a=document.activeElement;if(e.shiftKey&&a===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&a===f[f.length-1]){e.preventDefault();f[0].focus()}}});
let tx=0;lb.addEventListener("touchstart",e=>tx=e.touches[0].clientX,{passive:true});lb.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))});
/* MUSIC PLAYER: never autoplays */
const au=$("#audio"),pb=$("#play"),sk=$("#seek"),msg=$("#audioMsg"),pl=$(".player");let broken=false;
const fmt=s=>isFinite(s)?Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0"):"0:00";
function problem(){broken=true;msg.textContent=MUSIC_MISSING;msg.hidden=false;pl.classList.remove("playing");pb.textContent="▶";pb.setAttribute("aria-label","Play")}
au.addEventListener("error",problem);
au.addEventListener("loadedmetadata",()=>{$("#dur").textContent=fmt(au.duration)});
au.addEventListener("timeupdate",()=>{$("#cur").textContent=fmt(au.currentTime);if(au.duration)sk.value=au.currentTime/au.duration*100});
au.addEventListener("ended",()=>{pl.classList.remove("playing");pb.textContent="▶";pb.setAttribute("aria-label","Play")});
sk.addEventListener("input",()=>{if(au.duration)au.currentTime=sk.value/100*au.duration});
pb.addEventListener("click",()=>{if(broken)return problem();
 if(au.paused){const p=au.play();p&&p.then(()=>{pl.classList.add("playing");pb.textContent="❚❚";pb.setAttribute("aria-label","Pause");msg.hidden=true}).catch(problem)}
 else{au.pause();pl.classList.remove("playing");pb.textContent="▶";pb.setAttribute("aria-label","Play")}});
/* CONFETTI (warm browns + petals) */
const cv=$("#confetti"),cx=cv.getContext("2d");
function burst(x,y){if(reduce)return;cv.width=innerWidth;cv.height=innerHeight;
 const cols=["#A47752","#D6C2A9","#F5EFE6","#A88B75","#604333"],ps=Array.from({length:110},()=>({x,y,vx:(Math.random()-.5)*11,vy:-Math.random()*11-3,s:4+Math.random()*6,c:cols[Math.random()*5|0],r:Math.random()*6,vr:(Math.random()-.5)*.3,o:Math.random()<.5}));let t=0;
 (function go(){cx.clearRect(0,0,cv.width,cv.height);ps.forEach(p=>{p.vy+=.22;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.globalAlpha=Math.max(0,1-t/160);p.o?(cx.beginPath(),cx.ellipse(0,0,p.s,p.s/2,0,0,7),cx.fill()):cx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);cx.restore()});
  if(++t<170)requestAnimationFrame(go);else cx.clearRect(0,0,cv.width,cv.height)})()}
/* SURPRISE 1: envelope */
const env=$("#env"),letter=$("#letter");
env.addEventListener("click",()=>{const o=env.getAttribute("aria-expanded")==="true";env.setAttribute("aria-expanded",!o);letter.classList.toggle("open",!o);
 if(!o){const r=env.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2);setTimeout(()=>letter.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"}),500)}});
/* SURPRISE 2: hidden note under the flower */
$("#bloom").addEventListener("click",e=>{const b=e.currentTarget,o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",!o);$("#secret").hidden=o});
