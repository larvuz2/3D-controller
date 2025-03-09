// Import necessary modules
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { initPhysics, updatePhysics, createRigidBody, createCollider } from './physics.js';
import { initScene, renderScene, createVisualObject } from './scene.js';
import { initInput, getInputState, resetMouseMovement } from './input.js';
import { createCharacter, updateCharacter } from './character.js';
import { initCamera, updateCamera } from './camera.js';
import { createEnvironment } from './environment.js';
import { initGUI, waterParams } from './gui.js';

// Create a canvas element for rendering
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize variables
let physicsWorld = null;
let threeObjects = null;
let character = null;
let cameraController = null;
let loadingManager = null;
let clock = null;
let gui = null;

// Main initialization function
async function init() {
  console.log('Initializing 3D Physics-Based Character Controller');
  
  // Create a clock for time-based animations
  clock = new THREE.Clock();
  
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
  
  // Initialize GUI controls
  gui = initGUI(threeObjects);
  console.log('GUI controls initialized');
  
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
  
  // Get elapsed time for animations
  const time = clock.getElapsedTime();
  
  // Get the current input state
  const inputState = getInputState();
  
  // Update physics simulation with character for buoyancy
  if (physicsWorld) {
    updatePhysics(physicsWorld, character);
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
  if (threeObjects && threeObjects.water && threeObjects.water.material.uniforms) {
    // Use the waveSpeed parameter from GUI to control animation speed
    threeObjects.water.material.uniforms['time'].value += waterParams.waveSpeed / 60.0;
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