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

// Additional parameters for GUI control
uniform float foamForce;
uniform float thickness;
uniform float foamScale;
uniform float waveSpeed;
uniform float waveHeight;
uniform float waveFrequency;
uniform float toonFactor;
uniform float toonThreshold;
uniform float toonBands;

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

  // Use the GUI-controlled parameters
  vec2 displacement = texture2D(tDudv, (vUv * foamScale) - time * (waveSpeed * 0.01)).rg;
  displacement = ((displacement * 2.0) - 1.0) * 1.0;

  float waveAmount = sin((vUv.x + vUv.y) * waveFrequency + time * waveSpeed) * (waveHeight * foamForce);
  displacement.x += waveAmount;
  displacement.y += waveAmount;

  diff += displacement.x;

  // Ghibli-style toon shading for water with GUI-controlled parameters
  float bandCount = max(1.0, toonBands);
  float toonBandValue = floor(diff * bandCount) / bandCount;
  
  // Mix between darker and lighter water color based on toon threshold
  vec3 toonWaterColor = mix(
    waterColor * (1.0 - toonFactor), 
    waterColor * (1.0 + toonFactor), 
    step(toonThreshold, toonBandValue)
  );
  
  // Final color with foam
  gl_FragColor.rgb = mix(foamColor, toonWaterColor, step(threshold / (0.1 / thickness), diff));
  gl_FragColor.a = 1.0;

  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
} 