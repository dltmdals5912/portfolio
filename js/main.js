// js/main.js

/*──── Boot Sequence ────*/
const boot   = document.getElementById('boot'),
      bootTxt= document.getElementById('bootTxt');
gsap.to(bootTxt, {
  duration: 2,
  text: { value: 'SYSTEM POWER ON...', delimiter: '' },
  onComplete: () => {
    gsap.to(boot, { opacity: 0, duration: 1, onComplete: () => boot.remove() });
    gsap.to(window, { scrollTo: { y: '#hero', offsetY: 80 }, duration: 1 });
  }
});

/*──── 네비 offset 스크롤 ────*/
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', e => {
    if (a.hash) {
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: a.hash, offsetY: 80 }, duration: 1 });
    }
  });
});

/*──── 우주선 커서 + 네온 부스터 ────*/
const cursor = document.getElementById('cursor'),
      wrapper= cursor.querySelector('.ship-container'),
      ship   = wrapper.querySelector('.ship'),
      flames = Array.from(wrapper.querySelectorAll('.flame'));

let mouseX = innerWidth / 2,
    mouseY = innerHeight / 2,
    curX   = mouseX,
    curY   = mouseY,
    degPrev= 0;

addEventListener('pointermove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function renderCursor() {
  // 부드러운 보간 (약 0.08)으로 0.5초 정도 늦게 따라오게
  curX += (mouseX - curX) * 0.08;
  curY += (mouseY - curY) * 0.08;
  cursor.style.transform = `translate(${curX - 25}px, ${curY - 25}px)`;

  // 회전 각도 계산 (90° = 위쪽 기준)
  const dx = mouseX - curX,
        dy = mouseY - curY,
        deg = Math.atan2(dy, dx) * 180 / Math.PI + 90;
  degPrev += (deg - degPrev) * 0.15; // 부드럽게 보간해서 틀어짐 최소화
  wrapper.style.transform = `rotate(${degPrev}deg)`;

  // 속도에 따라 불꽃 길이·투명도 조절
  const speed = Math.hypot(dx, dy),
        scale = Math.min(2.2, 0.9 + speed * 0.018),
        opacity = Math.min(1, 0.35 + speed * 0.005);

  flames.forEach(flame => {
    flame.style.transform = `translateX(-50%) scaleY(${scale})`;
    flame.style.opacity   = opacity;
  });

  requestAnimationFrame(renderCursor);
}
renderCursor();

/*──── 스타필드 배경 ────*/
const cv = document.getElementById('bg'),
      ctx= cv.getContext('2d');
let W, H, stars = [];
function resize() {
  W = cv.width = innerWidth;
  H = cv.height = innerHeight;
}
resize();
window.onresize = resize;
for (let i = 0; i < 400; i++) {
  stars.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * W });
}
let pmx = 0, pmy = 0;
addEventListener('pointermove', e => {
  pmx = (e.clientX / W - .5) * 10;
  pmy = (e.clientY / H - .5) * 10;
});
(function loop() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0,191,255,.8)';
  stars.forEach(s => {
    s.z -= 2;
    if (s.z <= 0) s.z = W;
    const k = 128 / s.z,
          px= (s.x - W / 2) * k + W / 2 + pmx,
          py= (s.y - H / 2) * k + H / 2 + pmy;
    if (px > 0 && px < W && py > 0 && py < H) {
      const sz = (1 - s.z / W) * 2;
      ctx.fillRect(px, py, sz, sz);
    }
  });
  requestAnimationFrame(loop);
})();

/*──── 섹션 페이드 인/아웃 ────*/
gsap.utils.toArray('.fade').forEach(el => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: .8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true }
    }
  );
});

/*──── 글리치 텍스트 ────*/
gsap.registerPlugin(TextPlugin);
gsap.to('#glitch', {
  duration: 6,
  repeat: -1,
  ease: 'none',
  text: { value: 'EXPLORING THE COSMOS_' }
});

/*──── Skill 링 ────*/
document.querySelectorAll('.skill').forEach((s, i, arr) => {
  const pct   = +s.dataset.percent,
        label = s.dataset.label,
        total = 377,
        off   = total * (1 - pct / 100);
  s.innerHTML = `
    <svg viewBox="0 0 140 140">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="var(--ring-glow)"/>
          <stop offset="1" stop-color="#0ff"/>
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r="60" stroke="#333" stroke-width="12" fill="none"/>
      <circle class="ring" cx="70" cy="70" r="60" stroke="url(#grad)" stroke-width="12"
              fill="none" stroke-linecap="round"
              stroke-dasharray="377" stroke-dashoffset="377"/>
    </svg>
    <span>${label}</span>`;
  const ring = s.querySelector('.ring');
  gsap.fromTo(
    ring,
    { strokeDashoffset: total },
    {
      strokeDashoffset: off,
      duration: 1.2,
      scrollTrigger: { trigger: s, start: 'top 80%', once: true },
      onComplete: () => {
        if (i === arr.length - 1) {
          gsap.to(window, { scrollTo: { y: '#projects', offsetY: 80 }, duration: 1 });
        }
      }
    }
  );
});

/*──── 프로젝트 라이트박스 ────*/
const lb    = document.getElementById('lightbox'),
      lbImg = document.getElementById('lbImg');
document.querySelectorAll('.proj-card img').forEach(img => {
  img.onclick = () => {
    lbImg.src = img.src;
    lb.classList.add('open');
  };
});
const closeLB = () => {
  lb.classList.remove('open');
  gsap.to(window, { scrollTo: { y: '#roadmap', offsetY: 80 }, duration: 1 });
};
lb.onclick = e => {
  if (e.target === lb || e.target.id === 'lbClose') closeLB();
};

/*──── 로드맵 → 푸터 스크롤 ────*/
document.querySelectorAll('.road').at(-1).addEventListener('click', () => {
  gsap.to(window, { scrollTo: { y: '#footer', offsetY: 80 }, duration: 1 });
});
