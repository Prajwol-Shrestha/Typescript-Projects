import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectList from './components/ProjectList'
const ColorGenerator = React.lazy(() => import('./projects/ColorGenerator/ColorGenerator'))
const Quiz = React.lazy(() => import('./projects/Quiz/Quiz'))


function App() {

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<div> Loading... </div>}>
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/colorgenerator" element={<ColorGenerator />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
