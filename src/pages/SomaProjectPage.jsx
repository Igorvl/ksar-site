/**
 * SomaProjectPage - Detailed view for SOMA Project
 */
import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import './SomaProjectPage.css'
import { useModal } from '../context/ModalContext'
import OnlineIndicator from '../components/OnlineIndicator'
import SomaLogo from '../components/SomaLogo'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import BiometricsProgress from '../components/BiometricsProgress'

export default function SomaProjectPage() {
    const { openContactModal } = useModal()
    const [isNavDark, setIsNavDark] = useState(false)
    const section3Ref = useRef(null)
    const section5Ref = useRef(null)
    const section8Ref = useRef(null)
    const biometricsCardRef = useRef(null)
    const biometricsInView = useInView(biometricsCardRef, { amount: 0.4 })

    // Parallax Logic for Section 8
    const { scrollYProgress } = useScroll({
        target: section8Ref,
        offset: ["start end", "end start"]
    })

    // Parallax transforms: "smooth but substantial ~10%"
    // Adjusted to +/- 10% to match scale 1.25 (25% buffer, 12.5% per side) to prevent edge clipping
    const parallaxY_Main = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
    const parallaxY_Sub = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

    // Data Cascade Variants for Protocol
    const protocolContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    }

    const protocolItemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    }

    // Animation Variants for "Blueprint" Assembly
    const gridContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.06,
                delayChildren: 0.05
            }
        }
    }

    const drawLineHoriz = {
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
            scaleX: 1,
            opacity: 1,
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } // Custom bezier for premium feel
        }
    }

    const drawLineVert = {
        hidden: { scaleY: 0, opacity: 0 },
        visible: {
            scaleY: 1,
            opacity: 1,
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
        }
    }

    const fadeUp = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    }

    const markerScale = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        }
    }

    const circleRotate = {
        hidden: { rotate: -90, opacity: 0, scale: 0.8 },
        visible: {
            rotate: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 1.5, ease: "easeOut" }
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Simple logic: If any observed light section is entering the top zone, make nav dark.
                    // If leaving, make it light (assuming we revert to default dark bg).
                    if (entry.isIntersecting) {
                        setIsNavDark(true)
                    } else {
                        setIsNavDark(false)
                    }
                })
            },
            {
                threshold: 0,
                // Trigger when the section top reaches 10% of the viewport height (near the nav)
                rootMargin: "-2% 0px -90% 0px" // Adjusted slightly to be more responsive at the very top
            }
        )

        if (section3Ref.current) observer.observe(section3Ref.current)
        if (section5Ref.current) observer.observe(section5Ref.current)
        if (section8Ref.current) observer.observe(section8Ref.current)

        return () => observer.disconnect()
    }, [])

    return (
        <main className="soma-project-page">



            {/* === NAVIGATION (Strictly limited as per request) === */}
            <nav className={`corner-nav corner-nav--top-left ${isNavDark ? 'nav-dark' : ''}`}>
                <a href="/projects" className="nav-link">
                    <span className="nav-blur-bg" aria-hidden="true"></span>
                    <span className="nav-text font-nav">BACK TO PROJECTS</span>
                </a>
            </nav>

            {/* === GLOBAL CROSSHAIRS === */}
            <div className="crosshair crosshair--top-left"></div>
            <div className="crosshair crosshair--top-right"></div>
            <div className="crosshair crosshair--bottom-left"></div>
            <div className="crosshair crosshair--bottom-right"></div>

            {/* === SCROLLABLE BACKGROUND IMAGE === */}
            <div className="soma-bg-container">
                <img src="/Projects/Soma/Soma1.webp?v=2" alt="Soma Project Background" className="soma-bg-image" />
            </div>

            {/* === SOMA LOGO & DETAILS === */}
            <div className="soma-logo-container">
                <SomaLogo className="soma-logo" />

                {/* Investment Details */}
                <div className="soma-details">
                    <span className="soma-detail-left font-nav">INVESTMENT DECK // 2026</span>
                    <span className="soma-detail-right font-nav">V 2.0 / FINAL</span>
                </div>
            </div>




            {/* Background Glow Effect */}
            <div className="home-glow" aria-hidden="true" />

            {/* ============================================
                SECTION 2: GENESIS (Orb)
                ============================================ */}
            <section className="soma-section soma-section-2">
                {/* Grid Lines */}
                <div className="soma-grid-line soma-grid-vert" />
                <div className="soma-grid-line soma-grid-horiz" />

                {/* Corner Markers (Top) */}
                <div className="soma-corner-marker soma-corner-tl" />
                <div className="soma-corner-marker soma-corner-tr" />

                {/* Top Labels */}
                <div className="soma-label soma-label-tl font-nav">FIG 01. GENESIS ORIGIN</div>
                <div className="soma-label soma-label-tr font-nav">STATUS: ACTIVE</div>
                <div className="soma-label soma-label-tc font-nav">PROJECT: GENESIS // V 2.0</div>

                {/* Center Content */}
                <div className="soma-orb-container">
                    <img src="/Projects/Soma/Soma2.webp" alt="Genesis Orb" className="soma-orb-image" />

                </div>

                {/* Bottom Content */}
                <div className="soma-bottom-wrapper">
                    <h3 className="soma-section-title font-hero">CELLULAR REGENERATION PROTOCOLS</h3>
                    <p className="soma-section-subtitle font-nav">We don't treat aging. We cancel it.</p>
                </div>

                {/* Bottom Markers */}
                <div className="soma-label soma-label-bl font-nav">DATE: 2026.01.20</div>
                <div className="soma-label soma-label-br font-nav">REF: A-001</div>

                {/* Corner Markers (Bottom) */}
                <div className="soma-corner-marker soma-corner-bl" />
                <div className="soma-corner-marker soma-corner-br" />
            </section>

            {/* ============================================
                SECTION 3: IDENTITY GRID (Light Mode)
                ============================================ */}
            <motion.section
                className="soma-section soma-section-3 light-mode"
                ref={section3Ref}
                variants={gridContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
            >
                {/* Grid Lines (Darker for light bg) */}
                {/* Vertical Line growing from top */}
                <motion.div
                    className="soma-grid-line soma-grid-vert"
                    variants={drawLineVert}
                    style={{ originY: 0 }}
                />

                {/* Header Separator Line growing from center */}
                <motion.div
                    className="soma-identity-header-line"
                    variants={drawLineHoriz}
                    style={{ originX: 0.5 }}
                />

                {/* Header Vertical Line */}
                <motion.div
                    className="soma-identity-vert-line"
                    variants={drawLineVert}
                    style={{ originY: 0 }}
                />

                {/* Dashed Center Guide - Rotates nicely */}
                <motion.div
                    className="soma-dashed-circle"
                    variants={circleRotate}
                    style={{
                        rotate: 0
                    }}
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        // Initial appearance handled by variants
                        // Continuous rotation:
                        rotate: {
                            duration: 60,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                />

                {/* Corner Markers - Pop in */}
                <motion.div className="soma-corner-marker soma-corner-tl" variants={markerScale} />
                <motion.div className="soma-corner-marker soma-corner-tr" variants={markerScale} />
                <motion.div className="soma-corner-marker soma-corner-bl" variants={markerScale} />
                <motion.div className="soma-corner-marker soma-corner-br" variants={markerScale} />

                {/* Top Labels - Fade up */}
                <motion.div className="soma-label soma-label-tl font-nav text-dark" variants={fadeUp}>FIG 02. IDENTITY GRID</motion.div>
                <motion.div className="soma-label soma-label-tr font-nav text-dark" variants={fadeUp}>SYSTEM: VISUAL DNA</motion.div>

                {/* Center Wrapper */}
                <div className="soma-identity-wrapper">

                    {/* Left Caption */}
                    <motion.div className="soma-caption soma-caption-left font-nav text-dark" variants={fadeUp}>
                        <span>GRID: GOLDEN RATIO</span>
                        <motion.div className="caption-line" variants={drawLineHoriz} style={{ originX: 1 }}></motion.div>
                    </motion.div>

                    {/* Logo Area */}
                    <div className="soma-logo-construction-area">
                        {/* Inner markers - Sequential pop in */}
                        <motion.div className="inner-marker marker-tl" variants={markerScale}></motion.div>
                        <motion.div className="inner-marker marker-tr" variants={markerScale}></motion.div>
                        <motion.div className="inner-marker marker-bl" variants={markerScale}></motion.div>
                        <motion.div className="inner-marker marker-br" variants={markerScale}></motion.div>

                        {/* Logo fades in last */}
                        <motion.img
                            src="/Projects/Soma/Soma_Logo2.svg"
                            alt="Soma Identity Logo"
                            className="soma-identity-logo"
                            variants={fadeUp}
                        />
                    </div>

                    {/* Right Caption */}
                    <motion.div className="soma-caption soma-caption-right font-nav text-dark" variants={fadeUp}>
                        <motion.div className="caption-line" variants={drawLineHoriz} style={{ originX: 0 }}></motion.div>
                        <span>HEX: #1A1A1A / ONYX</span>
                    </motion.div>
                </div>

                {/* Bottom Text Content - Wrapped to fix centering conflict */}
                <div className="soma-identity-text-wrapper-static">
                    <motion.div className="soma-identity-text-content" variants={fadeUp}>
                        <h3 className="soma-section-title text-dark font-label">THE MITOSIS PULSE</h3>
                        <p className="soma-section-desc text-dark font-label">
                            The visual identity is derived from the precise moment of cellular<br />
                            division. Two organic entities connected by a vital thread,<br />
                            symbolizing the transfer of energy and life.
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Labels */}
                <motion.div className="soma-label soma-label-bl font-nav text-dark" variants={fadeUp}>DATE: 2026 / Q3</motion.div>
                <motion.div className="soma-label soma-label-br font-nav text-dark" variants={fadeUp}>LOGO CONSTRUCTION</motion.div>

            </motion.section>

            {/* ============================================
                SECTION 4: CHROMATIC DNA (Materials)
                ============================================ */}
            <motion.section
                className="soma-section soma-section-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Global Vertical Line through the section */}
                <motion.div
                    className="soma-grid-line soma-grid-vert"
                    variants={drawLineVert}
                    style={{ originY: 0 }}
                />

                {/* Header Area */}
                <div className="soma-materials-header">
                    <motion.div
                        className="soma-vert-line-up"
                        variants={drawLineVert}
                        style={{ originY: 1 }} // Grows upwards from bottom
                    />
                    <motion.div
                        className="soma-grid-line soma-grid-horiz-top"
                        variants={drawLineHoriz}
                        style={{ originX: 0.5 }} // Grows from center
                    />
                    <motion.div className="soma-label soma-label-tl font-nav" variants={fadeUp}>FIG 03: CHROMATIC DNA</motion.div>
                    <motion.div className="soma-label soma-label-tr font-nav" variants={fadeUp}>PROTOTYPE / V 2.0</motion.div>
                </div>

                {/* Materials Grid */}
                <div className="soma-materials-grid">
                    {/* Card 1: Tectonic Grey */}
                    <motion.div
                        className="soma-material-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <div className="material-image-container">
                            <img src="/Projects/Soma/Soma4_1.webp" alt="Tectonic Grey Material" className="material-image" />
                        </div>
                        <div className="material-color-bar" style={{ backgroundColor: '#1E1D1B' }}></div>
                        <div className="material-content-row">
                            <div className="material-info">
                                <h4 className="material-title">TECTONIC GREY</h4>
                                <div className="material-meta font-nav">
                                    <div>ROLE: BASE / STRUCTURE</div>
                                    <div>HEX: #1E1D1B</div>
                                </div>
                            </div>
                            <div className="material-corner-l-shape"></div>
                        </div>
                    </motion.div>

                    {/* Card 2: Amber Resin */}
                    <motion.div
                        className="soma-material-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="material-image-container">
                            <img src="/Projects/Soma/Soma4_2.webp" alt="Amber Resin Material" className="material-image" />
                        </div>
                        <div className="material-color-bar" style={{ backgroundColor: '#BF8232' }}></div>
                        <div className="material-content-row">
                            <div className="material-info">
                                <h4 className="material-title">AMBER RESIN</h4>
                                <div className="material-meta font-nav">
                                    <div>ROLE: ENERGY / FLUX</div>
                                    <div>HEX: #BF8232</div>
                                </div>
                            </div>
                            <div className="material-corner-l-shape"></div>
                        </div>
                    </motion.div>

                    {/* Card 3: Raw Travertine */}
                    <motion.div
                        className="soma-material-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <div className="material-image-container">
                            <img src="/Projects/Soma/Soma4_3.webp" alt="Raw Travertine Material" className="material-image" />
                        </div>
                        <div className="material-color-bar" style={{ backgroundColor: '#C8C2B6' }}></div>
                        <div className="material-content-row">
                            <div className="material-info">
                                <h4 className="material-title">RAW TRAVERTINE</h4>
                                <div className="material-meta font-nav">
                                    <div>ROLE: CALM / FOUNDATION</div>
                                    <div>HEX: #C8C2B6</div>
                                </div>
                            </div>
                            <div className="material-corner-l-shape"></div>
                        </div>
                    </motion.div>
                </div>


                <motion.div
                    className="soma-grid-line soma-grid-vert-bottom"
                    variants={drawLineVert}
                    style={{ originY: 0 }}
                />
            </motion.section>

            {/* ============================================
                SECTION 5: TYPOGRAPHIC SYNTAX
                ============================================ */}
            <motion.section
                ref={section5Ref}
                className="soma-section soma-section-5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Global Vertical Line (Dark for light bg) */}
                <motion.div
                    className="soma-grid-line soma-grid-vert soma-line-dark"
                    variants={drawLineVert}
                    style={{ originY: 0 }}
                />

                {/* Header Area */}
                <div className="soma-typography-header">
                    <motion.div
                        className="soma-grid-line soma-grid-horiz-top soma-line-dark"
                        variants={drawLineHoriz}
                        style={{ originX: 0.5 }}
                    />
                    {/* Vertical line going UP to connect with previous section */}
                    <div className="soma-vert-line-up soma-line-dark"></div>

                    <motion.div className="soma-label soma-label-tl font-nav soma-text-dark" variants={fadeUp}>
                        FIG 04: TYPOGRAPHIC SYNTAX
                    </motion.div>
                    <motion.div className="soma-label soma-label-tr font-nav soma-text-dark" variants={fadeUp}>
                        PROTOTYPE / V 2.0
                    </motion.div>
                </div>

                {/* Typography Content Container */}
                <div className="soma-typography-content">

                    {/* Block 1: Manrope */}
                    <div className="soma-type-block">
                        <div className="soma-type-image-wrapper">
                            <img src="/Projects/Soma/Soma5_1.svg" alt="Manrope Graphic" className="soma-type-img" />
                        </div>
                        <div className="soma-type-info">
                            <div className="soma-type-role font-nav">PRIMARY TYPEFACE // HUMAN INTERFACE</div>
                            <h2 className="soma-type-name font-hero">
                                MANROPE<br />
                                <span className="soma-type-sub">(Geometric Sans)</span>
                            </h2>
                            <p className="soma-type-desc">
                                Constructed on strict geometric principles, Manrope serves as the primary voice of SOMA. It embodies clinical precision and architectural stability. Used for headlines, logotypes, and navigation.
                            </p>
                            <motion.div
                                className="soma-type-protocol font-nav"
                                variants={protocolContainerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, margin: "-10%" }}
                            >
                                <motion.div className="protocol-title" variants={protocolItemVariants}>PROTOCOL:</motion.div>
                                <motion.div variants={protocolItemVariants}>Case: UPPERCASE (Headlines) / Sentence (Body)</motion.div>
                                <motion.div variants={protocolItemVariants}>Tracking: -3% (Tight for Display)</motion.div>
                                <motion.div variants={protocolItemVariants}>Weight: Bold / SemiBold</motion.div>
                            </motion.div>
                            <div className="soma-separator-line"></div>
                        </div>
                    </div>

                    {/* Block 2: Space Mono */}
                    <div className="soma-type-block">
                        <div className="soma-type-image-wrapper">
                            <img src="/Projects/Soma/Soma5_2.svg" alt="Space Mono Graphic" className="soma-type-img" />
                        </div>
                        <div className="soma-type-info">
                            <div className="soma-type-role font-nav">SECONDARY TYPEFACE // MACHINE DATA</div>
                            <h2 className="soma-type-name is-mono">
                                SPACE MONO<br />
                                <span className="soma-type-sub" style={{ fontWeight: 400 }}>(Fixed-width)</span>
                            </h2>
                            <p className="soma-type-desc">
                                A monospace typeface representing the analytical and scientific layer of the brand. Used for specifications, pricing, coordinates, and technical footnotes. It provides contrast to the sterile geometry of the primary font.
                            </p>
                            <motion.div
                                className="soma-type-protocol font-nav"
                                variants={protocolContainerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, margin: "-10%" }}
                            >
                                <motion.div className="protocol-title" variants={protocolItemVariants}>PROTOCOL:</motion.div>
                                <motion.div variants={protocolItemVariants}>Case: UPPERCASE ONLY (Recommended for labels)</motion.div>
                                <motion.div variants={protocolItemVariants}>Tracking: +5% (Wide)</motion.div>
                                <motion.div variants={protocolItemVariants}>Color: Muted Gray (80% Opacity)</motion.div>
                            </motion.div>
                            <div className="soma-separator-line"></div>
                        </div>
                    </div>

                </div>
            </motion.section>
            {/* Section 6: Product Prototype */}
            <motion.section className="soma-section soma-section-6">
                {/* Crop Marks / Lines */}
                <div className="soma-crop-mark-tl"></div>
                <div className="soma-crop-mark-tr"></div>

                <div className="soma-proto-header font-mono">
                    <span>PROTOTYPE / V 3.0</span>
                    <div className="soma-proto-header-line"></div>
                    <span>FIG 03: PHOTONIC EMITTER</span>
                </div>

                <div className="soma-proto-content">
                    <div className="soma-proto-main-img-wrapper">
                        <BeforeAfterSlider
                            beforeImage="/Projects/Soma/Soma6_1.webp"
                            afterImage="/Projects/Soma/Soma6_3.webp"
                            altText="Soma Prototype Comparison"
                        />
                        {/* Bottom Crop Marks - positioned relative to slider wrapper */}
                        <div className="soma-crop-mark-bl"></div>
                        <div className="soma-crop-mark-br"></div>
                    </div>

                    <div className="soma-proto-center-text font-hero">
                        <div className="soma-proto-title-main">PRODUCT PROTOTYPE</div>
                        <div className="soma-proto-title-sub">AMBER GLASS & TITANIUM</div>
                    </div>

                    <div className="soma-proto-connector-row">
                        <div className="soma-proto-label font-mono">AMBER GLASS & TITANIUM</div>
                        <div className="soma-proto-line-group">
                            <div className="soma-proto-line-h"></div>
                            <div className="soma-proto-line-v"></div>
                        </div>
                    </div>

                    <div className="soma-proto-detail-img-wrapper">
                        <img src="/Projects/Soma/Soma6_2.webp" alt="Soma Detail" className="soma-proto-img-detail" />
                    </div>

                    <div className="soma-proto-bottom-row font-hero">
                        <div className="soma-proto-bottom-col">
                            <p className="soma-proto-desc">
                                The SOMA-X luminaire acts as a neuro-aesthetic anchor. The translucent borosilicate shell mimics cellular membrane structures,
                                filtering light into a circadian-friendly amber spectrum (2200K).
                            </p>
                            <div className="soma-proto-specs">
                                <div className="specs-title">SPECS:</div>
                                <div>Material: Hand-blown Amber Glass & Titanium Gr.5</div>
                                <div>Light Source: Micro-Filament Matrix (CRI 98)</div>
                                <div>Function: Melatonin Preservation Mode</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ============================================
                SECTION 7: BIOMETRIC SYNC (Dark Mode)
                ============================================ */}
            <motion.section
                className="soma-section soma-section-7"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* SPLIT HEADER: Right Text Above, Left Text Below Line */}
                <div className="soma-split-header">
                    <motion.div
                        className="soma-split-header-right font-nav"
                        variants={fadeUp}
                    >
                        BIOMETRIC SYNC / V 1.0
                    </motion.div>

                    <motion.div
                        className="soma-split-line"
                        variants={drawLineHoriz}
                        style={{ originX: 0 }}
                    />

                    <motion.div
                        className="soma-split-header-left font-nav"
                        variants={fadeUp}
                    >
                        FIG 06: BIOMETRIC INTERFACE
                    </motion.div>
                </div>

                <div className="soma-biometric-container">
                    {/* Left Content */}
                    <div className="soma-biometric-content">
                        {/* Thin Line Animation */}
                        <motion.div
                            className="bio-top-line"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            style={{ originX: 0 }}
                        />

                        <motion.span className="font-bio-label" variants={fadeUp}>
                            BIOMETRIC SYNC / V 1.0
                        </motion.span>

                        <div className="bio-title-group">
                            <motion.h2 variants={fadeUp}>
                                SOMA O.S.<br />
                                THE BIOMETRIC TWIN
                            </motion.h2>
                        </div>

                        <motion.p className="bio-description" variants={fadeUp}>
                            Complete digitization of your metabolic processes.
                        </motion.p>

                        <div className="bio-feature-list">
                            <motion.div className="bio-feature-item" variants={fadeUp}>
                                <h4>REAL-TIME BODY MONITORING</h4>
                                <p>Real-time body monitoring: sleep, stress, recovery</p>
                            </motion.div>
                            <motion.div className="bio-feature-item" variants={fadeUp}>
                                <h4>ADAPTIVE NUTRITION PROTOCOLS</h4>
                                <p>Smart protocols: ampoule composition changes based on your test results</p>
                            </motion.div>
                            <motion.div className="bio-feature-item" variants={fadeUp}>
                                <h4>DIRECT CLINICAL ACCESS</h4>
                                <p>Direct connection with a medical curator 24/7</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Visual (With Video Overlay) */}
                    <div className="soma-biometric-visual">
                        <motion.div
                            className="soma-phone-anchor"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src="/Projects/Soma/Soma7_1.webp"
                                alt="Soma OS UI"
                                className="soma-biometric-img"
                            />
                            {/* Video Layer */}
                            <div className="soma-screen-video-container">
                                <video
                                    className="soma-screen-video"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Labels */}
                <div className="soma-label bio-label-left font-nav">FIG 4.1: DARK MODE UI</div>
                <div className="soma-label bio-label-right font-nav">DATA: LIVE STREAM</div>
            </motion.section>

            {/* ============================================
                SECTION 8: PHYSICAL PROTOCOLS (Light Mode)
                ============================================ */}
            <motion.section
                ref={section8Ref}
                className="soma-section soma-section-8 light-mode"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* SPLIT HEADER: Right Text Above, Left Text Below Line (Light Mode) */}
                <div className="soma-split-header">
                    <motion.div
                        className="soma-split-header-right font-nav text-dark"
                        variants={fadeUp}
                    >
                        BIO-AVAILABILITY PROTECTION
                    </motion.div>

                    <motion.div
                        className="soma-split-line soma-line-dark"
                        variants={drawLineHoriz}
                        style={{ originX: 0 }}
                    />

                    <motion.div
                        className="soma-split-header-left font-nav text-dark"
                        variants={fadeUp}
                    >
                        FIG 07: PHYSICAL PROTOCOL
                    </motion.div>
                </div>

                <div className="soma-delivery-container">
                    {/* Left Column: Vertical Image + Specs */}
                    <div className="soma-delivery-left">
                        <motion.div
                            className="delivery-img-main-wrapper"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.img
                                src="/Projects/Soma/Soma8_1.webp"
                                alt="Soma Ampoule Vertical"
                                className="delivery-img-main"
                                style={{ y: parallaxY_Main, scale: 1.25 }} // Increased Parallax + Scale
                            />
                        </motion.div>

                        <motion.div className="delivery-specs-text" variants={fadeUp}>
                            <span>MATERIAL: UV-RESISTANT AMBER GLASS</span>
                            <span>SEAL: HERMETIC FUSION</span>
                            <span>PRINT: CERAMIC SILKSCREEN</span>
                        </motion.div>
                    </div>

                    {/* Right Column: Text + Horizontal Image */}
                    <div className="soma-delivery-right">
                        <div className="delivery-text-block">
                            {/* Thin Line Animation (Sized to image width below logic handled by layout or width constraints) */}
                            {/* Note: In CSS delivery-top-line max-width matches the image/text block width */}
                            <motion.div
                                className="delivery-top-line"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: false }}
                                transition={{ duration: 1.2, ease: "circOut" }}
                                style={{ originX: 0 }}
                            />

                            <motion.span className="font-delivery-label" variants={fadeUp}>
                                DELIVERY SYSTEMS / V 2.0
                            </motion.span>

                            <motion.h2 className="delivery-title" variants={fadeUp}>
                                PHYSICAL<br />PROTOCOLS
                            </motion.h2>

                            <motion.p className="delivery-desc" variants={fadeUp}>
                                Material embodiment of digital algorithms. Single-use ampoules made of medical amber glass. Minimalist labeling, no paper labels, full protection of active substances.
                            </motion.p>
                        </div>

                        <motion.div
                            className="delivery-img-sub-wrapper"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <motion.img
                                src="/Projects/Soma/Soma8_2.webp"
                                alt="Soma Ampoule Detail"
                                className="delivery-img-sub"
                                style={{ y: parallaxY_Sub, scale: 1.25 }} // Increased Parallax + Scale
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Labels */}
                <div className="soma-label soma-label-bl font-nav text-dark">SINGLE-USE BIO-AMPOULE</div>
                <div className="soma-label soma-label-br font-nav text-dark">SURFACE: STERILE / NON-POROUS</div>
            </motion.section>

            {/* ============================================
                SECTION 9: WEB PORTAL (Dark Mode)
                ============================================ */}
            <motion.section
                className="soma-section soma-section-9"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Header Line */}
                <div className="soma-web-header">
                    <motion.div
                        className="soma-web-header-line"
                        variants={drawLineHoriz}
                        style={{ originX: 0 }}
                    />
                    <div className="soma-web-header-labels font-mono">
                        <motion.span variants={fadeUp}>FIG 09: WEB PORTAL ARCHITECTURE</motion.span>
                        <motion.span variants={fadeUp}>PLATFORM: DESKTOP / 4K</motion.span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="soma-web-grid">
                    {/* Left Column */}
                    <div className="soma-web-col-left">
                        {/* Biometrics Card (Soma9_1) */}
                        <motion.div
                            className="soma-web-card soma-card-biometrics"
                            variants={fadeUp}
                            ref={biometricsCardRef}
                        >
                            <BiometricsProgress size={340} shouldAnimate={biometricsInView} />
                        </motion.div>

                        {/* Text Block */}
                        <motion.div className="soma-web-text-block" variants={fadeUp}>
                            <div className="soma-web-label font-mono">DIGITAL EXPERIENCE</div>
                            <h2 className="soma-web-title font-hero">
                                IMMERSIVE<br />WEB PORTAL
                            </h2>
                            <p className="soma-web-desc font-nav">
                                The SOMA web interface is an extension of the clinic's physical space. An architectural approach to UI, where data is transformed into an aesthetic experience. Personal account and protocol management.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="soma-web-col-right">
                        {/* Calendar Card (Soma9_2) */}
                        <motion.div
                            className="soma-web-card soma-card-calendar"
                            variants={fadeUp}
                        >
                            <img src="/Projects/Soma/Soma9_2.svg" alt="Booking UI" className="soma-web-img" />
                        </motion.div>

                        {/* Laptop Card (Soma9_3) */}
                        <motion.div
                            className="soma-web-card soma-card-laptop"
                            variants={fadeUp}
                        >
                            <img src="/Projects/Soma/Soma9_3.webp" alt="Soma Web on Laptop" className="soma-web-img" />
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Labels */}
                <div className="soma-web-footer font-mono">
                    <motion.div variants={fadeUp}>FIG 8.1: IMMERSIVE WEB</motion.div>
                    <motion.div variants={fadeUp}>RENDER: WEBGL / REALTIME</motion.div>
                </div>
            </motion.section>

            {/* ============================================
                SECTION 10: FULL RENDER (Dark Mode)
                ============================================ */}
            <motion.section
                className="soma-section soma-section-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                <motion.div
                    className="soma-full-render-wrapper"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <img src="/Projects/Soma/Soma10_1.webp" alt="Soma Full Web Render" className="soma-full-render-img" />

                    {/* Overlay Frame/UI elements if needed, or just clean */}
                    <div className="soma-render-overlay">
                        <div className="render-label-tl font-mono">VIEW: LANDING_MAIN</div>
                        <div className="render-label-br font-mono">STATUS: LIVE</div>
                    </div>
                </motion.div>
            </motion.section>

        </main>
    )
}
