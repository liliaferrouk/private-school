import { useState } from 'react'
import { addTestimonial } from '../api'

interface TestimonialFormProps {
  onSuccess?: () => void
}

function TestimonialForm({ onSuccess }: TestimonialFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      await addTestimonial({
        name,
        message,
        date: new Date().toISOString(),
      })

      // Réinitialiser le formulaire
      setName('')
      setMessage('')
      setSubmitMessage('Merci pour votre témoignage!')

      // Appeler la fonction de callback si elle existe
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: unknown) {
      // Gestion appropriée du type unknown
      if (error instanceof Error) {
        setSubmitMessage(`Erreur: ${error.message}`)
      } else {
        setSubmitMessage("Une erreur inconnue s'est produite")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="testimonial-form-container">
      <h2>Partagez votre expérience</h2>
      <form onSubmit={handleSubmit} className="testimonial-form">
        <div className="form-group">
          <label htmlFor="name">Votre nom</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Votre témoignage</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="form-textarea"
            rows={4}
          />
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
        {submitMessage && <p className="submit-message">{submitMessage}</p>}
      </form>
    </div>
  )
}

export default TestimonialForm
