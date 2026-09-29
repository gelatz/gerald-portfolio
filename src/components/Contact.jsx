import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle2, Github, Linkedin, LoaderCircle, Mail, MapPin } from 'lucide-react'
import { profile } from '../data/profile.js'

const emptyForm = { name: '', email: '', subject: '', message: '', website: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(values.email.trim())) errors.email = 'Please use a valid @gmail.com address.'
  if (values.subject.trim().length < 3) errors.subject = 'Please add a short subject.'
  if (values.message.trim().length < 10) errors.message = 'Please enter at least 10 characters.'
  return errors
}

export default function Contact() {
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
    if (status === 'success' || status === 'error') setStatus('idle')
    if (submitError) setSubmitError('')
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      const firstInvalid = event.currentTarget.querySelector('[aria-invalid="true"]')
      firstInvalid?.focus()
      return
    }

    setStatus('sending')
    setSubmitError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.error || 'Your message could not be sent. Please try again.')
      }

      setStatus('success')
      setValues(emptyForm)
    } catch (error) {
      setStatus('error')
      setSubmitError(error.message || 'Your message could not be sent. Please try again.')
    }
  }

  return (
    <section className="section contact-section section-light" id="contact">
      <div className="container contact-grid">
        <motion.div className="contact-copy" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="eyebrow"><span aria-hidden="true" />Let's work together</span>
          <h2>Have a project<br />in mind<span>?</span></h2>
          <p>I'm open to freelance opportunities, full-time opportunities, collaborations, and interesting development projects.</p>
          <a className="button button--primary" href={`mailto:${profile.email}`}>Get In Touch <ArrowRight size={18} /></a>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`}><span><Mail size={19} /></span><div><small>Email</small>{profile.email}</div></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><span><Linkedin size={19} /></span><div><small>LinkedIn</small>Connect with me</div></a>
            <a href={profile.github} target="_blank" rel="noreferrer"><span><Github size={19} /></span><div><small>GitHub</small>View my repositories</div></a>
            <div className="contact-link"><span><MapPin size={19} /></span><div><small>Location</small>{profile.location}</div></div>
          </div>
        </motion.div>
        <motion.form className="contact-form" onSubmit={onSubmit} noValidate initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} aria-label="Contact form">
          <div className="form-heading"><span>Start a conversation</span><p>Tell me a little about what you're building.</p></div>
          <div className="form-honeypot" aria-hidden="true">
            <label>Website<input name="website" value={values.website} onChange={onChange} tabIndex="-1" autoComplete="off" /></label>
          </div>
          <div className="form-row">
            <label>Name<input name="name" value={values.name} onChange={onChange} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="Your name" autoComplete="name" maxLength="100" required />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label>
            <label>Gmail Address<input type="email" name="email" value={values.email} onChange={onChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : 'email-hint'} placeholder="you@gmail.com" autoComplete="email" inputMode="email" pattern="^[a-zA-Z0-9._%+\-]+@gmail\.com$" maxLength="254" required />{errors.email ? <small id="email-error" className="field-error">{errors.email}</small> : <small id="email-hint" className="field-hint">Only Gmail addresses are accepted.</small>}</label>
          </div>
          <label>Subject<input name="subject" value={values.subject} onChange={onChange} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'subject-error' : undefined} placeholder="Project inquiry" maxLength="150" required />{errors.subject && <small id="subject-error" className="field-error">{errors.subject}</small>}</label>
          <label>Message<textarea name="message" value={values.message} onChange={onChange} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} placeholder="Tell me about your idea, timeline, and goals..." rows="6" maxLength="5000" required />{errors.message && <small id="message-error" className="field-error">{errors.message}</small>}</label>
          <button className="button button--primary form-submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? <><LoaderCircle className="spin" size={18} /> Sending Message</> : <>Send Message <ArrowRight size={18} /></>}
          </button>
          {status === 'success' && <div className="form-success" role="status"><CheckCircle2 size={18} /> Message sent successfully. I'll get back to you soon.</div>}
          {status === 'error' && <div className="form-error" role="alert"><AlertCircle size={18} /> {submitError}</div>}
          <p className="form-note">Your details are only used to respond to your message.</p>
        </motion.form>
      </div>
    </section>
  )
}
