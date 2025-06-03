// js/planet.js

document.addEventListener('DOMContentLoaded', () => {
  const planet     = document.getElementById('planet');
  const container  = document.getElementById('planet-container');
  let isRotating   = false; // 클릭 시 계속 회전 중인지 여부

  /*───────────────────────────────────────────────
    마우스가 행성 영역 안에서 움직일 때마다
    행성을 기울여서 입체감 연출
  ───────────────────────────────────────────────*/
  container.addEventListener('mousemove', (e) => {
    const rect  = container.getBoundingClientRect();
    const xPos  = e.clientX - rect.left; // 컨테이너 내부 X 좌표
    const yPos  = e.clientY - rect.top;  // 컨테이너 내부 Y 좌표
    const percentX = (xPos / rect.width  - 0.5) * 2; // -1 ~ +1
    const percentY = (yPos / rect.height - 0.5) * 2; // -1 ~ +1

    const rotateY = percentX * 15;  // Y축 회전 (좌우 기울기)
    const rotateX = -percentY * 15; // X축 회전 (상하 기울기)

    // 계속 회전 애니메이션 중이면 mousemove 시 회전값 무시
    if (!isRotating) {
      planet.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });

  /*───────────────────────────────────────────────
    컨테이너에서 마우스가 벗어나면 기울기 리셋
  ───────────────────────────────────────────────*/
  container.addEventListener('mouseleave', () => {
    if (!isRotating) {
      planet.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  });

  /*───────────────────────────────────────────────
    클릭하면 토글: 계속 회전 애니메이션 on/off
  ───────────────────────────────────────────────*/
  planet.addEventListener('click', () => {
    isRotating = !isRotating;
    if (isRotating) {
      planet.classList.add('rotating');
      planet.style.transform = `rotateX(0deg) rotateY(0deg)`;
    } else {
      planet.classList.remove('rotating');
      planet.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  });
});
