/**
 * NegativeTextDemo - Experiment with Negative/Invert Effect
 * Text acts as a window revealing an inverted (or manipulated) version of the background image.
 */
import React from 'react';
import './NegativeTextDemo.css';

export default function NegativeTextDemo() {
    return (
        <main className="negative-demo-page">
            <div className="scrolling-content">
                {/* Screen 1 */}
                <section className="screen">
                    <img
                        src="/negative_ref_6.png"
                        alt="Background 1"
                        className="bg-image-full"
                    />
                </section>

                {/* Screen 2 */}
                <section className="screen">
                    <img
                        src="/negative_ref_6.png"
                        alt="Background 2"
                        className="bg-image-full"
                    />
                </section>
            </div>

            {/* Fixed Overlay 1: Inversion (Difference) */}
            <div className="fixed-text-overlay">
                <h1 className="hero-name font-hero">
                    <span className="hero-name__first">KSENIYA</span>
                    <span className="hero-name__last">ARTMAN</span>
                </h1>
            </div>

            {/* Fixed Overlay 2: Contrast Boost (Overlay/Soft-Light) */}
            <div className="fixed-text-overlay fixed-text-overlay-contrast">
                <h1 className="hero-name font-hero text-contrast">
                    <span className="hero-name__first">KSENIYA</span>
                    <span className="hero-name__last">ARTMAN</span>
                </h1>
            </div>
        </main>
    );
}
