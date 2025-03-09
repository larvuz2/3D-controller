// Import necessary modules
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { initPhysics, updatePhysics, createRigidBody, createCollider } from './physics.js';
import { initScene, renderScene, createVisualObject } from './scene.js';
import { initInput, getInputState, resetMouseMovement } from './input.js';
import { createCharacter, updateCharacter } from './character.js';
import { initCamera, updateCamera } from './camera.js';
import { createEnvironment } from './environment.js';

// Create a canvas element for rendering
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize variables
let physicsWorld = null;
let threeObjects = null;
let character = null;
let cameraController = null;
let loadingManager = null;

// Main initialization function
async function init() {
  console.log('Initializing 3D Physics-Based Character Controller');
  
  // Create a loading manager to track asset loading
  loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Loading: ${itemsLoaded}/${itemsTotal} - ${url}`);
  };
  loadingManager.onError = (url) => {
    console.error(`Error loading: ${url}`);
  };
  
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
  character = createCharacter(physicsWorld, threeObjects, loadingManager);
  console.log('Character controller created');
  
  // Initialize the camera controller
  cameraController = initCamera(threeObjects);
  console.log('Camera controller initialized');
  
  // Create the environment
  createEnvironment(physicsWorld, threeObjects);
  console.log('Environment created');
  
  // Start the animation loop
  animate();
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
  
  // Update water animation
  if (threeObjects && threeObjects.water) {
    threeObjects.water.material.uniforms['time'].value += 1.0 / 60.0;
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