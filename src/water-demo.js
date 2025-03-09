/**
 * Water Simulation Demo
 * 
 * This file demonstrates how to use the water simulation with GUI controls.
 * It creates a simple scene with water, a floating object, and GUI controls.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import RAPIER from '@dimforge/rapier3d-compat';

import { createWaterGUI } from './gui-implementation.js';
import { createWaterPhysics } from './water-physics.js';
import { updateWater } from './water-controls.js';

// Global variables
let scene, camera, renderer, controls;
let water, waterPhysics, gui;
let world, floatingObject, floatingObjectBody;
let clock = new THREE.Clock();
let time = 0;

/**
 * Initialize the demo
 */
async function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 10);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(renderer.domElement);
    
    // Add camera controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Initialize physics
    await RAPIER.init();
    world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    
    // Create water
    createWater();
    
    // Create floating object
    createFloatingObject();
    
    // Create GUI
    createGUI();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

/**
 * Create water surface
 */
function createWater() {
    const waterGeometry = new THREE.PlaneGeometry(100, 100);
    
    water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
            function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }
        ),
        sunDirection: new THREE.Vector3(0.5, 0.5, 0),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: false,
        alpha: 1.0
    });
    
    water.rotation.x = -Math.PI / 2; // Rotate to lie flat
    water.position.y = 0; // Water level at y=0
    scene.add(water);
    
    // Create water physics
    waterPhysics = createWaterPhysics(world);
}

/**
 * Create a floating object (capybara placeholder)
 */
function createFloatingObject() {
    // Create visual representation
    const capybaraGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.7, 1.2, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    capybaraGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0.9, 0.2, 0);
    capybaraGroup.add(head);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(1.2, 0.3, 0.3);
    capybaraGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(1.2, 0.3, -0.3);
    capybaraGroup.add(rightEye);
    
    // Position capybara in the scene
    capybaraGroup.position.set(0, 0, 0); // At water level
    scene.add(capybaraGroup);
    
    floatingObject = capybaraGroup;
    
    // Create physics body
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, 0, 0);
    floatingObjectBody = world.createRigidBody(bodyDesc);
    
    // Create collider
    const colliderDesc = RAPIER.ColliderDesc.capsule(0.6, 0.7);
    world.createCollider(colliderDesc, floatingObjectBody);
}

/**
 * Create GUI controls
 */
function createGUI() {
    // Create physics object for GUI to modify
    const physics = {
        buoyancyForce: 20,
        dragCoefficient: 2.0,
        waterLevel: 0
    };
    
    // Create GUI
    gui = createWaterGUI({
        water: water,
        physics: physics,
        waterPhysics: waterPhysics
    });
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Animation loop
 */
function animate() {
    requestAnimationFrame(animate);
    
    const deltaTime = clock.getDelta();
    time += deltaTime;
    
    // Update controls
    controls.update();
    
    // Update water
    updateWater(water, deltaTime);
    
    // Update physics
    waterPhysics.update(deltaTime, 0, time);
    world.step();
    
    // Update floating object position
    const position = floatingObjectBody.translation();
    floatingObject.position.set(position.x, position.y, position.z);
    
    const rotation = floatingObjectBody.rotation();
    floatingObject.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    
    // Render scene
    renderer.render(scene, camera);
}

/**
 * Start the demo
 */
window.addEventListener('DOMContentLoaded', init);

/**
 * How to use this demo:
 * 
 * 1. Include this file in your HTML:
 *    <script type="module" src="src/water-demo.js"></script>
 * 
 * 2. Make sure you have the required dependencies:
 *    - Three.js
 *    - Rapier physics
 *    - lil-gui
 * 
 * 3. The demo will create:
 *    - A water surface with realistic physics
 *    - A floating capybara-like object
 *    - GUI controls for adjusting water parameters
 * 
 * 4. Use the GUI to experiment with different water settings
 */

// Capybara Swim