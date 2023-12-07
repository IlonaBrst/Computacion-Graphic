import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Initial Setup
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


const cameras = [];
let activeCameraIndex = 0;

// CAMERA
const cameraFirstPerson = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraOrbitalGeneral = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controlsOrbitalGeneral = new OrbitControls(cameraOrbitalGeneral, renderer.domElement);
const cameraOrbitalRollerCoaster = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controlsOrbitalRollerCoaster = new OrbitControls(cameraOrbitalRollerCoaster, renderer.domElement);
const cameraOrbitalFlyingChairs = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controlsOrbitalFlyingChairs = new OrbitControls(cameraOrbitalFlyingChairs, renderer.domElement);
const carroCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);


cameraFirstPerson.position.set(-70,-50, -180); 
cameraOrbitalGeneral.position.set(-70, 0, 200); 
controlsOrbitalGeneral.target.set(80, 20, 100); 
cameraOrbitalRollerCoaster.position.set(50, 50, 50); 
controlsOrbitalRollerCoaster.target.set(10, 0, 10); 

cameras.push(cameraFirstPerson,cameraOrbitalGeneral,cameraOrbitalFlyingChairs,carroCamera);


// Orbit control
controlsOrbitalGeneral.update();
controlsOrbitalRollerCoaster.update();
controlsOrbitalFlyingChairs.update();

// Gestion du changement de caméra
window.addEventListener('keydown', (event) => {
    if (event.key === 'c') {
        activeCameraIndex = (activeCameraIndex + 1) % cameras.length;
    }
});





// Set up Orbit Controls for Camera
const controls = new OrbitControls(cameras[activeCameraIndex], renderer.domElement);
controls.maxDistance = 50;
controls.minDistance = 5;
controls.addEventListener('change', () => renderer.render(scene, cameras));


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);




// Texture Loader
// roof 
const roofLoader = new THREE.TextureLoader();
const roofTexture = roofLoader.load('material/maps/patron3.png');
//cyllinder
const cyllinderLoader = new THREE.TextureLoader();
const cyllinderTexture = cyllinderLoader.load('material/maps/patron1.png');

//sky 
const skyLoader = new THREE.TextureLoader();
const skyTexture = skyLoader.load('material/maps/sunset.jpg');


//plane
const planeLoader = new THREE.TextureLoader();
const planeTexture = planeLoader.load('material/maps/pasto.jpg');

// reflection
const reflectionLoader = new THREE.CubeTextureLoader();
const reflectionMap = reflectionLoader.load('material\maps\refmapGreyRoom3.jpg');

// Ajout de lumière ambiante
const ambientLight = new THREE.AmbientLight('white',0.5);  // Lumière blanche
scene.add(ambientLight);

// Création d'un plan vert pour le sol
const planeGeometry = new THREE.PlaneGeometry(5000, 2000); // Ajusté pour correspondre à l'échelle du manège
const planeMaterial = new THREE.MeshPhongMaterial({ map: planeTexture, side: THREE.DoubleSide }); // Double face pour que le plan soit visible de dessous
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotation pour que le plan soit horizontal
plane.position.y = -100; // Position légèrement plus basse pour que le manège repose sur le plan
plane.receiveShadow = true;
plane.castShadow = true;




// Création d'un dôme bleu pour le ciel
const skyDomeGeometry = new THREE.SphereGeometry(800, 32, 32); // Rayon ajusté
const skyDomeMaterial = new THREE.MeshPhongMaterial({ map: skyTexture, side: THREE.DoubleSide }); // Double face pour que le dôme soit visible de l'intérieur
const skyDome = new THREE.Mesh(skyDomeGeometry, skyDomeMaterial);
skyDome.castShadow = true;

scene.add(plane);
scene.add(skyDome);


// Utility function to create mesh
function createMesh(geometry, Kd, Ks, shininess) {
    const material = new THREE.MeshPhongMaterial({
        color: Kd, // la couleur de base du matériau
        //envMap: reflectionMap, // la carte de réflexion
        specular:Ks,
        reflectivity: 0.9, // La réflectivité de la surface
        shininess: 150, // La brillance de la surface
         });

    return new THREE.Mesh(geometry, material);
}

// Utility function to create mesh
function createMeshLight(geometry, Kd, Ks, shininess) {
    const material = new THREE.MeshPhongMaterial({
        color: Kd, // la couleur de base du matériau
        //envMap: reflectionMap, // la carte de réflexion
        specular:Ks,
        reflectivity: 0.9, // La réflectivité de la surface
        shininess: 150, // La brillance de la surface
        emissive: 'yellow',
        emissiveIntensity: 0.4,
         });

    return new THREE.Mesh(geometry, material);
}
function createMeshTexture(geometry, texture, Ks, shininess) {
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        specular:Ks,
        shininess: shininess,
         });

    return new THREE.Mesh(geometry, material);
}


// Create Chair
const createChair = () => {
    const assiseDimensions = { width: 4, height: 2, depth: 4 };
    const dossierDimensions = { width: 4, height: 5, depth: 2};

    const assise = createMesh(
        new THREE.BoxGeometry(assiseDimensions.width, assiseDimensions.height, assiseDimensions.depth),
        0x00ff00, 0x0000ff, 30
    );
    assise.position.y = assiseDimensions.height / 2;

    const dossier = createMesh(
        new THREE.BoxGeometry(dossierDimensions.width, dossierDimensions.height, dossierDimensions.depth),
        0xff0000, 0x0000ff, 30
    );
    dossier.position.set(0, (dossierDimensions.height / 2) + assiseDimensions.height, -(assiseDimensions.depth / 2 + dossierDimensions.depth / 2));

    
    const chairInstance = new THREE.Group();
    chairInstance.add(assise, dossier);
    return chairInstance;


};

const chair = createChair();


// FLYING CHAIRS GROUP :

// Create Roof
const radius_roof = 30;
const height_roof = 10;

const roof = createMeshTexture(
    new THREE.CylinderGeometry(radius_roof, radius_roof, height_roof, 10, 32),roofTexture, 0x0000ff, 30
);
roof.position.x = 0
roof.position.y = 50
roof.position.z = 0

roof.castShadow = true;
roof.receiveShadow = true;

//GET VERTICES TO POSITION ELEMENTS
const vertices = Array.from(roof.geometry.getAttribute('position').array).reduce((acc, _, i, array) => {
    if (i % 3 === 0) acc.push(new THREE.Vector3(array[i], array[i+1], array[i+2]));
    return acc;
}, []);

const filteredVertices = vertices.filter(vertex => !(vertex.x === 0 && vertex.z === 0));

//enlever vertices du milieu
filteredVertices.sort((a, b) => Math.atan2(a.x, a.z) - Math.atan2(b.x, b.z));

const desiredCount = 8;
const stepSize = Math.floor(filteredVertices.length / desiredCount);
const sampledVertices = [];

for (let i = 0; i < filteredVertices.length; i += stepSize) {
    if (sampledVertices.length < desiredCount) {
        sampledVertices.push(filteredVertices[i]);
    }
}

//prendre le premier vertex pour les coordonnées du poteau
const poteaucoo = sampledVertices[0];


const smallCylinders = [];
// keep only 8 points
sampledVertices.forEach(vertex => {
    const smallCylinderHeight = 45;
    const smallCylinderRadius = 1;
    const smallCylinder = createMesh(
        new THREE.CylinderGeometry(smallCylinderRadius, smallCylinderRadius, smallCylinderHeight, 32),
        0x00ff00, 0x0000ff, 30
    );

	if (vertex.x > 0 && vertex.z > 0){
		smallCylinder.position.set(vertex.x-3, poteaucoo.y-2*height_roof-10, vertex.z-3);
		roof.add(smallCylinder);
		const chairClone = chair.clone();
		chairClone.position.set(smallCylinder.position.x, poteaucoo.y - smallCylinderHeight-height_roof, smallCylinder.position.z);
		const centerPoint = new THREE.Vector3(0, chairClone.position.y, 0);
		chairClone.lookAt(centerPoint);
		chairClone.rotation.y += Math.PI;
		roof.add(chairClone);
		smallCylinders.push(smallCylinder); 

	}

	else if (vertex.x >0 && vertex.z < 0){
		smallCylinder.position.set(vertex.x-3, poteaucoo.y-2*height_roof-10, vertex.z+3);
		roof.add(smallCylinder);

		const chairClone = chair.clone();
		chairClone.position.set(smallCylinder.position.x, poteaucoo.y - smallCylinderHeight-height_roof,smallCylinder.position.z);
		const centerPoint = new THREE.Vector3(0, chairClone.position.y, 0);
    		chairClone.lookAt(centerPoint);
		chairClone.rotation.y += Math.PI;
		roof.add(chairClone);

		smallCylinders.push(smallCylinder); 

	}

	else if (vertex.x <0 && vertex.z > 0){
		smallCylinder.position.set(vertex.x+3, poteaucoo.y-2*height_roof-10, vertex.z-3);
		roof.add(smallCylinder);

		const chairClone = chair.clone();
		chairClone.position.set(smallCylinder.position.x, poteaucoo.y - smallCylinderHeight-height_roof, smallCylinder.position.z);
		const centerPoint = new THREE.Vector3(0, chairClone.position.y, 0);
    		chairClone.lookAt(centerPoint);
		chairClone.rotation.y += Math.PI;
		roof.add(chairClone);

		smallCylinders.push(smallCylinder); 

	}

	else if (vertex.x <0 && vertex.z < 0){
		smallCylinder.position.set(vertex.x+3, poteaucoo.y-2*height_roof-10, vertex.z+3);
		roof.add(smallCylinder);

		const chairClone = chair.clone();
		chairClone.position.set(smallCylinder.position.x, poteaucoo.y - smallCylinderHeight-height_roof, smallCylinder.position.z);
		const centerPoint = new THREE.Vector3(0, chairClone.position.y, 0);
    		chairClone.lookAt(centerPoint);
		chairClone.rotation.y += Math.PI;
		roof.add(chairClone);

		smallCylinders.push(smallCylinder); 
	}  
});



// Create Pole on y
const radius_pole = 5;
const height_pole = 100;

const poteau = createMeshTexture( new THREE.CylinderGeometry(radius_pole, radius_pole, height_pole, 32), cyllinderTexture, 0x0000ff, 30);

poteau.position.x = 0
poteau.position.y = 0
poteau.position.z = 0

roof.position.y = height_pole / 2 + height_roof / 2;


// contour du poteau

// Construcción de la superficie de revolución
// curvageneradora: curva definida en el plano XY que será rotada alrededor del eje Y
// Cantidad de puntos = cantidad de capas + 1
// retícula: arreglo de una dimesnsión conteniendo los vértices de la malla de la superficie 
// ordenados por capa
// Vértices de 4 float
var pasos = 32;
var capas = 15;

			
var curvageneradora =  new Float32Array( 4 * ( capas + 1 ) );
			
curvageneradora = [
                5.0, -5.0, 0.0, 10.0, 
                8, -9.0, 0.0, 10.0, 
                8.0, -10.0, 0.0, 10.0, 
                12.5, -15.0, 0.0, 10.0,
                12.5,-25.0,0.0,10.0,
];
var reticula = new Float32Array( 4 * (( capas + 1 ) * ( pasos + 1 )));

// buffersuperficie: buffer para los triangulos de la superfice
// Longitud: cantidad de capas * cantidad de pasos * cantidad de triangulos por rectangulo *
// cantidad de vertices por triangulos * cantidad de compenetes por vertice
// Vértices de 4 float
var buffersuperficie = new Float32Array( capas * pasos * 2 * 3 * 4 );

// buffernormales: buffer para las normales en los vertices de los triangulos de la superfice
// Longitud: cantidad de capas * cantidad de pasos * cantidad de triangulos por rectangulo *
// cantidad de vertices por triangulos * cantidad de compenetes por normal
// Normales de 3 float
var buffernormales = new Float32Array( capas * pasos * 2 * 3 * 3 );
			
// rotY: matriz de rotación alrededor del eje Y de un ángulo equivalente a un paso
var rotY = new THREE.Matrix4;
rotY.makeRotationY( - Math.PI * 2 / pasos );
			
var vec4 = new THREE.Vector4;

// Cargar la reticula con los vertices
for ( let j = 0; j <= capas; j++ ) {
	vec4.fromArray( curvageneradora , j * 4 );
	// Primer paso
	vec4.toArray( reticula, j * 4 );
	// Ultimo paso
	vec4.toArray( reticula, (j + pasos * ( capas + 1) ) * 4 );
	// Pasos intermedios
	for( let i = 1; i < pasos; i++ ) {
		vec4.applyMatrix4( rotY );
		vec4.toArray( reticula, ( j + i * ( capas + 1) ) * 4 );
	}
}

// Cargar el buffer de la superficie
for ( let j = 0, k = 0; j < capas; j++ )
	for ( let i = 0; i < pasos; i++, k += 6 ) {
		vec4.fromArray( reticula, ( i * ( capas + 1 ) + j ) * 4 );
		vec4.toArray( buffersuperficie, k * 4 );
		vec4.toArray( buffersuperficie, ( k + 3 ) * 4 );

		vec4.fromArray( reticula, ( i * ( capas + 1 ) + j + 1 ) * 4 );
		vec4.toArray( buffersuperficie, ( k + 1 ) * 4 );
		
		vec4.fromArray( reticula, (( i + 1 ) * ( capas + 1 ) + j + 1 ) * 4 );
		vec4.toArray( buffersuperficie, ( k + 2 ) * 4 );
		vec4.toArray( buffersuperficie, ( k + 4 ) * 4 );

		vec4.fromArray( reticula, (( i + 1 ) * ( capas + 1 ) + j ) * 4 );
		vec4.toArray( buffersuperficie, ( k + 5 ) * 4 );
}

// Calculo de las normales de cada vértice de cada triangulo
var pA = new THREE.Vector3();
var pB = new THREE.Vector3();
var pC = new THREE.Vector3();

for ( let i = 0; i < capas * pasos * 2; i++ ) {
// normales de cara plana
	pA.fromArray( buffersuperficie, i * 12 );
	pB.fromArray( buffersuperficie, i * 12 + 4 );
	pC.fromArray( buffersuperficie, i * 12 + 8 );
				
	pC.sub( pB );
	pA.sub( pB );
	pC.cross( pA );
	pC.normalize();
				
	pC.toArray( buffernormales, i * 9 );
	pC.toArray( buffernormales, i * 9 + 3 );
	pC.toArray( buffernormales, i * 9 + 6 );
}
			
// Crear el buffer para la superficie
var geometry = new THREE.BufferGeometry();
// Agregar el buffer de vértices de 4 floats a la superficie, itemSize = 4
geometry.setAttribute( 'position', new THREE.BufferAttribute( buffersuperficie, 4 ) );
// Agregar el buffer de normales de 3 floats a la superficie, itemSize = 3
geometry.setAttribute( 'normal', new THREE.BufferAttribute( buffernormales, 3 ) );

// Crear el mesh con la superficie de revolución
var mesh = new THREE.Mesh( geometry,0x00ff00, 0x0000ff, 30 );
// Cargar el mesh a la escena
scene.add(mesh);

mesh.position.y = -height_pole/2 +5


//FLYING CHAIRS :

// Groupe contenant tous les éléments de la scène
const manegeGroup = new THREE.Group();

// Ajout des éléments à ce groupe
manegeGroup.add(ambientLight);
manegeGroup.add(roof); // roof contient déjà les chaises et les petits cylindres
manegeGroup.add(poteau);
manegeGroup.add(mesh); // si 'mesh' est un élément que vous voulez inclure

manegeGroup.position.y = -60;

//changement de la taille
manegeGroup.scale.set(0.5, 0.5, 0.5);

scene.add(manegeGroup);

cameraOrbitalFlyingChairs.position.set(poteau.position.x + 10, poteau.position.y-50, poteau.position.z +10); // Vue sur les chaises volantes
controlsOrbitalFlyingChairs.target.set(5, 0, 5); // Ajustez en fonction de la position des chaises volantes



// Création d'un poteau

const lampadaire = new THREE.Group();

const poteauGeo = new THREE.CylinderGeometry(1.25, 1.25, 100, 32);

const poteauLampadaire = createMesh(poteauGeo, 0x00ff00, 0x0000ff, 30);

// Création de l'ampoule
const ampouleGeo = new THREE.SphereGeometry(8, 100, 32);
const ampouleMat = new THREE.MeshStandardMaterial({
  emissive: 0xffffee,
  emissiveIntensity: 1,
  color: 0xffffee
});
const ampoule = new THREE.Mesh(ampouleGeo, ampouleMat);
ampoule.position.set(0, 50, 0);


// Création de la lumière
const spotLight = new THREE.SpotLight('white', 100, 500, Math.PI / 6, 25, 1);
spotLight.position.set(0, 50, 0);
spotLight.target.position.set(0, 0, 0);
spotLight.castShadow = true;

// Ajout des composants au lampadaire
lampadaire.add(ampoule);
lampadaire.add(spotLight);
lampadaire.add(spotLight.target);
lampadaire.add(poteauLampadaire);



lampadaire.position.set(50, -70, 50);
lampadaire.scale.set(0.5, 0.5, 0.5);

scene.add(lampadaire);

//ajouter ombre sur tous les objets
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 500;
spotLight.shadow.camera.fov = 30;






// MONTAGNE russe

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
const coasterMesh = createMesh(coasterPathGeometry, 0x00ff00, 0x0000ff, 30);

coasterMesh.scale.set(0.5, 0.5, 0.5);




// Number of points to approximate a circle
const coasterGroup = new THREE.Group();

const circlePoints = 200;

// Create a Catmull-Rom curve for the circle CON punto 
const circlePathPoints = new Array(circlePoints).fill().map((_, i) => {
    const radius = 100;
    const theta = (i / circlePoints) * Math.PI * 2;
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;

    return new THREE.Vector3(x, y, 0);
});

const circlePath = new THREE.CatmullRomCurve3(circlePathPoints, true);

// Add coaster sections along the circle path
for (let i = 0; i < circlePoints; i++) {
    const point = circlePath.getPointAt(i / circlePoints);
    const tangent = circlePath.getTangentAt(i / circlePoints);

    const meshClone = coasterMesh.clone();
    meshClone.position.copy(point);

    // Set the orientation of the coaster section
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    meshClone.setRotationFromQuaternion(quaternion);
    meshClone.rotateX(Math.PI / 2);
    coasterGroup.add(meshClone);



    if (i % 20 === 0) {
        const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 50, 32);
        const cylinder= createMesh(cylinderGeometry, 0xFFC0CB, 0x0000ff, 100);
        // Move the cylinders more to the outside
        const offset = 55;
        const zOffset = -40;
        const cylinderPosition = point.clone().add(tangent.clone().multiplyScalar(offset)).setZ(zOffset);


        cylinder.position.copy(cylinderPosition);
        cylinder.rotateX(Math.PI / 2);
        coasterGroup.add(cylinder);
    }
}

coasterGroup.rotateX(-Math.PI / 2);
coasterGroup.scale.set (0.5, 0.5, 0.5)
coasterGroup.position.set(200, -50, 100);

scene.add(coasterGroup);

const carro = new THREE.Group();

// CHAIR
// Dimensions pour l'assise et le dossier
const assiseDimensions = { width: 3, height: 0.5, depth: 3 };
const dossierDimensions = { width: 3, height: 3, depth: 0.5 };

// Création de l'assise
const assiseGeometry = new THREE.BoxGeometry(assiseDimensions.width, assiseDimensions.height, assiseDimensions.depth);
const assise = createMesh(assiseGeometry, 0x00ff00, 0x0000ff, 30);

// Positionnement de l'assise
assise.position.y = assiseDimensions.height / 2;



// Création du dossier
const dossierGeometry = new THREE.BoxGeometry(dossierDimensions.width, dossierDimensions.height, dossierDimensions.depth);
const dossier = createMesh(dossierGeometry, 0xff0000, 0x0000ff, 30);

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
const devant = createMesh(devantGeometry, 0x00ff00, 0x0000ff, 30);

devant.position.y = 2;
devant.position.z = 2;
devant.rotation.x = Math.PI / 2;

// derriere = clone
const derriere = devant.clone();
derriere.position.z = -14;
derriere.rotation.x = -Math.PI / 2;

// milieu carro

const milieuGeometry = new THREE.BoxGeometry(8, 3, 12);
const milieu = createMesh(milieuGeometry, 0x00ff00, 0x0000ff, 30);
milieu.position.y = 2;
milieu.position.z = -6;
milieu.position.x = 4;
milieu.rotation.z = Math.PI / 2;

const milieu2 = milieu.clone();
milieu2.position.x = -4;

const milieu3 = milieu2.clone();
milieu3.position.y = -0.75;
milieu3.position.x = 0;
milieu3.position.z = -6;
milieu3.rotation.z = Math.PI ;

carro.add(chaise);
carro.add(chair2);
carro.add(devant);
carro.add(derriere);
carro.add(milieu);
carro.add(milieu2);
carro.add(milieu3);

carro.rotation.x = coasterGroup.rotation.x;
carro.rotation.y = coasterGroup.rotation.y;
carro.rotation.z = coasterGroup.rotation.z;
carro.scale.set(0.5, 0.5, 0.5); 

//scene.add(carro);


// Position initiale de "carro" basée sur le premier point de la courbe de la montagne russe
const startPoint = circlePath.getPointAt(0);
carro.position.set(startPoint.x, startPoint.y, startPoint.z);

// Ajustement de la hauteur du carro pour l'aligner avec la surface de la montagne russe
//dépend de la hauteur du carro et de la façon dont la montagne russe est construite
carro.position.x += coasterGroup.position.x
carro.position.y += coasterGroup.position.y;
carro.position.z += coasterGroup.position.z

// Inclinaison du "carro" pour correspondre à la tangente de la courbe au début
const startTangent = circlePath.getTangentAt(0);
carro.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), startTangent.normalize());

//coasterGroup.add(carro);

carro.position.add(coasterGroup.position);



// FLYING CHAIRS ANIMATION :
let vitesseRotation = 0.01;
const maxVitesseRotation = 0.1;
const maxInclinaisonChaise = Math.PI / 4; // 45 degrés
const vitesseInclinaisonChaise = 0.01;


function manege(){

      // Augmenter la vitesse de rotation jusqu'à une certaine limite
      if (vitesseRotation < maxVitesseRotation) {
        vitesseRotation += 0.00000001;
    }

    // Rotation du disque (toit)
    roof.rotation.y += vitesseRotation;

    // Inclinaison aléatoire du disque
    roof.rotation.x += (Math.random() - 0.5) * 0.01;
    roof.rotation.z += (Math.random() - 0.5) * 0.01;

    // Ajustement de l'inclinaison des chaises
    chair.children.forEach(child => {
        if (child.rotation.z < maxInclinaisonChaise) {
            child.rotation.z += vitesseInclinaisonChaise;
        }
    });

}

// MONTAGNE RUSSE ANIMATION :

let progress = 0; // Démarre à 0, ce qui est le début de la courbe
const animationSpeed = 0.0005; // Vitesse de l'animation

// Fonction d'animation mise à jour pour animer le carro
function russa() {
// Mise à jour de la progression du carro le long de la courbe
    progress += animationSpeed;
    progress = progress % 1;

    // Point et tangente sur la courbe à la position actuelle
    const point = circlePath.getPointAt(progress);
    const tangent = circlePath.getTangentAt(progress).normalize();

    // Calcul de l'axe binormal (perpendiculaire à la tangente et au vecteur 'up')
    const up = new THREE.Vector3(0, 1, 0);
    const binormal = new THREE.Vector3().crossVectors(up, tangent).normalize();

    // Décalage du carro du centre du chemin par la valeur binormal
    const offset = 5; // valeur pour écarter le carro du chemin
    carro.position.copy(point).add(binormal.multiplyScalar(offset));

    // Définition de l'orientation du carro pour suivre la courbe
    const lookAt = new THREE.Vector3().addVectors(carro.position, tangent);
    carro.lookAt(lookAt);

    // Ajustement de l'orientation pour que le carro soit debout
    carro.rotation.z = Math.PI / 2; // ajuste la rotation sur l'axe Z pour être aligné verticalement.
// verifier ou regarde camera et fructum : essayer sin el carro et avec ou deplacer plus en haut de la caméra
    if (cameras[activeCameraIndex] === carroCamera) {
      const offset = new THREE.Vector3(0, 2, -5);
      const lookAtOffset = new THREE.Vector3(0, 1, 10);
      const carroPosition = new THREE.Vector3();
      const carroOrientation = new THREE.Quaternion();
      carro.getWorldPosition(carroPosition);
      carro.getWorldQuaternion(carroOrientation);
      carroCamera.position.copy(carroPosition).add(offset.applyQuaternion(carroOrientation));
      carroCamera.lookAt(carroPosition.add(lookAtOffset));
  }
}

// Fonction d'animation
function animate() {

    requestAnimationFrame(animate);

    russa();

    manege();

    renderer.render(scene, cameras[activeCameraIndex]);
}





animate();



