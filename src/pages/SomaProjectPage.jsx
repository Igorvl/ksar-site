/**
 * SomaProjectPage - Detailed view for SOMA Project
 */
import React from 'react'
import './SomaProjectPage.css'
import { useModal } from '../context/ModalContext'
import OnlineIndicator from '../components/OnlineIndicator'
import SomaLogo from '../components/SomaLogo'

export default function SomaProjectPage() {
    const { openContactModal } = useModal()

    return (
        <main className="soma-project-page">
            {/* === NAVIGATION (Copy of ProjectsPage Nav for consistency) === */}
            <nav className="corner-nav corner-nav--top-left">
                <a href="/projects" className="nav-link font-nav">BACK TO PROJECTS</a>
            </nav>
            <nav className="corner-nav corner-nav--top-right">
                <span className="nav-status nav-status--online font-nav">
                    ONLINE
                    <OnlineIndicator />
                </span>
            </nav>
            <nav className="corner-nav corner-nav--bottom-left">
                <a href="/" className="nav-link font-nav">HOME</a>
            </nav>
            <nav className="corner-nav corner-nav--bottom-right">
                <button onClick={openContactModal} className="nav-link font-nav nav-button">CONTACT</button>
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


            {/* === CORNER CROSSHAIRS (SVG) === */}
            <img src="/kross.svg" className="crosshair crosshair--top-left" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--top-right" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--bottom-left" aria-hidden="true" alt="" />
            <img src="/kross.svg" className="crosshair crosshair--bottom-right" aria-hidden="true" alt="" />

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
        </main>
    )
}
