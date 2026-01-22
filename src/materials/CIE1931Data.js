/**
 * CIE 1931 Color Matching Functions (Safe Version)
 */
const CIE_1931_DATA = [
    [380, 0.001368, 0.000039, 0.006450],
    [392, 0.004243, 0.000120, 0.020050],
    [405, 0.014310, 0.000396, 0.067850],
    [417, 0.038470, 0.001210, 0.184500],
    [430, 0.091600, 0.004000, 0.450200],
    [442, 0.165500, 0.011600, 0.762100],
    [455, 0.225600, 0.029700, 1.039050],
    [467, 0.244400, 0.054700, 1.128950],
    [480, 0.191100, 0.090980, 0.966000],
    [492, 0.095640, 0.139020, 0.656760],
    [505, 0.032010, 0.208020, 0.370700],
    [517, 0.004900, 0.323000, 0.195000],
    [530, 0.063270, 0.503000, 0.107630],
    [542, 0.165500, 0.710000, 0.051750],
    [555, 0.290400, 0.862000, 0.020300],
    [567, 0.433450, 0.954000, 0.008500],
    [580, 0.594500, 0.995000, 0.003900],
    [592, 0.762100, 0.952000, 0.002100],
    [605, 0.916300, 0.870000, 0.001650],
    [617, 1.026300, 0.757000, 0.001100],
    [630, 1.062200, 0.631000, 0.000800],
    [642, 1.002600, 0.503000, 0.000340],
    [655, 0.854450, 0.381000, 0.000190],
    [667, 0.642400, 0.265000, 0.000050],
    [680, 0.447900, 0.175000, 0.000020],
    [692, 0.283500, 0.107000, 0.000000],
    [705, 0.164900, 0.061000, 0.000000],
    [717, 0.087400, 0.032000, 0.000000],
    [730, 0.046770, 0.017000, 0.000000],
    [742, 0.022700, 0.008210, 0.000000],
    [755, 0.011360, 0.004100, 0.000000],
    [780, 0.003640, 0.001210, 0.000000],
]

export function makeSpectralArrays(baseIOR = 1.5, dispersionStrength = 0.04) {
    const SPECTRAL_SAMPLES = 32

    const wavelengths = new Float32Array(SPECTRAL_SAMPLES)
    const iorSpectral = new Float32Array(SPECTRAL_SAMPLES)
    const cieX = new Float32Array(SPECTRAL_SAMPLES)
    const cieY = new Float32Array(SPECTRAL_SAMPLES)
    const cieZ = new Float32Array(SPECTRAL_SAMPLES)

    for (let i = 0; i < SPECTRAL_SAMPLES; i++) {
        const [lambda, xBar, yBar, zBar] = CIE_1931_DATA[i]

        wavelengths[i] = lambda

        // Cauchy dispersion: n(λ) = A + B/λ²
        const centerLambda = 0.55;
        const lambdaMicrons = lambda / 1000
        const dispersionOffset = dispersionStrength * (1.0 / (lambdaMicrons * lambdaMicrons) - 1.0 / (centerLambda * centerLambda));

        iorSpectral[i] = baseIOR + dispersionOffset

        cieX[i] = xBar
        cieY[i] = yBar
        cieZ[i] = zBar
    }

    // NO WHITE BALANCE CALCULATION HERE
    // We will handle it in shader

    return { wavelengths, iorSpectral, cieX, cieY, cieZ }
}

export const SPECTRAL_SAMPLES = 32

export default {
    CIE_1931_DATA,
    makeSpectralArrays,
    SPECTRAL_SAMPLES,
}
