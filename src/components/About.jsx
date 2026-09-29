import { motion } from 'framer-motion'
import { Braces, BriefcaseBusiness, Code2, Database, FileText, GraduationCap, Rocket, Waypoints } from 'lucide-react'
import { stats } from '../data/profile.js'

const services = [
  { icon: Braces, title: 'Web Application Development', description: 'Building responsive, maintainable, and user-friendly web applications.' },
  { icon: Waypoints, title: 'API Development', description: 'Designing and integrating RESTful APIs and backend services.' },
  { icon: Database, title: 'Database Design', description: 'Designing efficient relational databases, queries, and data workflows.' },
  { icon: Rocket, title: 'System Deployment', description: 'Deploying, configuring, and maintaining web applications and supporting services.' },
]

const statIcons = [BriefcaseBusiness, FileText, Code2, GraduationCap]

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-showcase section-dark">
        <div className="about-pattern" aria-hidden="true" />
        <div className="container">
          <div className="about-layout">
            <motion.div className="about-content" initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
              <span className="about-eyebrow"><i aria-hidden="true" />About me</span>
              <h2><span className="about-title-line">Problem Solver</span><br />and <span className="about-title-accent">Builder</span></h2>
              <div className="about-copy">
                <p>I'm a Full-Stack Web Developer with 3+ years of experience developing web applications, APIs, database-driven systems, and internal business applications.</p>
                <p>I enjoy turning ideas and complex workflows into efficient, user-friendly solutions while continuously learning new technologies and improving my craft.</p>
              </div>
            </motion.div>

            <motion.figure className="about-portrait" initial={{ opacity: 0, scale: 0.92, x: 28 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}>
              <div className="about-portrait__orbit about-portrait__orbit--outer" aria-hidden="true"><i /></div>
              <div className="about-portrait__orbit about-portrait__orbit--inner" aria-hidden="true" />
              <div className="about-portrait__glow" aria-hidden="true" />
              <div className="about-portrait__image">
                <img src="/images/projects/pfp.jpg" alt="Gerald, Full-Stack Web Developer" width="2000" height="2000" loading="lazy" />
              </div>
            </motion.figure>
          </div>

          <div className="stats-grid about-stats">
            {stats.map((stat, index) => {
              const Icon = statIcons[index]
              return (
                <motion.div className="stat-card" key={stat.label} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.08 }}>
                  <div className="stat-card__icon"><Icon size={27} strokeWidth={1.8} /></div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="about-services section-light">
        <div className="container">
          <div className="services-heading"><span>What I do</span><p>From the interface to the infrastructure.</p></div>
          <div className="services-grid">
            {services.map(({ icon: Icon, title, description }, index) => (
              <motion.article className="service-card" key={title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }}>
                <div className="service-card__icon"><Icon size={24} strokeWidth={1.8} /></div>
                <span className="service-card__number">0{index + 1}</span>
                <h3>{title}</h3><p>{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
