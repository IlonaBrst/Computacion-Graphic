import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.1, 1000);
camera.position.set(0, 0, 1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// ...

// 2. Ajouter une source de lumière
const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// 3. Ajouter un sol pour les ombres
const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x888888});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;  // Pour le positionner horizontalement
ground.receiveShadow = true;       // Pour recevoir les ombres
scene.add(ground);

// 4. Activer les ombres
renderer.shadowMap.enabled = true;

pointLight.castShadow = true; 

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

const shape1= new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material1 = new THREE.MeshStandardMaterial({ color: 0x00ff00});
const mesh = new THREE.Mesh(shape1, material1);

rotationObjet(mesh, 0, Math.PI/2, 0);
mesh.castShadow = true;  
// Points de contrôle pour la première courbe
const controlPoints1 = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(50, 100, 0),
  new THREE.Vector3(100, 0, 0)
];

const curve1 = new THREE.CatmullRomCurve3(controlPoints1);

// Points de contrôle pour la deuxième courbe
const controlPoints2 = [
  new THREE.Vector3(100, 0, 0),
  new THREE.Vector3(150, -100, 0),
  new THREE.Vector3(200, 0, 40)
];

const curve2 = new THREE.CatmullRomCurve3(controlPoints2);

// Points de contrôle pour la troisième courbe
const controlPoints3 = [
  new THREE.Vector3(200, 0, 40),
  new THREE.Vector3(250, 100, 100),
  new THREE.Vector3(0, 0, 0) // Ce point rejoint le premier point de la première courbe
];

const curve3 = new THREE.CatmullRomCurve3(controlPoints3);

// Obtenez les points de chaque courbe
const points1 = curve1.getPoints(50);
const points2 = curve2.getPoints(50);
const points3 = curve3.getPoints(50);

// Combine the points
const combinedPoints = points1.concat(points2, points3);
print(combinedPoints);
// Créer une géométrie et un matériau
const geometry = new THREE.BufferGeometry().setFromPoints(combinedPoints);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

// Utilisez ces points combinés pour créer une TubeGeometry
const tubeSegments = 100;
const radius = 2;
const radialSegments = 8;
const closed = false;
const tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(combinedPoints), tubeSegments, radius, radialSegments, closed);
const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

// placer tube
deplacerObjet(tube, 10, 10, 0);
rotationObjet(tube, -Math.PI/2, 0, 0);

//trouve nouveau points selon la pos actuelle
// Trouver les nouveaux points en appliquant la rotation
const newPoints = combinedPoints.map(point => {
  const newPosition = point.clone().add(tube.position); // Prend en compte la position actuelle du tube
  newPosition.applyEuler(tube.rotation); // Applique la rotation du tube aux points
  return newPosition;
});




// ajoute la shape selon nv points
for (const point of newPoints) {
  //si index est pair
  if(newPoints.indexOf(point)%15==0){
    const cylinderGeometry = new THREE.CylinderGeometry(5, 5, point.z -5, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(point.x, point.y-45, point.z);
    scene.add(cylinder);
  }
  const meshClone = mesh.clone();
  meshClone.position.set(point.x+60, point.y+40, point.z);
  scene.add(meshClone);
 
}


// Ajout d'une lumière ambiante pour l'éclairage
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Ajout d'une lumière directionnelle pour voir les ombres
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 4, 5);
scene.add(dirLight);


// Ajustement de la position et de l'orientation de la caméra
camera.position.z = 600;
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 50;  // limit zoom out
controls.minDistance = 5;   // limit zoom in

controls.addEventListener('change', () => renderer.render(scene, camera)); // Ajout d'un écouteur pour rendre à chaque changement

// Boucle de rendu
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();


function deplacerObjet(objet, deplacementX, deplacementY, deplacementZ) {
  // Vérifiez que l'objet est défini et qu'il a une position
  scene.remove(objet);
  if (objet && objet.position) {
    // Déplacez l'objet selon les valeurs de déplacement spécifiées
    objet.position.x += deplacementX;
    objet.position.y += deplacementY;
    objet.position.z += deplacementZ;
  }

  scene.add(objet);
}

function rotationObjet(objet, rotationX, rotationY, rotationZ) {
  // Vérifiez que l'objet est défini et qu'il a une rotation
  scene.remove(objet);
  if (objet && objet.rotation) {
    // Déplacez l'objet selon les valeurs de déplacement spécifiées
    objet.rotation.x += rotationX;
    objet.rotation.y += rotationY;
    objet.rotation.z += rotationZ;
  }

  scene.add(objet);
}