/**
 * ProjectsPage - Projects Listing Page
 * Based on HomePage design but simplified
 */
import './ProjectsPage.css'
import { useModal } from '../context/ModalContext'
import OnlineIndicator from '../components/OnlineIndicator'

export default function ProjectsPage() {
    const { openContactModal } = useModal()

    return (
        <main className="projects-page">
            {/* Full Screen Placeholder Image */}
            {/* Full Screen Placeholder Image */}
            <div className="project-hero-image">
                <a href="/soma" style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img src="/projects_cat_Soma.jpg" alt="Soma Project" />
                </a>
            </div>

            {/* Background Glow Effect */}
            <div className="home-glow" aria-hidden="true" />

            {/* === CORNER CROSSHAIRS (SVG) === */}
            <img src="/kross.svg" className="crosshair crosshair--top-left" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--top-right" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--bottom-left" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--bottom-right" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--bottom-center" aria-hidden="true" alt="" />

            {/* === CORNER NAVIGATION === */}
            <nav className="corner-nav corner-nav--top-left">
                <a href="/" className="nav-link font-nav">HOME</a>
            </nav>
            <nav className="corner-nav corner-nav--top-right">
                <span className="nav-status nav-status--online font-nav">
                    ONLINE
                    <OnlineIndicator />
                </span>
            </nav>
            <nav className="corner-nav corner-nav--bottom-left">
                <a href="/profile" className="nav-link font-nav">PROFILE</a>
            </nav>
            <nav className="corner-nav corner-nav--bottom-right">
                <button onClick={openContactModal} className="nav-link font-nav nav-button">CONTACT</button>
            </nav>

            {/* === SIDE VERTICAL TEXT === */}
            <div className="side-text side-text--left">
                <span className="vertical-text font-nav">BRANDING</span>
            </div>


            {/* === CORNER LINE (from SYNTHETIC to right) === */}
            <img src="/corn1.svg" className="corner-line corner-line--top" aria-hidden="true" alt="" />

            {/* === INFO BLOCK (Right Side) === */}
            <aside className="info-panel">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="info-block">
                        <p className="info-label font-nav">// LATENCY: 0.00MS // SUBJECT: KSENIYA_ARTMAN // STATUS: ONLINE // DATA_STREAM: UNSTABLE // UNIFORM VEC2 WINRESOLUTION; //</p>
                        <p className="info-label font-nav">UPLOAD_COMPLETE // ACCESSING_ARCHIVE_FILES...SYSTEM_OVERRIDE: INITIATED // UNIFORM SAMPLER2D UTEXTURE; // VARYING VEC3 EYEVECTOR; //</p>
                        <p className="info-label font-nav">PROTOCOL: ABYSSAL_09 // RENDERING_ENVIRONMENT: DARK_MODE // VARYING VEC3 WORLDNORMAL</p>
                    </div>
                ))}
            </aside>

        </main>
    )
}
