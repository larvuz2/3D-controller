// Import necessary modules
import * as THREE from 'three';
import { createRigidBody, createCollider } from './physics.js';
import { createVisualObject } from './scene.js';

// Character constants
const CHARACTER_HEIGHT = 2.0;
const CHARACTER_RADIUS = 0.5;
const MOVE_SPEED = 5.0;
const JUMP_FORCE = 10.0;
const ROTATION_SPEED = 0.1;
const GROUND_CHECK_DISTANCE = 0.1;

/**
 * Create a character controller
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 * @returns {Object} The character controller
 */
export function createCharacter(physicsWorld, threeObjects) {
  console.log('Creating character controller');
  
  // Create character position
  const position = { x: 0, y: CHARACTER_HEIGHT, z: 0 };
  
  // Create character physics body
  const rigidBody = createRigidBody(physicsWorld, position);
  
  // Set character physics properties
  rigidBody.setLinearDamping(0.5); // Add some damping to prevent sliding
  rigidBody.setAngularDamping(0.5); // Add some damping to prevent spinning
  rigidBody.lockRotations(true); // Lock rotations to prevent tipping over
  
  // Create character collider (capsule shape)
  const collider = createCollider(physicsWorld, rigidBody, 'capsule', {
    radius: CHARACTER_RADIUS,
    height: CHARACTER_HEIGHT
  });
  
  // Create character visual representation
  const mesh = createVisualObject(threeObjects, 'capsule', {
    radius: CHARACTER_RADIUS,
    height: CHARACTER_HEIGHT
  }, position, 0x2194ce);
  
  // Create a direction vector for movement
  const direction = new THREE.Vector3();
  
  // Create a rotation object for the character
  const rotation = new THREE.Euler(0, 0, 0, 'YXZ');
  
  // Create the character controller object
  const character = {
    rigidBody,
    collider,
    mesh,
    direction,
    rotation,
    isGrounded: false,
    velocity: new THREE.Vector3(),
    cameraOffset: new THREE.Vector3(0, 1.5, 0) // Camera offset from character position
  };
  
  console.log('Character controller created');
  
  return character;
}

/**
 * Update the character based on input
 * @param {Object} character - The character controller
 * @param {Object} inputState - The current input state
 * @param {Object} physicsWorld - The physics world
 * @param {Object} camera - The camera
 */
export function updateCharacter(character, inputState, physicsWorld, camera) {
  // Check if character is grounded
  character.isGrounded = checkGrounded(character, physicsWorld);
  
  // Update character rotation based on mouse input
  updateRotation(character, inputState, camera);
  
  // Calculate movement direction based on input and character rotation
  calculateMovementDirection(character, inputState);
  
  // Apply movement to the character
  applyMovement(character, inputState);
  
  // Update mesh position and rotation based on physics body
  updateMeshFromBody(character);
}

/**
 * Check if the character is grounded
 * @param {Object} character - The character controller
 * @param {Object} physicsWorld - The physics world
 * @returns {boolean} Whether the character is grounded
 */
function checkGrounded(character, physicsWorld) {
  // Get character position
  const position = character.rigidBody.translation();
  
  // Create a ray from the character's feet downward
  const rayOrigin = { 
    x: position.x, 
    y: position.y - CHARACTER_HEIGHT / 2 + CHARACTER_RADIUS, 
    z: position.z 
  };
  const rayDirection = { x: 0, y: -1, z: 0 };
  
  // Cast the ray to check for ground
  const ray = new physicsWorld.RAPIER.Ray(rayOrigin, rayDirection);
  const hit = physicsWorld.world.castRay(ray, GROUND_CHECK_DISTANCE, true);
  
  return hit !== null;
}

/**
 * Update character rotation based on mouse input
 * @param {Object} character - The character controller
 * @param {Object} inputState - The current input state
 * @param {Object} camera - The camera
 */
function updateRotation(character, inputState, camera) {
  // Update rotation based on mouse movement
  character.rotation.y -= inputState.mouseX * ROTATION_SPEED * 0.01;
  
  // Apply rotation to the camera
  camera.rotation.y = character.rotation.y;
}

/**
 * Calculate movement direction based on input and character rotation
 * @param {Object} character - The character controller
 * @param {Object} inputState - The current input state
 */
function calculateMovementDirection(character, inputState) {
  // Reset direction
  character.direction.set(0, 0, 0);
  
  // Calculate forward/backward movement
  if (inputState.forward) character.direction.z = -1;
  if (inputState.backward) character.direction.z = 1;
  
  // Calculate left/right movement
  if (inputState.left) character.direction.x = -1;
  if (inputState.right) character.direction.x = 1;
  
  // Normalize direction if moving diagonally
  if (character.direction.length() > 1) {
    character.direction.normalize();
  }
  
  // Apply character rotation to direction
  character.direction.applyEuler(character.rotation);
}

/**
 * Apply movement to the character
 * @param {Object} character - The character controller
 * @param {Object} inputState - The current input state
 */
function applyMovement(character, inputState) {
  // Get current velocity
  const velocity = character.rigidBody.linvel();
  
  // Calculate new velocity based on movement direction
  const newVelocity = {
    x: character.direction.x * MOVE_SPEED,
    y: velocity.y, // Maintain vertical velocity
    z: character.direction.z * MOVE_SPEED
  };
  
  // Apply jump if grounded and jump button pressed
  if (character.isGrounded && inputState.jump) {
    newVelocity.y = JUMP_FORCE;
  }
  
  // Apply the new velocity to the rigid body
  character.rigidBody.setLinvel(newVelocity, true);
}

/**
 * Update mesh position and rotation based on physics body
 * @param {Object} character - The character controller
 */
function updateMeshFromBody(character) {
  // Get position from rigid body
  const position = character.rigidBody.translation();
  
  // Update mesh position
  character.mesh.position.set(position.x, position.y, position.z);
  
  // Update mesh rotation based on character rotation
  character.mesh.rotation.y = character.rotation.y;
} 