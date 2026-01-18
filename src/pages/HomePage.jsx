/**
 * HomePage - Main Landing Page
 * Based on reference design with 12-column grid
 * Layout: Fixed positioning for corners + centered content
 */
import './HomePage.css'

export default function HomePage() {
    return (
        <main className="home-page">
            {/* Background Glow Effect */}
            <div className="home-glow" aria-hidden="true" />

            {/* === CORNER CROSSHAIRS (SVG) === */}
            <img src="/kross.svg" className="crosshair crosshair--top-left" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--top-right" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--bottom-left" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--bottom-right" aria-hidden="true" alt="" />

            {/* === CORNER NAVIGATION === */}
            <nav className="corner-nav corner-nav--top-left">
                <a href="/projects" className="nav-link font-nav">PROJECTS</a>
            </nav>
            <nav className="corner-nav corner-nav--top-right">
                <a href="/online" className="nav-link font-nav">ONLINE</a>
            </nav>
            <nav className="corner-nav corner-nav--bottom-left">
                <a href="/profile" className="nav-link font-nav">PROFILE</a>
            </nav>
            <nav className="corner-nav corner-nav--bottom-right">
                <a href="/contact" className="nav-link font-nav">CONTACT</a>
            </nav>

            {/* === SIDE VERTICAL TEXT === */}
            <div className="side-text side-text--left">
                <span className="vertical-text font-nav">SYNTHETIC</span>
            </div>
            <div className="side-text side-text--right">
                <img src="/lineV.svg" className="line-vertical" aria-hidden="true" alt="" />
                <span className="vertical-text font-nav">ARCHITECT</span>
            </div>

            {/* === CORNER LINE (from SYNTHETIC to right) === */}
            <img src="/corn1.svg" className="corner-line corner-line--top" aria-hidden="true" alt="" />

            {/* === HERO TITLE (Fixed Center) === */}
            <div className="hero-title">
                <h1 className="hero-name font-hero">
                    <span className="hero-name__first">KSENIYA</span>
                    <span className="hero-name__last">ARTMAN</span>
                </h1>
            </div>

            {/* === INFO BLOCK (Right Side) === */}
            <aside className="info-panel">
                <p className="info-label font-nav">SYSTEM_OVERRIDE: INITIATED // PROTOCOL: ABYSSAL_09 // RENDERING_ENVIRONMENT: DARK_MODE</p>
                <p className="info-label font-nav">// LATENCY: 0.00MS // SUBJECT: KSENIYA_ARTMAN // STATUS: ONLINE // DATA_STREAM:</p>
                <p className="info-label font-nav">UNSTABLE // UPLOAD_COMPLETE // ACCESSING_ARCHIVE_FILES...</p>
            </aside>

            {/* === META TEXT (Column 3 - right of PROFILE) === */}
            <div className="meta-panel">
                <img src="/lineV.svg" className="line-horizontal" aria-hidden="true" alt="" />
                <p className="meta-text font-nav">LOC: 34.05° N, 118.24° W</p>
                <p className="meta-text font-nav">new desition</p>
                <p className="meta-text font-nav">VERSION: 1.0</p>
            </div>

            {/* === CTA (Bottom Center) === */}
            <div className="cta-panel">
                <a href="#void" className="cta-link font-nav">
                    <span className="cta-text">ENTER THE VOID</span>
                    <span className="cta-line" aria-hidden="true" />
                </a>
            </div>
        </main>
    )
}
