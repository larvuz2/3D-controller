#include <common>
#include <packing>
#include <fog_pars_fragment>

varying vec2 vUv;
uniform sampler2D tDepth;
uniform sampler2D tDudv;
uniform vec3 waterColor;
uniform vec3 foamColor;
uniform float cameraNear;
uniform float cameraFar;
uniform float time;
uniform float threshold;
uniform vec2 resolution;

float getDepth(const in vec2 screenPosition) {
  #if DEPTH_PACKING == 1
    return unpackRGBAToDepth(texture2D(tDepth, screenPosition));
  #else
    return texture2D(tDepth, screenPosition).x;
  #endif
}

float getViewZ(const in float depth) {
  #if ORTHOGRAPHIC_CAMERA == 1
    return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
  #else
    return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
  #endif
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / resolution;

  float fragmentLinearEyeDepth = getViewZ(gl_FragCoord.z);
  float linearEyeDepth = getViewZ(getDepth(screenUV));

  float diff = saturate(fragmentLinearEyeDepth - linearEyeDepth);

  float foamForce = 0.05;
  float thickness = 0.01;
  float foamScale = 10.0;  // Adjust the foam scale value to control the fineness of the foam

  vec2 displacement = texture2D(tDudv, (vUv * foamScale) - time * 0.05).rg;
  displacement = ((displacement * 2.0) - 1.0) * 1.0;

  float waveAmount = sin((vUv.x + vUv.y) * 10.0 + time * 5.0) * foamForce;  // Adjust the parameters to control the wave effect
  displacement.x += waveAmount;
  displacement.y += waveAmount;

  diff += displacement.x;

  // Ghibli-style toon shading for water
  float toonFactor = 0.5;
  float toonThreshold = 0.7;
  
  // Create toon-like bands for the water
  float toonBands = floor(diff * 3.0) / 3.0;
  
  // Mix between foam color and water color with toon-like transition
  vec3 toonWaterColor = mix(waterColor * 0.8, waterColor * 1.2, step(toonThreshold, toonBands));
  
  // Final color with foam
  gl_FragColor.rgb = mix(foamColor, toonWaterColor, step(threshold / (0.1 / thickness), diff));
  gl_FragColor.a = 1.0;

  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
}