// js/sphere.js  —  구 색상을 밝은 ‘RED’(#FF4444) 로 변경한 최종 버전
import * as THREE        from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('sphereCanvas');
const scene  = new THREE.Scene();

/* ── 카메라 & 렌더러 ── */
const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
cam.position.z = 2.4;
const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
function resize() {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  cam.aspect = canvas.clientWidth / canvas.clientHeight;
  cam.updateProjectionMatrix();
}
resize();  window.addEventListener('resize', resize);

/* ── 파티클 구 (단색 Red) ── */
const COUNT = 6000, R = 1.2;
const pos = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
  const u = Math.random(), v = Math.random();
  const θ = 2 * Math.PI * u, φ = Math.acos(2*v - 1);
  const x = R * Math.sin(φ) * Math.cos(θ);
  const y = R * Math.sin(φ) * Math.sin(θ);
  const z = R * Math.cos(φ);
  pos.set([x, y, z], i * 3);
}
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

const mat = new THREE.PointsMaterial({
  size: 0.12,
  color: 0xff4444,              // ★ 밝은 레드 (#FF4444)
  vertexColors: false,
  depthWrite: true,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: false
});
const spherePts = new THREE.Points(geo, mat);
scene.add(spherePts);

/* ── 기울어진 링 (시안 유지) ── */
const RING_N = 2500, ringPos = new Float32Array(RING_N * 3);
for (let i = 0; i < RING_N; i++) {
  const a = 2 * Math.PI * i / RING_N, r = 2;
  ringPos.set([r * Math.cos(a), (Math.random()-.5)*0.05, r * Math.sin(a)], i*3);
}
const ringGeo = new THREE.BufferGeometry();
ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
const ringMat = new THREE.PointsMaterial({
  size: 0.03,
  color: 0x00e5ff,
  transparent: true,
  opacity: 0.6,
  depthWrite: false,
  depthTest:  true
});
const ring = new THREE.Points(ringGeo, ringMat);
ring.rotation.x = Math.PI / 3;
scene.add(ring);

/* ── 컨트롤 + 애니메이션 ── */
const ctrl = new OrbitControls(cam, renderer.domElement);
ctrl.enablePan = false; ctrl.enableZoom = false; ctrl.autoRotate = true; ctrl.autoRotateSpeed = 0.6;

(function animate() {
  requestAnimationFrame(animate);
  spherePts.rotation.y += 0.003;
  ring.rotation.y      += 0.002;
  ctrl.update();
  renderer.render(scene, cam);
})();
