/**
 * ContactModal - Contact Form Modal
 * Opens when clicking INIT@KSAR.ME on screen 5
 * Features: backdrop blur, two-column layout, styled form
 */
import { useState } from 'react'
import './ContactModal.css'

export default function ContactModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        projectType: '',
        timeline: '',
        budget: '',
        message: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
        console.log('Form submitted:', formData)
        // Could send to API or email service
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Corner brackets */}
                <div className="modal-bracket modal-bracket--top-left" />
                <div className="modal-bracket modal-bracket--bottom-right" />

                {/* Close button */}
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <div className="modal-grid">
                    {/* Left Column - Info */}
                    <div className="modal-info">
                        <h2 className="modal-title font-hero">INIT@KSAR.ME</h2>

                        <div className="modal-meta">
                            <p className="modal-meta-item font-nav">// BASE: DUBAI, UAE</p>
                            <p className="modal-meta-item font-nav">// TIMEZONE: GMT+4</p>
                            <p className="modal-meta-item font-nav">// RESPONSE TIME: &lt; 24 HOURS</p>
                            <p className="modal-meta-item font-nav">// NEXT PRODUCTION SLOT: [ Q3 2026 ] ■</p>
                        </div>

                        <div className="modal-social">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="modal-social-link font-nav">INSTAGRAM</a>
                            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="modal-social-link font-nav">BEHANCE</a>
                            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="modal-social-link font-nav">TELEGRAM</a>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="modal-form-container">
                        <h3 className="modal-form-title font-hero">// START NEW PROTOCOL</h3>

                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="form-field">
                                <label className="form-label font-nav">CODENAME (NAME)</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input font-nav"
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label font-nav">TARGET (PROJECT TYPE)</label>
                                <div className="form-select-wrapper">
                                    <select
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleChange}
                                        className="form-select font-nav"
                                        required
                                    >
                                        <option value="">—</option>
                                        <option value="branding">BRANDING</option>
                                        <option value="interior">INTERIOR DESIGN</option>
                                        <option value="web">WEB DESIGN</option>
                                        <option value="3d">3D VISUALIZATION</option>
                                        <option value="other">OTHER</option>
                                    </select>
                                    <span className="form-select-indicator font-nav">[ SELECT ]</span>
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label font-nav">TIMELINE</label>
                                <input
                                    type="text"
                                    name="timeline"
                                    value={formData.timeline}
                                    onChange={handleChange}
                                    className="form-input font-nav"
                                    placeholder=""
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label font-nav">BUDGET</label>
                                <input
                                    type="text"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="form-input font-nav"
                                    placeholder=""
                                />
                            </div>

                            <div className="form-field form-field--textarea">
                                <label className="form-label font-nav">TRANSMISSION (MESSAGE)</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-textarea font-nav"
                                    rows={3}
                                    required
                                />
                            </div>

                            <button type="submit" className="form-submit font-nav">
                                [ INITIALIZE PROJECT ]
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
