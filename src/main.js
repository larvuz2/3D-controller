// Import necessary modules
import { initPhysics, updatePhysics, createRigidBody, createCollider } from './physics.js';
import { initScene, renderScene, createVisualObject } from './scene.js';
import { initInput, getInputState, resetMouseMovement } from './input.js';
import { createCharacter, updateCharacter } from './character.js';
import { initCamera, updateCamera } from './camera.js';

// Create a canvas element for rendering
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize variables
let physicsWorld = null;
let threeObjects = null;
let character = null;
let cameraController = null;

// Main initialization function
async function init() {
  console.log('Initializing 3D Physics-Based Character Controller');
  
  // Initialize the physics world
  physicsWorld = await initPhysics();
  console.log('Physics world initialized');
  
  // Initialize the Three.js scene
  threeObjects = initScene(canvas);
  console.log('Three.js scene initialized');
  
  // Initialize input handling
  initInput();
  console.log('Input handling initialized');
  
  // Create the character controller
  character = createCharacter(physicsWorld, threeObjects);
  console.log('Character controller created');
  
  // Initialize the camera controller
  cameraController = initCamera(threeObjects);
  console.log('Camera controller initialized');
  
  // Create some test objects in the scene
  createTestEnvironment();
  
  // Start the animation loop
  animate();
}

// Create a test environment with some objects
function createTestEnvironment() {
  console.log('Creating test environment');
  
  // Create some boxes at different positions
  createBox({ x: 5, y: 1, z: 5 }, { width: 2, height: 2, depth: 2 }, 0xff0000);
  createBox({ x: -5, y: 1, z: 5 }, { width: 2, height: 2, depth: 2 }, 0x00ff00);
  createBox({ x: 0, y: 1, z: -5 }, { width: 2, height: 2, depth: 2 }, 0x0000ff);
  
  // Create a platform
  createBox({ x: 0, y: 0.5, z: -10 }, { width: 10, height: 1, depth: 2 }, 0xffff00);
  
  console.log('Test environment created');
}

// Helper function to create a box with physics
function createBox(position, size, color) {
  // Create a physics rigid body for the box
  const rigidBody = createRigidBody(physicsWorld, position, true); // Static body
  createCollider(physicsWorld, rigidBody, 'box', size);
  
  // Create a visual representation of the box
  createVisualObject(threeObjects, 'box', size, position, color);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Get the current input state
  const inputState = getInputState();
  
  // Update physics simulation
  if (physicsWorld) {
    updatePhysics(physicsWorld);
  }
  
  // Update character based on input and physics
  if (character && inputState) {
    updateCharacter(character, inputState, physicsWorld, threeObjects.camera);
  }
  
  // Update camera to follow character
  if (cameraController && character) {
    updateCamera(cameraController, character, inputState);
  }
  
  // Reset mouse movement after processing
  resetMouseMovement();
  
  // Render the scene
  if (threeObjects) {
    renderScene(threeObjects);
  }
}

// Start the application
init().catch(error => {
  console.error('Error initializing the application:', error);
}); 