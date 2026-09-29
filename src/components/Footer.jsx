import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../data/profile.js'

const links = [['About', '#about'], ['Projects', '#projects'], ['Skills', '#skills'], ['Contact', '#contact']]

export default function Footer() {
  return (
    <footer className="footer section-dark">
      <div className="container footer__grid">
        <div className="footer__brand"><a className="brand" href="#home">{profile.name}.</a><p>Full-Stack Developer building modern web applications and scalable systems.</p></div>
        <div><h2>Quick Links</h2><nav aria-label="Footer navigation">{links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</nav></div>
        <div><h2>Social</h2><nav aria-label="Social links"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a><a href={`mailto:${profile.email}`}><Mail size={16} /> Email</a></nav></div>
      </div>
      <div className="container footer__bottom"><span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span><a href="#home">Back to top <ArrowUp size={16} /></a></div>
    </footer>
  )
}
