import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


/* CHAIR
// Dimensions pour l'assise et le dossier
const assiseDimensions = { width: 4, height: 0.5, depth: 4 };
const dossierDimensions = { width: 4, height: 4, depth: 0.5 };

// Création de l'assise
const assiseGeometry = new THREE.BoxGeometry(assiseDimensions.width, assiseDimensions.height, assiseDimensions.depth);
const assiseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const assise = new THREE.Mesh(assiseGeometry, assiseMaterial);

// Positionnement de l'assise
assise.position.y = assiseDimensions.height / 2;

scene.add(assise);

// Création du dossier
const dossierGeometry = new THREE.BoxGeometry(dossierDimensions.width, dossierDimensions.height, dossierDimensions.depth);
const dossierMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const dossier = new THREE.Mesh(dossierGeometry, dossierMaterial);

// Positionnement du dossier
dossier.position.y = (dossierDimensions.height / 2) + assiseDimensions.height;
dossier.position.z = -(assiseDimensions.depth / 2 + dossierDimensions.depth / 2);

scene.add(dossier);


//Car
renderer.shadowMap.enabled = true;

const length = 12, width = 8;

const shape = new THREE.Shape();
shape.moveTo( 0, 0 );
shape.lineTo( 0, width );
shape.lineTo( length, width );
shape.lineTo( length, 0 );
shape.lineTo( 0, 0 );

const extrudeSettings = {
    steps: 2,
    depth: 10,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1
};

const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); 
const mesh = new THREE.Mesh( geometry, material );

// Activer les ombres pour le maillage
mesh.castShadow = true;
mesh.receiveShadow = true;

// Centrez le maillage
mesh.position.set(-length / 2, -width / 2, -extrudeSettings.depth / 2);
scene.add(mesh);



// ... [Positionnement du maillage et ajout à la scène]

// Ajouter une lumière directionnelle avec des ombres
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
light.castShadow = true;
scene.add(light);

// Ajouter une lumière ambiante pour un éclairage doux
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Ajustez la position et l'orientation de la caméra
camera.position.set(length / 2, width, 30);
camera.lookAt(mesh.position);*/
//MIDDLE :

//MODIF SHAPE POUR AVOIR LA BONNE
/*
const shape = new THREE.Shape();
shape.moveTo(-1, 0);
shape.lineTo(-1, 1.5);
shape.absarc(0, 1.5, 1, Math.PI, 0, false);
shape.lineTo(1, 0);

// Créer la trajectoire pour le balayage
const curve = new THREE.LineCurve3(
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(2, 0, 0)
);

const extrudeSettings = {
    steps: 100,
    bevelEnabled: false,
    extrudePath: curve
};


const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 }); // Couleur jaune
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);*/

const shape = new THREE.Shape();

// Surface vide a la moitié pourquoi ?
shape.moveTo(20, 0);
shape.lineTo(20, 50); 
shape.absarc(0, 50, 20, Math.PI, 0, true);     
shape.lineTo(-20, 50);
shape.lineTo(-20, 0);
shape.absarc(0, 0, 20, Math.PI, 0, false);
shape.lineTo(20, 0);

// Avoir point de de la shape
const points = shape.getPoints();


// Créer la trajectoire selon point de la shape
const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, p.y, 0)));



for (const point of points) {
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry1, material1);
    cube.position.set(point.x, point.y, 0);
    scene.add(cube);
}






const extrudeSettings = {
    depth: 2,
    bevelEnabled: false,
};


const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 }); 
const cuve = new THREE.Mesh(geometry, material);
scene.add(cuve);

/*
const radius = 25;  // Ajustez en fonction de la taille souhaitée
const height = 10;  // Ajustez en fonction de la hauteur souhaitée
const segments = 32;  // Nombre de segments pour le cylindre

const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true);
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

// Positionnement du cylindre par rapport à la cuve
cylinder.position.set(25, -15, 5);  // Ajustez ces valeurs pour aligner correctement le cylindre à la cuve

scene.add(cylinder);*/



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


