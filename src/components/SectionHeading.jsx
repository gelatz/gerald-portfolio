import { motion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, description, light = false }) {
  return (
    <motion.div
      className={`section-heading ${light ? 'section-heading--light' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <span className="eyebrow"><span aria-hidden="true" />{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </motion.div>
  )
}
