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
  
  // Load GLB models for environment assets
  loadEnvironmentAssets(physicsWorld, threeObjects);
  
  // Create a floating platform
  createBox(physicsWorld, threeObjects, 
    { x: 10, y: 0.5, z: 10 }, 
    { width: 5, height: 1, depth: 5 }, 
    0x8B4513, // Brown wooden color
    null,
    false // Make it dynamic so it floats
  );
  
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
 * Load GLB models for environment assets
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 */
function loadEnvironmentAssets(physicsWorld, threeObjects) {
  const loader = new GLTFLoader();
  
  // Define island positions
  const islandPositions = [
    { x: 30, y: 0, z: 30, scale: 10 },
    { x: -40, y: 0, z: 20, scale: 15 },
    { x: 0, y: 0, z: -50, scale: 20 }
  ];
  
  // Load island model
  // Note: This is a placeholder. You should replace with your actual model path
  // If the model doesn't exist, it will fail silently and use the procedural islands instead
  loader.load('/assets/models/island.glb', (gltf) => {
    console.log('Island model loaded');
    
    // Create multiple islands at different positions
    islandPositions.forEach(pos => {
      const island = gltf.scene.clone();
      island.position.set(pos.x, pos.y, pos.z);
      island.scale.set(pos.scale, pos.scale, pos.scale);
      threeObjects.scene.add(island);
      
      // Add physics collider (approximate with a box)
      const islandBody = createRigidBody(
        physicsWorld,
        { 
          type: 'fixed',
          position: { x: pos.x, y: pos.y, z: pos.z }
        }
      );
      
      createCollider(
        physicsWorld,
        islandBody,
        {
          shape: 'cuboid',
          halfExtents: { x: pos.scale * 2, y: pos.scale, z: pos.scale * 2 }
        }
      );
    });
  }, 
  // Progress callback
  (xhr) => {
    console.log(`Island model: ${(xhr.loaded / xhr.total * 100)}% loaded`);
  },
  // Error callback
  (error) => {
    console.warn('Could not load island model:', error);
    console.log('Using procedural islands instead');
  });
  
  // Define tree positions
  const treePositions = [
    { x: 30, y: 10, z: 30, scale: 5 },
    { x: 35, y: 10, z: 25, scale: 3 },
    { x: -40, y: 15, z: 20, scale: 4 },
    { x: -45, y: 15, z: 25, scale: 6 },
    { x: 0, y: 20, z: -50, scale: 7 },
    { x: 5, y: 20, z: -55, scale: 4 }
  ];
  
  // Load tree model
  // Note: This is a placeholder. You should replace with your actual model path
  loader.load('/assets/models/tree.glb', (gltf) => {
    console.log('Tree model loaded');
    
    // Create multiple trees at different positions
    treePositions.forEach(pos => {
      const tree = gltf.scene.clone();
      tree.position.set(pos.x, pos.y, pos.z);
      tree.scale.set(pos.scale, pos.scale, pos.scale);
      threeObjects.scene.add(tree);
      
      // Add physics collider (approximate with a cylinder)
      const treeBody = createRigidBody(
        physicsWorld,
        { 
          type: 'fixed',
          position: { x: pos.x, y: pos.y, z: pos.z }
        }
      );
      
      createCollider(
        physicsWorld,
        treeBody,
        {
          shape: 'cylinder',
          halfHeight: pos.scale * 2,
          radius: pos.scale * 0.5
        }
      );
    });
  },
  // Progress callback
  (xhr) => {
    console.log(`Tree model: ${(xhr.loaded / xhr.total * 100)}% loaded`);
  },
  // Error callback
  (error) => {
    console.warn('Could not load tree model:', error);
    console.log('Using procedural trees instead');
  });
}

/**
 * Create islands with trees
 * @param {Object} physicsWorld - The physics world
 * @param {Object} threeObjects - The Three.js objects
 */
function createIslandsWithTrees(physicsWorld, threeObjects) {
  const loader = new GLTFLoader();
  
  // Create multiple islands with trees
  
  // Main central island
  const mainIslandPosition = { x: 0, y: -0.5, z: 0 };
  const mainIsland = createSimpleIsland(physicsWorld, threeObjects, mainIslandPosition, 8, 1.5, 10, 0x8B4513);
  
  // Add trees to main island
  createSimpleTree(physicsWorld, threeObjects, { x: 0, y: 1, z: 0 }, 3, 0.5);
  createSimpleTree(physicsWorld, threeObjects, { x: 3, y: 1, z: 2 }, 2.5, 0.4);
  createSimpleTree(physicsWorld, threeObjects, { x: -2, y: 1, z: -3 }, 3.5, 0.6);
  createSimpleTree(physicsWorld, threeObjects, { x: 4, y: 1, z: -2 }, 2, 0.3);
  
  // Small island 1
  const island1Position = { x: 15, y: -0.5, z: 15 };
  createSimpleIsland(physicsWorld, threeObjects, island1Position, 4, 1, 5, 0x8B4513);
  
  // Add trees to small island 1
  createSimpleTree(physicsWorld, threeObjects, { x: 15, y: 0.5, z: 15 }, 2.5, 0.4);
  createSimpleTree(physicsWorld, threeObjects, { x: 17, y: 0.5, z: 14 }, 1.8, 0.3);
  
  // Small island 2
  const island2Position = { x: -15, y: -0.5, z: 10 };
  createSimpleIsland(physicsWorld, threeObjects, island2Position, 3, 1, 4, 0x8B4513);
  
  // Add trees to small island 2
  createSimpleTree(physicsWorld, threeObjects, { x: -15, y: 0.5, z: 10 }, 2, 0.35);
  
  // Small island 3
  const island3Position = { x: 5, y: -0.5, z: -20 };
  createSimpleIsland(physicsWorld, threeObjects, island3Position, 5, 1.2, 6, 0x8B4513);
  
  // Add trees to small island 3
  createSimpleTree(physicsWorld, threeObjects, { x: 5, y: 0.7, z: -20 }, 3, 0.5);
  createSimpleTree(physicsWorld, threeObjects, { x: 7, y: 0.7, z: -18 }, 2.2, 0.4);
  createSimpleTree(physicsWorld, threeObjects, { x: 3, y: 0.7, z: -22 }, 2.5, 0.45);
  
  // Add vegetation to islands
  addVegetation(threeObjects, mainIslandPosition, 8);
  addVegetation(threeObjects, island1Position, 4);
  addVegetation(threeObjects, island2Position, 3);
  addVegetation(threeObjects, island3Position, 5);
  
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