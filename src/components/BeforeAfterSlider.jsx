import React, { useState, useRef, useEffect } from 'react'
import './BeforeAfterSlider.css'

export default function BeforeAfterSlider({ beforeImage, afterImage, altText = "Comparison" }) {
    const [sliderPosition, setSliderPosition] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef(null)

    const handleMove = (clientX) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = (x / rect.width) * 100

        // Clamp between 0 and 100
        const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
        setSliderPosition(clampedPercentage)
    }

    const handleMouseDown = () => {
        setIsDragging(true)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        e.preventDefault()
        handleMove(e.clientX)
    }

    const handleTouchMove = (e) => {
        if (!isDragging) return
        e.preventDefault()
        handleMove(e.touches[0].clientX)
    }

    useEffect(() => {
        const onMouseMove = (e) => handleMouseMove(e)
        const onMouseUp = () => handleMouseUp()
        const onTouchMove = (e) => handleTouchMove(e)
        const onTouchEnd = () => handleMouseUp()

        if (isDragging) {
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
            document.addEventListener('touchmove', onTouchMove, { passive: false })
            document.addEventListener('touchend', onTouchEnd)
        }

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('touchmove', onTouchMove)
            document.removeEventListener('touchend', onTouchEnd)
        }
    }, [isDragging])

    return (
        <div
            className="before-after-slider"
            ref={containerRef}
            onMouseDown={(e) => {
                handleMove(e.clientX)
                handleMouseDown()
            }}
            onTouchStart={(e) => {
                handleMove(e.touches[0].clientX)
                handleMouseDown()
            }}
        >
            {/* After Image (Background) */}
            <img
                src={afterImage}
                alt={`${altText} - After`}
                className="slider-image slider-image-after"
            />

            {/* Before Image (Foreground, clipped) */}
            <div
                className="slider-image-before-wrapper"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt={`${altText} - Before`}
                    className="slider-image slider-image-before"
                />
            </div>

            {/* Slider Handle */}
            <div
                className="slider-handle-wrapper"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="slider-line"></div>
                <div className="slider-handle">
                    <div className="slider-handle-arrow slider-handle-arrow-left"></div>
                    <div className="slider-handle-arrow slider-handle-arrow-right"></div>
                </div>
            </div>
        </div>
    )
}
