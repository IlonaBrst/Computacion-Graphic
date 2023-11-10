import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// Shape of the coaster
const shape = new THREE.Shape();

shape.moveTo(0, 0);
shape.lineTo(10, 0);
shape.lineTo(10, -10);
shape.bezierCurveTo(10,-10,25,-15,30,-25); // Ajustement des points de contrôle et d'arrivée
shape.bezierCurveTo(30,-25,35,-15,50,-10); // Ajustement des points de contrôle et d'arrivée
shape.lineTo(50, 0);
shape.lineTo(60, 0);
shape.lineTo(60, -10);
shape.bezierCurveTo(60,-10,45,-25,30,-35); // Ajustement des points de contrôle et d'arrivée
shape.bezierCurveTo(30,-35,15,-25,0,-10); // Ajustement des points de contrôle et d'arrivée
shape.lineTo(0, 0);



const extrudeSettings = {
  steps: 10,
  depth:10,
 
};

const coasterPathGeometry= new THREE.ExtrudeGeometry(shape, extrudeSettings);
const coasterMaterial = new THREE.MeshStandardMaterial({ color: "red"});
const coasterMesh = new THREE.Mesh(coasterPathGeometry, coasterMaterial);


// Enable shadows for the coaster mesh
coasterMesh.castShadow = true;
coasterMesh.receiveShadow = true;


// Number of points to approximate a circle
const circlePoints = 100;

/*
// Create points for a circle
const circlePathPoints = [];
for (let i = 0; i < circlePoints; i++) {
  const theta = (i / circlePoints) * Math.PI * 2;
  const x = Math.cos(theta) * 100; // Adjust the radius as needed
  const y = Math.sin(theta) * 100; // Adjust the radius as needed
  circlePathPoints.push(new THREE.Vector3(x, y, 0));
}
*/
// Create a Catmull-Rom curve for the circle
const circlePathPoints = new Array(circlePoints).fill().map((_, i) => {
    const radius = 100;
    const theta = (i / circlePoints) * Math.PI * 2;
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;
  
  
    return new THREE.Vector3(x, y, 0);
  });
  
  const circlePath = new THREE.CatmullRomCurve3(circlePathPoints, true); // Set closed to false
  
// Add coaster sections along the circle path
for (let i = 0; i < circlePoints; i++) {
    const point = circlePath.getPointAt(i / circlePoints);
    const tangent = circlePath.getTangentAt(i / circlePoints);
  
    const meshClone = coasterMesh.clone();
    meshClone.position.copy(point);
  
    // Set the orientation of the coaster section
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    meshClone.setRotationFromQuaternion(quaternion);
  
    scene.add(meshClone);
  }
  
// Create a Catmull-Rom curve for the circle
//const circlePath = new THREE.CatmullRomCurve3(circlePathPoints, true);

/*
// Create a tube geometry along the coaster path
const tubeGeometry = new THREE.TubeGeometry(circlePath, 500, 2, 3, false);
const tubeMaterial = new THREE.MeshStandardMaterial({ color: "red", roughness: 0.5, metalness: 0.5 });
const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
// Enable shadows for the tube mesh
tubeMesh.castShadow = true;
tubeMesh.receiveShadow = true;

scene.add(tubeMesh);

*/


// Set camera position
camera.position.z = 300;

// Set up Orbit Controls for Camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 500;
controls.minDistance = 5;

// Set up lights for shadows
const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light for overall scene brightness
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Increased light intensity to 2
directionalLight.position.set(50, 200, 100);
directionalLight.castShadow = true;

scene.add(directionalLight);

// Render the scene
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Start rendering
render();
