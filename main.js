import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(15);
renderer.render(scene, camera);

const moonTexture = new THREE.TextureLoader().load("./moon.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(6, 64, 64),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);
moon.position.set(0, 0, 0);
scene.add(moon);

const moonNormalMap = new THREE.TextureLoader().load("./moon_normals.png");

moon.material = new THREE.MeshStandardMaterial({
  map: moonTexture,
  normalMap: moonNormalMap,
});
moon.material.normalScale.set(1, 1);
camera.position.set(0, -10, 15);
camera.lookAt(moon.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(15, 15, -15);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);

const spotlight = new THREE.SpotLight(0xff0000, 0.5, 100, Math.PI / 4, 1);
spotlight.position.set(10, 15, -10);
spotlight.target.position.copy(moon.position);
scene.add(spotlight);
scene.add(spotlight.target);

const spotlightHelper = new THREE.SpotLightHelper(spotlight);

moon.material.shadowSide = THREE.DoubleSide;
moon.material.needsUpdate = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function createStarryBackground() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });

  const starsCount = 10000;
  const stars = new THREE.Points(starsGeometry, starsMaterial);

  const positions = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 1000;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  stars.rotation.x = Math.random() * 6;
  stars.rotation.y = Math.random() * 6;
  stars.rotation.z = Math.random() * 6;

  scene.add(stars);
}

createStarryBackground();

const gridHelper = new THREE.GridHelper(20, 20);

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

function getScrollProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  return scrollTop / scrollHeight;
}

function updateCameraPosition() {
  const progress = getScrollProgress();
  const angle = progress * 2 * Math.PI;
  const radius = 10;
  const targetZ = moon.position.z + radius * Math.sin(angle);
  const targetX = moon.position.x + radius * Math.cos(angle);

  gsap.to(camera.position, {
    x: targetX,
    z: targetZ - angle,
    duration: 1,
    ease: "power1.inOut",
  });
}

window.addEventListener("scroll", () => {
  updateCameraPosition();
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  moon.rotation.z += 0.0005;
  moon.rotation.y += 0.001;

  scene.children.forEach((child) => {
    if (child instanceof THREE.Points) {
      child.rotation.x += 0.0001;
      child.rotation.y += 0.0001;
    }
  });

  renderer.render(scene, camera);
}

animate();

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "+=100%",
    scrub: true,
  },
  delay: 8,
});
const fontFamilies = [
  "Space Mono, monospace",
  "Arial, sans-serif",
  "Georgia, serif",
  "Courier New, monospace",
];

function cycleFonts(target, index) {
  gsap.to(target, {
    fontFamily: fontFamilies[index],
    duration: 0.5,
    ease: "power1.inOut",
    onComplete: function () {
      const nextIndex = (index + 1) % fontFamilies.length;
      cycleFonts(target, nextIndex);
    },
  });
}

cycleFonts("#loader p", 0);

// Your existing loaderTimeline code
const loaderTimeline = gsap.timeline();
loaderTimeline.to("#loader p", {
  opacity: 0,
  duration: 1,
  delay: 3,
});

loaderTimeline.to("#loader", {
  opacity: 0,
  duration: 1,
  ease: "power1.inOut",
});

loaderTimeline.to("#loader", {
  display: "none",
  duration: 1,
  ease: "power1.inOut",
});

var tl2 = gsap.timeline();

tl2.from(".navbar", {
  y: -300,
  duration: 1,
  ease: "power1.inOut",
  delay: 4,
});

tl2.from(
  ".hero .text",
  {
    x: -750,
    duration: 1,
    delay: 1,
    ease: "power1.inOut",
  },
  "heroAnimation"
);

tl2.from(
  ".hero .vertical-text",
  {
    x: 750,
    duration: 1,
    delay: 1,
    ease: "power1.inOut",
  },
  "heroAnimation"
);

gsap.utils.toArray(".skills-section").forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top center",
      toggleActions: "play none none reverse",
    },
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const scrollIndicator = document.getElementById("scrollIndicator");

  const totalScrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  gsap.to(scrollIndicator, {
    height: "100%",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      ease: "linear",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const scrollPercentage = self.progress * 100;
        scrollIndicator.style.height = `${scrollPercentage}%`;
      },
    },
  });
});
