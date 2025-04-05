import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getCourse, inscrireEtudiantAuCours } from '../../api'
import { Cours, Etudiant } from '../../types'

function CourseDetails() {
  const [cours, setCours] = React.useState<Cours | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [isEnrolled, setIsEnrolled] = React.useState(false)
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  React.useEffect(() => {
    async function loadCourse() {
      if (!id) {
        setError(new Error("L'identifiant du cours est manquant."))
        return
      }
      setLoading(true)
      try {
        const data = await getCourse(id)
        setCours(data)
        const stored = localStorage.getItem('etudiant')
        if (stored) {
          const etudiant: Etudiant = JSON.parse(stored)
          // Vérifier si l'ID du cours est dans le tableau coursId de l'étudiant
          if (etudiant.coursId && Array.isArray(etudiant.coursId)) {
            setIsEnrolled(etudiant.coursId.includes(id))
          }
        }
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
    loadCourse()
  }, [id])

  const handleSignup = async () => {
    const stored = localStorage.getItem('etudiant')

    if (!stored) {
      // Pas connecté → redirection vers /login
      navigate('/login', {
        state: {
          from: location.pathname,
          message: 'Veuillez vous connecter pour vous inscrire à un cours.',
        },
        replace: true,
      })
      return
    }

    try {
      const etudiant = JSON.parse(stored)
      if (!id) {
        setError(new Error("L'identifiant du cours est manquant."))
        return
      }

      // Appel de la fonction pour inscrire l'étudiant au cours
      await inscrireEtudiantAuCours(etudiant.id, id)

      // Mettre à jour le localStorage avec le nouveau cours
      if (!etudiant.coursId) {
        etudiant.coursId = []
      }
      if (!etudiant.coursId.includes(id)) {
        etudiant.coursId.push(id)
        localStorage.setItem('etudiant', JSON.stringify(etudiant))
      }
      
      setIsEnrolled(true)
      alert('Inscription réussie au cours ✅')
    } catch (err) {
      alert("Erreur lors de l'inscription au cours.")
      console.error(err)
    }
  }

  if (loading) {
    return <h1>Chargement en cours...</h1>
  }

  if (error) {
    return <h1>Une erreur est survenue : {error.message}</h1>
  }

  const search = location.state?.search || ''
  const level = location.state?.level || ''

  return (
    <div className="course-detail-container">
      <Link to={`..${search}`} relative="path" className="back-button">
        &larr; <span>Retour aux cours {level}</span>
      </Link>

      {cours && (
        <div className="course-detail">
          <img
            src={cours.imageUrl}
            alt={`Illustration du cours ${cours.name}`}
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
          <i className={`course-level ${cours.level} selected`}>
            {cours.level.charAt(0).toUpperCase() + cours.level.slice(1)}
          </i>
          <h2>{cours.name}</h2>
          <p className="course-price">
            <span>{cours.price}€</span>/mois
          </p>
          <p>{cours.description}</p>
          {isEnrolled ? (
            <div className="enrolled-status">
              <p>Vous êtes déjà inscrit à ce cours</p>
              <button className="link-button" disabled>
                Déjà inscrit ✓
              </button>
            </div>
          ) : (
            <button className="link-button" onClick={handleSignup}>
              S'inscrire à ce cours
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CourseDetails
