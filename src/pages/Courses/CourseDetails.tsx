import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Cours } from './Courses'
import { getCourse } from '../../api'

function CourseDetails() {
  const [cours, setCours] = React.useState<Cours | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const { id } = useParams()
  const location = useLocation()

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
          <button className="link-button">S'inscrire à ce cours</button>
        </div>
      )}
    </div>
  )
}

export default CourseDetails
