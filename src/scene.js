// Import Three.js
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';

// Variables to store Three.js objects
let scene, renderer, camera;
let ground, water;

/**
 * Initialize the Three.js scene
 * @param {HTMLCanvasElement} canvas - The canvas element to render to
 * @returns {Object} The Three.js scene, renderer, and objects
 */
export function initScene(canvas) {
  console.log('Initializing Three.js scene');
  
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Sky blue background
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  
  // Create camera
  camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  // Create water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000); // Large plane for the pond
  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      '/textures/water/waternormals.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    alpha: 1.0,
    sunDirection: new THREE.Vector3(0, 1, 0), // Sun direction for lighting
    sunColor: 0xffffff,
    waterColor: 0x001e0f, // Dark greenish water
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2; // Rotate to lie flat
  water.position.y = 0; // Water level at y=0
  scene.add(water);
  
  // Create ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3a9d23, // Green color
    roughness: 0.8,
  });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  ground.receiveShadow = true;
  scene.add(ground);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  console.log('Three.js scene initialized');
  
  return {
    scene,
    renderer,
    camera,
    ground,
    water
  };
}

/**
 * Render the scene
 * @param {Object} threeObjects - The Three.js objects
 */
export function renderScene(threeObjects) {
  threeObjects.renderer.render(threeObjects.scene, threeObjects.camera);
}

/**
 * Create a visual representation of a physics object
 * @param {Object} threeObjects - The Three.js objects
 * @param {string} shape - The shape of the object ('box', 'sphere', 'capsule')
 * @param {Object} size - The dimensions of the object
 * @param {Object} position - The position of the object
 * @param {number} color - The color of the object
 * @returns {Object} The created mesh
 */
export function createVisualObject(threeObjects, shape, size, position, color = 0x2194ce) {
  let geometry, mesh;
  
  switch (shape) {
    case 'box':
      geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(size.radius, 32, 32);
      break;
    case 'capsule':
      geometry = new THREE.CapsuleGeometry(
        size.radius, 
        size.height - size.radius * 2, 
        16, 
        16
      );
      break;
    default:
      throw new Error(`Unsupported visual shape: ${shape}`);
  }
  
  const material = new THREE.MeshStandardMaterial({ color });
  mesh = new THREE.Mesh(geometry, material);
  
  mesh.position.set(position.x, position.y, position.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  threeObjects.scene.add(mesh);
  
  return mesh;
} 