// js/main.js
/* Boot Sequence */
const boot=document.getElementById('boot'), bootTxt=document.getElementById('bootTxt');
gsap.to(bootTxt,{duration:2,text:{value:'SYSTEM POWER ON...',delimiter:''},
  onComplete:()=>{gsap.to(boot,{opacity:0,duration:1,onComplete:()=>boot.remove()});
                 gsap.to(window,{scrollTo:{y:'#hero',offsetY:80},duration:1});}});

/* 네비 스크롤 */
document.querySelectorAll('.nav-link').forEach(a=>{
  a.addEventListener('click',e=>{
    if(a.hash){e.preventDefault();
      gsap.to(window,{scrollTo:{y:a.hash,offsetY:80},duration:1});}
  });
});

/* 우주선 커서 */
const cursor=document.getElementById('cursor'), wrap=cursor.querySelector('.ship-container'),
      flames=[...wrap.querySelectorAll('.flame')];
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,deg=0;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});
(function loop(){
  cx+=(mx-cx)*.08; cy+=(my-cy)*.08;
  cursor.style.transform=`translate(${cx-25}px,${cy-25}px)`;
  const dx=mx-cx,dy=my-cy,ang=Math.atan2(dy,dx)*180/Math.PI+90;
  deg+=(ang-deg)*.15; wrap.style.transform=`rotate(${deg}deg)`;
  const spd=Math.hypot(dx,dy),sc=Math.min(2.2,.9+spd*.018),op=Math.min(1,.35+spd*.005);
  flames.forEach(f=>{f.style.transform=`translateX(-50%) scaleY(${sc})`;f.style.opacity=op;});
  requestAnimationFrame(loop);
})();

/* 스타필드 */
const bg=document.getElementById('bg'),ctx=bg.getContext('2d');let W,H;
function resize(){W=bg.width=innerWidth;H=bg.height=innerHeight;}resize();onresize=resize;
const stars=Array.from({length:400},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random()*W}));
let pmx=0,pmy=0;addEventListener('pointermove',e=>{pmx=(e.clientX/W-.5)*10;pmy=(e.clientY/H-.5)*10;});
(function starLoop(){
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(0,191,255,.8)';
  stars.forEach(s=>{
    s.z-=2;if(s.z<=0)s.z=W;
    const k=128/s.z,px=(s.x-W/2)*k+W/2+pmx,py=(s.y-H/2)*k+H/2+pmy;
    if(px>0&&px<W&&py>0&&py<H){const sz=(1-s.z/W)*2;ctx.fillRect(px,py,sz,sz);}
  });
  requestAnimationFrame(starLoop);
})();

/* 섹션 페이드 */
gsap.utils.toArray('.fade').forEach(el=>{
  gsap.fromTo(el,{opacity:0,y:30},{opacity:1,y:0,duration:.8,ease:'power2.out',
    scrollTrigger:{trigger:el,start:'top 80%',once:true}});
});

/* Projects Lightbox */
const lb=document.getElementById('lightbox'),lbImg=document.getElementById('lbImg');
document.querySelectorAll('.proj-card img').forEach(img=>{
  img.onclick=()=>{lbImg.src=img.src;lb.classList.add('open');};
});
lb.onclick=e=>{if(e.target===lb||e.target.id==='lbClose')lb.classList.remove('open');};

/* Roadmap → Footer */
const roads=document.querySelectorAll('.road');
if(roads.length){
  roads[roads.length-1].addEventListener('click',()=>{
    gsap.to(window,{scrollTo:{y:'#footer',offsetY:80},duration:1});
  });
}
