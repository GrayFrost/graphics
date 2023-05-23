import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

let container;

let camera, cameraTarget, scene, renderer;

let group, textMesh1, textMesh2, textGeo, materials;

let text = "hello world";

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);
  // CAMERA

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1500
  );
  
  camera.position.set(0, 0, 700);

  cameraTarget = new THREE.Vector3(0, 0, 0);

  // SCENE

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 250, 1400);

  // LIGHTS

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
  dirLight.position.set(0, 0, 1).normalize();
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.color.setHSL(Math.random(), 1, 0.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);

  loadFont();

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10000, 10000),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true,
    })
  );
  plane.position.y = 100;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
}

function loadFont() {
  const loader = new FontLoader();
  loader.load("./assets/fonts/gentilis_regular.typeface.json", function (font) {
    const textGeometry = new TextGeometry("hell0 webgl font", {
      font, // 字体
      size: 30, // 字体大小
      height: 20, // 文本厚度
      curveSegments: 4,
      bevelEnabled: true /* 是否开启斜角 */,
      bevelThickness: 0.5 /* 斜角深度 */,
      bevelSize: 1.5 /* 斜角与原始文本轮廓之间的延伸距离 */,
      bevelSegments: 2 /* 斜角的分段数 (3降低优化性能) */,
      bevelOffset: 0 /* 斜角偏移 */,
    });
    textGeometry.computeBoundingBox();

    const textMaterial = new THREE.MeshBasicMaterial();
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
  });
}

var x = 0;
var flag = 1;
function animate() {
  requestAnimationFrame(animate);

  render();
}


function render() {
  camera.lookAt(cameraTarget);

  renderer.clear();
  if (x <= 0) {
    flag = 1;
  } else if (x >= 200) {
    flag = -1;
  }
  x = x + 5 * flag;
  
  camera.position.x = x;
  renderer.render(scene, camera);
}
