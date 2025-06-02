/* ── ① IntersectionObserver: 스크롤 페이드-인 ───────────────────────── */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);}
  });
},{threshold:0.15});
document.querySelectorAll('.fade-in').forEach(el=>io.observe(el));

/* ── ② 필터 버튼 로직 ───────────────────────────────────────────────── */
const cards   = document.querySelectorAll('.proj-card');
const buttons = document.querySelectorAll('#filterBtns button');

buttons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    // 버튼 UI
    buttons.forEach(b=>b.classList.remove('filter-active'));
    btn.classList.add('filter-active');
    // 카드 필터
    const f = btn.dataset.filter;
    cards.forEach(c=>{
      c.style.display = (f==='all'||c.dataset.category===f) ? '' : 'none';
    });
  });
});

/* ── ③ 라이트박스 ──────────────────────────────────────────────────── */
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');

cards.forEach(c=>{
  c.querySelector('img').addEventListener('click', e=>{
    lbImg.src = e.target.src;
    lb.classList.remove('hidden');
  });
});
lbClose.addEventListener('click', ()=>lb.classList.add('hidden'));
lb.addEventListener('click', e=>{
  if(e.target===lb) lb.classList.add('hidden');
});
