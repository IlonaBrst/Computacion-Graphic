import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Initial Setup
const scene_manege = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(0, 0, 600);

// Ajuster la caméra pour voir la scène
camera.position.set(0, 0, 150);
camera.left = -80;
camera.right = 80;
camera.top = 80;
camera.bottom = -80;
camera.updateProjectionMatrix();

// Ajout de lumière ambiante
const ambientLight = new THREE.AmbientLight(0xaaaaaa);  // Lumière douce grise
scene_manege.add(ambientLight);

// Création d'un plan vert pour le sol
const planeGeometry = new THREE.PlaneGeometry(5000, 2000); // Ajusté pour correspondre à l'échelle du manège
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Vert
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotation pour que le plan soit horizontal
plane.position.y = -100; // Position légèrement plus basse pour que le manège repose sur le plan
scene_manege.add(plane);


// Création d'un dôme bleu pour le ciel
const skyDomeGeometry = new THREE.SphereGeometry(800, 32, 32); // Rayon ajusté
const skyDomeMaterial = new THREE.MeshBasicMaterial({ color: 0xADD8E6, side: THREE.BackSide }); // Bleu, rendu de l'intérieur
const skyDome = new THREE.Mesh(skyDomeGeometry, skyDomeMaterial);


scene_manege.add(skyDome);


// Helper Functions
function positionObjet(objet, x, y, z) {
    objet.position.set(x, y, z);
    scene_manege.add(objet);
}

// Add Axes Helper
const axesHelper = new THREE.AxesHelper(5);
scene_manege.add(axesHelper);


// Utility function to create mesh
function createMesh(geometry, color) {
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
}

// Create Chair
const createChair = () => {
    const assiseDimensions = { width: 4, height: 2, depth: 4 };
    const dossierDimensions = { width: 4, height: 5, depth: 2};

    const assise = createMesh(
        new THREE.BoxGeometry(assiseDimensions.width, assiseDimensions.height, assiseDimensions.depth),
        'yellow'
    );
    assise.position.y = assiseDimensions.height / 2;

    const dossier = createMesh(
        new THREE.BoxGeometry(dossierDimensions.width, dossierDimensions.height, dossierDimensions.depth),
        0xff0000
    );
    dossier.position.set(0, (dossierDimensions.height / 2) + assiseDimensions.height, -(assiseDimensions.depth / 2 + dossierDimensions.depth / 2));

    
    const chairInstance = new THREE.Group();
    chairInstance.add(assise, dossier);
    return chairInstance;


};


const chair = createChair();




// Create Roof
const radius_roof = 30;
const height_roof = 10;

const roof = createMesh(
    new THREE.CylinderGeometry(radius_roof, radius_roof, height_roof, 10, 32),
    0x888888
);
positionObjet(roof, 0, 50, 0);


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
        0xff0000
    );

	if (vertex.x > 0 && vertex.z > 0){
		smallCylinder.position.set(vertex.x-3, poteaucoo.y-2*height_roof-10, vertex.z-3);
		roof.add(smallCylinder);
		const chairClone = chair.clone();
		chairClone.position.set(smallCylinder.position.x, poteaucoo.y - smallCylinderHeight-height_roof, smallCylinder.position.z);
		const centerPoint = new THREE.Vector3(0, chairClone.position.y, 0);
    
		// Utilisez la méthode lookAt pour orienter la chaise vers le point central
		chairClone.lookAt(centerPoint);
		smallCylinder.lookAt(centerPoint);
	
		// Puisque lookAt oriente l'objet de sorte que son axe -z pointe vers le point cible,
		// vous devrez peut-être ajuster la rotation de la chaise de 180 degrés autour de l'axe Y
		// si vous voulez que le devant de la chaise soit orienté vers l'extérieur
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
    
		// Utilisez la méthode lookAt pour orienter la chaise vers le point central
		chairClone.lookAt(centerPoint);
		smallCylinder.lookAt(centerPoint);

	
		// Puisque lookAt oriente l'objet de sorte que son axe -z pointe vers le point cible,
		// vous devrez peut-être ajuster la rotation de la chaise de 180 degrés autour de l'axe Y
		// si vous voulez que le devant de la chaise soit orienté vers l'extérieur
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
    
		// Utilisez la méthode lookAt pour orienter la chaise vers le point central
		chairClone.lookAt(centerPoint);
		smallCylinder.lookAt(centerPoint);

	
		// Puisque lookAt oriente l'objet de sorte que son axe -z pointe vers le point cible,
		// vous devrez peut-être ajuster la rotation de la chaise de 180 degrés autour de l'axe Y
		// si vous voulez que le devant de la chaise soit orienté vers l'extérieur
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
    
		// Utilisez la méthode lookAt pour orienter la chaise vers le point central
		chairClone.lookAt(centerPoint);
		smallCylinder.lookAt(centerPoint);

	
		// Puisque lookAt oriente l'objet de sorte que son axe -z pointe vers le point cible,
		// vous devrez peut-être ajuster la rotation de la chaise de 180 degrés autour de l'axe Y
		// si vous voulez que le devant de la chaise soit orienté vers l'extérieur
		chairClone.rotation.y += Math.PI;
		

		
		roof.add(chairClone);

		smallCylinders.push(smallCylinder); 

	}
    
});






// Create Pole sur y
const radius_pole = 5;
const height_pole = 100;
const poteauGeometry = new THREE.CylinderGeometry(radius_pole, radius_pole, height_pole, 10, 32);
const poteauMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const poteau = new THREE.Mesh(poteauGeometry, poteauMaterial);
positionObjet(poteau, 0, 0, 0);

roof.position.y = height_pole / 2 + height_roof / 2;


// contour poteau =CODE DU PROF MODIFIER

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

			//console.log( reticula );

			// Cargar el buffer de la superficie
			for ( let j = 0, k = 0; j < capas; j++ )
				for ( let i = 0; i < pasos; i++, k += 6 ) {
					// A: i * ( capas + 1 ) + j
					vec4.fromArray( reticula, ( i * ( capas + 1 ) + j ) * 4 );
					// Triangulo ABC
					vec4.toArray( buffersuperficie, k * 4 );
					// Triangulo ACD
					vec4.toArray( buffersuperficie, ( k + 3 ) * 4 );

					// B: i * ( capas + 1 ) + j + 1
					vec4.fromArray( reticula, ( i * ( capas + 1 ) + j + 1 ) * 4 );
					// Triangulo ABC
					vec4.toArray( buffersuperficie, ( k + 1 ) * 4 );

					// C: ( i + 1 ) * ( capas + 1 ) + j + 1
					vec4.fromArray( reticula, (( i + 1 ) * ( capas + 1 ) + j + 1 ) * 4 );
					// Triangulo ABC
					vec4.toArray( buffersuperficie, ( k + 2 ) * 4 );
					// Triangulo ACD
					vec4.toArray( buffersuperficie, ( k + 4 ) * 4 );

					// D: ( i + 1 ) * ( capas + 1 ) + j
					vec4.fromArray( reticula, (( i + 1 ) * ( capas + 1 ) + j ) * 4 );
					// Triangulo ACD
					vec4.toArray( buffersuperficie, ( k + 5 ) * 4 );
				}

			//console.log( buffersuperficie );

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

			//console.log( buffernormales );
			
			// Crear el buffer para la superficie
			var geometry = new THREE.BufferGeometry();
			// Agregar el buffer de vértices de 4 floats a la superficie, itemSize = 4
            geometry.setAttribute( 'position', new THREE.BufferAttribute( buffersuperficie, 4 ) );
			// Agregar el buffer de normales de 3 floats a la superficie, itemSize = 3
            geometry.setAttribute( 'normal', new THREE.BufferAttribute( buffernormales, 3 ) );

			// Crear material para la superficie
            var material = new THREE.MeshBasicMaterial( { color: 'blue', side: THREE.DoubleSide } );

            // Crear el mesh con la superficie de revolución
			var mesh = new THREE.Mesh( geometry, material );
			// Cargar el mesh a la escena
            scene_manege.add(mesh);

            mesh.position.y = -height_pole/2 +5



// Create Point Light
const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
pointLight.position.set(50, 50, 50);
scene_manege.add(pointLight);

// Set up Orbit Controls for Camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 50;
controls.minDistance = 5;
controls.addEventListener('change', () => renderer.render(scene_manege, camera));

// Render Loop
let vitesseRotation = 0.01;
const maxVitesseRotation = 0.1;
const maxInclinaisonChaise = Math.PI / 4; // 45 degrés
const vitesseInclinaisonChaise = 0.01;

// Créez un groupe pour contenir tous les éléments de la scène
const manegeGroup = new THREE.Group();

// Ajoutez tous les éléments à ce groupe
manegeGroup.add(ambientLight);
manegeGroup.add(axesHelper);
manegeGroup.add(roof); // roof contient déjà les chaises et les petits cylindres
manegeGroup.add(poteau);
manegeGroup.add(mesh); // si 'mesh' est un élément que vous voulez inclure
manegeGroup.add(pointLight);

// Ajustez la position du groupe si nécessaire
// manegeGroup.position.set(x, y, z);
manegeGroup.position.y = -60;

//changer taille
manegeGroup.scale.set(0.5, 0.5, 0.5);
// Maintenant, vous pouvez ajouter ce groupe à votre scène
scene_manege.add(manegeGroup);


//Poteau

// Création d'un poteau

const lampadaire = new THREE.Group();

const poteauGeo = new THREE.CylinderGeometry(1.25, 1.25, 100, 32);
const poteauMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const poteauLampadaire = new THREE.Mesh(poteauGeo, poteauMat);

const ampouleGeo = new THREE.SphereGeometry(8, 100, 32);
const ampouleMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const ampoule = new THREE.Mesh(ampouleGeo, ampouleMat);
ampoule.position.y = 50;


lampadaire.add(poteauLampadaire);
lampadaire.add(ampoule);

lampadaire.position.set(50, -70, 0);

lampadaire.scale.set(0.5, 0.5, 0.5);

scene_manege.add(lampadaire);

// Paramètres de l'animation
const maxAngle = 0.001; // 5 degrés en radians
const rotationSpeed = 0.001; // La vitesse de rotation par frame, pour une animation lente

// Un tableau pour suivre l'angle actuel de rotation de chaque cylindre
const currentAngles = new Array(smallCylinders.length).fill(0);

function animateCylinders() {
    // Animer chaque petit cylindre
    let localAxisX = new THREE.Vector3(1, 0, 0);

    smallCylinders.forEach((cylinder, index) => {
        // Si l'angle actuel est inférieur à l'angle maximal, continuez à tourner
        if (currentAngles[index] < maxAngle) {
            // Calculez le montant de rotation pour cette frame
            let angleIncrement = Math.min(rotationSpeed, maxAngle - currentAngles[index]);
            cylinder.rotateOnAxis(localAxisX, angleIncrement);

            // Mettre à jour l'angle actuel
            currentAngles[index] += angleIncrement;
        }
        // Si l'angle actuel est égal ou dépasse l'angle maximal, la rotation s'arrête
    });

   
}


// Boucle de rendu
function animate() {
    requestAnimationFrame(animate);

    animateCylinders(); // Appelez la fonction d'animation des cylindres

    controls.update(); // Mettre à jour les contrôles d'orbite
    renderer.render(scene_manege, camera); // Rendre la scène
}


function manege(){

	// Augmenter la vitesse de rotation jusqu'à une certaine limite
	if (vitesseRotation < maxVitesseRotation) {
	  vitesseRotation += 0.00000001; // Increment de la vitesse, à ajuster selon les besoins
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

// Fonction d'animation
function animate() {

  requestAnimationFrame(animate);

  manege();

  renderer.render(scene_manege, camera);
}


animate(); // Démarrer la boucle d'animation












