// Import necessary modules
import * as THREE from 'three';
import { createRigidBody, createCollider } from './physics.js';
import { createVisualObject } from './scene.js';

/**
 * Create the environment with various objects
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 */
export function createEnvironment(physicsWorld, threeObjects) {
  console.log('Creating environment');
  
  // Create some boxes at different positions
  createBox(physicsWorld, threeObjects, 
    { x: 5, y: 1, z: 5 }, 
    { width: 2, height: 2, depth: 2 }, 
    0xff0000
  );
  
  createBox(physicsWorld, threeObjects, 
    { x: -5, y: 1, z: 5 }, 
    { width: 2, height: 2, depth: 2 }, 
    0x00ff00
  );
  
  createBox(physicsWorld, threeObjects, 
    { x: 0, y: 1, z: -5 }, 
    { width: 2, height: 2, depth: 2 }, 
    0x0000ff
  );
  
  // Create a platform
  createBox(physicsWorld, threeObjects, 
    { x: 0, y: 0.5, z: -10 }, 
    { width: 10, height: 1, depth: 2 }, 
    0xffff00
  );
  
  // Create a ramp
  createBox(physicsWorld, threeObjects, 
    { x: 10, y: 1, z: 0 }, 
    { width: 5, height: 2, depth: 5 }, 
    0xff00ff,
    new THREE.Euler(0, 0, Math.PI / 8)
  );
  
  // Create a wall
  createBox(physicsWorld, threeObjects, 
    { x: -10, y: 2, z: 0 }, 
    { width: 1, height: 4, depth: 10 }, 
    0x00ffff
  );
  
  // Create some dynamic objects
  createSphere(physicsWorld, threeObjects, 
    { x: 0, y: 5, z: 10 }, 
    { radius: 1 }, 
    0xffa500,
    false // Dynamic
  );
  
  createSphere(physicsWorld, threeObjects, 
    { x: 2, y: 5, z: 10 }, 
    { radius: 0.5 }, 
    0xa52a2a,
    false // Dynamic
  );
  
  console.log('Environment created');
}

/**
 * Create a box in the environment
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 * @param {Object} position - The position of the box
 * @param {Object} size - The size of the box
 * @param {number} color - The color of the box
 * @param {Object} rotation - The rotation of the box (optional)
 * @param {boolean} isStatic - Whether the box is static (default: true)
 */
function createBox(physicsWorld, threeObjects, position, size, color, rotation = null, isStatic = true) {
  // Create a physics rigid body for the box
  const rigidBody = createRigidBody(physicsWorld, position, isStatic);
  
  // Apply rotation if provided
  if (rotation) {
    const q = new physicsWorld.RAPIER.Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );
    rigidBody.setRotation(q, true);
  }
  
  // Create a collider for the box
  createCollider(physicsWorld, rigidBody, 'box', size);
  
  // Create a visual representation of the box
  const mesh = createVisualObject(threeObjects, 'box', size, position, color);
  
  // Apply rotation to the mesh if provided
  if (rotation) {
    mesh.rotation.copy(rotation);
  }
  
  return { rigidBody, mesh };
}

/**
 * Create a sphere in the environment
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 * @param {Object} position - The position of the sphere
 * @param {Object} size - The size of the sphere
 * @param {number} color - The color of the sphere
 * @param {boolean} isStatic - Whether the sphere is static (default: true)
 */
function createSphere(physicsWorld, threeObjects, position, size, color, isStatic = true) {
  // Create a physics rigid body for the sphere
  const rigidBody = createRigidBody(physicsWorld, position, isStatic);
  
  // Create a collider for the sphere
  createCollider(physicsWorld, rigidBody, 'sphere', size);
  
  // Create a visual representation of the sphere
  const mesh = createVisualObject(threeObjects, 'sphere', size, position, color);
  
  return { rigidBody, mesh };
} 