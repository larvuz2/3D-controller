// Import necessary modules
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createRigidBody, createCollider } from './physics.js';
import { createVisualObject } from './scene.js';

/**
 * Create the environment with various objects
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 */
export function createEnvironment(physicsWorld, threeObjects) {
  console.log('Creating environment');
  
  // Create islands with trees
  createIslandsWithTrees(physicsWorld, threeObjects);
  
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
 * Create islands with trees
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 */
function createIslandsWithTrees(physicsWorld, threeObjects) {
  const loader = new GLTFLoader();
  
  // If models are not available, create simple geometries for islands and trees
  
  // Create first island
  const island1Position = { x: 0, y: 0, z: 0 };
  createSimpleIsland(physicsWorld, threeObjects, island1Position, 5, 1, 5, 0x8B4513);
  
  // Create trees on first island
  createSimpleTree(physicsWorld, threeObjects, { x: 0, y: 1, z: 0 }, 2, 0.5);
  createSimpleTree(physicsWorld, threeObjects, { x: 2, y: 1, z: 2 }, 1.5, 0.4);
  
  // Create second island
  const island2Position = { x: 15, y: 0, z: 15 };
  createSimpleIsland(physicsWorld, threeObjects, island2Position, 8, 1.5, 8, 0x8B4513);
  
  // Create trees on second island
  createSimpleTree(physicsWorld, threeObjects, { x: 15, y: 1.5, z: 15 }, 3, 0.6);
  createSimpleTree(physicsWorld, threeObjects, { x: 18, y: 1.5, z: 12 }, 2, 0.5);
  createSimpleTree(physicsWorld, threeObjects, { x: 12, y: 1.5, z: 18 }, 2.5, 0.55);
  
  // Attempt to load actual models if available
  try {
    // Load island model
    loader.load('/island.glb', (gltf) => {
      const island = gltf.scene;
      island.position.set(30, 0, 30); // Base at water level (y=0)
      island.scale.set(10, 10, 10); // Adjust scale as needed
      threeObjects.scene.add(island);

      // Add physics collider (approximate with a box)
      const islandBody = createRigidBody(physicsWorld, { x: 30, y: 0, z: 30 }, true);
      createCollider(physicsWorld, islandBody, 'box', { width: 10, height: 2, depth: 10 });
    }, undefined, (error) => {
      console.warn('Could not load island model:', error);
    });

    // Load tree model
    loader.load('/tree.glb', (gltf) => {
      const tree = gltf.scene;
      tree.position.set(30, 2, 30); // On island, above water
      tree.scale.set(5, 5, 5); // Adjust scale
      threeObjects.scene.add(tree);

      // Add collider for tree
      const treeBody = createRigidBody(physicsWorld, { x: 30, y: 2, z: 30 }, true);
      createCollider(physicsWorld, treeBody, 'cylinder', { radius: 0.5, height: 2 });
    }, undefined, (error) => {
      console.warn('Could not load tree model:', error);
    });
  } catch (error) {
    console.warn('Error loading models:', error);
  }
}

/**
 * Create a simple island using a cylinder
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 * @param {Object} position - The position of the island
 * @param {number} radiusTop - The top radius of the island
 * @param {number} height - The height of the island
 * @param {number} radiusBottom - The bottom radius of the island
 * @param {number} color - The color of the island
 */
function createSimpleIsland(physicsWorld, threeObjects, position, radiusTop, height, radiusBottom, color) {
  // Create island mesh
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  threeObjects.scene.add(mesh);
  
  // Create physics body for the island
  const rigidBody = createRigidBody(physicsWorld, position, true);
  createCollider(physicsWorld, rigidBody, 'cylinder', { radius: radiusTop, height });
  
  return { rigidBody, mesh };
}

/**
 * Create a simple tree using a cylinder for trunk and a cone for foliage
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 * @param {Object} position - The position of the tree
 * @param {number} height - The height of the tree
 * @param {number} radius - The radius of the tree trunk
 */
function createSimpleTree(physicsWorld, threeObjects, position, height, radius) {
  // Create tree trunk
  const trunkGeometry = new THREE.CylinderGeometry(radius * 0.5, radius, height * 0.4, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(position.x, position.y + height * 0.2, position.z);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  threeObjects.scene.add(trunk);
  
  // Create tree foliage
  const foliageGeometry = new THREE.ConeGeometry(height * 0.3, height * 0.8, 8);
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.set(position.x, position.y + height * 0.6, position.z);
  foliage.castShadow = true;
  foliage.receiveShadow = true;
  threeObjects.scene.add(foliage);
  
  // Create physics body for the tree
  const rigidBody = createRigidBody(physicsWorld, position, true);
  createCollider(physicsWorld, rigidBody, 'cylinder', { radius, height });
  
  return { rigidBody, trunk, foliage };
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