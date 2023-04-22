import React, { useEffect, useState } from 'react'
import projectArr from '../projects.json'
import { Link } from 'react-router-dom'
import RouteName from '../utils/routename'

export default function ProjectList() {
  const [projects, setProjects] = useState(projectArr)

  return (
    <section className='container'>
      <h1>Typescript Projects</h1>
      <ol>
        {projects.map((project, index) => <li key={index}> <Link to={RouteName(project.projectName)}> {project.projectName} </Link>  </li>)}
      </ol>
    </section>
  )
}
