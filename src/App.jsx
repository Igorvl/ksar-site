/**
 * App - Main Application with Routing
 * Routes:
 *   /         - New HomePage (reference design)
 *   /crystal  - CrystalDemo (3D crystal page)
 */
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CrystalDemo from './pages/CrystalDemo'
import CustomCursor from './components/CustomCursor'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crystal" element={<CrystalDemo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
