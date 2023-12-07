// Shape of the coaster
const shape = new THREE.Shape();

shape.moveTo(0, 0);
shape.lineTo(10, 0);
shape.lineTo(10, -10);
shape.bezierCurveTo(10, -10, 25, -15, 30, -25);
shape.bezierCurveTo(30, -25, 35, -15, 50, -10);
shape.lineTo(50, 0);
shape.lineTo(60, 0);
shape.lineTo(60, -10);
shape.bezierCurveTo(60, -10, 45, -25, 30, -35);
shape.bezierCurveTo(30, -35, 15, -25, 0, -10);
shape.lineTo(0, 0);

// Extrude the shape with customizable depth and steps
const extrudeSettings = {
  steps: 10,
  depth: 10,
};

const coasterPathGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

// Create the coaster mesh with improved materials
const coasterMesh = createMesh(coasterPathGeometry, 0x00ff00, 0x0000ff, 30);

// Scale the coaster to a more suitable size
coasterMesh.scale.set(0.5, 0.5, 0.5);

// Remove the loop
coasterMesh.geometry.vertices.splice(15, 10);
coasterMesh.geometry.faces.splice(15, 10);

// Rotate the coaster group
coasterGroup.rotateX(-Math.PI / 2);
coasterGroup.scale.set(0.5, 0.5, 0.5);
coasterGroup.position.set(200, -50, 100);

// Add support cylinders at regular intervals
const supportInterval = 20;
for (let i = 0; i < coasterMesh.geometry.vertices.length; i += supportInterval) {
  const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 50, 32);
  const cylinder = createMesh(cylinderGeometry, 0xFFC0CB, 0x0000ff, 100);

  // Calculate the cylinder position
  const offset = 55;
  const zOffset = -40;
  const cylinderPosition = coasterMesh.geometry.vertices[i].clone().add(
    coasterMesh.geometry.normals[i].clone().multiplyScalar(offset)
  ).setZ(zOffset);

  cylinder.position.copy(cylinderPosition);
  cylinder.rotateX(Math.PI / 2);
  coasterGroup.add(cylinder);
}

// Add the coaster group to the scene
scene.add(coasterGroup);
