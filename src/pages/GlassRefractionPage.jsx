import React from 'react';
import RefractionGlassScene from '../components/RefractionGlassScene';

export default function GlassRefractionPage() {
    return (
        <main style={{ width: '100vw', height: '100vh', background: 'black' }}>
            <RefractionGlassScene />
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: 'white',
                fontFamily: 'monospace',
                pointerEvents: 'none'
            }}>
                <h1 style={{ margin: 0, fontSize: '1.2rem' }}>DUAL-PASS REFRACTION SHADER</h1>
                <p style={{ margin: 0, opacity: 0.7 }}>Implementation from App1.js</p>
            </div>
        </main>
    );
}
