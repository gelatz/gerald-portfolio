import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading.jsx'
import { experience } from '../data/experience.js'

export default function Experience() {
  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <SectionHeading eyebrow="Experience" title="My Journey" description="A path shaped by practical work, continuous learning, and increasingly ambitious systems." light />
        <div className="timeline">
          <motion.div className="timeline__line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.1, ease: 'easeInOut' }} />
          {experience.map((item, index) => (
            <motion.article className="timeline-item" key={item.year} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.13, duration: 0.45 }}>
              <span className="timeline-item__dot"><i /></span>
              <span className="timeline-item__year">{item.year}</span>
              <h3>{item.role}</h3>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
