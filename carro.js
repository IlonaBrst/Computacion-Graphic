import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


carro = new THREE.Group();

// CHAIR
// Dimensions pour l'assise et le dossier
const assiseDimensions = { width: 3, height: 0.5, depth: 3 };
const dossierDimensions = { width: 3, height: 3, depth: 0.5 };

// Création de l'assise
const assiseGeometry = new THREE.BoxGeometry(assiseDimensions.width, assiseDimensions.height, assiseDimensions.depth);
const assiseMaterial = new THREE.MeshBasicMaterial({ color:'red' });
const assise = new THREE.Mesh(assiseGeometry, assiseMaterial);

// Positionnement de l'assise
assise.position.y = assiseDimensions.height / 2;



// Création du dossier
const dossierGeometry = new THREE.BoxGeometry(dossierDimensions.width, dossierDimensions.height, dossierDimensions.depth);
const dossierMaterial = new THREE.MeshBasicMaterial({ color: 'green' });
const dossier = new THREE.Mesh(dossierGeometry, dossierMaterial);

// Positionnement du dossier
dossier.position.y = (dossierDimensions.height / 2) + assiseDimensions.height;
dossier.position.z = -(assiseDimensions.depth / 2 + dossierDimensions.depth / 2);



// faire un seul objet chaise

const chaise = new THREE.Group();

chaise.add(assise);

chaise.add(dossier);

chaise.position.y = 2;

chaise.position.x = 0;

chaise.position.z = -8;

const chair2 = chaise.clone();  

chair2.position.x = 0;

chair2.position.z = -3;





//  devant 

const devantGeometry = new THREE.CylinderGeometry(3, 4, 4, 32);

const devantMaterial = new THREE.MeshBasicMaterial({ color: 'yellow'});

const devant = new THREE.Mesh(devantGeometry, devantMaterial);

devant.position.y = 2;

devant.position.z = 2;

devant.rotation.x = Math.PI / 2;


// derriere = clone

const derriere = devant.clone();

derriere.position.z = -14;

derriere.rotation.x = -Math.PI / 2;







// milieu cube

const milieuGeometry = new THREE.BoxGeometry(8, 3, 12);

const milieuMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });

const milieu = new THREE.Mesh(milieuGeometry, milieuMaterial);

milieu.position.y = 2;

milieu.position.z = -6;

milieu.position.x = 4;

milieu.rotation.z = Math.PI / 2;

// clone milieu

const milieu2 = milieu.clone();

milieu2.position.x = -4;


//clone milieu2

const milieu3 = milieu2.clone();

milieu3.position.y = -0.75;
milieu3.position.x = 0;
milieu3.position.z = -6;
milieu3.rotation.z = Math.PI ;

// scalar

carro.add(chaise);
carro.add(chair2);
carro.add(devant);
carro.add(derriere);
carro.add(milieu);
carro.add(milieu2);
carro.add(milieu3);






// enlever une forme de cube
const shape = new THREE.Shape();











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

const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();


