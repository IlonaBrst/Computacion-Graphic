import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//import manegeGroup from './manege';

// Scene

const scene_main = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);




//manegeGroup.position.set(0, 0, 0);

//manegeGroup.scale.set(0.1, 0.1, 0.1);



// Création d'un plan vert pour le sol
const planeGeometry = new THREE.PlaneGeometry(5000, 5000); // Taille suffisamment grande pour le sol
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Vert
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotation pour que le plan soit horizontal
plane.receiveShadow = true; // Optionnel: pour recevoir des ombres
scene_main.add(plane);

// Création d'un dôme bleu pour le ciel
const skyDomeGeometry = new THREE.SphereGeometry(5000, 64, 64); // Grand rayon pour englober la scène
const skyDomeMaterial = new THREE.MeshBasicMaterial({ color: 0xADD8E6, side: THREE.BackSide }); // Bleu, rendu de l'intérieur
const skyDome = new THREE.Mesh(skyDomeGeometry, skyDomeMaterial);
scene_main.add(skyDome);

// Camera
const camera = new THREE.PerspectiveCamera(
    75, // champ de vision
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // plan de coupe près
    10000 // plan de coupe loin
  );

// Ajustement des plans de coupe de la caméra
camera.near = 0.1;
camera.far = 10000; // Assurez-vous que le plan "far" est suffisamment grand pour inclure le dôme
camera.updateProjectionMatrix();

// Ajout d'une lumière directionnelle pour voir le plan (optionnel si vous utilisez MeshBasicMaterial pour le plan)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
scene_main.add(directionalLight);

// Ajout de l'objet manegeGroup importé à la scène si nécessaire
// scene_main.add(manegeGroup);

// Rendu initial de la scène
renderer.render(scene_main, camera);

// Set up Orbit Controls for Camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 50;
controls.minDistance = 5;
controls.addEventListener('change', () => renderer.render(scene_main, camera));

// Fonction d'animation pour rendre la scène avec les contrôles d'orbite
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Seulement nécessaire si vous voulez que les contrôles d'orbite soient actifs
    renderer.render(scene_main, camera);
}
animate();
