import { motion } from 'framer-motion'
import { Braces, Code2, CodeXml, Database, GitBranch, Server, TerminalSquare, Workflow } from 'lucide-react'
import { SiBootstrap, SiCss, SiGithub, SiHtml5, SiJavascript, SiMysql, SiNodedotjs, SiPhp, SiPostman, SiReact, SiRedis, SiVercel } from 'react-icons/si'
import SectionHeading from './SectionHeading.jsx'
import { skillGroups } from '../data/skills.js'

const icons = {
  HTML5: SiHtml5, CSS3: SiCss, JavaScript: SiJavascript, Bootstrap: SiBootstrap, 'React.js': SiReact,
  PHP: SiPhp, 'Node.js': SiNodedotjs, 'REST API': Workflow,
  'SQL Server': Database, MySQL: SiMysql, SQL: Database,
  Git: GitBranch, GitHub: SiGithub, Redis: SiRedis, 'Windows Server': Server, 'VS Code': Code2,
  Vercel: SiVercel,
}

const categoryIcons = { Frontend: CodeXml, Backend: Braces, Database, 'Tools & Infrastructure': TerminalSquare }

export default function Skills() {
  return (
    <section className="section skills-section section-dark" id="skills">
      <div className="container">
        <SectionHeading eyebrow="Tech stack" title="Technologies I Work With" description="A practical toolkit for building reliable products from interface to deployment." light />
        <div className="skills-groups">
          {skillGroups.map((group, groupIndex) => {
            const CategoryIcon = categoryIcons[group.category]
            return (
              <motion.div className="skill-group" key={group.category} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: groupIndex * 0.08 }}>
                <div className="skill-group__title"><CategoryIcon size={19} /><h3>{group.category}</h3><span>{String(groupIndex + 1).padStart(2, '0')}</span></div>
                <div className="skill-list">
                  {group.items.map((skill) => {
                    const Icon = icons[skill] || Braces
                    return <div className="skill-pill" key={skill}><Icon aria-hidden="true" /><span>{skill}</span></div>
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
