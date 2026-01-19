/**
 * ProfilePage - Profile/About Page
 * Two-screen layout with scroll
 * Each section has its own UI elements (crosshairs, nav, texts)
 */
import './ProfilePage.css'

export default function ProfilePage() {
    return (
        <main className="profile-page">
            {/* === SCREEN 1: HERO === */}
            <section className="profile-section profile-section--hero" id="hero">
                {/* Background Image */}
                <div className="profile-bg" aria-hidden="true">
                    <img src="/about-2.jpg" alt="" />
                </div>
                <div className="profile-bg-overlay" aria-hidden="true" />

                {/* Corner Crosshairs */}
                <img src="/kross.svg" className="crosshair crosshair--top-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--top-right" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-right" aria-hidden="true" alt="" />

                {/* Corner Navigation */}
                <nav className="corner-nav corner-nav--top-left">
                    <a href="/projects" className="nav-link font-nav">PROJECTS</a>
                </nav>
                <nav className="corner-nav corner-nav--top-right">
                    <a href="/online" className="nav-link font-nav">ONLINE</a>
                </nav>
                <nav className="corner-nav corner-nav--bottom-left">
                    <a href="/" className="nav-link font-nav">HOME</a>
                </nav>
                <nav className="corner-nav corner-nav--bottom-right">
                    <a href="/contact" className="nav-link font-nav">CONTACT</a>
                </nav>

                {/* Side Vertical Text */}
                <div className="side-text side-text--left">
                    <span className="vertical-text font-nav">BRANDING</span>
                </div>
                <div className="side-text side-text--right">
                    <img src="/lineV.svg" className="line-vertical" aria-hidden="true" alt="" />
                    <span className="vertical-text font-nav">ARCHITECT</span>
                </div>

                {/* Corner Line */}
                <img src="/corn1.svg" className="corner-line corner-line--top" aria-hidden="true" alt="" />

                {/* Meta Panel */}
                <div className="meta-panel">
                    <img src="/lineV.svg" className="line-horizontal" aria-hidden="true" alt="" />
                    <p className="meta-text font-nav">LOC: 34.05° N, 118.24° W</p>
                    <p className="meta-text font-nav">new desition</p>
                    <p className="meta-text font-nav">VERSION: 1.0</p>
                </div>

                {/* CTA */}
                <div className="cta-panel">
                    <a href="#section-2" className="cta-link font-nav">
                        <span className="cta-text">EXPLORE</span>
                        <span className="cta-line" aria-hidden="true" />
                    </a>
                </div>
            </section>

            {/* === SCREEN 2: K.S.A.R. ALGORITHM === */}
            <section className="profile-section profile-section--algorithm" id="section-2">
                {/* Corner Crosshairs */}
                <img src="/kross.svg" className="crosshair crosshair--top-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--top-right" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-right" aria-hidden="true" alt="" />

                {/* Corner Navigation */}
                <nav className="corner-nav corner-nav--top-left">
                    <a href="/projects" className="nav-link font-nav">PROJECTS</a>
                </nav>
                <nav className="corner-nav corner-nav--top-right">
                    <a href="/online" className="nav-link font-nav">ONLINE</a>
                </nav>
                <nav className="corner-nav corner-nav--bottom-left">
                    <a href="/" className="nav-link font-nav">HOME</a>
                </nav>
                <nav className="corner-nav corner-nav--bottom-right">
                    <a href="/contact" className="nav-link font-nav">CONTACT</a>
                </nav>

                {/* Side Vertical Text */}
                <div className="side-text side-text--left">
                    <span className="vertical-text font-nav">BRANDING</span>
                </div>
                <div className="side-text side-text--right">
                    <img src="/lineV.svg" className="line-vertical" aria-hidden="true" alt="" />
                    <span className="vertical-text font-nav">INTERIOR</span>
                </div>

                {/* Corner Line */}
                <img src="/corn1.svg" className="corner-line corner-line--top" aria-hidden="true" alt="" />

                {/* Meta Panel */}
                <div className="meta-panel">
                    <img src="/lineV.svg" className="line-horizontal" aria-hidden="true" alt="" />
                    <p className="meta-text font-nav">LOC: 34.05° N, 118.24° W</p>
                    <p className="meta-text font-nav">new desition</p>
                    <p className="meta-text font-nav">VERSION: 1.0</p>
                </div>

                {/* CTA */}
                <div className="cta-panel">
                    <a href="#section-3" className="cta-link font-nav">
                        <span className="cta-text">EXPLORE</span>
                        <span className="cta-line" aria-hidden="true" />
                    </a>
                </div>

                {/* Section Content */}
                <div className="section-content">
                    <header className="section-header">
                        <span className="section-label font-nav">THE K.S.A.R. ALGORITHM / PHASE 01</span>
                    </header>

                    <h2 className="section-title font-hero">
                        A FLAT BRAND<br />
                        IS A DEAD BRAND.
                    </h2>

                    <div className="section-text">
                        <p className="section-paragraph font-body">
                            We don't just draw logos; we engineer Brand Universes.
                            In a world of digital noise, a brand must possess volume.
                        </p>
                        <p className="section-paragraph font-body">
                            Our method translates Brand Semiotics — your meanings, signs,
                            and visual codes — into Immersive Reality. We bridge the gap
                            between Graphic Design and Interior Concept, simulating the
                            ecosystem where your brand lives: from the pixel on a screen to
                            the texture of a concrete wall.
                        </p>
                    </div>
                </div>
            </section>

            {/* === SCREEN 3: K.S.A.R. CORE PROTOCOL === */}
            <section className="profile-section profile-section--protocol" id="section-3">
                {/* Corner Crosshairs */}
                <img src="/kross.svg" className="crosshair crosshair--top-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--top-right" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-right" aria-hidden="true" alt="" />

                {/* Corner Navigation */}
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

                {/* Side Vertical Text */}
                <div className="side-text side-text--left">
                    <span className="vertical-text font-nav">BRANDING</span>
                </div>
                <div className="side-text side-text--right">
                    <img src="/lineV.svg" className="line-vertical" aria-hidden="true" alt="" />
                    <span className="vertical-text font-nav">INTERIOR</span>
                </div>

                {/* Corner Line */}
                <img src="/corn1.svg" className="corner-line corner-line--top" aria-hidden="true" alt="" />

                {/* Meta Panel */}
                <div className="meta-panel">
                    <img src="/lineV.svg" className="line-horizontal" aria-hidden="true" alt="" />
                    <p className="meta-text font-nav">LOC: 34.05° N, 118.24° W</p>
                    <p className="meta-text font-nav">new desition</p>
                    <p className="meta-text font-nav">VERSION: 1.0</p>
                </div>

                {/* CTA */}
                <div className="cta-panel">
                    <a href="#section-4" className="cta-link font-nav">
                        <span className="cta-text">EXPLORE</span>
                        <span className="cta-line" aria-hidden="true" />
                    </a>
                </div>

                {/* Section Content - K.S.A.R. Protocol */}
                <div className="section-content section-content--protocol">
                    <header className="section-header">
                        <span className="section-label font-nav">// K.S.A.R. CORE PROTOCOL:</span>
                    </header>

                    <div className="protocol-grid">
                        <div className="protocol-item">
                            <h3 className="protocol-title font-hero">
                                <span className="protocol-letter">[K]</span> KINETIC
                            </h3>
                            <p className="protocol-description font-body">
                                Scenarios of motion. How the user moves through the brand environment.
                            </p>
                        </div>

                        <div className="protocol-item">
                            <h3 className="protocol-title font-hero">
                                <span className="protocol-letter">[S]</span> SEMIOTICS
                            </h3>
                            <p className="protocol-description font-body">
                                The most critical layer. We treat the interior not as decoration, but as an unfolded 3D-symbol of your brand identity.
                            </p>
                        </div>

                        <div className="protocol-item">
                            <h3 className="protocol-title font-hero">
                                <span className="protocol-letter">[A]</span> ATMOSPHERE
                            </h3>
                            <p className="protocol-description font-body">
                                Sensory impact. Light, tactility, sound, and the emotional weight of materials.
                            </p>
                        </div>

                        <div className="protocol-item">
                            <h3 className="protocol-title font-hero">
                                <span className="protocol-letter">[R]</span> RESEARCH
                            </h3>
                            <p className="protocol-description font-body">
                                Marketing precision. Business logic and target audience analysis behind every line.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === SCREEN 4: SERVICES === */}
            <section className="profile-section profile-section--services" id="section-4">
                {/* Corner Crosshairs */}
                <img src="/kross.svg" className="crosshair crosshair--top-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--top-right" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-right" aria-hidden="true" alt="" />

                {/* Corner Navigation */}
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

                {/* Side Vertical Text */}
                <div className="side-text side-text--left">
                    <span className="vertical-text font-nav">BRANDING</span>
                </div>
                <div className="side-text side-text--right">
                    <img src="/lineV.svg" className="line-vertical" aria-hidden="true" alt="" />
                    <span className="vertical-text font-nav">INTERIOR</span>
                </div>

                {/* Corner Line */}
                <img src="/corn1.svg" className="corner-line corner-line--top" aria-hidden="true" alt="" />

                {/* Meta Panel */}
                <div className="meta-panel">
                    <img src="/lineV.svg" className="line-horizontal" aria-hidden="true" alt="" />
                    <p className="meta-text font-nav">LOC: 34.05° N, 118.24° W</p>
                    <p className="meta-text font-nav">new desition</p>
                    <p className="meta-text font-nav">VERSION: 1.0</p>
                </div>

                {/* CTA */}
                <div className="cta-panel">
                    <a href="#section-5" className="cta-link font-nav">
                        <span className="cta-text">EXPLORE</span>
                        <span className="cta-line" aria-hidden="true" />
                    </a>
                </div>

                {/* Section Content - Services Grid */}
                <div className="section-content section-content--services">
                    <div className="services-grid">
                        {/* Service 1: Brand Identity System */}
                        <article className="service-card">
                            <header className="service-header">
                                <span className="service-label font-nav">BRAND DNA SYNTHESIS / PHASE 01</span>
                            </header>
                            <h3 className="service-title font-hero">
                                Brand Identity<br />System
                            </h3>
                            <p className="service-description font-body">
                                High-end logo design, typography, and visual systems. Creating adaptive identities designed to dominate any medium.
                            </p>
                        </article>

                        {/* Service 2: Spatial Concepts */}
                        <article className="service-card">
                            <header className="service-header">
                                <span className="service-label font-nav">CONCEPTS / PHASE 02</span>
                            </header>
                            <h3 className="service-title font-hero">
                                Spatial<br />Concepts
                            </h3>
                            <p className="service-description font-body">
                                Beyond standard mockups. Atmospheric 3D-visualization of your future space. We show how the brand lives in the real world before construction begins.
                            </p>
                        </article>

                        {/* Service 3: Digital Experience */}
                        <article className="service-card">
                            <header className="service-header">
                                <span className="service-label font-nav">DIGITAL / PHASE 03</span>
                            </header>
                            <h3 className="service-title font-hero">
                                Digital<br />Experience
                            </h3>
                            <p className="service-description font-body">
                                Web-design and UI/UX that continues the storytelling. Translating physical atmosphere into the browser.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* === SCREEN 5: CONTACT CTA === */}
            <section className="profile-section profile-section--contact" id="section-5">
                {/* Corner Crosshairs */}
                <img src="/kross.svg" className="crosshair crosshair--top-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--top-right" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-left" aria-hidden="true" alt="" />
                <img src="/kross.svg" className="crosshair crosshair--bottom-right" aria-hidden="true" alt="" />

                {/* Corner Navigation */}
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

                {/* Side Vertical Text */}
                <div className="side-text side-text--left">
                    <span className="vertical-text font-nav">BRANDING</span>
                </div>
                <div className="side-text side-text--right">
                    <img src="/lineV.svg" className="line-vertical" aria-hidden="true" alt="" />
                    <span className="vertical-text font-nav">INTERIOR</span>
                </div>

                {/* Corner Line */}
                <img src="/corn1.svg" className="corner-line corner-line--top" aria-hidden="true" alt="" />

                {/* Meta Panel */}
                <div className="meta-panel">
                    <img src="/lineV.svg" className="line-horizontal" aria-hidden="true" alt="" />
                    <p className="meta-text font-nav">LOC: 34.05° N, 118.24° W</p>
                    <p className="meta-text font-nav">new desition</p>
                    <p className="meta-text font-nav">VERSION: 1.0</p>
                </div>

                {/* CTA - Arrow Up (back to top) */}
                <div className="cta-panel">
                    <a href="#hero" className="cta-link cta-link--arrow font-nav">
                        <span className="cta-arrow" aria-hidden="true">↑</span>
                    </a>
                </div>

                {/* Section Content - Contact CTA */}
                <div className="section-content section-content--contact">
                    <header className="contact-header">
                        <span className="contact-label font-nav">// READY TO INITIALIZE?</span>
                    </header>

                    <a href="mailto:init@ksar.me" className="contact-email font-hero">
                        INIT@KSAR.ME
                    </a>
                </div>
            </section>
        </main>
    )
}
