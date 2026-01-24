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
        </main>
    )
}
