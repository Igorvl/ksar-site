/**
 * SpectralGlassMaterial - Full rainbow spectrum dispersion
 * Uses 7 wavelength samples for realistic prismatic refraction
 */
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Vertex shader
const vertexShader = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;
varying vec3 vViewDir;

void main() {
    vUv = uv;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - vWorldPosition);
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

// Fragment shader with spectral dispersion
const fragmentShader = `
uniform samplerCube envMap;
uniform float time;
uniform float dispersion;
uniform float ior;
uniform float transmission;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;
varying vec3 vViewDir;

// Convert wavelength (380-780nm) to RGB
vec3 wavelengthToRGB(float wavelength) {
    float w = wavelength;
    vec3 color;
    
    if (w < 440.0) {
        color = vec3(-(w - 440.0) / 60.0, 0.0, 1.0);
    } else if (w < 490.0) {
        color = vec3(0.0, (w - 440.0) / 50.0, 1.0);
    } else if (w < 510.0) {
        color = vec3(0.0, 1.0, -(w - 510.0) / 20.0);
    } else if (w < 580.0) {
        color = vec3((w - 510.0) / 70.0, 1.0, 0.0);
    } else if (w < 645.0) {
        color = vec3(1.0, -(w - 645.0) / 65.0, 0.0);
    } else {
        color = vec3(1.0, 0.0, 0.0);
    }
    
    // Intensity falloff at edges
    float factor = 1.0;
    if (w < 420.0) factor = 0.3 + 0.7 * (w - 380.0) / 40.0;
    else if (w > 700.0) factor = 0.3 + 0.7 * (780.0 - w) / 80.0;
    
    return max(color * factor, 0.0);
}

// Cauchy's equation for dispersion
float cauchyIOR(float wavelength, float baseIOR, float dispersionStrength) {
    float lambda = wavelength / 1000.0;
    float B = dispersionStrength * 0.01;
    return baseIOR + B / (lambda * lambda);
}

void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(vViewDir);
    
    // Fresnel
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
    
    vec3 totalColor = vec3(0.0);
    float totalWeight = 0.0;
    
    // Sample 7 wavelengths
    for (int i = 0; i < 7; i++) {
        float t = float(i) / 6.0;
        float wavelength = 400.0 + t * 280.0;
        
        float wavelengthIOR = cauchyIOR(wavelength, ior, dispersion);
        vec3 refracted = refract(-viewDir, normal, 1.0 / wavelengthIOR);
        
        if (length(refracted) < 0.01) {
            refracted = reflect(-viewDir, normal);
        }
        
        // Sample environment
        vec4 envSample = textureCube(envMap, refracted);
        vec3 spectralColor = wavelengthToRGB(wavelength);
        
        // If envMap returns black, use spectral color directly
        vec3 sampleColor = envSample.rgb;
        if (length(sampleColor) < 0.01) {
            sampleColor = vec3(0.5) + spectralColor * 0.5;
        }
        
        totalColor += sampleColor * spectralColor;
        totalWeight += length(spectralColor);
    }
    
    totalColor /= max(totalWeight, 0.001);
    totalColor *= 3.0; // Boost brightness
    
    // Reflection
    vec3 reflected = reflect(-viewDir, normal);
    vec4 reflSample = textureCube(envMap, reflected);
    vec3 reflectionColor = reflSample.rgb;
    if (length(reflectionColor) < 0.01) {
        reflectionColor = vec3(0.3);
    }
    
    vec3 finalColor = mix(totalColor, reflectionColor, fresnel * 0.3);
    finalColor *= transmission;
    
    // Edge highlight - always visible
    float edge = pow(1.0 - abs(dot(viewDir, normal)), 2.0);
    finalColor += vec3(1.0) * edge * 0.2;
    
    // Minimum brightness
    finalColor = max(finalColor, vec3(0.05));
    
    gl_FragColor = vec4(finalColor, 0.95);
}
`

/**
 * SpectralGlassMaterial component
 */
export default function SpectralGlass({ envMap, dispersion = 5.0, ior = 1.5, transmission = 1.0 }) {
    const materialRef = useRef()

    // Update envMap when it changes
    useEffect(() => {
        if (materialRef.current && envMap) {
            materialRef.current.uniforms.envMap.value = envMap
            materialRef.current.needsUpdate = true
        }
    }, [envMap])

    // Create uniforms
    const uniforms = {
        envMap: { value: envMap },
        time: { value: 0 },
        dispersion: { value: dispersion },
        ior: { value: ior },
        transmission: { value: transmission }
    }

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime
        }
    })

    return (
        <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent={true}
            side={THREE.DoubleSide}
        />
    )
}
