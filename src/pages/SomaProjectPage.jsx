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
            {/* === NAVIGATION (Strictly limited as per request) === */}
            <nav className="corner-nav corner-nav--top-left">
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
        </main>
    )
}
