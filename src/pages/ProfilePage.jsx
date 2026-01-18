/**
 * ProfilePage - Profile/About Page
 * Same layout as HomePage with background image
 */
import './ProfilePage.css'

export default function ProfilePage() {
    return (
        <main className="profile-page">
            {/* Background Image */}
            <div className="profile-bg" aria-hidden="true">
                <img src="/about-2.jpg" alt="" />
            </div>

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
                <a href="/profile" className="nav-link font-nav nav-link--active">PROFILE</a>
            </nav>
            <nav className="corner-nav corner-nav--bottom-right">
                <a href="/contact" className="nav-link font-nav">CONTACT</a>
            </nav>

            {/* === SIDE VERTICAL TEXT === */}
            <div className="side-text side-text--left">
                <span className="vertical-text font-nav">BRANDING</span>
            </div>
            <div className="side-text side-text--right">
                <img src="/lineV.svg" className="line-vertical" aria-hidden="true" alt="" />
                <span className="vertical-text font-nav">ARCHITECT</span>
            </div>

            {/* === CORNER LINE (from BRANDING to right) === */}
            <img src="/corn1.svg" className="corner-line corner-line--top" aria-hidden="true" alt="" />

            {/* === INFO BLOCK (Right Side) === */}
            <aside className="info-panel">
                <p className="info-label font-nav">// SPATIAL BRAND DESIGNER</p>
                <p className="info-label font-nav">// STATUS: ONLINE</p>
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
                <a href="#explore" className="cta-link font-nav">
                    <span className="cta-text">EXPLORE</span>
                    <span className="cta-line" aria-hidden="true" />
                </a>
            </div>
        </main>
    )
}
