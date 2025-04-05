import { Link } from 'react-router-dom'
import bgImg from '../assets/images/about-hero.jpg'
import { useEffect, useState } from 'react'
import { getTestimonials } from '../api'
import TestimonialForm from '../components/TestimonialForm'
import { Testimonial } from '../types'


function About() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadTestimonials = async () => {
    setLoading(true)
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err)
      } else {
        setError(new Error("Une erreur inconnue s'est produite."))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  // Fonction pour actualiser la liste des témoignages après l'ajout d'un nouveau
  const refreshTestimonials = () => {
    loadTestimonials()
    setShowForm(false) // Masquer le formulaire après soumission
  }

  if (loading) {
    return <h1>Chargement en cours...</h1>
  }

  if (error) {
    return <h1>Une erreur est survenue : {error.message}</h1>
  }

  return (
    <div className="about-page-container">
      <div className="about-page-content">
        <h1>À propos de HopeSchool</h1>
        <p>
          Bienvenue chez <strong>Hope</strong>, une école dédiée à l'excellence
          académique et au développement personnel. Nous offrons des cours
          particuliers adaptés à tous les niveaux, du primaire à l'université.
        </p>
        <p>
          Notre mission est d'accompagner chaque étudiant dans son parcours
          d'apprentissage grâce à un enseignement de qualité et un suivi
          personnalisé. Nos professeurs qualifiés sont passionnés et engagés
          dans la réussite de chaque élève.
        </p>
      </div>
      <img
        src={bgImg}
        className="about-hero-image"
        alt="À propos de HopeSchool"
      />

      <div className="testimonials-section">
        <h2>Nos derniers témoignages</h2>
        <div className="testimonial-list">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <p className="testimonial-message">"{testimonial.message}"</p>
                <p className="testimonial-author">
                  — {testimonial.name},{' '}
                  {new Date(testimonial.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="no-testimonials">Aucun témoignage pour l'instant.</p>
          )}
        </div>

        {showForm ? (
          <TestimonialForm onSuccess={refreshTestimonials} />
        ) : (
          <button
            className="add-testimonial-btn"
            onClick={() => setShowForm(true)}
          >
            Ajouter votre témoignage
          </button>
        )}
      </div>

      <div className="about-page-cta">
        <h2>Votre cours est prêt.</h2>
        <Link className="link-button" to="/courses">
          Explorer nos cours
        </Link>
      </div>
    </div>
  )
}

export default About
