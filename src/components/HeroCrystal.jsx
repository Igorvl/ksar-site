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
 */
function createChamferedCubeGeometry(size = 1.5, chamfer = 0.12) {
    const s = size / 2
    const c = chamfer

    // Main cube vertices adjusted for chamfer
    // Each original corner becomes 3 vertices (one for each adjacent face)
    const vertices = []
    const indices = []

    // Helper to add a face (quad as two triangles)
    const addQuad = (v0, v1, v2, v3) => {
        const idx = vertices.length / 3
        vertices.push(...v0, ...v1, ...v2, ...v3)
        indices.push(idx, idx + 1, idx + 2)
        indices.push(idx, idx + 2, idx + 3)
    }

    // Helper to add a triangle
    const addTri = (v0, v1, v2) => {
        const idx = vertices.length / 3
        vertices.push(...v0, ...v1, ...v2)
        indices.push(idx, idx + 1, idx + 2)
    }

    // 6 main faces (with chamfered corners)
    // +X face
    addQuad(
        [s, s - c, -s + c], [s, s - c, s - c], [s, -s + c, s - c], [s, -s + c, -s + c]
    )
    // -X face
    addQuad(
        [-s, s - c, s - c], [-s, s - c, -s + c], [-s, -s + c, -s + c], [-s, -s + c, s - c]
    )
    // +Y face
    addQuad(
        [-s + c, s, s - c], [s - c, s, s - c], [s - c, s, -s + c], [-s + c, s, -s + c]
    )
    // -Y face
    addQuad(
        [-s + c, -s, -s + c], [s - c, -s, -s + c], [s - c, -s, s - c], [-s + c, -s, s - c]
    )
    // +Z face
    addQuad(
        [-s + c, s - c, s], [s - c, s - c, s], [s - c, -s + c, s], [-s + c, -s + c, s]
    )
    // -Z face
    addQuad(
        [s - c, s - c, -s], [-s + c, s - c, -s], [-s + c, -s + c, -s], [s - c, -s + c, -s]
    )

    // 12 edge chamfer faces (rectangles along edges)
    // Edges along X axis
    addQuad([s - c, s, s - c], [-s + c, s, s - c], [-s + c, s - c, s], [s - c, s - c, s])
    addQuad([-s + c, s, -s + c], [s - c, s, -s + c], [s - c, s - c, -s], [-s + c, s - c, -s])
    addQuad([-s + c, -s, s - c], [s - c, -s, s - c], [s - c, -s + c, s], [-s + c, -s + c, s])
    addQuad([s - c, -s, -s + c], [-s + c, -s, -s + c], [-s + c, -s + c, -s], [s - c, -s + c, -s])

    // Edges along Y axis
    addQuad([s, s - c, s - c], [s, -s + c, s - c], [s - c, -s + c, s], [s - c, s - c, s])
    addQuad([s, -s + c, -s + c], [s, s - c, -s + c], [s - c, s - c, -s], [s - c, -s + c, -s])
    addQuad([-s, -s + c, s - c], [-s, s - c, s - c], [-s + c, s - c, s], [-s + c, -s + c, s])
    addQuad([-s, s - c, -s + c], [-s, -s + c, -s + c], [-s + c, -s + c, -s], [-s + c, s - c, -s])

    // Edges along Z axis
    addQuad([s - c, s, s - c], [s, s - c, s - c], [s, s - c, -s + c], [s - c, s, -s + c])
    addQuad([-s + c, s, -s + c], [-s, s - c, -s + c], [-s, s - c, s - c], [-s + c, s, s - c])
    addQuad([s, -s + c, s - c], [s - c, -s, s - c], [s - c, -s, -s + c], [s, -s + c, -s + c])
    addQuad([-s, -s + c, -s + c], [-s + c, -s, -s + c], [-s + c, -s, s - c], [-s, -s + c, s - c])

    // 8 corner triangles
    addTri([s, s - c, s - c], [s - c, s, s - c], [s - c, s - c, s])
    addTri([s - c, s, -s + c], [s, s - c, -s + c], [s - c, s - c, -s])
    addTri([-s + c, s, s - c], [-s, s - c, s - c], [-s + c, s - c, s])
    addTri([-s, s - c, -s + c], [-s + c, s, -s + c], [-s + c, s - c, -s])
    addTri([s - c, -s, s - c], [s, -s + c, s - c], [s - c, -s + c, s])
    addTri([s, -s + c, -s + c], [s - c, -s, -s + c], [s - c, -s + c, -s])
    addTri([-s, -s + c, s - c], [-s + c, -s, s - c], [-s + c, -s + c, s])
    addTri([-s + c, -s, -s + c], [-s, -s + c, -s + c], [-s + c, -s + c, -s])

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    return geometry
}

/**
 * Glass Cube - Main crystal mesh with chamfered edges
 */
function GlassCube() {
    const animRef = useRef()
    const geometry = React.useMemo(() => createChamferedCubeGeometry(1.5, 0.1), [])

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
                    {/* Main Glass Cube with chamfered edges */}
                    <mesh geometry={geometry}>
                        <MeshTransmissionMaterial
                            ior={2.4}
                            transmission={1}
                            thickness={0.5}
                            roughness={0}
                            chromaticAberration={0.6}
                            anisotropicBlur={0}
                            distortion={0}
                            distortionScale={0}
                            temporalDistortion={0}
                            backside={true}
                            backsideThickness={0.2}
                            color="#ffffff"
                            envMapIntensity={0.6}
                            samples={12}
                            resolution={1024}
                            backsideResolution={512}
                            clearcoat={1}
                            clearcoatRoughness={0}
                            attenuationDistance={10}
                            attenuationColor="#ffffff"
                        />
                        {/* Edge highlights */}
                        <Edges
                            threshold={15}
                            color="#ffffff"
                            opacity={0.2}
                            transparent
                        />
                    </mesh>
                </group>
            </group>
        </Float>
    )
}

/**
 * Studio Environment for reflections
 */
function StudioLighting() {
    return (
        <Environment resolution={512} background={false}>
            <group>
                {/* Key light - top right */}
                <mesh position={[8, 10, 5]} scale={[15, 15, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </mesh>

                {/* Fill - left, cool */}
                <mesh position={[-12, 0, 5]} scale={[10, 25, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#99ccff" toneMapped={false} />
                </mesh>

                {/* Rim - back right, warm/magenta for rainbow caustics */}
                <mesh position={[10, -5, -10]} scale={[12, 20, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#ffaacc" toneMapped={false} />
                </mesh>

                {/* Top */}
                <mesh position={[0, 20, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[30, 30, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </mesh>

                {/* Bottom - dark for contrast */}
                <mesh position={[0, -15, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[25, 25, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#111111" toneMapped={false} />
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

            {/* Caustics / floor reflection area */}
            <ContactShadows
                position={[0, -2.2, 0]}
                opacity={0.5}
                scale={12}
                blur={2}
                far={4}
                color="#88aaff"
            />
        </>
    )
}

export default HeroCrystal
