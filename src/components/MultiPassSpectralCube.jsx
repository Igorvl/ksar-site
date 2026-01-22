/**
 * MultiPassSpectralCube - Uses multiple render passes for spectral effect
 * Renders the same cube multiple times with different IOR values
 * Blends them together for rainbow chromatic aberration
 * 
 * This is a simpler approach than patching shaders
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
    MeshTransmissionMaterial,
    RoundedBox,
    useEnvironment
} from '@react-three/drei'
import * as THREE from 'three'

// Spectral bands configuration
const SPECTRAL_BANDS = [
    { ior: 1.45, color: new THREE.Color(0.5, 0, 1), weight: 0.8 },   // Violet
    { ior: 1.47, color: new THREE.Color(0, 0, 1), weight: 1.0 },    // Blue
    { ior: 1.49, color: new THREE.Color(0, 1, 1), weight: 0.9 },    // Cyan
    { ior: 1.50, color: new THREE.Color(0, 1, 0), weight: 1.0 },    // Green
    { ior: 1.52, color: new THREE.Color(1, 1, 0), weight: 1.0 },    // Yellow
    { ior: 1.54, color: new THREE.Color(1, 0.5, 0), weight: 0.9 },  // Orange
    { ior: 1.56, color: new THREE.Color(1, 0, 0), weight: 0.8 },    // Red
]

/**
 * Single spectral layer
 */
function SpectralLayer({
    scale,
    ior,
    color,
    opacity,
    envMap,
    chromaticAberration
}) {
    return (
        <RoundedBox args={[scale, scale, scale]} radius={0.05} smoothness={4}>
            <MeshTransmissionMaterial
                transmission={1}
                thickness={0.5}
                roughness={0}
                ior={ior}
                chromaticAberration={chromaticAberration}
                anisotropy={0.1}
                samples={6}
                resolution={256}
                backside={false}
                envMap={envMap}
                envMapIntensity={0.3}
                color={color}
                attenuationDistance={10}
                attenuationColor={color}
                transparent={true}
                opacity={opacity}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </RoundedBox>
    )
}

/**
 * MultiPassSpectralCube - Stacked spectral layers
 */
export default function MultiPassSpectralCube({
    scale = 2,
    rotationSpeed = 0.003,
    spectralSpread = 0.1  // How much IOR varies across spectrum
}) {
    const groupRef = useRef()
    const envMap = useEnvironment({ preset: 'city' })

    // Rotation animation
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed
        }
    })

    // Generate spectral layers
    const layers = useMemo(() => {
        return SPECTRAL_BANDS.map((band, i) => ({
            ...band,
            ior: 1.5 + (i - 3) * spectralSpread / 3,
            opacity: 0.15 * band.weight
        }))
    }, [spectralSpread])

    return (
        <group rotation={[Math.PI / 4, 0, Math.atan(1 / Math.SQRT2)]}>
            <group ref={groupRef}>
                {/* Base glass cube */}
                <RoundedBox args={[scale, scale, scale]} radius={0.05} smoothness={4}>
                    <MeshTransmissionMaterial
                        transmission={1}
                        thickness={1}
                        roughness={0}
                        ior={1.5}
                        chromaticAberration={0.1}
                        anisotropy={0.15}
                        samples={8}
                        resolution={512}
                        backside={false}
                        envMap={envMap}
                        envMapIntensity={0.3}
                        color="#ffffff"
                        attenuationDistance={5}
                        attenuationColor="#ffffff"
                    />
                </RoundedBox>

                {/* Additive spectral layers */}
                {layers.map((layer, i) => (
                    <SpectralLayer
                        key={i}
                        scale={scale * 1.001} // Slightly larger to avoid z-fighting
                        ior={layer.ior}
                        color={layer.color}
                        opacity={layer.opacity}
                        envMap={envMap}
                        chromaticAberration={0.02}
                    />
                ))}
            </group>
        </group>
    )
}
