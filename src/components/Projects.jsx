import { useCallback, useState } from 'react'
import SectionHeading from './SectionHeading.jsx'
import ProjectCard from './ProjectCard.jsx'
import ProjectModal from './ProjectModal.jsx'
import { projects } from '../data/projects.js'

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const closeModal = useCallback(() => setSelectedProject(null), [])

  return (
    <section className="section projects-section section-light" id="projects">
      <div className="container">
        <SectionHeading eyebrow="Featured projects" title="Selected Projects" description="A selection of systems and applications I've designed and developed." />
        <div className="projects-grid">
          {projects.filter((project) => project.featured).map((project, index) => <ProjectCard project={project} index={index} onOpen={setSelectedProject} key={project.id} />)}
        </div>
      </div>
      <ProjectModal project={selectedProject} onClose={closeModal} />
    </section>
  )
}
