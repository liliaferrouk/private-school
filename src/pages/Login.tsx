import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../api'

function Login() {
  const [loginFormData, setLoginFormData] = React.useState({
    email: '',
    password: '',
  })
  const [status, setStatus] = React.useState('idle')
  const [error, setError] = React.useState<Error | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from || '/espace-etudiant'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    loginUser(loginFormData)
      .then((data) => {
        setError(null)
        localStorage.setItem('loggedin', 'true')
        navigate(from, { replace: true })
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setStatus('idle')
      })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="login-container">
      {location.state?.message && (
        <h3 className="login-error">{location.state.message}</h3>
      )}
      <h1>Sign in to your account</h1>
      {error?.message && <h3 className="login-error">{error.message}</h3>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Email address"
          value={loginFormData.email}
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          value={loginFormData.password}
        />
        <button disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}

export default Login
