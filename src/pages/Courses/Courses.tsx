import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getCourses } from '../../api'

export interface Cours {
  id: string
  name: string
  description: string
  price: number
  level: 'primaire' | 'secondaire' | 'universite'
  imageUrl: string
}

function Courses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = React.useState<Cours[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const levelFilter = searchParams.get('level')

  React.useEffect(() => {
    async function loadCourses() {
      setLoading(true)
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error('An unknown error occurred'))
        }
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const displayedCourses = levelFilter
    ? courses.filter((cours) => cours.level === levelFilter)
    : courses

  const courseElements = displayedCourses.map((cours) => (
    <div key={cours.id} className="course-tile">
      <Link
        to={cours.id}
        state={{
          search: `?${searchParams.toString()}`,
          level: levelFilter,
        }}
      >
        <img src={cours.imageUrl} />
        <div className="course-info">
          <h3>{cours.name}</h3>
          <p>
            {cours.price}€<span>/mois</span>
          </p>
        </div>
        <i className={`course-level ${cours.level} selected`}>
          {cours.level.charAt(0).toUpperCase() + cours.level.slice(1)}
        </i>
      </Link>
    </div>
  ))

  function handleFilterChange(key: string, value: string | null) {
    setSearchParams((prevParams) => {
      if (value === null) {
        prevParams.delete(key)
      } else {
        prevParams.set(key, value)
      }
      return prevParams
    })
  }

  if (loading) {
    return <h1>Chargement en cours...</h1>
  }

  if (error) {
    return <h1>Une erreur est survenue : {error.message}</h1>
  }

  return (
    <div className="course-list-container">
      <h1>Explorez nos cours</h1>
      <div className="course-list-filter-buttons">
        <button
          onClick={() => handleFilterChange('level', 'primaire')}
          className={`course-level primaire
                        ${levelFilter === 'primaire' ? 'selected' : ''}`}
        >
          Primaire
        </button>
        <button
          onClick={() => handleFilterChange('level', 'secondaire')}
          className={`course-level secondaire
                        ${levelFilter === 'secondaire' ? 'selected' : ''}`}
        >
          Secondaire
        </button>
        <button
          onClick={() => handleFilterChange('level', 'universite')}
          className={`course-level universite
                        ${levelFilter === 'universite' ? 'selected' : ''}`}
        >
          Universite
        </button>

        {levelFilter ? (
          <button
            onClick={() => handleFilterChange('level', null)}
            className="course-level clear-filters"
          >
            Réinitialiser les filtres
          </button>
        ) : null}
      </div>
      <div className="course-list">{courseElements}</div>
    </div>
  )
}

export default Courses
