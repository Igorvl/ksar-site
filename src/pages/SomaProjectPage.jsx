/**
 * SomaProjectPage - Detailed view for SOMA Project
 */
import React, { useState, useEffect, useRef } from 'react'
import './SomaProjectPage.css'
import { useModal } from '../context/ModalContext'
import OnlineIndicator from '../components/OnlineIndicator'
import SomaLogo from '../components/SomaLogo'

export default function SomaProjectPage() {
    const { openContactModal } = useModal()
    const [isNavDark, setIsNavDark] = useState(false)
    const section3Ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsNavDark(entry.isIntersecting)
            },
            {
                threshold: 0,
                // Trigger immediately when the element hits the top of the viewport
                rootMargin: "0px 0px -90% 0px"
            }
        )

        if (section3Ref.current) {
            observer.observe(section3Ref.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <main className="soma-project-page">
            {/* Nav Readability Gradient */}
            <div className={`soma-nav-gradient ${isNavDark ? 'nav-dark' : ''}`} aria-hidden="true" />


            {/* === NAVIGATION (Strictly limited as per request) === */}
            <nav className={`corner-nav corner-nav--top-left ${isNavDark ? 'nav-dark' : ''}`}>
                <a href="/projects" className="nav-link font-nav">BACK TO PROJECTS</a>
            </nav>

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
            <section className="soma-section soma-section-3 light-mode" ref={section3Ref}>
                {/* Grid Lines (Darker for light bg) */}
                <div className="soma-grid-line soma-grid-vert" />

                {/* Header Separator Line */}
                <div className="soma-identity-header-line" />

                {/* Header Vertical Line */}
                <div className="soma-identity-vert-line" />

                {/* Dashed Center Guide */}
                <div className="soma-dashed-circle" />

                {/* Corner Markers */}
                <div className="soma-corner-marker soma-corner-tl" />
                <div className="soma-corner-marker soma-corner-tr" />
                <div className="soma-corner-marker soma-corner-bl" />
                <div className="soma-corner-marker soma-corner-br" />

                {/* Top Labels */}
                <div className="soma-label soma-label-tl font-nav text-dark">FIG 02. IDENTITY GRID</div>
                <div className="soma-label soma-label-tr font-nav text-dark">SYSTEM: VISUAL DNA</div>

                {/* Center Wrapper */}
                <div className="soma-identity-wrapper">

                    {/* Left Caption */}
                    <div className="soma-caption soma-caption-left font-nav text-dark">
                        <span>GRID: GOLDEN RATIO</span>
                        <div className="caption-line"></div>
                    </div>

                    {/* Logo Area */}
                    <div className="soma-logo-construction-area">
                        {/* Inner markers */}
                        <div className="inner-marker marker-tl"></div>
                        <div className="inner-marker marker-tr"></div>
                        <div className="inner-marker marker-bl"></div>
                        <div className="inner-marker marker-br"></div>

                        <img src="/Projects/Soma/Soma_Logo2.svg" alt="Soma Identity Logo" className="soma-identity-logo" />
                    </div>

                    {/* Right Caption */}
                    <div className="soma-caption soma-caption-right font-nav text-dark">
                        <div className="caption-line"></div>
                        <span>HEX: #1A1A1A / ONYX</span>
                    </div>
                </div>

                {/* Bottom Text Content */}
                <div className="soma-identity-text-content">
                    <h3 className="soma-section-title text-dark font-label">THE MITOSIS PULSE</h3>
                    <p className="soma-section-desc text-dark font-label">
                        The visual identity is derived from the precise moment of cellular<br />
                        division. Two organic entities connected by a vital thread,<br />
                        symbolizing the transfer of energy and life.
                    </p>
                </div>

                {/* Bottom Labels */}
                <div className="soma-label soma-label-bl font-nav text-dark">DATE: 2026 / Q3</div>
                <div className="soma-label soma-label-br font-nav text-dark">LOGO CONSTRUCTION</div>

            </section>
        </main>
    )
}
