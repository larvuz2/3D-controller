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
  
  // Load single island in the middle of the scene
  loadSingleIsland(physicsWorld, threeObjects);
  
  // Create some floating spheres
  createSphere(physicsWorld, threeObjects, 
    { x: 5, y: 0, z: 15 }, 
    { radius: 1 }, 
    0xffa500, // Orange
    false // Dynamic
  );
  
  createSphere(physicsWorld, threeObjects, 
    { x: -5, y: 0, z: 10 }, 
    { radius: 0.7 }, 
    0xa52a2a, // Brown
    false // Dynamic
  );
  
  console.log('Environment created');
}

/**
 * Load a single island in the middle of the scene
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 */
function loadSingleIsland(physicsWorld, threeObjects) {
  const loader = new GLTFLoader();
  
  // Define island position in the middle of the scene
  const islandPosition = { x: 0, y: 0, z: 0 };
  const islandScale = 15; // Larger scale for a single island
  
  // Load island model
  loader.load('/models/island.glb', (gltf) => {
    console.log('Island model loaded');
    
    // Create a single island in the middle
    const island = gltf.scene;
    island.position.set(islandPosition.x, islandPosition.y, islandPosition.z);
    island.scale.set(islandScale, islandScale, islandScale);
    threeObjects.scene.add(island);
    
    // Add physics collider (approximate with a box)
    const islandBody = createRigidBody(
      physicsWorld,
      { 
        type: 'fixed',
        position: islandPosition
      }
    );
    
    createCollider(
      physicsWorld,
      islandBody,
      {
        shape: 'cuboid',
        halfExtents: { x: islandScale * 2, y: islandScale, z: islandScale * 2 }
      }
    );
    
    // Add some trees on the island
    addTreesToIsland(physicsWorld, threeObjects, islandPosition, islandScale);
  }, 
  // Progress callback
  (xhr) => {
    console.log(`Island model: ${(xhr.loaded / xhr.total * 100)}% loaded`);
  },
  // Error callback
  (error) => {
    console.warn('Could not load island model:', error);
    console.log('Using procedural island instead');
    
    // Fallback to a simple procedural island
    createSimpleIsland(
      physicsWorld, 
      threeObjects, 
      { x: 0, y: -0.5, z: 0 }, 
      8, 1.5, 10, 
      0x8B4513
    );
  });
}

/**
 * Add trees to the island
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 * @param {Object} islandPosition - The position of the island
 * @param {number} islandScale - The scale of the island
 */
function addTreesToIsland(physicsWorld, threeObjects, islandPosition, islandScale) {
  // Define tree positions relative to the island center
  const treePositions = [
    { x: 0, y: islandScale, z: 0, scale: 5 },
    { x: 5, y: islandScale, z: 5, scale: 3 },
    { x: -5, y: islandScale, z: -5, scale: 4 },
    { x: -3, y: islandScale, z: 7, scale: 2 },
    { x: 7, y: islandScale, z: -3, scale: 3.5 }
  ];
  
  // Create simple trees at these positions
  treePositions.forEach(pos => {
    createSimpleTree(
      physicsWorld, 
      threeObjects, 
      { 
        x: islandPosition.x + pos.x, 
        y: islandPosition.y + pos.y, 
        z: islandPosition.z + pos.z 
      }, 
      pos.scale, 
      pos.scale * 0.2
    );
  });
}

/**
 * Create islands with trees
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 */
function createIslandsWithTrees(physicsWorld, threeObjects) {
  // This function is no longer used - we're loading a single island instead
  console.log('createIslandsWithTrees is deprecated - using loadSingleIsland instead');
}

/**
 * Add vegetation (grass, flowers) to an island
 * @param {Object} threeObjects - The Three.js objects
 * @param {Object} islandPosition - The position of the island
 * @param {number} radius - The radius of the island
 */
function addVegetation(threeObjects, islandPosition, radius) {
  // Create grass
  const grassGeometry = new THREE.PlaneGeometry(radius * 2, radius * 2);
  const grassMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7CFC00, // Bright green
    side: THREE.DoubleSide,
    roughness: 0.8
  });
  
  const grass = new THREE.Mesh(grassGeometry, grassMaterial);
  grass.rotation.x = -Math.PI / 2; // Lay flat
  grass.position.set(
    islandPosition.x, 
    islandPosition.y + 0.01, // Slightly above island
    islandPosition.z
  );
  threeObjects.scene.add(grass);
  
  // Add some random flowers or small details
  const flowerCount = Math.floor(radius * 3); // More flowers for bigger islands
  
  for (let i = 0; i < flowerCount; i++) {
    // Random position within island radius
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * (radius * 0.8); // Keep within 80% of radius
    const x = islandPosition.x + Math.cos(angle) * distance;
    const z = islandPosition.z + Math.sin(angle) * distance;
    
    // Random flower color
    const colors = [0xFF1493, 0xFFFF00, 0xFF4500, 0x9932CC, 0xFFFFFF];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create a simple flower with a sphere and cylinder
    const flowerGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const flowerMaterial = new THREE.MeshStandardMaterial({ color });
    const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
    
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    
    // Position flower and stem
    stem.position.set(x, islandPosition.y + 0.25, z);
    flower.position.set(x, islandPosition.y + 0.6, z);
    
    threeObjects.scene.add(stem);
    threeObjects.scene.add(flower);
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
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.9,
    metalness: 0.1
  });
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
  const trunkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.9,
    metalness: 0.1
  });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(position.x, position.y + height * 0.2, position.z);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  threeObjects.scene.add(trunk);
  
  // Create multiple layers of foliage for a more realistic tree
  const foliageColors = [0x228B22, 0x006400, 0x32CD32]; // Different shades of green
  const foliageLayers = 3;
  
  for (let i = 0; i < foliageLayers; i++) {
    const layerSize = height * 0.3 * (1 - i * 0.2); // Decreasing size for higher layers
    const layerHeight = height * 0.2;
    const layerY = position.y + height * 0.4 + i * layerHeight * 0.8;
    
    const foliageGeometry = new THREE.ConeGeometry(layerSize, layerHeight, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({ 
      color: foliageColors[i % foliageColors.length],
      roughness: 0.8,
      metalness: 0.1
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(position.x, layerY, position.z);
    foliage.castShadow = true;
    foliage.receiveShadow = true;
    threeObjects.scene.add(foliage);
  }
  
  // Create physics body for the tree
  const rigidBody = createRigidBody(physicsWorld, position, true);
  createCollider(physicsWorld, rigidBody, 'cylinder', { radius, height });
  
  return { rigidBody };
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