import * as THREE from 'three';
import { GUI } from 'dat.gui';

// Parameters for water shader
const waterParams = {
  // Water colors
  waterColor: '#14c6a5',
  
  // Water physics
  waveSpeed: 1.0,
  waveHeight: 3.7,
  distortionScale: 3.7,
  
  // Wave animation
  waveSpeed: 1.0,
  
  // Legacy parameters for compatibility
  foamColor: '#ffffff',
  threshold: 0.1,
  foamForce: 0.05,
  thickness: 0.01,
  foamScale: 10.0,
  waveFrequency: 10.0,
  toonFactor: 0.5,
  toonThreshold: 0.7,
  toonBands: 3.0
};

// Parameters for lighting
const lightParams = {
  // Ambient light
  ambientIntensity: 0.5,
  ambientColor: '#ffffff',
  
  // Directional light
  directionalIntensity: 1.0,
  directionalColor: '#ffffff',
  
  // Sky settings
  turbidity: 10.0,
  rayleigh: 2.0,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  
  // Sun position
  sunElevation: 88,
  sunAzimuth: 180
};

/**
 * Initialize the GUI
 * @param {Object} threeObjects - The Three.js objects
 * @returns {Object} The GUI object
 */
export function initGUI(threeObjects) {
  const gui = new GUI();
  
  // Water folder
  const waterFolder = gui.addFolder('Water');
  
  // Water color
  waterFolder.addColor(waterParams, 'waterColor').onChange((value) => {
    if (threeObjects.water && threeObjects.water.material) {
      threeObjects.water.material.uniforms.waterColor.value.set(value);
    }
  });
  
  // Wave speed
  waterFolder.add(waterParams, 'waveSpeed', 0.1, 5.0).onChange((value) => {
    // This is handled in the animation loop
  });
  
  // Wave height (distortion scale)
  waterFolder.add(waterParams, 'distortionScale', 0.1, 10.0).onChange((value) => {
    if (threeObjects.water && threeObjects.water.material) {
      threeObjects.water.material.uniforms.distortionScale.value = value;
    }
  });
  
  waterFolder.open();
  
  // Lighting folder
  const lightingFolder = gui.addFolder('Lighting');
  
  // Ambient light
  const ambientFolder = lightingFolder.addFolder('Ambient Light');
  
  ambientFolder.add(lightParams, 'ambientIntensity', 0.0, 2.0).name('Intensity').onChange((value) => {
    if (threeObjects.ambientLight) {
      threeObjects.ambientLight.intensity = value;
    }
  });
  
  ambientFolder.addColor(lightParams, 'ambientColor').name('Color').onChange((value) => {
    if (threeObjects.ambientLight) {
      threeObjects.ambientLight.color.set(value);
    }
  });
  
  // Directional light
  const directionalFolder = lightingFolder.addFolder('Directional Light');
  
  directionalFolder.add(lightParams, 'directionalIntensity', 0.0, 2.0).name('Intensity').onChange((value) => {
    if (threeObjects.directionalLight) {
      threeObjects.directionalLight.intensity = value;
    }
  });
  
  directionalFolder.addColor(lightParams, 'directionalColor').name('Color').onChange((value) => {
    if (threeObjects.directionalLight) {
      threeObjects.directionalLight.color.set(value);
    }
  });
  
  // Sky settings
  const skyFolder = lightingFolder.addFolder('Sky');
  
  skyFolder.add(lightParams, 'turbidity', 0.0, 20.0).name('Turbidity').onChange((value) => {
    if (threeObjects.sky && threeObjects.sky.uniforms) {
      threeObjects.sky.uniforms.turbidity.value = value;
    }
  });
  
  skyFolder.add(lightParams, 'rayleigh', 0.0, 4.0).name('Rayleigh').onChange((value) => {
    if (threeObjects.sky && threeObjects.sky.uniforms) {
      threeObjects.sky.uniforms.rayleigh.value = value;
    }
  });
  
  skyFolder.add(lightParams, 'mieCoefficient', 0.0, 0.1).name('Mie Coefficient').onChange((value) => {
    if (threeObjects.sky && threeObjects.sky.uniforms) {
      threeObjects.sky.uniforms.mieCoefficient.value = value;
    }
  });
  
  skyFolder.add(lightParams, 'mieDirectionalG', 0.0, 1.0).name('Mie Directional G').onChange((value) => {
    if (threeObjects.sky && threeObjects.sky.uniforms) {
      threeObjects.sky.uniforms.mieDirectionalG.value = value;
    }
  });
  
  // Sun position
  const sunFolder = skyFolder.addFolder('Sun Position');
  
  sunFolder.add(lightParams, 'sunElevation', 0, 180).name('Elevation').onChange((value) => {
    updateSunPosition(threeObjects);
  });
  
  sunFolder.add(lightParams, 'sunAzimuth', 0, 360).name('Azimuth').onChange((value) => {
    updateSunPosition(threeObjects);
  });
  
  // Open folders
  waterFolder.open();
  lightingFolder.open();
  
  return gui;
}

/**
 * Update sun position based on elevation and azimuth
 * @param {Object} threeObjects - The Three.js objects
 */
function updateSunPosition(threeObjects) {
  if (threeObjects.sky && threeObjects.sky.uniforms) {
    const phi = THREE.MathUtils.degToRad(90 - lightParams.sunElevation);
    const theta = THREE.MathUtils.degToRad(lightParams.sunAzimuth);
    
    const sun = new THREE.Vector3();
    sun.setFromSphericalCoords(1, phi, theta);
    
    threeObjects.sky.uniforms.sunPosition.value.copy(sun);
    
    // Also update directional light position to match sun
    if (threeObjects.directionalLight) {
      threeObjects.directionalLight.position.copy(sun);
    }
  }
}

// Export parameters
export { waterParams, lightParams }; 