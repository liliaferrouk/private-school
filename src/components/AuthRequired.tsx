import { Navigate, Outlet, useLocation } from 'react-router-dom'

function AuthRequired() {
  const isLoggedIn = !!localStorage.getItem('etudiant')
  const location = useLocation()

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{
          message: 'Veuillez vous connecter d\'abord.',
          from: location.pathname,
        }}
        replace
      />
    )
  }
  return <Outlet />
}

export default AuthRequired
