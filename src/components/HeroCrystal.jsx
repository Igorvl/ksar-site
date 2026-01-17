import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
    Float,
    Environment,
    MeshTransmissionMaterial,
    ContactShadows,
    Edges,
    Text,
    RoundedBox
} from '@react-three/drei'
import * as THREE from 'three'

/**
 * Create chamfered cube geometry with flat beveled edges
 * Guaranteed CCW winding order for transparent materials
 */
function createChamferedCubeGeometry(size = 1.5, chamfer = 0.12) {
    const s = size / 2
    const c = chamfer

    const positions = []
    const normals = []

    // Helper to compute face normal from 3 vertices
    const computeNormal = (v0, v1, v2) => {
        const ax = v1[0] - v0[0], ay = v1[1] - v0[1], az = v1[2] - v0[2]
        const bx = v2[0] - v0[0], by = v2[1] - v0[1], bz = v2[2] - v0[2]
        const nx = ay * bz - az * by
        const ny = az * bx - ax * bz
        const nz = ax * by - ay * bx
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
        return [nx / len, ny / len, nz / len]
    }

    // Helper to add a quad (2 triangles) with computed normal
    const addQuad = (v0, v1, v2, v3) => {
        const n = computeNormal(v0, v1, v2)
        // Triangle 1: v0, v1, v2
        positions.push(...v0, ...v1, ...v2)
        normals.push(...n, ...n, ...n)
        // Triangle 2: v0, v2, v3
        positions.push(...v0, ...v2, ...v3)
        normals.push(...n, ...n, ...n)
    }

    // Helper to add a triangle with computed normal
    const addTri = (v0, v1, v2) => {
        const n = computeNormal(v0, v1, v2)
        positions.push(...v0, ...v1, ...v2)
        normals.push(...n, ...n, ...n)
    }

    // --- 6 MAIN FACES (CCW) ---
    // +X Right
    addQuad([s, -s + c, s - c], [s, -s + c, -s + c], [s, s - c, -s + c], [s, s - c, s - c])
    // -X Left
    addQuad([-s, -s + c, -s + c], [-s, -s + c, s - c], [-s, s - c, s - c], [-s, s - c, -s + c])
    // +Y Top
    addQuad([-s + c, s, s - c], [s - c, s, s - c], [s - c, s, -s + c], [-s + c, s, -s + c])
    // -Y Bottom
    addQuad([-s + c, -s, -s + c], [s - c, -s, -s + c], [s - c, -s, s - c], [-s + c, -s, s - c])
    // +Z Front
    addQuad([-s + c, -s + c, s], [s - c, -s + c, s], [s - c, s - c, s], [-s + c, s - c, s])
    // -Z Back
    addQuad([s - c, -s + c, -s], [-s + c, -s + c, -s], [-s + c, s - c, -s], [s - c, s - c, -s])

    // --- 12 EDGE CHAMFERS (CCW) ---
    // Around Y axis (Vertical edges)
    addQuad([s, s - c, s - c], [s, -s + c, s - c], [s - c, -s + c, s], [s - c, s - c, s]) // FR
    addQuad([s, -s + c, -s + c], [s, s - c, -s + c], [s - c, s - c, -s], [s - c, -s + c, -s]) // BR
    addQuad([-s, -s + c, s - c], [-s, s - c, s - c], [-s + c, s - c, s], [-s + c, -s + c, s]) // FL
    addQuad([-s, s - c, -s + c], [-s, -s + c, -s + c], [-s + c, -s + c, -s], [-s + c, s - c, -s]) // BL

    // Around X axis (Horizontal side edges)
    addQuad([s - c, s, s - c], [-s + c, s, s - c], [-s + c, s - c, s], [s - c, s - c, s]) // Top-Front
    addQuad([-s + c, s, -s + c], [s - c, s, -s + c], [s - c, s - c, -s], [-s + c, s - c, -s]) // Top-Back
    addQuad([-s + c, -s, s - c], [s - c, -s, s - c], [s - c, -s + c, s], [-s + c, -s + c, s]) // Bottom-Front
    addQuad([s - c, -s, -s + c], [-s + c, -s, -s + c], [-s + c, -s + c, -s], [s - c, -s + c, -s]) // Bottom-Back

    // Around Z axis (Side edges) - wait, these are actually the ones connecting X and Y faces? 
    // Let's re-verify logic. The groups above:
    // Group 1: FL, FR, BL, BR (Vertical corners) -> Correctly connect X and Z faces? No, they connect X and Z faces.
    // Group 2: Top-F, Top-B, Bot-F, Bot-B -> Correctly connect Y and Z faces.
    // Group 3: Top-R, Top-L, Bot-R, Bot-L -> Should connect X and Y faces.

    // Let's rewrite Group 3 (X and Y connection):
    addQuad([s - c, s, -s + c], [s - c, s, s - c], [s, s - c, s - c], [s, s - c, -s + c]) // Top-Right
    addQuad([-s + c, s, s - c], [-s + c, s, -s + c], [-s, s - c, -s + c], [-s, s - c, s - c]) // Top-Left
    addQuad([s, -s + c, s - c], [s, -s + c, -s + c], [s - c, -s, -s + c], [s - c, -s, s - c]) // Bottom-Right
    addQuad([-s, -s + c, -s + c], [-s, -s + c, s - c], [-s + c, -s, s - c], [-s + c, -s, -s + c]) // Bottom-Left

    // --- 8 CORNER TRIANGLES (CCW) ---
    addTri([s - c, s - c, s], [s, s - c, s - c], [s - c, s, s - c]) // Top-Front-Right
    addTri([s - c, s - c, -s], [s - c, s, -s + c], [s, s - c, -s + c]) // Top-Back-Right
    addTri([-s + c, s - c, s], [-s + c, s, s - c], [-s, s - c, s - c]) // Top-Front-Left
    addTri([-s + c, s - c, -s], [-s, s - c, -s + c], [-s + c, s, -s + c]) // Top-Back-Left

    addTri([s - c, -s + c, s], [s - c, -s, s - c], [s, -s + c, s - c]) // Bottom-Front-Right
    addTri([s - c, -s + c, -s], [s, -s + c, -s + c], [s - c, -s, -s + c]) // Bottom-Back-Right
    addTri([-s + c, -s + c, s], [-s, -s + c, s - c], [-s + c, -s, s - c]) // Bottom-Front-Left
    addTri([-s + c, -s + c, -s], [-s + c, -s, -s + c], [-s, -s + c, -s + c]) // Bottom-Back-Left

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))

    return geometry
}

/**
 * Glass Crystal Component
 */
/**
 * Glass Crystal Component
 */
function GlassCube() {
    const animRef = useRef()
    const geometry = React.useMemo(() => createChamferedCubeGeometry(1.5, 0.12), [])

    useFrame((state, delta) => {
        if (animRef.current) {
            // Slow elegant rotation around world Y (vertical)
            animRef.current.rotation.y -= delta * 0.08
        }
    })

    return (
        <Float
            speed={0.6}
            rotationIntensity={0.05}
            floatIntensity={0.1}
        >
            {/* Outer group: Animation - rotates around WORLD Y axis (vertical spin) */}
            <group ref={animRef}>
                {/* Inner group: Tilt to stand on corner */}
                {/* arctan(1/sqrt(2)) ≈ 35.26° for vertex-down orientation */}
                <group rotation={[-Math.atan(1 / Math.SQRT2), 0, Math.PI / 4]} scale={[1.8, 1.8, 1.8]}>
                    {/* Main Glass Cube - custom chamfered geometry with fixed normals */}
                    <mesh geometry={geometry}>
                        <MeshTransmissionMaterial
                            ior={2.4}
                            transmission={1}
                            thickness={0.1}
                            roughness={0}
                            chromaticAberration={0.5}
                            anisotropicBlur={0}
                            distortion={0}
                            distortionScale={0}
                            temporalDistortion={0}
                            backside={true}
                            backsideThickness={0.04}
                            color="#ffffff"
                            envMapIntensity={0}
                            samples={16}
                            resolution={1024}
                            backsideResolution={512}
                            clearcoat={0}
                            clearcoatRoughness={0}
                            attenuationDistance={Infinity}
                            attenuationColor="#ffffff"
                            side={THREE.DoubleSide}
                        />
                        {/* RGB dispersion edges */}
                        <Edges threshold={25} color="#ff4444" scale={1.003} opacity={0.35} transparent />
                        <Edges threshold={25} color="#ffffff" opacity={0.5} transparent />
                        <Edges threshold={25} color="#4488ff" scale={0.997} opacity={0.35} transparent />
                    </mesh>
                </group>
            </group>
        </Float>
    )
}

/**
 * Studio Environment for reflections - TOP LIGHT ONLY
 */
function StudioLighting() {
    return (
        <Environment resolution={512} background={false}>
            <group>
                {/* Main top light - directly above */}
                <mesh position={[0, 25, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[40, 40, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </mesh>

                {/* Dark surroundings for contrast */}
                <mesh position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[40, 40, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#000000" toneMapped={false} />
                </mesh>

                {/* Dark sides */}
                <mesh position={[20, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[40, 40, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#000000" toneMapped={false} />
                </mesh>
                <mesh position={[-20, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[40, 40, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#000000" toneMapped={false} />
                </mesh>
                <mesh position={[0, 0, 20]} rotation={[0, Math.PI, 0]} scale={[40, 40, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#000000" toneMapped={false} />
                </mesh>
                <mesh position={[0, 0, -20]} scale={[40, 40, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#000000" toneMapped={false} />
                </mesh>
            </group>
        </Environment>
    )
}

/**
 * 3D Brand Text - positioned behind crystal for refraction effect
 */
function BrandText() {
    return (
        <group position={[0, 0, -3]}>
            {/* KSENIYA - top line, K partially cut off at left edge */}
            <Text
                position={[-8, 0.9, 0]}
                fontSize={2.8}
                font="/fonts/HelveticaNeueBold.woff"
                color="#ffffff"
                anchorX="left"
                anchorY="middle"
                letterSpacing={-0.02}
            >
                KSENIYA
            </Text>

            {/* ARTMAN - bottom line, A partially cut off at left edge */}
            <Text
                position={[-8, -1.4, 0]}
                fontSize={2.8}
                font="/fonts/HelveticaNeueBold.woff"
                color="#ffffff"
                anchorX="left"
                anchorY="middle"
                letterSpacing={-0.02}
            >
                ARTMAN
            </Text>
        </group>
    )
}

/**
 * Main HeroCrystal Component
 */
function HeroCrystal() {
    return (
        <>
            {/* Ambient fill */}
            <ambientLight intensity={0.03} />

            {/* Key light */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={0.7}
                color="#ffffff"
            />

            {/* Fill light - cool blue */}
            <directionalLight
                position={[-6, 2, -2]}
                intensity={0.25}
                color="#88ccff"
            />

            {/* Rim light - warm for caustics */}
            <directionalLight
                position={[4, -3, -6]}
                intensity={0.2}
                color="#ffcc99"
            />

            {/* Top spot for edge highlights */}
            <spotLight
                position={[0, 12, 6]}
                intensity={1.5}
                angle={0.5}
                penumbra={0.8}
                color="#ffffff"
            />

            <StudioLighting />

            {/* 3D Text behind crystal - will be refracted */}
            <BrandText />

            <GlassCube />

            {/* Floor reflection / glow under cube */}
            <ContactShadows
                position={[0, -2.5, 0]}
                opacity={0.6}
                scale={15}
                blur={2.5}
                far={5}
                color="#aaccff"
                resolution={512}
            />

            {/* Subtle reflective floor plane */}
            <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial
                    color="#000000"
                    metalness={0.9}
                    roughness={0.15}
                    envMapIntensity={0.3}
                />
            </mesh>
        </>
    )
}

export default HeroCrystal
