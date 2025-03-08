// Import Three.js
import * as THREE from 'three';

// Camera constants
const CAMERA_HEIGHT = 1.5;
const CAMERA_DISTANCE = 5.0;
const CAMERA_SMOOTHING = 0.1;
const CAMERA_LOOK_AHEAD = 2.0;

/**
 * Initialize the camera
 * @param {Object} threeObjects - The Three.js objects
 * @returns {Object} The camera controller
 */
export function initCamera(threeObjects) {
  console.log('Initializing camera controller');
  
  // Get the camera from threeObjects
  const camera = threeObjects.camera;
  
  // Set initial camera position
  camera.position.set(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
  
  // Create a target vector for the camera to look at
  const target = new THREE.Vector3(0, CAMERA_HEIGHT, -CAMERA_LOOK_AHEAD);
  
  // Create the camera controller object
  const cameraController = {
    camera,
    target,
    idealPosition: new THREE.Vector3(),
    idealLookAt: new THREE.Vector3()
  };
  
  console.log('Camera controller initialized');
  
  return cameraController;
}

/**
 * Update the camera based on character position and rotation
 * @param {Object} cameraController - The camera controller
 * @param {Object} character - The character controller
 * @param {Object} inputState - The current input state
 */
export function updateCamera(cameraController, character, inputState) {
  // Get character position
  const characterPosition = character.mesh.position;
  
  // Calculate ideal camera position based on character position and rotation
  calculateIdealCameraPosition(cameraController, characterPosition, character.rotation);
  
  // Smoothly move camera towards ideal position
  smoothCameraMovement(cameraController);
  
  // Make camera look at the target
  cameraController.camera.lookAt(cameraController.target);
}

/**
 * Calculate the ideal camera position based on character position and rotation
 * @param {Object} cameraController - The camera controller
 * @param {Object} characterPosition - The character position
 * @param {Object} characterRotation - The character rotation
 */
function calculateIdealCameraPosition(cameraController, characterPosition, characterRotation) {
  // Calculate camera offset based on character rotation
  const offset = new THREE.Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
  offset.applyEuler(characterRotation);
  
  // Calculate ideal camera position
  cameraController.idealPosition.copy(characterPosition).add(offset);
  
  // Calculate look-ahead point based on character rotation
  const lookAhead = new THREE.Vector3(0, 0, -CAMERA_LOOK_AHEAD);
  lookAhead.applyEuler(characterRotation);
  
  // Calculate ideal look-at point
  cameraController.idealLookAt.copy(characterPosition).add(lookAhead);
  cameraController.idealLookAt.y += CAMERA_HEIGHT;
}

/**
 * Smoothly move camera towards ideal position
 * @param {Object} cameraController - The camera controller
 */
function smoothCameraMovement(cameraController) {
  // Smoothly interpolate camera position
  cameraController.camera.position.lerp(cameraController.idealPosition, CAMERA_SMOOTHING);
  
  // Smoothly interpolate camera target
  cameraController.target.lerp(cameraController.idealLookAt, CAMERA_SMOOTHING);
} 