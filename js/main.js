/*───────────────── Boot Sequence ─────────────────*/
const boot   = document.getElementById('boot');
const bootTxt= document.getElementById('bootTxt');
gsap.to(bootTxt,{
  duration:2,
  text:{value:'SYSTEM POWER ON...',delimiter:''},
  onComplete:()=>{
    gsap.to(boot,{opacity:0,duration:1,onComplete:()=>boot.remove()});
    gsap.to(window,{scrollTo:'#skills',duration:1,ease:'power2.inOut',delay:.1});
  }
});

/*───────────────── 고정 네비 스크롤 오프셋 ───────*/
/* (ScrollToPlugin은 네비 높이를 자동 반영하지 못함 → offsetY) */
gsap.utils.toArray('.nav-link').forEach(a=>{
  a.addEventListener('click',e=>{
    if(a.hash){
      e.preventDefault();
      gsap.to(window,{scrollTo:{y:a.hash,offsetY:80},duration:1});
    }
  });
});

/*───────────────── 우주선 커서 ───────────────────*/
const cur=document.getElementById('cursor'), ship=cur.querySelector('.ship');
let pX=0,pY=0;
addEventListener('pointermove',e=>{
  const {clientX:x,clientY:y}=e;
  cur.style.transform=`translate(${x-25}px,${y-25}px)`;
  const angle=Math.atan2(y-pY,x-pX)*180/Math.PI+90; // 90°=위
  ship.style.transform=`rotate(${angle}deg)`;
  pX=x;pY=y;
});

/*───────────────── 스타필드 배경 ─────────────────*/
const cv=document.getElementById('bg'),ctx=cv.getContext('2d');
let W,H,stars=[],mx=0,my=0;
function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;}
addEventListener('resize',resize);resize();
for(let i=0;i<400;i++){stars.push({x:Math.random()*W,y:Math.random()*H,z:Math.random()*W})}
addEventListener('pointermove',e=>{mx=(e.clientX/W-.5)*10;my=(e.clientY/H-.5)*10});
function loop(){
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(0,191,255,.8)';
  stars.forEach(s=>{
    s.z-=2;if(s.z<=0)s.z=W;
    const k=128/s.z,px=(s.x-W/2)*k+W/2+mx,py=(s.y-H/2)*k+H/2+my;
    if(px>0&&px<W&&py>0&&py<H){
      const size=(1-s.z/W)*2;ctx.fillRect(px,py,size,size);
    }
  });
  requestAnimationFrame(loop);
}loop();

/*───────────────── 페이드 인 ─────────────────────*/
gsap.utils.toArray('.fade').forEach(el=>{
  gsap.fromTo(el,{opacity:0,y:40},{opacity:1,y:0,duration:.6,
    ease:'power2.out',scrollTrigger:{trigger:el,start:'top 95%',once:true}});
});

/*───────────────── 글리치 텍스트 ────────────────*/
gsap.registerPlugin(TextPlugin);
gsap.to('#glitch',{duration:6,repeat:-1,ease:'none',
  text:{value:'CREATING ▄█▌ BRIDGES_ ▒▒'}});

/*───────────────── Skill 링 ─────────────────────*/
document.querySelectorAll('.skill').forEach((s,i,arr)=>{
  const pct=+s.dataset.percent,label=s.dataset.label,total=377,
        off=total*(1-pct/100);
  s.innerHTML=`<svg viewBox="0 0 140 140">
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0"  stop-color="var(--ring-glow)"/>
        <stop offset="1"  stop-color="#0ff"/>
      </linearGradient>
    </defs>
    <circle cx="70" cy="70" r="60" stroke="#333" stroke-width="12" fill="none"/>
    <circle class="ring" cx="70" cy="70" r="60" stroke="url(#grad)" stroke-width="12"
            fill="none" stroke-linecap="round"
            stroke-dasharray="377" stroke-dashoffset="377"/>
  </svg><span>${label}</span>`;
  const ring=s.querySelector('.ring');
  gsap.fromTo(ring,{strokeDashoffset:total},{strokeDashoffset:off,duration:1.2,
    scrollTrigger:{trigger:s,start:'top 80%',once:true},
    onComplete:()=>{if(i===arr.length-1)
      gsap.to(window,{scrollTo:{y:'#projects',offsetY:80},duration:1});}});
});

/*───────────────── 라이트박스 & 전환 ─────────────*/
const lb=document.getElementById('lightbox'),lbImg=document.getElementById('lbImg');
document.querySelectorAll('.proj-card img').forEach(img=>{
  img.onclick=()=>{lbImg.src=img.src;lb.classList.add('open');};
});
function closeLB(){
  lb.classList.remove('open');
  gsap.to(window,{scrollTo:{y:'#roadmap',offsetY:80},duration:1});
}
lb.onclick=e=>{if(e.target===lb||e.target.id==='lbClose')closeLB();};

/*───────────────── Roadmap → Contact ───────────*/
document.querySelectorAll('.road').at(-1)
  .addEventListener('click',()=>gsap.to(window,{scrollTo:{y:'#contact',offsetY:80},duration:1}));

/*───────────────── EmailJS (키 교체 필요) ─────*/
emailjs.init('YOUR_PUBLIC_KEY');
contactForm.onsubmit=e=>{
  e.preventDefault();
  emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',{
    from_name:contactForm.name.value,
    reply_to:contactForm.email.value,
    message  :contactForm.msg.value
  }).then(()=>alert('Sent ✔'));
};

/*───────────────── Konami Code ────────────────*/
const seq='38384040373937396665',buf=[];
addEventListener('keydown',e=>{
  buf.push(e.keyCode);buf.splice(0,buf.length-10);
  if(buf.join('')===seq){alert('🕹️ 1-UP!')}});
