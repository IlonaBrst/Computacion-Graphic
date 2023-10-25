import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//import scene_manege from './manege';

// Scene

const scene_main = new THREE.Scene();

// Add scene => bug enleve le ciel et le plan
/*
scene_manege.children.forEach(child => {
    scene_main.add(child.clone());
});
*/

const geometry = new THREE.PlaneGeometry(2000, 2000, 32, 32);
const material = new THREE.MeshBasicMaterial({ color:'green', side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = Math.PI / 2;
scene_main.add(plane);


const skyGeometry = new THREE.SphereGeometry(1000, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
const skyMaterial = new THREE.MeshBasicMaterial({ color: 0xADD8E6, side: THREE.BackSide }); // couleur bleu ciel
const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
scene_main.add(skyDome);


// Camera

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 10, 50);
camera.lookAt(0, 0, 0);

// Renderer

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls

const controls = new OrbitControls(camera, renderer.domElement);


// Animation

const animate = function () {
    requestAnimationFrame(animate);
    
    controls.update();
    
    renderer.render(scene_main, camera);
    }

animate();
