import React, { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

function CustomCursor() {
    const cursorRef = useRef(null)
    const cursorDotRef = useRef(null)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const cursor = cursorRef.current
        const cursorDot = cursorDotRef.current

        let mouseX = 0
        let mouseY = 0
        let cursorX = 0
        let cursorY = 0

        const handleMouseMove = (e) => {
            mouseX = e.clientX
            mouseY = e.clientY

            // Dot follows instantly
            if (cursorDot) {
                cursorDot.style.left = `${mouseX}px`
                cursorDot.style.top = `${mouseY}px`
            }
        }

        const handleMouseEnter = (e) => {
            if (e.target.tagName === 'A' ||
                e.target.tagName === 'BUTTON' ||
                e.target.closest('a') ||
                e.target.closest('button') ||
                e.target.dataset.cursor === 'hover') {
                setIsHovering(true)
            }
        }

        const handleMouseLeave = () => {
            setIsHovering(false)
        }

        // Smooth follow animation
        const animate = () => {
            const ease = 0.15
            cursorX += (mouseX - cursorX) * ease
            cursorY += (mouseY - cursorY) * ease

            if (cursor) {
                cursor.style.left = `${cursorX}px`
                cursor.style.top = `${cursorY}px`
            }

            requestAnimationFrame(animate)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseover', handleMouseEnter)
        document.addEventListener('mouseout', handleMouseLeave)
        animate()

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseover', handleMouseEnter)
            document.removeEventListener('mouseout', handleMouseLeave)
        }
    }, [])

    return (
        <>
            <div
                ref={cursorRef}
                className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
            />
            <div
                ref={cursorDotRef}
                className="custom-cursor-dot"
            />
        </>
    )
}

export default CustomCursor
