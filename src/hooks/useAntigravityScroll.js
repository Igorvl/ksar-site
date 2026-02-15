/**
 * useAntigravityScroll — AI-driven adaptive scroll interpolation hook.
 *
 * Tracks the user's scrolling behavior in real-time, builds a behavioral
 * profile ("Antigravity metadata"), and dynamically adapts scroll-linked
 * animation easing, damping, and interpolation to match the user's intent.
 *
 * Behavior profiles:
 *   • SCANNER  — fast scrolling, large jumps → snappy easing, low friction
 *   • READER   — slow, steady scrolling     → smooth easing, high damping
 *   • EXPLORER — erratic direction changes   → springy easing, medium damping
 *   • IDLE     — no significant activity     → gentle drift
 *
 * Usage:
 *   const {
 *     scrollY,          // raw scroll position (MotionValue)
 *     smoothY,          // adaptively-smoothed scroll (MotionValue)
 *     velocity,         // current scroll velocity (MotionValue)
 *     progress,         // 0-1 page progress (MotionValue)
 *     profile,          // 'SCANNER' | 'READER' | 'EXPLORER' | 'IDLE'
 *     meta,             // full Antigravity metadata object
 *     adaptiveTransform // helper: useTransform with adaptive easing
 *   } = useAntigravityScroll({ container, lerp, profileUpdateInterval });
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
    useMotionValue,
    useTransform,
    useSpring,
    useScroll,
} from 'framer-motion';

// ─── Constants ──────────────────────────────────────────────────────────────

const PROFILES = {
    IDLE: 'IDLE',
    READER: 'READER',
    SCANNER: 'SCANNER',
    EXPLORER: 'EXPLORER',
};

/** Easing presets per profile (spring configs) */
const SPRING_PRESETS = {
    [PROFILES.IDLE]: { stiffness: 60, damping: 30, mass: 1.0 },
    [PROFILES.READER]: { stiffness: 80, damping: 40, mass: 1.2 },
    [PROFILES.SCANNER]: { stiffness: 200, damping: 25, mass: 0.8 },
    [PROFILES.EXPLORER]: { stiffness: 120, damping: 20, mass: 1.0 },
};

/** Velocity thresholds (px/s) */
const VELOCITY_SLOW = 200;
const VELOCITY_FAST = 1200;

/** Direction-change sensitivity */
const DIRECTION_CHANGE_WINDOW = 1500; // ms
const DIRECTION_CHANGE_THRESHOLD = 3; // changes in window → EXPLORER

// ─── Utility: Exponential Moving Average ────────────────────────────────────

function ema(prev, next, alpha = 0.15) {
    return prev + alpha * (next - prev);
}

// ─── The Hook ───────────────────────────────────────────────────────────────

export default function useAntigravityScroll({
    container,
    profileUpdateInterval = 500,
} = {}) {

    // ── Scroll source ─────────────────────────────────────────────────────────
    const scrollOptions = container ? { container } : {};
    const { scrollY, scrollYProgress } = useScroll(scrollOptions);

    // ── Motion values ─────────────────────────────────────────────────────────
    const velocity = useMotionValue(0);
    const avgVelocity = useMotionValue(0);
    const smoothedLerp = useMotionValue(0.1);

    // ── Adaptive spring — config mutates based on profile ─────────────────────
    const [springConfig, setSpringConfig] = useState(SPRING_PRESETS[PROFILES.IDLE]);
    const smoothY = useSpring(scrollY, springConfig);

    // ── Behavioural metadata ──────────────────────────────────────────────────
    const [profile, setProfile] = useState(PROFILES.IDLE);
    const [meta, setMeta] = useState(() => ({
        profile: PROFILES.IDLE,
        sessionScrollDistance: 0,
        avgVelocity: 0,
        peakVelocity: 0,
        directionChanges: 0,
        dwellZones: [],            // scroll positions where user lingered
        scrollBursts: 0,           // number of rapid scroll bursts
        timeSinceLastScroll: 0,
        confidence: 0,             // 0-1 how confident the profile classification is
        springConfig: SPRING_PRESETS[PROFILES.IDLE],
        history: [],               // last N velocity samples
    }));

    // ── Internal refs (mutable, no re-renders) ────────────────────────────────
    const internals = useRef({
        lastY: 0,
        lastTime: performance.now(),
        lastDirection: 0,          // 1 = down, -1 = up
        directionChanges: [],      // timestamps of recent direction changes
        velocitySamples: [],       // last ~20 velocity readings
        dwellStart: 0,
        dwellY: 0,
        totalDistance: 0,
        peakVelocity: 0,
        scrollBursts: 0,
        idleTimer: null,
    });

    // ── Frame-level scroll tracking ───────────────────────────────────────────
    useEffect(() => {
        let rafId;

        const track = () => {
            const now = performance.now();
            const currentY = scrollY.get();
            const dt = (now - internals.current.lastTime) / 1000; // seconds

            if (dt > 0.005) { // ~200 fps cap to avoid noise
                const dy = currentY - internals.current.lastY;
                const instantVelocity = Math.abs(dy / dt);

                // Update velocity motion value
                velocity.set(instantVelocity);

                // EMA smoothing for avg velocity
                const smoothedVel = ema(avgVelocity.get(), instantVelocity, 0.1);
                avgVelocity.set(smoothedVel);

                // Track direction changes
                const dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
                if (dir !== 0 && dir !== internals.current.lastDirection) {
                    internals.current.directionChanges.push(now);
                    internals.current.lastDirection = dir;
                }

                // Prune old direction changes
                internals.current.directionChanges =
                    internals.current.directionChanges.filter(
                        t => now - t < DIRECTION_CHANGE_WINDOW
                    );

                // Track velocity samples (ring buffer, ~40 entries)
                internals.current.velocitySamples.push(instantVelocity);
                if (internals.current.velocitySamples.length > 40) {
                    internals.current.velocitySamples.shift();
                }

                // Accumulate distance
                internals.current.totalDistance += Math.abs(dy);

                // Peak velocity
                if (instantVelocity > internals.current.peakVelocity) {
                    internals.current.peakVelocity = instantVelocity;
                }

                // Detect scroll bursts (velocity spike after idle)
                if (instantVelocity > VELOCITY_FAST && smoothedVel < VELOCITY_SLOW) {
                    internals.current.scrollBursts++;
                }

                // Dwell detection — if user stays within 20px for > 1.5s
                if (Math.abs(currentY - internals.current.dwellY) < 20) {
                    if (now - internals.current.dwellStart > 1500) {
                        // Emit dwell zone (debounced by distance)
                        const zones = meta.dwellZones;
                        const lastZone = zones[zones.length - 1];
                        if (!lastZone || Math.abs(lastZone - currentY) > 100) {
                            zones.push(Math.round(currentY));
                        }
                    }
                } else {
                    internals.current.dwellStart = now;
                    internals.current.dwellY = currentY;
                }

                // Reset idle timer
                clearTimeout(internals.current.idleTimer);
                internals.current.idleTimer = setTimeout(() => {
                    velocity.set(0);
                    avgVelocity.set(ema(avgVelocity.get(), 0, 0.3));
                }, 300);

                internals.current.lastY = currentY;
                internals.current.lastTime = now;
            }

            rafId = requestAnimationFrame(track);
        };

        rafId = requestAnimationFrame(track);
        return () => cancelAnimationFrame(rafId);
    }, [scrollY, velocity, avgVelocity, meta.dwellZones]);

    // ── Profile classification (runs on interval) ─────────────────────────────
    useEffect(() => {
        const classify = () => {
            const vel = avgVelocity.get();
            const dirChanges = internals.current.directionChanges.length;
            const samples = internals.current.velocitySamples;

            // Calculate velocity variance (jitter indicator)
            const mean = samples.reduce((a, b) => a + b, 0) / (samples.length || 1);
            const variance = samples.reduce((a, v) => a + (v - mean) ** 2, 0)
                / (samples.length || 1);
            const stdDev = Math.sqrt(variance);

            let newProfile = PROFILES.IDLE;
            let confidence = 0;

            if (vel < 30) {
                // Essentially idle
                newProfile = PROFILES.IDLE;
                confidence = 0.9;
            } else if (dirChanges >= DIRECTION_CHANGE_THRESHOLD) {
                // Lots of direction changes → exploring
                newProfile = PROFILES.EXPLORER;
                confidence = Math.min(dirChanges / 5, 1);
            } else if (vel > VELOCITY_FAST || mean > VELOCITY_FAST * 0.6) {
                // Fast and decisive → scanning
                newProfile = PROFILES.SCANNER;
                confidence = Math.min(vel / (VELOCITY_FAST * 1.5), 1);
            } else if (vel > VELOCITY_SLOW * 0.3 && stdDev < mean * 0.5) {
                // Moderate, steady → reading
                newProfile = PROFILES.READER;
                confidence = 1 - (stdDev / (mean || 1));
            } else {
                newProfile = PROFILES.READER;
                confidence = 0.5;
            }

            // Only update if changed or confidence improved
            if (newProfile !== profile || confidence > meta.confidence) {
                setProfile(newProfile);
                setSpringConfig(SPRING_PRESETS[newProfile]);

                setMeta(prev => ({
                    ...prev,
                    profile: newProfile,
                    sessionScrollDistance: Math.round(internals.current.totalDistance),
                    avgVelocity: Math.round(vel),
                    peakVelocity: Math.round(internals.current.peakVelocity),
                    directionChanges: dirChanges,
                    scrollBursts: internals.current.scrollBursts,
                    confidence: parseFloat(confidence.toFixed(2)),
                    springConfig: SPRING_PRESETS[newProfile],
                    history: [...samples.slice(-10)],
                }));
            }
        };

        const interval = setInterval(classify, profileUpdateInterval);
        return () => clearInterval(interval);
    }, [profile, meta.confidence, avgVelocity, profileUpdateInterval]);

    // ── adaptiveTransform — useTransform with profile-sensitive easing ────────
    const adaptiveTransform = useCallback(
        (inputRange, outputRange, options = {}) => {
            // Merge adaptive ease with any user overrides
            const profileEase = getProfileEaseFunction(profile);
            return useTransform(
                smoothY,
                inputRange,
                outputRange,
                { ease: profileEase, ...options }
            );
        },
        [smoothY, profile]
    );

    // ── Debug overlay data ────────────────────────────────────────────────────
    const debugData = useMemo(() => ({
        profile,
        velocity: velocity.get(),
        avgVelocity: avgVelocity.get(),
        springConfig,
        totalDistance: internals.current.totalDistance,
    }), [profile, springConfig]);

    return {
        scrollY,
        smoothY,
        velocity,
        progress: scrollYProgress,
        profile,
        meta,
        adaptiveTransform,
        springConfig,
        debugData,
        PROFILES,
    };
}


// ─── Profile-based easing functions ─────────────────────────────────────────

function getProfileEaseFunction(profile) {
    switch (profile) {
        case PROFILES.SCANNER:
            // Aggressive ease-out — fast start, quick settle
            return cubicBezier(0.22, 1, 0.36, 1);

        case PROFILES.READER:
            // Gentle ease-in-out — smooth, predictable
            return cubicBezier(0.4, 0, 0.2, 1);

        case PROFILES.EXPLORER:
            // Bouncy — playful, responsive to direction changes
            return cubicBezier(0.34, 1.56, 0.64, 1);

        case PROFILES.IDLE:
        default:
            // Linear-ish with slight ease — minimal processing
            return cubicBezier(0.25, 0.1, 0.25, 1);
    }
}

/** Attempt to use framer-motion's cubicBezier, fall back to manual */
function cubicBezier(x1, y1, x2, y2) {
    // Attempt to import from framer-motion if available at module scope
    // Otherwise implement a simple cubic bezier evaluator
    return (t) => {
        // De Casteljau's algorithm for cubic bezier
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;
        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        function sampleCurveX(t) { return ((ax * t + bx) * t + cx) * t; }
        function sampleCurveY(t) { return ((ay * t + by) * t + cy) * t; }
        function sampleCurveDerivativeX(t) { return (3 * ax * t + 2 * bx) * t + cx; }

        // Newton-Raphson iteration to find t for given x
        let guess = t;
        for (let i = 0; i < 8; i++) {
            const currentX = sampleCurveX(guess) - t;
            if (Math.abs(currentX) < 1e-6) break;
            const derivative = sampleCurveDerivativeX(guess);
            if (Math.abs(derivative) < 1e-6) break;
            guess -= currentX / derivative;
        }
        return sampleCurveY(guess);
    };
}
