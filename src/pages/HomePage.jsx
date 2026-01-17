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
                <span className="vertical-text font-nav">ARCHITECT</span>
            </div>

            {/* === HERO TITLE (Fixed Center) === */}
            <div className="hero-title">
                <h1 className="hero-name font-hero">
                    <span className="hero-name__first">KSENIYA</span>
                    <span className="hero-name__last">ARTMAN</span>
                </h1>
            </div>

            {/* === INFO BLOCK (Right Side) === */}
            <aside className="info-panel">
                <div className="info-block">
                    <p className="info-label font-nav">VISUAL UNIVERSE, BESPOKE</p>
                    <p className="info-label font-nav">CRYSTAL SPACES, MY SINGAPORE,</p>
                    <p className="info-label font-nav">SOPHISTICATED</p>
                </div>
                <div className="info-block">
                    <p className="info-label font-nav">LA GALLERY | DESIGN COMPLETE</p>
                    <p className="info-label font-nav">ARTROOM | DIGITAL PRINT STUDIO</p>
                    <p className="info-label font-nav">BESPOKE | LS</p>
                </div>
                <div className="info-block">
                    <p className="info-label font-nav">EXTERIOR</p>
                </div>
            </aside>

            {/* === META TEXT (Bottom Left) === */}
            <div className="meta-panel">
                <p className="meta-text font-nav">07 04.0607 N 101.1307</p>
                <p className="meta-text font-nav">NEW WORLD</p>
                <p className="meta-text font-nav">VERSION 1.0</p>
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
