// Shape of the coaster
const shape = new THREE.Shape();

// Define the coaster path with more points for smoother curves
shape.moveTo(0, 0);
shape.lineTo(10, 0);
shape.lineTo(15, -5);
shape.lineTo(20, -10);
shape.bezierCurveTo(20, -10, 30, -15, 40, -25);
shape.bezierCurveTo(40, -25, 45, -15, 50, -10);
shape.lineTo(60, 0);
shape.lineTo(70, 0);
shape.lineTo(75, -5);
shape.lineTo(80, -10);
shape.bezierCurveTo(80, -10, 60, -25, 50, -35);
shape.bezierCurveTo(50, -35, 40, -25, 30, -10);
shape.lineTo(20, 0);
shape.lineTo(15, 5);
shape.lineTo(10, 10);
shape.closePath();

// Extrude the shape with customizable depth and steps
const extrudeSettings = {
  steps: 20, // Increased steps for smoother curves
  depth: 10,
  bevelEnabled: false,
};

const coasterPathGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

// Create the coaster mesh with improved materials
const coasterMesh = createMesh(coasterPathGeometry, 0x00ff00, 0x0000ff, 30);

// Scale the coaster to a more suitable size
coasterMesh.scale.set(0.5, 0.5, 0.5);

// Use a Catmull-Rom curve for a more organic loop
const circlePoints = 200;
const circlePathPoints = new Array(circlePoints).fill().map((_, i) => {
  const radius = 100; // Increased radius for a larger loop
  const theta = (i / circlePoints) * Math.PI * 2;
  const x = Math.cos(theta) * radius;
  const y = Math.sin(theta) * radius;
  return new THREE.Vector3(x, y, 0);
});

const circlePath = new THREE.CatmullRomCurve3(circlePathPoints, true);

// Add coaster sections along the circle path with improved spacing and rotation
const coasterGroup = new THREE.Group();

for (let i = 0; i < circlePoints; i += 10) { // Add sections at specific intervals
  const point = circlePath.getPointAt(i / circlePoints);
  const tangent = circlePath.getTangentAt(i / circlePoints);

  const meshClone = coasterMesh.clone();
  meshClone.position.copy(point);

  // Set the orientation of the coaster section
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  meshClone.setRotationFromQuaternion(quaternion);
  meshClone.rotateX(Math.PI / 2);

  coasterGroup.add(meshClone);
}

// Add support cylinders at regular intervals
const supportInterval = 20; // Added variable for easier customization
for (let i = 0; i < circlePoints; i += supportInterval) {
  const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 50, 32);
  const cylinder = createMesh(cylinderGeometry, 0xFFC0CB, 0x0000ff, 100);

  // Calculate the cylinder position
  const offset = 55;
  const zOffset = -40;
  const cylinderPosition = point.clone().add(tangent.clone().multiplyScalar(offset)).setZ(zOffset);

  cylinder.position.copy(cylinderPosition);
  cylinder.rotateX(Math.PI / 2);
  coasterGroup.add(cylinder);
}

// Rotate and position the coaster group
coasterGroup.rotateX(-Math.PI / 2);
coasterGroup.scale.set(0.5, 0.5, 0.5); // Adjusted scale for better proportions
coasterGroup.position.set
