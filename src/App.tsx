import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ColorGenerator from './projects/ColorGenerator/ColorGenerator'
import ProjectList from './components/ProjectList'


function App() {

  return (
    <Router>
      <div className="App">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/colorgenerator" element={<ColorGenerator />} />
          </Routes>
      </div>
    </Router>
  )
}

export default App
