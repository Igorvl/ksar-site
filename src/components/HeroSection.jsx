import React, { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import HeroCrystal from './HeroCrystal'
import './HeroSection.css'

function HeroSection() {
    return (
        <section className="hero">
            {/* Corner Technical Frames */}
            <div className="hero-frame hero-frame--top-left" />
            <div className="hero-frame hero-frame--top-right" />
            <div className="hero-frame hero-frame--bottom-left" />
            <div className="hero-frame hero-frame--bottom-right" />

            {/* Navigation - Top */}
            <nav className="hero-nav hero-nav--top">
                <a href="#projects" className="hero-nav__link hero-nav__link--left">
                    PROJECTS
                </a>
                <span className="hero-nav__label hero-nav__label--vertical hero-nav__label--center">
                    SYNTHETIC
                </span>
                <a href="#online" className="hero-nav__link hero-nav__link--right">
                    ONLINE
                </a>
            </nav>

            {/* Main Hero Content */}
            <div className="hero-content">
                {/* 3D Crystal Canvas - takes full area, text is inside 3D scene */}
                <div className="hero-crystal hero-crystal--fullscreen">
                    <Canvas
                        camera={{ position: [0, 0, 8], fov: 35 }}
                        dpr={[1, 2]}
                        gl={{
                            antialias: true,
                            alpha: false,
                            powerPreference: 'high-performance'
                        }}
                    >
                        <color attach="background" args={['#000000']} />
                        <Suspense fallback={null}>
                            <HeroCrystal />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Side Info - Right */}
                <div className="hero-info hero-info--right">
                    <p className="hero-info__text">
                        VISUAL UNIVERSE. BESPOKE CRYSTAL SPACES. W1 SINGAPORE. SOPHISTICATED
                    </p>
                    <p className="hero-info__text">
                        LA GALLERY | DESIGN COMPLETE ARTFORM | DIGITAL PRINT STUDIO BESPOKE | L5
                    </p>
                    <p className="hero-info__meta">
                        EXTERIOR
                    </p>
                </div>

                {/* Side Info - Left */}
                <div className="hero-info hero-info--left">
                    <p className="hero-info__coords">
                        5°  28.997° N 103.126°
                    </p>
                    <p className="hero-info__coords">
                        NEW WORLD
                    </p>
                    <p className="hero-info__version">
                        VERSION 1.0
                    </p>
                </div>
            </div>

            {/* Navigation - Bottom */}
            <nav className="hero-nav hero-nav--bottom">
                <a href="#profile" className="hero-nav__link hero-nav__link--left">
                    PROFILE
                </a>
                <a href="#enter" className="hero-nav__cta">
                    <span className="hero-nav__cta-text">ENTER THE VOID</span>
                    <span className="hero-nav__cta-line" />
                </a>
                <div className="hero-nav__right-group">
                    <div className="hero-nav__architect-wrapper">
                        <img
                            src="/lineV.svg"
                            alt=""
                            className="hero-nav__line-vertical"
                        />
                        <span className="hero-nav__label hero-nav__label--vertical">
                            ARCHITECT
                        </span>
                    </div>
                    <a href="#contact" className="hero-nav__link">
                        CONTACT
                    </a>
                </div>
            </nav>
        </section>
    )
}

export default HeroSection
