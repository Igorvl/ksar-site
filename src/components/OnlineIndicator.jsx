import { useEffect, useRef } from 'react'
import './OnlineIndicator.css'

/**
 * OnlineIndicator - Pulsing dot with random trembling effect
 * Uses JavaScript for random timing to create organic "alive" feeling
 */
export default function OnlineIndicator() {
    const indicatorRef = useRef(null)

    useEffect(() => {
        const indicator = indicatorRef.current
        if (!indicator) return

        let animationId
        let lastTime = 0

        // Random pulse function
        const pulse = (timestamp) => {
            if (!lastTime) lastTime = timestamp

            const elapsed = timestamp - lastTime

            // Random interval between 500ms and 1500ms
            const randomInterval = 500 + Math.random() * 1000

            if (elapsed > randomInterval) {
                // Random opacity between 0.7 and 1
                const randomOpacity = 0.7 + Math.random() * 0.3

                // Random scale between 0.95 and 1.1
                const randomScale = 0.95 + Math.random() * 0.15

                // Random glow spread
                const glowSpread = 2 + Math.random() * 4

                indicator.style.opacity = randomOpacity
                indicator.style.transform = `scale(${randomScale})`
                indicator.style.boxShadow = `
                    0 0 ${glowSpread}px 1px rgba(255, 255, 255, ${0.5 + Math.random() * 0.3}),
                    0 0 ${glowSpread * 2}px ${glowSpread}px rgba(255, 255, 255, ${0.2 + Math.random() * 0.2})
                `

                lastTime = timestamp
            }

            animationId = requestAnimationFrame(pulse)
        }

        animationId = requestAnimationFrame(pulse)

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <span
            ref={indicatorRef}
            className="online-indicator-js"
            aria-hidden="true"
        />
    )
}
