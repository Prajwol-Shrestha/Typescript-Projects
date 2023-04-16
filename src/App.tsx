import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ColorGenerator from './projects/ColorGenerator/ColorGenerator'

function App() {

  return (
    <Router>
      <div className="App">
        <h1>Typescript Projects</h1>
          <Routes>
            <Route path="/colorgenerator" element={<ColorGenerator />} />
          </Routes>
      </div>
    </Router>
  )
}

export default App
