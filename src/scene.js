// Import Three.js
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { waterParams, lightParams } from './gui.js';

// Variables to store Three.js objects
let scene, renderer, camera;
let water, sky;
let renderTarget, depthMaterial;
let ambientLight, directionalLight;

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
  ambientLight = new THREE.AmbientLight(
    lightParams.ambientColor, 
    lightParams.ambientIntensity
  );
  scene.add(ambientLight);
  
  directionalLight = new THREE.DirectionalLight(
    lightParams.directionalColor, 
    lightParams.directionalIntensity
  );
  directionalLight.position.set(0, 100, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  scene.add(directionalLight);
  
  // Create sky
  sky = createSky();
  scene.add(sky);
  
  // Create water
  water = createStylizedWater();
  scene.add(water);
  
  // Setup render target for depth texture
  setupRenderTarget();
  
  // Create depth material for water shader
  depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.depthPacking = THREE.RGBADepthPacking;
  depthMaterial.blending = THREE.NoBlending;
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update render target size
    const pixelRatio = renderer.getPixelRatio();
    renderTarget.setSize(
      window.innerWidth * pixelRatio,
      window.innerHeight * pixelRatio
    );
    
    // Update water shader resolution
    if (water && water.material.uniforms) {
      water.material.uniforms.resolution.value.set(
        window.innerWidth * pixelRatio,
        window.innerHeight * pixelRatio
      );
    }
  });
  
  console.log('Three.js scene initialized');
  
  return {
    scene,
    renderer,
    camera,
    water,
    depthMaterial,
    renderTarget,
    ambientLight,
    directionalLight,
    sky: sky.uniforms
  };
}

/**
 * Setup render target for depth texture
 */
function setupRenderTarget() {
  const pixelRatio = renderer.getPixelRatio();
  
  renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth * pixelRatio,
    window.innerHeight * pixelRatio
  );
  renderTarget.texture.minFilter = THREE.NearestFilter;
  renderTarget.texture.magFilter = THREE.NearestFilter;
  renderTarget.texture.generateMipmaps = false;
  renderTarget.stencilBuffer = false;
  
  // Check if depth texture extension is supported
  const supportsDepthTextureExtension = !!renderer.extensions.get("WEBGL_depth_texture");
  
  if (supportsDepthTextureExtension) {
    renderTarget.depthTexture = new THREE.DepthTexture();
    renderTarget.depthTexture.type = THREE.UnsignedShortType;
    renderTarget.depthTexture.minFilter = THREE.NearestFilter;
    renderTarget.depthTexture.maxFilter = THREE.NearestFilter;
  }
}

/**
 * Create a realistic sky
 * @returns {Object} The sky object
 */
function createSky() {
  const sky = new Sky();
  sky.scale.setScalar(10000);
  
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = lightParams.turbidity;
  skyUniforms['rayleigh'].value = lightParams.rayleigh;
  skyUniforms['mieCoefficient'].value = lightParams.mieCoefficient;
  skyUniforms['mieDirectionalG'].value = lightParams.mieDirectionalG;
  
  const sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - lightParams.sunElevation);
  const theta = THREE.MathUtils.degToRad(lightParams.sunAzimuth);
  
  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms['sunPosition'].value.copy(sun);
  
  return { mesh: sky, uniforms: skyUniforms, sun };
}

/**
 * Create stylized water using the Water class
 * @returns {Object} The water object
 */
function createStylizedWater() {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('/textures/water/waternormals.jpg', (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(0, 1, 0),
    sunColor: 0xffffff,
    waterColor: waterParams.waterColor,
    distortionScale: waterParams.waveHeight * 50,
    fog: scene.fog !== undefined
  });
  
  water.rotation.x = -Math.PI / 2; // Rotate to lie flat
  water.position.y = 0; // Set at ground level
  
  return water;
}

/**
 * Render the scene with water shader
 * @param {Object} threeObjects - The Three.js objects
 */
export function renderScene(threeObjects) {
  // Depth pass for water shader
  if (threeObjects.water) {
    threeObjects.water.visible = false; // Hide water for depth pass
    threeObjects.scene.overrideMaterial = threeObjects.depthMaterial;
    
    threeObjects.renderer.setRenderTarget(threeObjects.renderTarget);
    threeObjects.renderer.render(threeObjects.scene, threeObjects.camera);
    threeObjects.renderer.setRenderTarget(null);
    
    threeObjects.scene.overrideMaterial = null;
    threeObjects.water.visible = true;
  }
  
  // Beauty pass
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