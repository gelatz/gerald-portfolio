import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, ExternalLink, Github, X } from 'lucide-react'

export default function ProjectModal({ project, onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!project) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll('.project-modal button, .project-modal a[href]')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
          <motion.div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} transition={{ duration: 0.25 }}>
            <button ref={closeButtonRef} className="modal-close icon-button" type="button" onClick={onClose} aria-label="Close project details"><X size={21} /></button>
            <div className="modal-hero"><img src={project.image} alt={project.imageAlt} width="960" height="600" /></div>
            <div className="modal-content">
              <span className="project-category">{project.category}</span>
              <h2 id="project-modal-title">{project.title}</h2>
              <p className="modal-overview">{project.overview}</p>
              <div className="modal-columns">
                <div><h3>The problem</h3><p>{project.problem}</p></div>
                <div><h3>The solution</h3><p>{project.solution}</p></div>
              </div>
              <div className="modal-details">
                <div><h3>Key features</h3><ul>{project.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul></div>
                <div><h3>Technologies</h3><div className="technology-tags technology-tags--large">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
              </div>
              <div className="modal-columns modal-columns--notes">
                <div><h3>Challenge</h3><p>{project.challenges}</p></div>
                <div><h3>What I learned</h3><p>{project.learned}</p></div>
              </div>
              {(project.github || project.demo) && <div className="modal-actions">
                {project.github && <a className="button button--outline" href={project.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>}
                {project.demo && <a className="button button--primary" href={project.demo} target="_blank" rel="noreferrer">Live Demo <ExternalLink size={17} /></a>}
              </div>}
              {!project.github && !project.demo && <p className="project-confidential"><ArrowUpRight size={16} /> Private project — links available on request.</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
