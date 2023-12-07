// Créer un plan de base pour la montagne russe
const track = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({color: 0x000000}),
  );
  
  // Créer les rails de la montagne russe
  const rails = [];
  for (let i = 0; i < 100; i++) {
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 1),
      new THREE.MeshBasicMaterial({color: 0xff0000}),
    );
    rail.position.x = i;
    rail.position.y = Math.sin(i / 100 * Math.PI);
    rails.push(rail);
  }
  
  // Créer les supports de la montagne russe
  const supports = [];
  for (let i = 0; i < 10; i++) {
    const support = new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 100),
      new THREE.MeshBasicMaterial({color: 0x000000}),
    );
    support.position.x = i * 10;
    supports.push(support);
  }
  
  // Ajouter la montagne russe à la scène
  const scene = new THREE.Scene();
  scene.add(track);
  scene.add(rails);
  
  // Créer la caméra
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 500;
  
  // Créer le renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Démarrer le rendu
  render();
  
  function render() {
    // Mettre à jour la position des rails
    for (let i = 0; i < rails.length; i++) {
      rails[i].position.y = Math.sin(i / 100 * Math.PI);
    }
  
    // Rendre la scène
    renderer.render(scene, camera);
  
    // Appeler la fonction de rendu à nouveau après un délai
    requestAnimationFrame(render);
  }