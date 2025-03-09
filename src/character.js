// Import necessary modules
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { createRigidBody, createCollider } from './physics.js';
import { createVisualObject } from './scene.js';

// Character constants
const CHARACTER_HEIGHT = 2.0;
const CHARACTER_RADIUS = 0.5;
const MOVE_SPEED = 5.0;
const JUMP_FORCE = 10.0;
const ROTATION_SPEED = 0.1;
const GROUND_CHECK_DISTANCE = 0.1;
const WATER_LEVEL = 0; // Water level at y=0

/**
 * Create a character controller
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 * @param {Object} loadingManager - Optional Three.js loading manager
 * @returns {Object} The character controller
 */
export function createCharacter(physicsWorld, threeObjects, loadingManager) {
  console.log('Creating character controller');
  
  // Create character position at water level (half-submerged)
  const position = { x: 0, y: 0, z: 0 }; // Center at water level (y=0)
  
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
  
  // Create character visual representation (transparent capsule)
  const mesh = createVisualObject(threeObjects, 'capsule', {
    radius: CHARACTER_RADIUS,
    height: CHARACTER_HEIGHT
  }, position, 0x2194ce);
  
  // Make the capsule transparent immediately and disable its shadow
  if (mesh.material) {
    mesh.material.transparent = true;
    mesh.material.opacity = 0;
    mesh.material.needsUpdate = true;
  }
  
  // Disable the capsule shadow
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  
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
    isFloating: true, // New property to track if character is in water
    velocity: new THREE.Vector3(),
    cameraOffset: new THREE.Vector3(0, 1.5, 0), // Camera offset from character position
    modelLoaded: false,
    model: null
  };
  
  // Load the character 3D model
  loadCharacterModel(character, threeObjects, loadingManager);
  
  console.log('Character controller created');
  
  return character;
}

/**
 * Load the character 3D model
 * @param {Object} character - The character controller
 * @param {Object} threeObjects - The Three.js objects
 * @param {Object} loadingManager - Optional Three.js loading manager
 */
function loadCharacterModel(character, threeObjects, loadingManager) {
  const loader = new FBXLoader(loadingManager);
  const modelPath = '/assets/models/character/ybot.fbx';
  
  // Make the capsule transparent immediately
  if (character.mesh && character.mesh.material) {
    character.mesh.material.transparent = true;
    character.mesh.material.opacity = 0;
    character.mesh.material.needsUpdate = true;
    
    // Disable the capsule shadow
    character.mesh.castShadow = false;
    character.mesh.receiveShadow = false;
  }
  
  loader.load(
    modelPath,
    (fbx) => {
      console.log('Character model loaded successfully');
      
      // Scale the model appropriately
      fbx.scale.set(0.01, 0.01, 0.01);
      
      // Position the model relative to the character's center
      // Adjust the Y position to make the feet touch the ground
      fbx.position.set(0, -1.8, 0);
      
      // Enable shadows for the model
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Add the model to the character mesh
      character.mesh.add(fbx);
      
      // Store the model reference
      character.model = fbx;
      character.modelLoaded = true;
      
      // Ensure the capsule is completely transparent
      if (character.mesh.material) {
        character.mesh.material.transparent = true;
        character.mesh.material.opacity = 0;
        character.mesh.material.needsUpdate = true;
      }
      
      // Ensure the capsule doesn't cast shadows
      character.mesh.castShadow = false;
      character.mesh.receiveShadow = false;
    },
    (xhr) => {
      console.log(`Character model loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
      console.error('Error loading character model:', error);
    }
  );
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
  
  // Apply movement force in the direction of movement
  const movementForce = {
    x: character.direction.x * MOVE_SPEED,
    y: velocity.y, // Preserve vertical velocity
    z: character.direction.z * MOVE_SPEED
  };
  
  // Apply jump force if jumping and grounded
  if (inputState.jump && character.isGrounded) {
    movementForce.y = JUMP_FORCE;
  }
  
  // Set the character's velocity
  character.rigidBody.setLinvel(movementForce, true);
  
  // Store velocity for reference
  character.velocity.set(movementForce.x, movementForce.y, movementForce.z);
}

/**
 * Update the mesh position and rotation based on the physics body
 * @param {Object} character - The character controller
 */
function updateMeshFromBody(character) {
  // Get the position and rotation from the physics body
  const position = character.rigidBody.translation();
  const rotation = character.rigidBody.rotation();
  
  // Update the mesh position and rotation
  character.mesh.position.set(position.x, position.y, position.z);
  character.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
}