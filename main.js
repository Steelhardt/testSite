import "./style.css";

import * as THREE from "three";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene(); //scene = container

//FOV, Aspect Ratio, View Frustrum (determines what objects are visible relative to camera)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); //full screen canvas
camera.position.setZ(30); //moved camera along z for better perspective
camera.position.setX(-3);

renderer.render(scene, camera); //scene/render = draw

const geometry = new THREE.TorusGeometry(10, 3, 16, 100); // xyz that defines shape (torus = ring)
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
  wireframe: false,
}); //can make custom shaders with webgl OR use built in shaders
const torus = new THREE.Mesh(geometry, material);
//create mesh combine geometry with material
scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// //HELPERS
// const lightHelper = new THREE.PointLightHelper(pointLight); //Helps show where the light is
// const gridHelper = new THREE.GridHelper(200, 50); //draws 2d grid along scene
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement); //listen to dom events update cam position accordingly

//CREATE STAR FUNCTION
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100)); //random gen location

  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar); //for determining how many stars we want

//SET BG TEXTURE
const spaceTexture = new THREE.TextureLoader().load("/space.jpg");
scene.background = spaceTexture; //set bg for scene

//LOAD TEXTURE AND PUT IN CUBE
const crunklyTexture = new THREE.TextureLoader().load("/crunkly.png");
const crunkly = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({map: crunklyTexture})
);

scene.add(crunkly);
crunkly.position.z = -5;
crunkly.position.x = 2;

//CREATE MOON
const moonTexture = new THREE.TextureLoader().load("/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("/normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10);

//SCROLL CAMERA FUNCTION
function moveCamera() {
  //gives us dimension of viewport and top shows how far we are from top of site
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  crunkly.rotation.y += 0.01;
  crunkly.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

//ANIMATION FUNCTION
function animate() {
  //function to re-render scene
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.x += 0.01;

  moon.rotation.x += 0.05;

  //controls.update; //makes control update with mouse stuff
  renderer.render(scene, camera);
}
animate();
