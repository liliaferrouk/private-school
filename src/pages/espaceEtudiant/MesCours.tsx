import React from 'react'
import { Link } from 'react-router-dom'
import { Cours, Etudiant } from '../../types'
import { getCourses } from '../../api'

function MesCours() {
  const [courses, setCourses] = React.useState<Cours[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    async function fetchMyCourses() {
      try {
        const stored = localStorage.getItem('etudiant')
        if (!stored) {
          throw new Error("Aucun étudiant connecté.")
        }

        const etudiant: Etudiant = JSON.parse(stored)
        const allCourses = await getCourses()

        const myCourses = allCourses.filter((cours) =>
          etudiant.coursId?.includes(cours.id)
        )

        setCourses(myCourses)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error("Une erreur inconnue est survenue."))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMyCourses()
  }, [])

  if (loading) return <h2>Chargement de vos cours...</h2>
  if (error) return <h2>Erreur : {error.message}</h2>

  if (courses.length === 0) {
    return <p>Vous n'êtes inscrit à aucun cours pour le moment.</p>
  }

  return (
    <div className="my-courses-container">
      <h2>Mes Cours</h2>
      <div className="course-list">
        {courses.map((cours) => (
          <div key={cours.id} className="course-tile">
            <Link to={`/courses/${cours.id}`}>
              <img src={cours.imageUrl} alt={cours.name} />
              <div className="course-info">
                <h3>{cours.name}</h3>
                <p>
                  {cours.price}€ <span>/mois</span>
                </p>
              </div>
              <i className={`course-level ${cours.level}`}>
                {cours.level.charAt(0).toUpperCase() + cours.level.slice(1)}
              </i>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MesCours