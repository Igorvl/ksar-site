/**
 * GlassCubeDemo - Demo page for the glass cube with refraction
 */
import GlassCube from '../components/GlassCube'
import './GlassCubeDemo.css'

export default function GlassCubeDemo() {
    return (
        <main className="glass-demo-page">
            {/* Full-screen glass cube with text inside 3D scene */}
            <div className="glass-demo-fullscreen">
                <GlassCube
                    size={800}
                    cubeScale={2.5}
                    rotationSpeed={0.008}
                    text="SYNTHETIC"
                />
            </div>

            {/* Subtitle outside */}
            <p className="glass-demo-subtitle font-nav">
                32-Channel Spectral Dispersion • Turbo Rainbow Shader
            </p>
        </main>
    )
}
