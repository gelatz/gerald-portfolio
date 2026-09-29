import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, CheckCircle2, Code2, Download, Github, Linkedin, Mail, Server } from 'lucide-react'
import { profile } from '../data/profile.js'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }

function DeveloperVisual() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div className="developer-visual" initial={{ opacity: 0, scale: 0.96, x: 28 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }} aria-label="Illustration of a full-stack development workspace" role="img">
      <div className="visual-glow" />
      <motion.div className="float-card float-card--api" animate={reduceMotion ? {} : { y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <Server size={17} /> <span>API</span><i>200</i>
      </motion.div>
      <motion.div className="float-card float-card--deploy" animate={reduceMotion ? {} : { y: [0, 8, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}>
        <CheckCircle2 size={17} /> <span>Build passed</span>
      </motion.div>
      <div className="code-window">
        <div className="window-bar"><span /><span /><span /><em>gerald.dev / workspace</em></div>
        <div className="code-layout">
          <div className="code-sidebar">
            <Code2 size={20} />
            <span className="sidebar-line active" />
            <span className="sidebar-line" />
            <span className="sidebar-line short" />
          </div>
          <div className="code-content" aria-hidden="true">
            <span><b>const</b> developer <i>=</i> {'{'}</span>
            <span className="indent">focus: <q>'full-stack'</q>,</span>
            <span className="indent">builds: [</span>
            <span className="indent-2"><q>'web apps'</q>,</span>
            <span className="indent-2"><q>'APIs'</q>,</span>
            <span className="indent-2"><q>'systems'</q></span>
            <span className="indent">],</span>
            <span className="indent">status: <q>'shipping'</q></span>
            <span>{'}'}</span>
          </div>
        </div>
        <div className="code-footer"><span><i /> main</span><span>JavaScript</span></div>
      </div>
      <div className="metric-card">
        <span>System health</span><strong>99.9%</strong>
        <div className="metric-chart"><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="hero section-dark" id="home">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero__inner">
        <motion.div className="hero__copy" variants={container} initial="hidden" animate="show">
          <motion.div className="availability" variants={item}><i /> {profile.availability}</motion.div>
          <motion.p className="hero__hello" variants={item}>Hello, I'm</motion.p>
          <motion.h1 variants={item}>{profile.name}<span>.</span></motion.h1>
          <motion.h2 variants={item}>{profile.title}</motion.h2>
          <motion.p className="hero__description" variants={item}>{profile.description}</motion.p>
          <motion.div className="hero__actions" variants={item}>
            <a className="button button--primary" href="#projects">View My Projects <ArrowRight size={18} /></a>
            <a className="button button--ghost" href={profile.resume} download><Download size={17} /> Download CV</a>
          </motion.div>
          <motion.div className="hero__socials" variants={item}>
            <span>Find me online</span>
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={19} /></a>
          </motion.div>
        </motion.div>
        <DeveloperVisual />
      </div>
      <a className="scroll-cue" href="#about">Scroll to explore <ArrowDownRight size={16} /></a>
    </section>
  )
}
