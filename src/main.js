// Import necessary modules
import { initPhysics, updatePhysics, createRigidBody, createCollider } from './physics.js';
import { initScene, renderScene, createVisualObject } from './scene.js';

// Create a canvas element for rendering
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize variables
let physicsWorld = null;
let threeObjects = null;
let box = null;
let boxMesh = null;

// Main initialization function
async function init() {
  console.log('Initializing 3D Physics-Based Character Controller');
  
  // Initialize the physics world
  physicsWorld = await initPhysics();
  console.log('Physics world initialized');
  
  // Initialize the Three.js scene
  threeObjects = initScene(canvas);
  console.log('Three.js scene initialized');
  
  // Create a test box
  createTestBox();
  
  // Start the animation loop
  animate();
}

// Create a test box to demonstrate physics
function createTestBox() {
  // Create a physics rigid body for the box
  const boxPosition = { x: 0, y: 5, z: 0 };
  const boxSize = { width: 1, height: 1, depth: 1 };
  
  box = createRigidBody(physicsWorld, boxPosition);
  createCollider(physicsWorld, box, 'box', boxSize);
  
  // Create a visual representation of the box
  boxMesh = createVisualObject(threeObjects, 'box', boxSize, boxPosition);
  
  console.log('Test box created');
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update physics simulation
  if (physicsWorld) {
    updatePhysics(physicsWorld);
    
    // Update visual objects based on physics
    if (box && boxMesh) {
      const position = box.translation();
      boxMesh.position.set(position.x, position.y, position.z);
      
      const rotation = box.rotation();
      boxMesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    }
  }
  
  // Render the scene
  if (threeObjects) {
    renderScene(threeObjects);
  }
}

// Start the application
init().catch(error => {
  console.error('Error initializing the application:', error);
}); 