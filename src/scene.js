// Import Three.js
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

// Variables to store Three.js objects
let scene, renderer, camera;
let ground, water, sky;

/**
 * Initialize the Three.js scene
 * @param {HTMLCanvasElement} canvas - The canvas element to render to
 * @returns {Object} The Three.js scene, renderer, and objects
 */
export function initScene(canvas) {
  console.log('Initializing Three.js scene');
  
  // Create scene
  scene = new THREE.Scene();
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  
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
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-1, 1, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  scene.add(directionalLight);
  
  // Create sky
  sky = createSky();
  scene.add(sky.mesh);
  
  // Create water
  water = createWater();
  scene.add(water);
  
  // Remove ground plane as we're using water as the base
  
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
    water
  };
}

/**
 * Create a realistic sky
 * @returns {Object} The sky object
 */
function createSky() {
  const sky = new Sky();
  sky.scale.setScalar(10000);
  
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;
  
  const sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(88);
  const theta = THREE.MathUtils.degToRad(180);
  
  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms['sunPosition'].value.copy(sun);
  
  return { mesh: sky, uniforms: skyUniforms, sun };
}

/**
 * Create a realistic water surface
 * @returns {Object} The water object
 */
function createWater() {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      '/textures/water/waternormals.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(0.70, 0.25, 0.60),
    sunColor: 0xffffff,
    waterColor: 0x001e0f, // Dark greenish water
    distortionScale: 3.7,
    fog: false,
    alpha: 0.9 // Slightly transparent water
  });
  
  water.rotation.x = -Math.PI / 2; // Rotate to lie flat
  water.position.y = 0; // Water level at y=0
  
  return water;
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
  
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.7,
    metalness: 0.2
  });
  mesh = new THREE.Mesh(geometry, material);
  
  mesh.position.set(position.x, position.y, position.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  threeObjects.scene.add(mesh);
  
  return mesh;
}