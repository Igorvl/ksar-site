/**
 * App - Main Application with Routing
 * Routes:
 *   /         - New HomePage (reference design)
 *   /profile  - ProfilePage (about page with background image)
 *   /crystal  - CrystalDemo (3D crystal page)
 * 
 * Global Components:
 *   - CustomCursor (follows mouse)
 *   - ContactModal (opens from any page via CONTACT button)
 */
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CursorProvider } from './context/CursorContext'
import { ModalProvider, useModal } from './context/ModalContext'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CrystalDemo from './pages/CrystalDemo'
import CustomCursor from './components/CustomCursor'
import ContactModal from './components/ContactModal'
import './App.css'

// Wrapper component to use modal context
function AppContent() {
  const { isContactModalOpen, closeContactModal } = useModal()

  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/crystal" element={<CrystalDemo />} />
      </Routes>
      {/* Global Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
      />
    </>
  )
}

function App() {
  return (
    <CursorProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ModalProvider>
    </CursorProvider>
  )
}

export default App
