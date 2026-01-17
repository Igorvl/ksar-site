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
// --- HELPER: Generate Rainbow Gradient Texture ---
function generateRainbowTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 1
    const context = canvas.getContext('2d')
    const gradient = context.createLinearGradient(0, 0, 256, 0)
    // Spectrum: Violet -> Blue -> Cyan -> Green -> Yellow -> Orange -> Red
    gradient.addColorStop(0.0, '#8b00ff') // Violet
    gradient.addColorStop(0.15, '#0000ff') // Blue
    gradient.addColorStop(0.3, '#00ffff') // Cyan
    gradient.addColorStop(0.5, '#00ff00') // Green
    gradient.addColorStop(0.7, '#ffff00') // Yellow
    gradient.addColorStop(0.85, '#ffa500') // Orange
    gradient.addColorStop(1.0, '#ff0000') // Red

    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 1)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
}

/**
 * Create geometry ONLY for the chamfer faces with UVs for gradient mapping
 */
function createChamfersOnlyGeometry(size = 1.5, chamfer = 0.12) {
    const s = size / 2
    const c = chamfer

    const positions = []
    const uvs = []

    // Helper to add a quad with UVs mapped across the width (0->1)
    // We want the gradient to flow "across" the chamfer strip, not along it.
    // So V coordinate goes from 0 to 1 across the width. U goes 0 to 1 along length.
    const addChamferQuad = (v0, v1, v2, v3) => {
        // Tri 1: v0, v1, v2
        positions.push(...v0, ...v1, ...v2)
        uvs.push(0, 0, 1, 0, 1, 1) // V varies 0->1? No, let's map simply: 

        // Actually, simple planar mapping might be tricky. Let's explicitly define corners.
        // v0, v3 are "inner" edge? v1, v2 are "outer"? 
        // Let's assume v0-v1 is "width".
        // Let's try uniform mapping:
        // v0 (0,0), v1(1,0), v2(1,1), v3(0,1) -> Gradient along U (0->1)
    }

    // Let's manually map UVs so the gradient (U axis of texture) maps to the WIDTH of the chamfer.
    // The texture creates a gradient from U=0 to U=1.
    // So we need 0 at one side of the edge, and 1 at the other.

    const addQ = (v0, v1, v2, v3) => {
        // Triangle 1: v0, v1, v2. v0->v1 is ONE SIDE (Long edge?), v1->v2 is SHORT (Width?)
        // Let's look at the calls below.
        // e.g. Y-axis chamfer: [s, s-c, s-c], [s, -s+c, s-c], [s-c, -s+c, s], [s-c, s-c, s]
        // v0(top-right-back), v1(bott-right-back), v2(bott-front-right), v3(top-front-right)
        // v0 and v3 have same Y (top). v1 and v2 have same Y (bottom).
        // So v0-v3 is TOP width. v1-v2 is BOTTOM width.
        // v0-v1 is LENGTH.

        // We want gradient ACROSS the width. So U=0 at v0/v1, U=1 at v3/v2.

        // Tri 1: v0(0,0), v1(0,1), v2(1,1)
        positions.push(...v0, ...v1, ...v2)
        uvs.push(0, 0, 0, 1, 1, 1)

        // Tri 2: v0(0,0), v2(1,1), v3(1,0)
        positions.push(...v0, ...v2, ...v3)
        uvs.push(0, 0, 1, 1, 1, 0)
    }

    // --- 12 EDGE CHAMFERS ONLY ---
    // Around Y axis (Vertical edges)
    addQ([s, s - c, s - c], [s, -s + c, s - c], [s - c, -s + c, s], [s - c, s - c, s])
    addQ([s, -s + c, -s + c], [s, s - c, -s + c], [s - c, s - c, -s], [s - c, -s + c, -s])
    // Note: Winding order here matters less for UVs but good to keep consistency.
    // For UVs + gradient, we just need visual coverage.
    addQ([-s, -s + c, s - c], [-s, s - c, s - c], [-s + c, s - c, s], [-s + c, -s + c, s])
    addQ([-s, s - c, -s + c], [-s, -s + c, -s + c], [-s + c, -s + c, -s], [-s + c, s - c, -s])

    // Around X axis
    addQ([s - c, s, s - c], [-s + c, s, s - c], [-s + c, s - c, s], [s - c, s - c, s])
    addQ([-s + c, s, -s + c], [s - c, s, -s + c], [s - c, s - c, -s], [-s + c, s - c, -s])
    addQ([-s + c, -s, s - c], [s - c, -s, s - c], [s - c, -s + c, s], [-s + c, -s + c, s])
    addQ([s - c, -s, -s + c], [-s + c, -s, -s + c], [-s + c, -s + c, -s], [s - c, -s + c, -s])

    // Around Z axis (Connecting X-Y)
    addQ([s - c, s, -s + c], [s - c, s, s - c], [s, s - c, s - c], [s, s - c, -s + c])
    addQ([-s + c, s, s - c], [-s + c, s, -s + c], [-s, s - c, -s + c], [-s, s - c, s - c])
    addQ([s, -s + c, s - c], [s, -s + c, -s + c], [s - c, -s, -s + c], [s - c, -s, s - c])
    addQ([-s, -s + c, -s + c], [-s, -s + c, s - c], [-s + c, -s, s - c], [-s + c, -s, -s + c])

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    return geometry
}

/**
 * Glass Crystal Component
 */
function GlassCube() {
    const animRef = useRef()
    const geometry = React.useMemo(() => createChamferedCubeGeometry(1.5, 0.12), [])

    // Geometry for the rainbow effect on edges
    const chamferGeometry = React.useMemo(() => createChamfersOnlyGeometry(1.5, 0.12), [])

    // Texture needs to wrap for scrolling animation
    const rainbowTexture = React.useMemo(() => {
        const tex = generateRainbowTexture()
        tex.wrapS = THREE.RepeatWrapping
        tex.wrapT = THREE.RepeatWrapping
        return tex
    }, [])

    useFrame((state, delta) => {
        if (animRef.current) {
            // 1. Base auto-rotation (slow)
            const autoSpeed = 0.05
            // Using elapsed time ensures consistent speed regardless of framerate
            const currentAutoRot = state.clock.elapsedTime * autoSpeed

            // 2. Mouse Interaction: Rotate around vertical axis ONLY (Y-axis)
            // Use smooth lerp for mouse influence to avoid jitter
            // Target rotation = Base Auto + Mouse X influence
            const mouseInfluence = state.pointer.x * 0.8 // Sensitivity

            // Smoothly blend to the target Y rotation
            // We use a separate variable or apply directly? 
            // Applying directly to .y with lerp effectively smoothens the mouse input
            // But we need to mix 'auto' (continuous) and 'mouse' (static offset).

            const targetY = currentAutoRot + mouseInfluence

            // Lerp current rotation to target (smoothing the mouse movement)
            animRef.current.rotation.y = THREE.MathUtils.lerp(animRef.current.rotation.y, targetY, 0.1)

            // STRICTLY ZERO TILT on other axes
            animRef.current.rotation.x = 0
            animRef.current.rotation.z = 0
        }

        // 3. Alive Dispersion: texture animation
        if (rainbowTexture) {
            rainbowTexture.offset.x += delta * 0.2
        }
    })

    return (
        <Float
            speed={0.8}
            rotationIntensity={0} // STOP tilting/wobbling
            floatIntensity={0.3} // Keep vertical floating
        >
            <group ref={animRef}>
                <group rotation={[-Math.atan(1 / Math.SQRT2), 0, Math.PI / 4]} scale={[1.8, 1.8, 1.8]}>

                    {/* 1. MAIN GLASS BODY */}
                    <mesh geometry={geometry}>
                        <MeshTransmissionMaterial
                            ior={2.4}
                            transmission={1}
                            thickness={0.06}
                            roughness={0}
                            chromaticAberration={0.6}
                            anisotropicBlur={0.05}
                            distortion={0.2}
                            distortionScale={0.3}
                            temporalDistortion={0}
                            backside={true}
                            backsideThickness={0.03}
                            color="#ffffff"
                            envMapIntensity={0.5}
                            samples={16}
                            resolution={1024}
                            backsideResolution={512}
                            clearcoat={0}
                            clearcoatRoughness={0}
                            attenuationDistance={Infinity}
                            attenuationColor="#ffffff"
                            side={THREE.DoubleSide}
                        />
                    </mesh>

                    {/* 2. RAINBOW CHAMFERS GLOW */}
                    {/* Rendered slightly larger to avoid Z-fighting, with additive blending */}
                    <mesh geometry={chamferGeometry} scale={[1.002, 1.002, 1.002]}>
                        <meshBasicMaterial
                            map={rainbowTexture}
                            transparent
                            opacity={0.8}
                            blending={THREE.AdditiveBlending}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* 3. ADDITIONAL SHARP HIGHLIGHTS (White only) */}
                    <Edges threshold={25} color="#ffffff" opacity={0.4} transparent />

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
