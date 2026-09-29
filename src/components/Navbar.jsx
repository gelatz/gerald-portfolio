import { useEffect, useState } from 'react'
import { Download, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'
import { profile } from '../data/profile.js'

const links = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact']

export default function Navbar({ theme, onThemeToggle }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.5] },
    )
    links.forEach((link) => {
      const section = document.getElementById(link.toLowerCase())
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)
    return () => document.body.classList.remove('menu-open')
  }, [isOpen])

  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className={`navbar ${isScrolled || isOpen ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a className="brand" href="#home" aria-label="Gerald portfolio home">{profile.mark}</a>
        <nav className={`nav-links ${isOpen ? 'nav-links--open' : ''}`} aria-label="Main navigation">
          {links.map((link) => {
            const id = link.toLowerCase()
            return <a key={link} href={`#${id}`} className={activeSection === id ? 'active' : ''} onClick={() => setIsOpen(false)}>{link}</a>
          })}
          <a className="button button--primary nav-resume" href={profile.resume} download>
            <Download size={16} aria-hidden="true" /> Download CV
          </a>
        </nav>
        <div className="navbar__actions">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <a className="button button--small button--outline desktop-resume" href={profile.resume} download>
            <Download size={16} aria-hidden="true" /> Download CV
          </a>
          <button className="icon-button menu-toggle" type="button" aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  )
}
