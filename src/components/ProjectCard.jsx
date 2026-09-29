import { motion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'

export default function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article className="project-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.5, delay: (index % 3) * 0.08 }} whileHover={{ y: -7 }}>
      <button className="project-card__image" type="button" onClick={() => onOpen(project)} aria-label={`View details for ${project.title}`}>
        <img src={project.image} alt={project.imageAlt} width="720" height="450" loading="lazy" />
        <span className="project-card__overlay"><ArrowUpRight size={21} /> View case study</span>
      </button>
      <div className="project-card__content">
        <span className="project-category">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="technology-tags">
          {project.technologies.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}
          {project.technologies.length > 4 && <span>+{project.technologies.length - 4}</span>}
        </div>
        <div className="project-card__actions">
          <button className="text-link" type="button" onClick={() => onOpen(project)}>View details <ArrowUpRight size={16} /></button>
          {project.github && <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub repository`}><Github size={18} /></a>}
        </div>
      </div>
    </motion.article>
  )
}
