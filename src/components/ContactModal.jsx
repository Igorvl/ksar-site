/**
 * ContactModal - Contact Form Modal
 * Opens when clicking INIT@KSAR.ME on screen 5
 * Features: backdrop blur, two-column layout, styled form
 * Sends emails directly via ksar.me PHP API
 */
import { useState } from 'react'
import './ContactModal.css'

// API endpoint for contact form (your Hestia server)
const CONTACT_API_URL = 'https://www.ksar.me/api/contact.php'

const projectTypes = [
    { value: '', label: '—' },
    { value: 'branding', label: 'BRANDING' },
    { value: 'interior', label: 'INTERIOR DESIGN' },
    { value: 'web', label: 'WEB DESIGN' },
    { value: '3d', label: '3D VISUALIZATION' },
    { value: 'other', label: 'OTHER' }
]

export default function ContactModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        projectType: '',
        timeline: '',
        budget: '',
        message: ''
    })
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSelectOption = (value) => {
        setFormData(prev => ({ ...prev, projectType: value }))
        setIsDropdownOpen(false)
        if (errors.projectType) {
            setErrors(prev => ({ ...prev, projectType: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) {
            newErrors.name = '// FIELD REQUIRED'
        }
        if (!formData.projectType) {
            newErrors.projectType = '// SELECT PROJECT TYPE'
        }
        if (!formData.message.trim()) {
            newErrors.message = '// MESSAGE REQUIRED'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)
        setSubmitStatus(null)

        // Prepare data for API
        const payload = {
            name: formData.name,
            projectType: projectTypes.find(t => t.value === formData.projectType)?.label || formData.projectType,
            timeline: formData.timeline || '',
            budget: formData.budget || '',
            message: formData.message
        }

        try {
            const response = await fetch(CONTACT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setSubmitStatus('success')
                // Reset form
                setFormData({
                    name: '',
                    projectType: '',
                    timeline: '',
                    budget: '',
                    message: ''
                })
                // Close modal after 2 seconds on success
                setTimeout(() => {
                    onClose()
                    setSubmitStatus(null)
                }, 2000)
            } else {
                throw new Error(data.error || 'Failed to send')
            }
        } catch (error) {
            console.error('Contact API Error:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedLabel = projectTypes.find(t => t.value === formData.projectType)?.label || '—'

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

                        <form className="modal-form" onSubmit={handleSubmit} noValidate>
                            <div className={`form-field ${errors.name ? 'form-field--error' : ''}`}>
                                <label className="form-label font-nav">CODENAME (NAME)</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input font-nav"
                                />
                                {errors.name && <span className="form-error font-nav">{errors.name}</span>}
                            </div>

                            {/* Custom Dropdown */}
                            <div className={`form-field ${errors.projectType ? 'form-field--error' : ''}`}>
                                <label className="form-label font-nav">TARGET (PROJECT TYPE)</label>
                                <div className="custom-dropdown">
                                    <button
                                        type="button"
                                        className="custom-dropdown-trigger font-nav"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span>{selectedLabel}</span>
                                        <span className="custom-dropdown-indicator">[ SELECT ]</span>
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="custom-dropdown-menu">
                                            {projectTypes.map(type => (
                                                <li
                                                    key={type.value}
                                                    className={`custom-dropdown-item font-nav ${formData.projectType === type.value ? 'active' : ''}`}
                                                    onClick={() => handleSelectOption(type.value)}
                                                >
                                                    {type.label}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {errors.projectType && <span className="form-error font-nav">{errors.projectType}</span>}
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

                            <div className={`form-field form-field--textarea ${errors.message ? 'form-field--error' : ''}`}>
                                <label className="form-label font-nav">TRANSMISSION (MESSAGE)</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-textarea font-nav"
                                    rows={3}
                                />
                                {errors.message && <span className="form-error font-nav">{errors.message}</span>}
                            </div>

                            <button
                                type="submit"
                                className={`form-submit font-nav ${isSubmitting ? 'form-submit--loading' : ''} ${submitStatus ? `form-submit--${submitStatus}` : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && '[ TRANSMITTING... ]'}
                                {submitStatus === 'success' && '[ TRANSMISSION COMPLETE ]'}
                                {submitStatus === 'error' && '[ TRANSMISSION FAILED ]'}
                                {!isSubmitting && !submitStatus && '[ INITIALIZE PROJECT ]'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
