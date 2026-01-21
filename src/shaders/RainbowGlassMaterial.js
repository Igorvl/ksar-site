/**
 * Rainbow Chromatic Aberration Shader
 * Samples multiple wavelengths for full spectrum dispersion effect
 */
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// Custom shader for rainbow chromatic aberration
const RainbowGlassMaterial = shaderMaterial(
    {
        time: 0,
        resolution: new THREE.Vector2(1, 1),
        envMap: null,
        transmission: 1.0,
        thickness: 1.5,
        roughness: 0.0,
        chromaticAberration: 0.1,
        ior: 1.5,
        samples: 8,  // Number of spectral samples
    },
    // Vertex shader
    `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
    `,
    // Fragment shader with rainbow dispersion
    `
    uniform float time;
    uniform float transmission;
    uniform float thickness;
    uniform float roughness;
    uniform float chromaticAberration;
    uniform float ior;
    uniform int samples;
    uniform samplerCube envMap;
    
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    // Spectral color from wavelength (380-780nm mapped to 0-1)
    vec3 wavelengthToRGB(float wavelength) {
        float w = wavelength * 400.0 + 380.0; // Map to nm
        vec3 color;
        
        if (w >= 380.0 && w < 440.0) {
            color = vec3(-(w - 440.0) / 60.0, 0.0, 1.0);
        } else if (w >= 440.0 && w < 490.0) {
            color = vec3(0.0, (w - 440.0) / 50.0, 1.0);
        } else if (w >= 490.0 && w < 510.0) {
            color = vec3(0.0, 1.0, -(w - 510.0) / 20.0);
        } else if (w >= 510.0 && w < 580.0) {
            color = vec3((w - 510.0) / 70.0, 1.0, 0.0);
        } else if (w >= 580.0 && w < 645.0) {
            color = vec3(1.0, -(w - 645.0) / 65.0, 0.0);
        } else if (w >= 645.0 && w <= 780.0) {
            color = vec3(1.0, 0.0, 0.0);
        } else {
            color = vec3(0.0);
        }
        
        // Intensity correction at edges
        float factor;
        if (w >= 380.0 && w < 420.0) {
            factor = 0.3 + 0.7 * (w - 380.0) / 40.0;
        } else if (w >= 700.0 && w <= 780.0) {
            factor = 0.3 + 0.7 * (780.0 - w) / 80.0;
        } else {
            factor = 1.0;
        }
        
        return color * factor;
    }
    
    void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 normal = normalize(vNormal);
        
        // Fresnel effect
        float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
        
        vec3 totalColor = vec3(0.0);
        float totalWeight = 0.0;
        
        // Sample multiple wavelengths for rainbow effect
        for (int i = 0; i < 12; i++) {
            float t = float(i) / 11.0;
            
            // Different IOR for each wavelength (dispersion)
            float wavelengthIor = ior + chromaticAberration * (t - 0.5) * 2.0;
            
            // Refraction direction
            vec3 refracted = refract(-viewDir, normal, 1.0 / wavelengthIor);
            
            // Sample environment
            vec3 envColor = textureCube(envMap, refracted).rgb;
            
            // Get spectral color
            vec3 spectralColor = wavelengthToRGB(t);
            
            totalColor += envColor * spectralColor;
            totalWeight += 1.0;
        }
        
        totalColor /= totalWeight;
        
        // Reflection
        vec3 reflected = reflect(-viewDir, normal);
        vec3 reflectionColor = textureCube(envMap, reflected).rgb;
        
        // Mix transmission and reflection
        vec3 finalColor = mix(totalColor, reflectionColor, fresnel * 0.3);
        
        // Add subtle edge highlighting
        float edge = 1.0 - abs(dot(viewDir, normal));
        finalColor += vec3(edge * 0.1);
        
        gl_FragColor = vec4(finalColor * transmission, 1.0);
    }
    `
)

// Extend for use in React Three Fiber
extend({ RainbowGlassMaterial })

export default RainbowGlassMaterial
