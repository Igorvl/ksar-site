import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import './TestProgressPage.css';

// Helper component for animated numbers
function Counter({ value, className = "", suffix = "" }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        return value.on("change", (latest) => {
            setDisplayValue(Math.round(latest));
        });
    }, [value]);

    return <span className={className}>{displayValue}{suffix}</span>;
}

export default function TestProgressPage() {
    const progress = useMotionValue(0);
    const percentage = useTransform(progress, Math.round);

    // Bottom stats motion values
    const neuralProgress = useMotionValue(0);
    const neuralPercentage = useTransform(neuralProgress, Math.round);

    const cellularProgress = useMotionValue(0);
    const cellularPercentage = useTransform(cellularProgress, Math.round);

    // Update dimensions: Progress is OUTER (160), Decoration is INNER (120, 100)
    const radius = 160;
    const strokeWidth = 2; // Thinner for elegance
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        // Reduced speed by ~25% (quarter slower) -> 3.2s
        const controls = animate(progress, 75, {
            duration: 3.2,
            ease: "easeInOut",
            delay: 0.5
        });

        // Neural Sync animation
        const neuralControls = animate(neuralProgress, 92, {
            duration: 3.4,
            ease: "easeOut",
            delay: 0.8
        });

        // Cellular Repair animation
        const cellularControls = animate(cellularProgress, 68, {
            duration: 3.0,
            ease: "easeOut",
            delay: 1.0
        });

        return () => {
            controls.stop();
            neuralControls.stop();
            cellularControls.stop();
        };
    }, [progress, neuralProgress, cellularProgress]);

    return (
        <div className="test-progress-container">
            <div className="progress-wrapper">
                {/* SVG Ring */}
                <svg width="400" height="400" viewBox="0 0 400 400" className="progress-svg">
                    {/* Defs for gradients */}
                    <defs>
                        {/* Unified Gold Gradient - subtle shift for metallic feel */}
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFE082" stopOpacity="1" />
                            <stop offset="50%" stopColor="#FFD54F" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FFCA28" stopOpacity="1" />
                        </linearGradient>

                        {/* Standard Glow */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Stronger Halo Glow - Very blurry and wide */}
                        <filter id="strongGlow" x="-50%" y="-50%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="45" result="blur" />
                            <feComposite in="blur" in2="SourceGraphic" operator="over" />
                        </filter>
                    </defs>

                    {/* Global Back Glow */}
                    <circle cx="200" cy="200" r={radius} stroke="#FFD54F" strokeWidth="20" strokeOpacity="0.03" filter="url(#strongGlow)" fill="none" />

                    {/* Inner Decoration Ring 1 (Dashed) */}
                    <circle
                        cx="200"
                        cy="200"
                        r="120"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        fill="none"
                    />

                    {/* Inner Decoration Ring 2 (Solid Thin) */}
                    <circle
                        cx="200"
                        cy="200"
                        r="100"
                        stroke="rgba(255,255,255,0.02)"
                        strokeWidth="1"
                        fill="none"
                    />

                    {/* Tick Ring (Decorative) */}
                    <circle
                        cx="200"
                        cy="200"
                        r={radius + 15}
                        stroke="rgba(173, 156, 101, 0.1)"
                        strokeWidth="2"
                        strokeDasharray="1 10"
                        fill="none"
                        opacity="0.5"
                    />

                    {/* Track Borders (Channel effect) */}
                    <circle cx="200" cy="200" r={radius - 4} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" fill="none" />
                    <circle cx="200" cy="200" r={radius + 4} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" fill="none" />

                    {/* Outer Track (Dark background) */}
                    <circle
                        cx="200"
                        cy="200"
                        r={radius}
                        stroke="rgba(0, 0, 0, 0.8)"
                        strokeWidth={6}
                        fill="none"
                    />

                    {/* Progress Halo (Wide Glow Layer) - Very subtle and wide */}
                    <motion.circle
                        cx="200"
                        cy="200"
                        r={radius}
                        stroke="#FFD54F" /* Solid Gold for Halo */
                        strokeWidth={20}
                        strokeOpacity={0.1}
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: useTransform(progress, value => {
                                return circumference - (value / 100) * circumference;
                            }),
                            rotate: -90,
                            transformOrigin: "center",
                            filter: "url(#strongGlow)"
                        }}
                    />

                    {/* Progress Core (Sharp Layer) */}
                    <motion.circle
                        cx="200"
                        cy="200"
                        r={radius}
                        stroke="url(#goldGradient)"
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: useTransform(progress, value => {
                                return circumference - (value / 100) * circumference;
                            }),
                            rotate: -90,
                            transformOrigin: "center",
                            filter: "url(#glow)"
                        }}
                    />

                    {/* Glowing Tip Dot - Calculated Position
                        We calculate cx/cy directly to ensure it sticks to the tip 
                        regardless of SVG group transform quirks.
                        Angle starts at -90deg (12 o'clock).
                    */}
                    <motion.circle
                        r="3"
                        fill="#FFFFFF"
                        filter="url(#glow)"
                        style={{
                            cx: useTransform(progress, v => 200 + radius * Math.cos(((v / 100 * 360) - 90) * (Math.PI / 180))),
                            cy: useTransform(progress, v => 200 + radius * Math.sin(((v / 100 * 360) - 90) * (Math.PI / 180)))
                        }}
                    />
                    <motion.circle
                        r="1.5"
                        fill="#FFFFFF"
                        style={{
                            cx: useTransform(progress, v => 200 + radius * Math.cos(((v / 100 * 360) - 90) * (Math.PI / 180))),
                            cy: useTransform(progress, v => 200 + radius * Math.sin(((v / 100 * 360) - 90) * (Math.PI / 180)))
                        }}
                    />
                </svg>

                {/* Center Content */}
                <div className="progress-text-content">
                    <motion.div className="progress-percent font-hero">
                        <Counter value={percentage} className="percent-val" suffix="%" />
                    </motion.div>
                    <div className="progress-label font-mono">
                        OPTIMAL BIOMETRICS
                    </div>
                </div>
            </div>

            {/* Bottom Technical Graphics */}
            <div className="progress-bottom-ui">
                <div className="tech-stat-group">
                    <div className="tech-stat">
                        <span className="tech-dot"></span>
                        NEURAL SYNC: <Counter value={neuralPercentage} />%
                    </div>
                    <div className="tech-bar">
                        <motion.div
                            className="tech-fill main-bar"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 0.92 }}
                            transition={{ duration: 3.4, ease: "easeOut", delay: 0.8 }}
                        />
                    </div>
                </div>

                <div className="tech-stat-group">
                    <div className="tech-stat">
                        <span className="tech-dot"></span>
                        CELLULAR REPAIR: <Counter value={cellularPercentage} />%
                    </div>
                    <div className="tech-bar">
                        <motion.div
                            className="tech-fill alt-bar"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 0.68 }}
                            transition={{ duration: 3.0, ease: "easeOut", delay: 1.0 }}
                        />
                    </div>
                </div>

                {/* Simple waveform SVG */}
                <svg width="100" height="50" viewBox="0 0 100 50" className="tech-wave">
                    {/* Pulse pattern: Flat -> Small bump -> Big spike -> Flat */}
                    <motion.path
                        d="M0,25 L50,25 Q55,25 57,22 T65,25 T75,35 T85,15 T95,25 L100,25"
                        fill="none"
                        stroke="#AD9C65"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            pathLength: { duration: 4, ease: "easeInOut" },
                            opacity: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                        }}
                    />
                </svg>
            </div>
        </div>
    );
}
