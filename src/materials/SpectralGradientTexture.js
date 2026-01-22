/**
 * SpectralGradientTexture.js
 * Generates a DataTexture representing a full visible spectrum gradient.
 * Used for fast spectral approximation in shaders.
 */
import * as THREE from 'three'

export function getSpectralGradientTexture() {
    const width = 256
    const height = 1
    const size = width * height
    const data = new Uint8Array(4 * size)

    // Turbo colormap logic (High quality rainbow)
    for (let i = 0; i < width; i++) {
        const t = i / (width - 1)

        // Simple spectral approximation (Blue -> Cyan -> Green -> Yellow -> Red)
        // Note: Real spectrum is usually Violet -> Red, but for glass dispersion
        // we often want Red (low IOR) to Blue (high IOR) mapping.

        let r, g, b

        // This is a "Turbo"-like gradient approximation
        // t=0 (Blue-ish), t=1 (Red-ish)
        const x = t * 2.0 - 1.0 // -1 to 1

        // Red curve
        r = Math.max(0, Math.min(1, Math.abs(x - 0.5) * -1.5 + 1.5))
        // Green curve
        g = Math.max(0, Math.min(1, 1 - Math.abs(x)))
        // Blue curve
        b = Math.max(0, Math.min(1, Math.abs(x + 0.5) * -1.5 + 1.5))

        // Boost saturation
        r = Math.pow(r, 0.8)
        g = Math.pow(g, 0.8)
        b = Math.pow(b, 0.8)

        const stride = i * 4
        data[stride] = r * 255
        data[stride + 1] = g * 255
        data[stride + 2] = b * 255
        data[stride + 3] = 255
    }

    const texture = new THREE.DataTexture(data, width, height)
    texture.format = THREE.RGBAFormat
    texture.type = THREE.UnsignedByteType
    texture.needsUpdate = true

    return texture
}
