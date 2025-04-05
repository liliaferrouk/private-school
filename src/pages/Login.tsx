import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginStudent, logoutStudent, registerStudent } from '../api'
import { Etudiant } from '../types'



function Login() {
  const [loginMode, setLoginMode] = useState(true) // true = login, false = sign up
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    niveau: '',
  })

  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<Etudiant | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/espace-etudiant'
  const message = location.state?.message 

  // Vérifier si un étudiant est déjà connecté (dans localStorage)
  useEffect(() => {
    const stored = localStorage.getItem('etudiant')
    if (stored) {
      setStudent(JSON.parse(stored))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)

    try {
      let etudiant: Etudiant

      if (loginMode) {
        etudiant = await loginStudent(formData.email, formData.password)
      } else {
        etudiant = await registerStudent(
          formData.email,
          formData.password,
          formData.name,
          formData.niveau
        )
      }

      localStorage.setItem('etudiant', JSON.stringify(etudiant))
      setStudent(etudiant)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setStatus('idle')
    }
  }

  const handleLogout = () => {
    logoutStudent()
    setStudent(null)
  }

  if (student) {
    return (
      <div className="login-container">
        <h1>Bienvenue, {student.name}</h1>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        {student.niveau && (
          <p>
            <strong>Niveau:</strong> {student.niveau}
          </p>
        )}
        <p>
          <strong>Dernière connexion:</strong>{' '}
          {new Date(student.derniereConnexion || '').toLocaleString()}
        </p>
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    )
  }

  return (
    <div className="login-container">
      {message && <p className="login-error">{message}</p>}
      <h1>{loginMode ? 'Connexion étudiant' : 'Créer un compte étudiant'}</h1>
      {error && <p className="login-error">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        {!loginMode && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Nom complet"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="niveau"
              placeholder="Niveau (ex: L2, M1...)"
              value={formData.niveau}
              onChange={handleChange}
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button disabled={status === 'submitting'}>
          {status === 'submitting'
            ? loginMode
              ? 'Connexion...'
              : 'Création...'
            : loginMode
              ? 'Se connecter'
              : "S'inscrire"}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        {loginMode ? (
          <>
            Pas encore inscrit ?{' '}
            <button type="button" onClick={() => setLoginMode(false)}>
              Créer un compte
            </button>
          </>
        ) : (
          <>
            Déjà inscrit ?{' '}
            <button type="button" onClick={() => setLoginMode(true)}>
              Se connecter
            </button>
          </>
        )}
      </p>
    </div>
  )
}

export default Login
