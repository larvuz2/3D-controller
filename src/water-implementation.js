/**
 * Water Implementation Example
 * 
 * This file demonstrates how to integrate the water simulation components
 * into the existing 3D-controller project.
 */

import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import RAPIER from '@dimforge/rapier3d-compat';

import { createWaterControls, updateWater, waterParams } from './water-controls.js';
import { createWaterPhysics, waterPhysicsParams } from './water-physics.js';
import { createEnhancedWater } from './water-shaders.js';

/**
 * Adds water simulation to an existing scene and physics world
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {RAPIER.World} world - The Rapier physics world
 * @param {Object} options - Optional configuration parameters
 * @returns {Object} Water simulation objects and utilities
 */
export function addWaterSimulation(scene, world, options = {}) {
    // Default options
    const defaultOptions = {
        useEnhancedShaders: false,  // Whether to use custom shaders or standard Water
        waterSize: 100,             // Size of water plane
        waterPosition: { x: 0, y: 0, z: 0 }, // Position of water plane
        waterLevel: 0,              // Water level for physics (y-coordinate)
        addGui: true                // Whether to add GUI controls
    };
    
    // Merge with provided options
    const config = { ...defaultOptions, ...options };
    
    // Create water geometry
    const waterGeometry = new THREE.PlaneGeometry(config.waterSize, config.waterSize);
    
    // Create water object (either enhanced or standard)
    let water;
    
    if (config.useEnhancedShaders) {
        // Use custom enhanced water with advanced shaders
        water = createEnhancedWater(waterGeometry, {
            waterNormals: options.waterNormals || 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
            textureWidth: waterParams.textureWidth,
            textureHeight: waterParams.textureHeight,
            waterColor: waterParams.waterColor,
            sunColor: waterParams.sunColor,
            distortionScale: waterParams.distortionScale,
            alpha: waterParams.alpha,
            waveHeight: waterParams.waveHeight,
            waveFrequency: waterParams.waveFrequency
        });
    } else {
        // Use standard Three.js Water
        water = new Water(waterGeometry, {
            textureWidth: waterParams.textureWidth,
            textureHeight: waterParams.textureHeight,
            waterNormals: new THREE.TextureLoader().load(
                options.waterNormals || 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
                function(texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }
            ),
            sunDirection: new THREE.Vector3(0.5, 0.5, 0),
            sunColor: waterParams.sunColor,
            waterColor: waterParams.waterColor,
            distortionScale: waterParams.distortionScale,
            fog: scene.fog !== undefined,
            alpha: waterParams.alpha
        });
    }
    
    // Position and rotate water
    water.rotation.x = -Math.PI / 2; // Rotate to lie flat
    water.position.set(
        config.waterPosition.x,
        config.waterPosition.y,
        config.waterPosition.z
    );
    
    // Add water to scene
    scene.add(water);
    
    // Create physics for water interaction
    const waterPhysics = createWaterPhysics(world, {
        // Optional custom physics parameters
        density: waterPhysicsParams.density,
        buoyancyMultiplier: waterPhysicsParams.buoyancyMultiplier,
        linearDrag: waterPhysicsParams.linearDrag,
        quadraticDrag: waterPhysicsParams.quadraticDrag,
        waveHeight: waterPhysicsParams.waveHeight,
        waveFrequency: waterPhysicsParams.waveFrequency,
        waveSpeed: waterPhysicsParams.waveSpeed
    });
    
    // Create GUI controls if requested
    let gui;
    if (config.addGui) {
        // Create physics object for GUI to modify
        const physics = {
            buoyancyForce: waterPhysicsParams.buoyancyMultiplier * 9.81,
            dragCoefficient: waterPhysicsParams.linearDrag,
            waterLevel: config.waterLevel
        };
        
        // Create GUI
        gui = createWaterControls(water, physics);
        
        // Connect GUI physics to water physics
        const originalUpdate = waterPhysics.update;
        waterPhysics.update = function(deltaTime, time) {
            // Update settings from GUI
            waterPhysics.settings.buoyancyMultiplier = physics.buoyancyForce / 9.81;
            waterPhysics.settings.linearDrag = physics.dragCoefficient;
            
            // Call original update with current water level
            originalUpdate.call(this, deltaTime, physics.waterLevel, time);
        };
    }
    
    // Return water simulation objects and utilities
    return {
        water,
        waterPhysics,
        gui,
        
        // Update method to call in animation loop
        update: function(deltaTime, time) {
            // Update water material (animation)
            if (config.useEnhancedShaders) {
                water.update(null, scene, null, deltaTime);
            } else {
                updateWater(water, deltaTime);
            }
            
            // Update water physics
            waterPhysics.update(deltaTime, config.waterLevel, time);
        },
        
        // Clean up method
        dispose: function() {
            if (gui) gui.destroy();
            if (water.geometry) water.geometry.dispose();
            if (water.material) water.material.dispose();
            if (water.material.uniforms.normalSampler.value) 
                water.material.uniforms.normalSampler.value.dispose();
            scene.remove(water);
        }
    };
}

/**
 * Integration Guide:
 * 
 * 1. Import the water simulation in your main file:
 *    import { addWaterSimulation } from './water-implementation.js';
 * 
 * 2. After creating your scene and physics world, add water:
 *    const waterSim = addWaterSimulation(scene, world, {
 *        waterLevel: 0,
 *        waterSize: 100,
 *        useEnhancedShaders: true // For advanced effects
 *    });
 * 
 * 3. In your animation loop, update the water simulation:
 *    function animate(time) {
 *        const deltaTime = clock.getDelta();
 *        
 *        // Update water
 *        waterSim.update(deltaTime, time);
 *        
 *        // Rest of your animation code...
 *        
 *        requestAnimationFrame(animate);
 *    }
 * 
 * 4. To make objects float, ensure they are dynamic rigid bodies in Rapier.
 *    The water physics will automatically apply buoyancy to all dynamic bodies.
 * 
 * 5. For cleanup when changing scenes:
 *    waterSim.dispose();
 */

// Capybara Swim