/**
 * App - Main Application with Routing
 * Routes:
 *   /         - New HomePage (reference design)
 *   /profile  - ProfilePage (about page with background image)
 *   /crystal  - CrystalDemo (3D crystal page)
 */
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CursorProvider } from './context/CursorContext'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CrystalDemo from './pages/CrystalDemo'
import CustomCursor from './components/CustomCursor'
import './App.css'

function App() {
  return (
    <CursorProvider>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/crystal" element={<CrystalDemo />} />
        </Routes>
      </BrowserRouter>
    </CursorProvider>
  )
}

export default App
