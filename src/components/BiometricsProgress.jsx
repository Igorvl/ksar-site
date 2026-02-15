/**
 * BiometricsProgress — Reusable animated progress indicator component.
 * Extracted from TestProgressPage for embedding in Soma and other pages.
 *
 * Props:
 *   size       — Overall container size in px (default: 400)
 *   targetPct  — Target percentage (default: 75)
 *   animate    — Whether to run animation (default: true, can tie to inView)
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate as fmAnimate } from 'framer-motion';
import './BiometricsProgress.css';

function Counter({ value, className = "", suffix = "" }) {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        return value.on("change", (latest) => {
            setDisplayValue(Math.round(latest));
        });
    }, [value]);
    return <span className={className}>{displayValue}{suffix}</span>;
}

export default function BiometricsProgress({
    size = 400,
    targetPct = 75,
    shouldAnimate = true,
}) {
    const progress = useMotionValue(0);
    const percentage = useTransform(progress, Math.round);

    const neuralProgress = useMotionValue(0);
    const neuralPercentage = useTransform(neuralProgress, Math.round);

    const cellularProgress = useMotionValue(0);
    const cellularPercentage = useTransform(cellularProgress, Math.round);

    const radius = 160;
    const strokeWidth = 2;
    const circumference = 2 * Math.PI * radius;

    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!shouldAnimate) {
            // Reset when leaving viewport
            progress.set(0);
            neuralProgress.set(0);
            cellularProgress.set(0);
            hasAnimated.current = false;
            return;
        }
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const c1 = fmAnimate(progress, targetPct, {
            duration: 3.2, ease: "easeInOut", delay: 0.5
        });
        const c2 = fmAnimate(neuralProgress, 92, {
            duration: 3.4, ease: "easeOut", delay: 0.8
        });
        const c3 = fmAnimate(cellularProgress, 68, {
            duration: 3.0, ease: "easeOut", delay: 1.0
        });

        return () => { c1.stop(); c2.stop(); c3.stop(); };
    }, [shouldAnimate, targetPct, progress, neuralProgress, cellularProgress]);

    const scale = size / 400;

    return (
        <div
            className="bp-container"
            style={{
                width: size,
                height: size,
                transform: `scale(${scale > 1 ? 1 : 1})`,
            }}
        >
            <div className="bp-wrapper" style={{ width: 400, height: 400, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                {/* SVG Ring */}
                <svg width="400" height="400" viewBox="0 0 400 400" className="bp-svg">
                    <defs>
                        <linearGradient id="bpGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFE082" stopOpacity="1" />
                            <stop offset="50%" stopColor="#FFD54F" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FFCA28" stopOpacity="1" />
                        </linearGradient>
                        <filter id="bpGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="bpStrongGlow" x="-50%" y="-50%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="45" result="blur" />
                            <feComposite in="blur" in2="SourceGraphic" operator="over" />
                        </filter>
                    </defs>

                    {/* Global Back Glow */}
                    <circle cx="200" cy="200" r={radius} stroke="#FFD54F" strokeWidth="20" strokeOpacity="0.03" filter="url(#bpStrongGlow)" fill="none" />

                    {/* Inner Decoration Ring 1 (Dashed) */}
                    <circle cx="200" cy="200" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" fill="none" />

                    {/* Inner Decoration Ring 2 */}
                    <circle cx="200" cy="200" r="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none" />

                    {/* Tick Ring */}
                    <circle cx="200" cy="200" r={radius + 15} stroke="rgba(173, 156, 101, 0.1)" strokeWidth="2" strokeDasharray="1 10" fill="none" opacity="0.5" />

                    {/* Track Borders */}
                    <circle cx="200" cy="200" r={radius - 4} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" fill="none" />
                    <circle cx="200" cy="200" r={radius + 4} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" fill="none" />

                    {/* Outer Track */}
                    <circle cx="200" cy="200" r={radius} stroke="rgba(0, 0, 0, 0.8)" strokeWidth={6} fill="none" />

                    {/* Progress Halo */}
                    <motion.circle
                        cx="200" cy="200" r={radius}
                        stroke="#FFD54F" strokeWidth={20} strokeOpacity={0.1}
                        fill="none" strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: useTransform(progress, value => circumference - (value / 100) * circumference),
                            rotate: -90, transformOrigin: "center",
                            filter: "url(#bpStrongGlow)"
                        }}
                    />

                    {/* Progress Core */}
                    <motion.circle
                        cx="200" cy="200" r={radius}
                        stroke="url(#bpGoldGrad)" strokeWidth={2}
                        fill="none" strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: useTransform(progress, value => circumference - (value / 100) * circumference),
                            rotate: -90, transformOrigin: "center",
                            filter: "url(#bpGlow)"
                        }}
                    />

                    {/* Glowing Tip Dot */}
                    <motion.circle
                        r="3" fill="#FFFFFF" filter="url(#bpGlow)"
                        style={{
                            cx: useTransform(progress, v => 200 + radius * Math.cos(((v / 100 * 360) - 90) * (Math.PI / 180))),
                            cy: useTransform(progress, v => 200 + radius * Math.sin(((v / 100 * 360) - 90) * (Math.PI / 180)))
                        }}
                    />
                    <motion.circle
                        r="1.5" fill="#FFFFFF"
                        style={{
                            cx: useTransform(progress, v => 200 + radius * Math.cos(((v / 100 * 360) - 90) * (Math.PI / 180))),
                            cy: useTransform(progress, v => 200 + radius * Math.sin(((v / 100 * 360) - 90) * (Math.PI / 180)))
                        }}
                    />
                </svg>

                {/* Center Content */}
                <div className="bp-text-content">
                    <div className="bp-percent font-hero">
                        <Counter value={percentage} className="bp-percent-val" suffix="%" />
                    </div>
                    <div className="bp-label font-mono">OPTIMAL BIOMETRICS</div>
                </div>
            </div>

            {/* Bottom Technical Graphics */}
            <div className="bp-bottom-ui" style={{ width: size, maxWidth: size }}>
                <div className="bp-stat-group">
                    <div className="bp-stat">
                        <span className="bp-dot"></span>
                        NEURAL SYNC: <Counter value={neuralPercentage} />%
                    </div>
                    <div className="bp-bar">
                        <motion.div
                            className="bp-fill bp-main-bar"
                            initial={{ scaleX: 0 }}
                            animate={shouldAnimate ? { scaleX: 0.92 } : { scaleX: 0 }}
                            transition={{ duration: 3.4, ease: "easeOut", delay: 0.8 }}
                        />
                    </div>
                </div>

                <div className="bp-stat-group">
                    <div className="bp-stat">
                        <span className="bp-dot"></span>
                        CELLULAR REPAIR: <Counter value={cellularPercentage} />%
                    </div>
                    <div className="bp-bar">
                        <motion.div
                            className="bp-fill bp-alt-bar"
                            initial={{ scaleX: 0 }}
                            animate={shouldAnimate ? { scaleX: 0.68 } : { scaleX: 0 }}
                            transition={{ duration: 3.0, ease: "easeOut", delay: 1.0 }}
                        />
                    </div>
                </div>

                <svg width="100" height="50" viewBox="0 0 100 50" className="bp-wave">
                    <motion.path
                        d="M0,25 L50,25 Q55,25 57,22 T65,25 T75,35 T85,15 T95,25 L100,25"
                        fill="none" stroke="#AD9C65" strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.5 }}
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
