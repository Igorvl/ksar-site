/**
 * FastSpectralGlass.jsx
 * 
 * High-performance 32-channel spectral dispersion using Tint approximation.
 * Renders a full rainbow spectrum without crashing the GPU.
 * 
 * Strategy:
 * 1. Loop 16-32 times (configurable)
 * 2. Calculate IOR for each wavelength
 * 3. Sample environment
 * 4. Weight by "Turbo" spectral color palette (vibrant rainbow)
 * 5. Normalize to preserve White Balance
 */
import * as THREE from 'three'
import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame, extend, useThree } from '@react-three/fiber'
import { useFBO, useEnvironment, RoundedBox } from '@react-three/drei'

// --- 1. Discard Material (needed for transmission FBO) ---
class DiscardMaterialImpl extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {},
            vertexShader: `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: `void main() { discard; }`
        })
    }
}

// --- 2. Spectral Material Shader ---
const SpectralShader = {
    uniforms: {
        buffer: { value: null },      // Background FBO
        uTime: { value: 0 },
        uIor: { value: 1.6 }, // Flint Glass
        uChromaticAberration: { value: 5.0 }, // Extreme separation
        uAnisotropy: { value: 0.1 },
        uDispersion: { value: 3.0 },
        uSamples: { value: 8 }, // Low samples for sharp bands
        uBrightness: { value: 1.0 },
        resolution: { value: new THREE.Vector2() }
    },
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    fragmentShader: `
    uniform sampler2D buffer;
    uniform float uTime;
    uniform float uIor;
    uniform float uChromaticAberration;
    uniform float uDispersion;
    uniform int uSamples;
    uniform float uBrightness;
    uniform vec2 resolution;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    // Mathematical Turbo Rainbow (High Saturation Boost)
    vec3 spectralColor(float t) {
      vec3 c = vec3(0.0);
      c.r = 0.237 + 1.51 * t - 2.8 * t*t + 1.5 * t*t*t;
      c.g = 0.05 + 2.6 * t - 3.8 * t*t + 0.5 * t*t*t;
      c.b = 0.5 - 0.5 * t + 1.2 * t*t - 0.8 * t*t*t;
      
      // Extreme sharpening to separate bands (prevent white mix)
      c = pow(c, vec3(3.0)); 
      return clamp(c * 5.0, 0.0, 1.0); // Ultra brightness
    }

    // Dithering to prevent banding
    float noise(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec3 viewDir = normalize(vViewPosition); 
      vec3 normal = normalize(vNormal); 

      vec2 screenUV = gl_FragCoord.xy / resolution;

      vec3 accumulatedColor = vec3(0.0);
      float accumulatedAlpha = 0.0;
      float totalWeight = 0.0;

      // SHARP WHITE FRESNEL (Glass-like body reflection)
      float fresnelFactor = pow(1.0 - abs(dot(viewDir, normal)), 3.0);
      
      // FRESNEL-BASED DISPERSION
      // Dispersion is stronger at glancing angles (edges)
      // This creates the "rainbow edges" effect naturally without UV hacks
      float dynamicDispersion = uDispersion * (1.0 + fresnelFactor * 3.0);

      // REDUCED SAMPLES FOR SHARP BANDS
      for(int i = 0; i < 8; i++) {
        float t = float(i) / 7.0; 
        vec3 waveColor = spectralColor(t); 

        float wavelengthIOR = uIor + (t - 0.5) * uChromaticAberration * 4.0;

        vec3 refractedDir = refract(-viewDir, normal, 1.0 / wavelengthIOR);
        
        // Use dynamic dispersion based on view angle
        vec2 offset = refractedDir.xy * dynamicDispersion * 0.5;
        
        vec4 sampleData = texture2D(buffer, screenUV + offset);
        
        accumulatedColor += sampleData.rgb * waveColor;
        accumulatedAlpha += sampleData.a; 
        totalWeight += 1.0;
      }

      vec3 finalColor = accumulatedColor / totalWeight * uBrightness * 4.0; 
      float finalAlpha = accumulatedAlpha / totalWeight;
      
      vec3 finalColor = accumulatedColor / totalWeight * uBrightness * 4.0; 
      float finalAlpha = accumulatedAlpha / totalWeight;
      
      // 1. BASE GLASS REFLECTION (White)
      // This is crucial for visibility! Without it, the center is just invisible.
      float baseFresnel = pow(1.0 - abs(dot(viewDir, normal)), 3.0);
      finalColor += vec3(0.8) * baseFresnel; // White reflection
      
      // 2. RAINBOW EDGES
      // Calculate angle of incidence (0 = facing camera, 1 = edge)
      float viewingAngle = 1.0 - max(0.0, dot(viewDir, normal));
      
      // Edge Zone: Wider than before (pow 5.0 instead of 8.0) so we can see it
      float edgeZone = pow(viewingAngle, 5.0); 
      
      // Generate Rainbow
      vec3 edgeColor = spectralColor(viewingAngle * 4.0 + vWorldPosition.y * 0.5);
      
      // Add glowing neon edges ON TOP of the white reflection
      finalColor += edgeColor * edgeZone * 5.0; 
      
      // Apply dithering
      float rnd = noise(gl_FragCoord.xy + uTime);
      finalColor += (rnd - 0.5) * 0.02;

      // Composite alpha
      // Visible if: It has refraction (finalAlpha) OR Reflection (baseFresnel) OR EdgeGlow (edgeZone)
      float outAlpha = clamp(baseFresnel + edgeZone + 0.1, 0.15, 1.0); 

      gl_FragColor = vec4(finalColor, outAlpha);
    }
  `
}

class FastSpectralMaterialImpl extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: THREE.UniformsUtils.clone(SpectralShader.uniforms),
            vertexShader: SpectralShader.vertexShader,
            fragmentShader: SpectralShader.fragmentShader,
            transparent: true,
            side: THREE.FrontSide
        })
    }
}

extend({ FastSpectralMaterial: FastSpectralMaterialImpl })

// --- 3. React Component ---
export default function FastSpectralGlass({ scale = 2, chromaticAberration = 0.8, rotationSpeed = 0 }) {
    const meshRef = useRef()
    const matRef = useRef()
    const fbo = useFBO() // Full screen FBO
    const { size, gl, viewport } = useThree() // Access Three.js state

    // Unified useFrame for standard updates (Time, Resolution, Rotation)
    useFrame((state) => {
        if (matRef.current) {
            matRef.current.uniforms.uTime.value = state.clock.elapsedTime
            const dpr = state.gl.getPixelRatio()
            matRef.current.uniforms.resolution.value.set(
                state.size.width * dpr,
                state.size.height * dpr
            )
            matRef.current.uniforms.uChromaticAberration.value = chromaticAberration
            matRef.current.uniforms.uIor.value = 1.6
            matRef.current.uniforms.uDispersion.value = 3.0 // Extreme dispersion
        }

        // Rotation
        if (meshRef.current && rotationSpeed > 0) {
            meshRef.current.rotation.y += rotationSpeed
        }
    })

    // ... remainder of file ...

    // FBO Rendering Logic (Must be separate or carefully ordered)
    useFrame((state) => {
        if (!meshRef.current) return

        // Hide glass, render scene to FBO
        meshRef.current.visible = false
        const oldTarget = state.gl.getRenderTarget()
        state.gl.setRenderTarget(fbo)
        state.gl.render(state.scene, state.camera)

        // Restore
        state.gl.setRenderTarget(oldTarget)
        meshRef.current.visible = true
    })

    return (
        <RoundedBox
            ref={meshRef}
            args={[scale, scale, scale]}
            radius={0.05}
            smoothness={4}
        >
            <fastSpectralMaterial
                ref={matRef}
                buffer={fbo.texture}
                uSamples={32}
                uDispersion={1.0}
            />
        </RoundedBox>
    )
}
