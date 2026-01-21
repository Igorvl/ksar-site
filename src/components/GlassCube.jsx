/**
 * GlassCube - Transparent glass cube standing on one corner
 * Uses MeshTransmissionMaterial for realistic glass refraction effect
 * Text is rendered in 3D scene to be refracted through the glass
 */
import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
    MeshTransmissionMaterial,
    Environment,
    Text,
    RoundedBox,
    useEnvironment
} from '@react-three/drei'
import * as THREE from 'three'
import './GlassCube.css'

/**
 * Background text that will be refracted through the glass
 */
function BackgroundText({ children = "GLASS CUBE", color = "#ffffff" }) {
    return (
        <Text
            position={[0, 0, -5]}
            fontSize={3}
            color={color}
            font="/fonts/Manrope-Bold.woff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
        >
            {children}
        </Text>
    )
}

/**
 * Glass Cube with transmission material
 * Standing on one corner with slow rotation
 */
function Cube({ scale = 2, rotationSpeed = 0.003 }) {
    const meshRef = useRef()
    const { viewport } = useThree()

    // Load environment for reflections
    const envMap = useEnvironment({ preset: 'city' })

    // Slow rotation animation
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed
        }
    })

    return (
        <group rotation={[Math.PI / 4, 0, Math.atan(1 / Math.SQRT2)]}>
            <RoundedBox
                ref={meshRef}
                args={[scale, scale, scale]}
                radius={0.05}
                smoothness={4}
            >
                <MeshTransmissionMaterial
                    // Core transmission settings
                    transmission={1}
                    thickness={1}
                    roughness={0}

                    // Refraction - RGB chromatic aberration
                    ior={1.5}
                    chromaticAberration={0.15}
                    anisotropy={0.2}

                    // Rendering - OPTIMIZED for performance
                    samples={8}
                    resolution={512}
                    backside={false}

                    // Environment
                    envMap={envMap}
                    envMapIntensity={0.3}

                    // Colors
                    color="#ffffff"
                    attenuationDistance={3}
                    attenuationColor="#ffffff"

                    // Distortion off
                    distortion={0}
                    distortionScale={0}
                    temporalDistortion={0}
                />
            </RoundedBox>
        </group>
    )
}

/**
 * Scene with text and glass cube
 */
function Scene({ cubeScale, rotationSpeed, text }) {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            <pointLight position={[-5, -5, 5]} intensity={0.3} />

            {/* Background text - will be refracted */}
            <BackgroundText>{text}</BackgroundText>

            {/* Glass cube in front of text */}
            <Cube scale={cubeScale} rotationSpeed={rotationSpeed} />

            {/* Environment for reflections */}
            <Environment preset="city" background={false} />
        </>
    )
}

/**
 * Main GlassCube component
 */
export default function GlassCube({
    size = 400,
    cubeScale = 2,
    rotationSpeed = 0.003,
    text = "GLASS CUBE",
    className = ''
}) {
    return (
        <div
            className={`glass-cube-container ${className}`}
            style={{ width: size, height: size }}
        >
            <Canvas
                camera={{ position: [0, 0, 8], fov: 35 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true
                }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <Scene
                        cubeScale={cubeScale}
                        rotationSpeed={rotationSpeed}
                        text={text}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}
