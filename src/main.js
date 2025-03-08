// Import necessary modules
import { initPhysics, updatePhysics } from './physics.js';

// Create a canvas element for rendering
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize the physics world
let physicsWorld = null;

// Main initialization function
async function init() {
  console.log('Initializing 3D Physics-Based Character Controller');
  
  // Initialize the physics world
  physicsWorld = await initPhysics();
  console.log('Physics world initialized');
  
  // Start the animation loop
  animate();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update physics simulation
  if (physicsWorld) {
    updatePhysics(physicsWorld);
  }
}

// Start the application
init().catch(error => {
  console.error('Error initializing the application:', error);
}); 