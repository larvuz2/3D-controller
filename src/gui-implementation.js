/**
 * GUI Implementation for Water Controls
 * 
 * This file provides a dedicated implementation of the GUI controls
 * for the water simulation, ensuring they are properly displayed and
 * connected to the water parameters.
 */

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import * as THREE from 'three';
import { waterParams } from './water-controls.js';
import { waterPhysicsParams } from './water-physics.js';

/**
 * Creates and configures the GUI for water simulation
 * @param {Object} options - Configuration options
 * @returns {GUI} The created GUI instance
 */
export function createWaterGUI(options = {}) {
    // Default options
    const defaultOptions = {
        water: null,           // Water object (required for direct control)
        physics: null,         // Physics object (required for direct control)
        waterPhysics: null,    // Water physics simulator (optional)
        title: 'Water Controls',
        width: 300,
        closeable: true
    };
    
    // Merge with provided options
    const config = { ...defaultOptions, ...options };
    
    // Create GUI
    const gui = new GUI({ 
        title: config.title,
        width: config.width,
        closeable: config.closeable
    });
    
    // Create physics object if not provided
    const physics = config.physics || {
        buoyancyForce: waterPhysicsParams.buoyancyMultiplier * 9.81,
        dragCoefficient: waterPhysicsParams.linearDrag,
        waterLevel: 0
    };
    
    // Create folders
    const visualFolder = gui.addFolder('Visual Properties');
    const waveFolder = gui.addFolder('Wave Properties');
    const reflectionFolder = gui.addFolder('Reflection & Refraction');
    const foamFolder = gui.addFolder('Foam Effects');
    const physicsFolder = gui.addFolder('Physics');
    const performanceFolder = gui.addFolder('Performance');
    
    // Visual properties
    const waterColorParam = { color: waterParams.waterColor };
    visualFolder.addColor(waterColorParam, 'color').name('Water Color').onChange((value) => {
        if (config.water && config.water.material && config.water.material.uniforms) {
            config.water.material.uniforms['waterColor'].value.set(value);
        }
    });
    
    const sunColorParam = { color: waterParams.sunColor };
    visualFolder.addColor(sunColorParam, 'color').name('Sun Color').onChange((value) => {
        if (config.water && config.water.material && config.water.material.uniforms) {
            config.water.material.uniforms['sunColor'].value.set(value);
        }
    });
    
    visualFolder.add(waterParams, 'distortionScale', 0, 10, 0.1).name('Distortion').onChange((value) => {
        if (config.water && config.water.material && config.water.material.uniforms) {
            config.water.material.uniforms['distortionScale'].value = value;
        }
    });
    
    visualFolder.add(waterParams, 'alpha', 0, 1, 0.01).name('Transparency').onChange((value) => {
        if (config.water && config.water.material && config.water.material.uniforms) {
            config.water.material.uniforms['alpha'].value = value;
        }
    });
    
    // Wave properties
    waveFolder.add(waterParams, 'waveSpeed', 0, 5, 0.1).name('Wave Speed').onChange((value) => {
        if (config.water && config.water.material) {
            config.water.material.userData = config.water.material.userData || {};
            config.water.material.userData.waveSpeed = value;
        }
        
        if (config.waterPhysics) {
            config.waterPhysics.settings.waveSpeed = value;
        }
    });
    
    waveFolder.add(waterParams, 'waveHeight', 0, 1, 0.05).name('Wave Height').onChange((value) => {
        if (config.water && config.water.material && config.water.material.uniforms) {
            // This affects the normal map's influence
            config.water.material.uniforms['distortionScale'].value = value * 10;
        }
        
        if (config.waterPhysics) {
            config.waterPhysics.settings.waveHeight = value;
        }
    });
    
    waveFolder.add(waterParams, 'waveFrequency', 0, 2, 0.1).name('Wave Frequency').onChange((value) => {
        if (config.water && config.water.material) {
            config.water.material.userData = config.water.material.userData || {};
            config.water.material.userData.waveFrequency = value;
        }
        
        if (config.waterPhysics) {
            config.waterPhysics.settings.waveFrequency = value;
        }
    });
    
    // Reflection & refraction
    reflectionFolder.add(waterParams, 'reflectivity', 0, 1, 0.05).name('Reflectivity').onChange((value) => {
        if (config.water && config.water.material && config.water.material.uniforms) {
            config.water.material.uniforms['reflectivity'].value = value;
        }
    });
    
    reflectionFolder.add(waterParams, 'refractionRatio', 0, 1, 0.01).name('Refraction').onChange((value) => {
        if (config.water && config.water.material && config.water.material.uniforms) {
            config.water.material.uniforms['refractionRatio'].value = value;
        }
    });
    
    // Foam effects
    foamFolder.add(waterParams, 'foamEnabled').name('Enable Foam').onChange((value) => {
        if (config.water && config.water.material) {
            config.water.material.userData = config.water.material.userData || {};
            config.water.material.userData.foamEnabled = value;
        }
    });
    
    const foamColorParam = { color: waterParams.foamColor };
    foamFolder.addColor(foamColorParam, 'color').name('Foam Color').onChange((value) => {
        if (config.water && config.water.material) {
            config.water.material.userData = config.water.material.userData || {};
            config.water.material.userData.foamColor = new THREE.Color(value);
        }
    });
    
    foamFolder.add(waterParams, 'foamThreshold', 0, 1, 0.05).name('Foam Threshold').onChange((value) => {
        if (config.water && config.water.material) {
            config.water.material.userData = config.water.material.userData || {};
            config.water.material.userData.foamThreshold = value;
        }
    });
    
    // Physics
    physicsFolder.add(physics, 'buoyancyForce', 0, 50, 1).name('Buoyancy Force').onChange((value) => {
        if (config.waterPhysics) {
            config.waterPhysics.settings.buoyancyMultiplier = value / 9.81;
        }
    });
    
    physicsFolder.add(physics, 'dragCoefficient', 0, 10, 0.1).name('Drag').onChange((value) => {
        if (config.waterPhysics) {
            config.waterPhysics.settings.linearDrag = value;
        }
    });
    
    physicsFolder.add(physics, 'waterLevel', -2, 2, 0.1).name('Water Level').onChange((value) => {
        if (config.water) {
            config.water.position.y = value;
        }
    });
    
    // Performance
    const textureOptions = [128, 256, 512, 1024, 2048];
    performanceFolder.add(waterParams, 'textureWidth', textureOptions).name('Texture Width').onChange((value) => {
        console.log('Texture width changed to', value, '- requires reload to take effect');
    });
    
    performanceFolder.add(waterParams, 'textureHeight', textureOptions).name('Texture Height').onChange((value) => {
        console.log('Texture height changed to', value, '- requires reload to take effect');
    });
    
    // Add a preset selector
    const presets = {
        'Default': function() { applyPreset('default'); },
        'Calm': function() { applyPreset('calm'); },
        'Stormy': function() { applyPreset('stormy'); },
        'Crystal Clear': function() { applyPreset('crystal'); },
        'Murky': function() { applyPreset('murky'); }
    };
    
    gui.add(presets, 'Default').name('Default Settings');
    gui.add(presets, 'Calm').name('Calm Water');
    gui.add(presets, 'Stormy').name('Stormy Water');
    gui.add(presets, 'Crystal Clear').name('Crystal Clear');
    gui.add(presets, 'Murky').name('Murky Water');
    
    // Preset application function
    function applyPreset(preset) {
        switch(preset) {
            case 'default':
                updateValues({
                    waterColor: '#001e0f',
                    distortionScale: 3.7,
                    waveSpeed: 1.0,
                    waveHeight: 0.2,
                    waveFrequency: 0.5,
                    buoyancyForce: 20,
                    dragCoefficient: 2.0
                });
                break;
                
            case 'calm':
                updateValues({
                    waterColor: '#0077be',
                    distortionScale: 1.5,
                    waveSpeed: 0.5,
                    waveHeight: 0.1,
                    waveFrequency: 0.3,
                    buoyancyForce: 15,
                    dragCoefficient: 1.0
                });
                break;
                
            case 'stormy':
                updateValues({
                    waterColor: '#1a3c40',
                    distortionScale: 8.0,
                    waveSpeed: 2.0,
                    waveHeight: 0.5,
                    waveFrequency: 1.0,
                    buoyancyForce: 30,
                    dragCoefficient: 4.0
                });
                break;
                
            case 'crystal':
                updateValues({
                    waterColor: '#a5f2f3',
                    distortionScale: 2.0,
                    alpha: 0.8,
                    waveSpeed: 0.7,
                    waveHeight: 0.15,
                    waveFrequency: 0.4,
                    reflectivity: 0.7,
                    buoyancyForce: 18,
                    dragCoefficient: 1.5
                });
                break;
                
            case 'murky':
                updateValues({
                    waterColor: '#2d4c3b',
                    distortionScale: 1.0,
                    alpha: 0.95,
                    waveSpeed: 0.3,
                    waveHeight: 0.1,
                    waveFrequency: 0.2,
                    reflectivity: 0.2,
                    buoyancyForce: 22,
                    dragCoefficient: 3.0
                });
                break;
        }
    }
    
    // Helper to update all values
    function updateValues(values) {
        // Update GUI controls
        for (const key in values) {
            if (waterParams.hasOwnProperty(key)) {
                waterParams[key] = values[key];
                
                // Find and update the controller
                for (const folder of [visualFolder, waveFolder, reflectionFolder, foamFolder]) {
                    for (const controller of folder.controllers) {
                        if (controller.property === key) {
                            controller.setValue(values[key]);
                            break;
                        }
                    }
                }
            }
            
            // Handle special cases
            if (key === 'buoyancyForce' && physics) {
                physics.buoyancyForce = values[key];
                for (const controller of physicsFolder.controllers) {
                    if (controller.property === 'buoyancyForce') {
                        controller.setValue(values[key]);
                        break;
                    }
                }
            }
            
            if (key === 'dragCoefficient' && physics) {
                physics.dragCoefficient = values[key];
                for (const controller of physicsFolder.controllers) {
                    if (controller.property === 'dragCoefficient') {
                        controller.setValue(values[key]);
                        break;
                    }
                }
            }
        }
    }
    
    return gui;
}

/**
 * Example usage:
 * 
 * import { createWaterGUI } from './gui-implementation.js';
 * 
 * // After creating water and physics objects
 * const gui = createWaterGUI({
 *     water: waterObject,
 *     physics: physicsObject,
 *     waterPhysics: waterPhysicsSimulator
 * });
 * 
 * // To update GUI visibility
 * gui.show(); // Show GUI
 * gui.hide(); // Hide GUI
 * 
 * // To destroy GUI when no longer needed
 * gui.destroy();
 */

// Capybara Swim