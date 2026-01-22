import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "../materials/RefractionShaders";

const Geometries = () => {
    // This reference gives us direct access to our mesh
    const mesh = useRef();
    const backgroundGroup = useRef();

    // Render Targets
    const mainRenderTarget = useFBO();
    const backRenderTarget = useFBO();

    // Constants (hardcoded settings to avoid deps)
    const settings = {
        light: new THREE.Vector3(-1.0, 1.0, 1.0),
        diffuseness: 0.2,
        shininess: 15.0,
        fresnelPower: 8.0,
        iorR: 1.15,
        iorY: 1.16,
        iorG: 1.18,
        iorC: 1.22,
        iorB: 1.22,
        iorP: 1.22,
        saturation: 1.14,
        chromaticAberration: 0.5,
        refraction: 0.25
    };

    const uniforms = useMemo(() => ({
        uTexture: { value: null },
        uIorR: { value: 1.0 },
        uIorY: { value: 1.0 },
        uIorG: { value: 1.0 },
        uIorC: { value: 1.0 },
        uIorB: { value: 1.0 },
        uIorP: { value: 1.0 },
        uRefractPower: { value: 0.2 },
        uChromaticAberration: { value: 1.0 },
        uSaturation: { value: 0.0 },
        uShininess: { value: 40.0 },
        uDiffuseness: { value: 0.2 },
        uFresnelPower: { value: 8.0 },
        uLight: { value: new THREE.Vector3(-1.0, 1.0, 1.0) },
        winResolution: {
            value: new THREE.Vector2(
                window.innerWidth,
                window.innerHeight
            ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
        },
    }), []);

    useFrame((state) => {
        const { gl, scene, camera } = state;
        if (!mesh.current) return;

        // Hide mesh to render background
        mesh.current.visible = false;

        // Update uniforms
        mesh.current.material.uniforms.uDiffuseness.value = settings.diffuseness;
        mesh.current.material.uniforms.uShininess.value = settings.shininess;
        mesh.current.material.uniforms.uLight.value = settings.light;
        mesh.current.material.uniforms.uFresnelPower.value = settings.fresnelPower;

        mesh.current.material.uniforms.uIorR.value = settings.iorR;
        mesh.current.material.uniforms.uIorY.value = settings.iorY;
        mesh.current.material.uniforms.uIorG.value = settings.iorG;
        mesh.current.material.uniforms.uIorC.value = settings.iorC;
        mesh.current.material.uniforms.uIorB.value = settings.iorB;
        mesh.current.material.uniforms.uIorP.value = settings.iorP;

        mesh.current.material.uniforms.uSaturation.value = settings.saturation;
        mesh.current.material.uniforms.uChromaticAberration.value = settings.chromaticAberration;
        mesh.current.material.uniforms.uRefractPower.value = settings.refraction;

        // 1. Render Backside to Texture
        gl.setRenderTarget(backRenderTarget);
        gl.render(scene, camera);

        // 2. Render Frontside with Backside texture
        mesh.current.material.uniforms.uTexture.value = backRenderTarget.texture;
        mesh.current.material.side = THREE.BackSide;

        mesh.current.visible = true;
        gl.setRenderTarget(mainRenderTarget);
        gl.render(scene, camera);

        // 3. Final Render to Screen with Frontside texture
        mesh.current.material.uniforms.uTexture.value = mainRenderTarget.texture;
        mesh.current.material.side = THREE.FrontSide;

        gl.setRenderTarget(null);
    });

    return (
        <>
            <color attach="background" args={["black"]} />

            {/* Background Objects for Refraction */}
            <group ref={backgroundGroup}>
                {/* We need something bright to refract. Using basic material for max brightness. */}
                <mesh position={[0, 0, -2]}>
                    <planeGeometry args={[10, 10]} />
                    <meshBasicMaterial color="#111" /> {/* Dark Grey Wall */}
                </mesh>
                <mesh position={[-2, 0, -3]}>
                    <boxGeometry args={[1, 4, 1]} />
                    <meshBasicMaterial color="#ff0000" /> {/* RED */}
                </mesh>
                <mesh position={[0, 0, -3]}>
                    <boxGeometry args={[1, 4, 1]} />
                    <meshBasicMaterial color="#00ff00" /> {/* GREEN */}
                </mesh>
                <mesh position={[2, 0, -3]}>
                    <boxGeometry args={[1, 4, 1]} />
                    <meshBasicMaterial color="#0000ff" /> {/* BLUE */}
                </mesh>
                <mesh position={[0, 0, -4]}>
                    <planeGeometry args={[8, 3]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            </group>

            {/* Standard Mesh + BoxGeometry to avoid drei issues */}
            <mesh ref={mesh}>
                <boxGeometry args={[3, 3, 3]} />
                <shaderMaterial
                    attach="material"
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                />
            </mesh>
        </>
    );
};

export default function RefractionGlassScene() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 7] }} dpr={[1, 2]}>
                <ambientLight intensity={1.0} />
                <Geometries />
                <OrbitControls />
            </Canvas>
        </div>
    );
};
