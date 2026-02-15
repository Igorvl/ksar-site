/**
 * AntigravityScrollDebug — Dev overlay for useAntigravityScroll.
 *
 * Renders a compact HUD showing real-time scroll metadata,
 * behavioral profile, and adaptive spring config. Toggle with ` (backtick).
 *
 * Usage:
 *   import AntigravityScrollDebug from '../hooks/AntigravityScrollDebug';
 *   // Place at root level of your scrollable page:
 *   <AntigravityScrollDebug />
 */

import React, { useEffect, useState } from 'react';
import { motion, useMotionValueEvent } from 'framer-motion';
import useAntigravityScroll from './useAntigravityScroll';

const PROFILE_COLORS = {
    IDLE: '#6e6e6e',
    READER: '#4fc3f7',
    SCANNER: '#ffca28',
    EXPLORER: '#ab47bc',
};

const PROFILE_ICONS = {
    IDLE: '◇',
    READER: '◈',
    SCANNER: '◆',
    EXPLORER: '◉',
};

export default function AntigravityScrollDebug() {
    const {
        scrollY,
        smoothY,
        velocity,
        progress,
        profile,
        meta,
        springConfig,
    } = useAntigravityScroll();

    const [visible, setVisible] = useState(true);
    const [liveVelocity, setLiveVelocity] = useState(0);
    const [liveProgress, setLiveProgress] = useState(0);
    const [liveSmoothY, setLiveSmoothY] = useState(0);

    // Toggle visibility with backtick
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === '`') setVisible(v => !v);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Subscribe to motion values
    useMotionValueEvent(velocity, 'change', (v) => setLiveVelocity(Math.round(v)));
    useMotionValueEvent(progress, 'change', (v) => setLiveProgress((v * 100).toFixed(1)));
    useMotionValueEvent(smoothY, 'change', (v) => setLiveSmoothY(Math.round(v)));

    if (!visible) return null;

    const color = PROFILE_COLORS[profile] || '#6e6e6e';
    const icon = PROFILE_ICONS[profile] || '◇';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 99999,
                fontFamily: "'Space Mono', 'SF Mono', monospace",
                fontSize: '0.65rem',
                lineHeight: 1.6,
                color: '#ccc',
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${color}33`,
                borderRadius: '6px',
                padding: '0.8rem 1rem',
                minWidth: '220px',
                pointerEvents: 'none',
                userSelect: 'none',
            }}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.5rem',
                paddingBottom: '0.4rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
                <span style={{ fontSize: '0.5rem', opacity: 0.4 }}>●</span>
                <span style={{ letterSpacing: '0.1em', opacity: 0.5 }}>
                    ANTIGRAVITY
                </span>
            </div>

            {/* Profile badge */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.6rem',
            }}>
                <motion.span
                    key={profile}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ color, fontSize: '1rem' }}
                >
                    {icon}
                </motion.span>
                <motion.span
                    key={profile + '_text'}
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    style={{
                        color,
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                        fontSize: '0.75rem',
                    }}
                >
                    {profile}
                </motion.span>
                <span style={{
                    marginLeft: 'auto',
                    opacity: 0.4,
                    fontSize: '0.6rem',
                }}>
                    {(meta.confidence * 100).toFixed(0)}%
                </span>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2rem 1rem' }}>
                <Metric label="VELOCITY" value={`${liveVelocity} px/s`} />
                <Metric label="AVG VEL" value={`${meta.avgVelocity} px/s`} />
                <Metric label="PROGRESS" value={`${liveProgress}%`} />
                <Metric label="SMOOTH Y" value={`${liveSmoothY}px`} />
                <Metric label="DISTANCE" value={`${(meta.sessionScrollDistance / 1000).toFixed(1)}k`} />
                <Metric label="PEAK" value={`${meta.peakVelocity} px/s`} />
                <Metric label="DIR Δ" value={meta.directionChanges} />
                <Metric label="BURSTS" value={meta.scrollBursts} />
            </div>

            {/* Spring config */}
            <div style={{
                marginTop: '0.5rem',
                paddingTop: '0.4rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                opacity: 0.5,
                fontSize: '0.55rem',
            }}>
                SPRING: S{springConfig.stiffness} D{springConfig.damping} M{springConfig.mass}
            </div>

            {/* Dwell zones */}
            {meta.dwellZones.length > 0 && (
                <div style={{
                    marginTop: '0.3rem',
                    opacity: 0.4,
                    fontSize: '0.55rem',
                }}>
                    DWELL: {meta.dwellZones.slice(-3).map(z => `${z}px`).join(' · ')}
                </div>
            )}

            {/* Toggle hint */}
            <div style={{
                marginTop: '0.5rem',
                opacity: 0.2,
                fontSize: '0.5rem',
                textAlign: 'center',
            }}>
                [ ` ] TOGGLE
            </div>
        </motion.div>
    );
}

function Metric({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.4 }}>{label}</span>
            <span>{value}</span>
        </div>
    );
}
