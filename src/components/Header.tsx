import { NavLink, Link } from 'react-router-dom'
import imageUrl from '../assets/images/avatar-icon.png'

function Header() {
  const activeStyles = {
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: '#161616',
  }

  function fakeLogOut() {
    localStorage.removeItem('loggedin')
  }

  return (
    <header>
      <Link className="site-logo" to="/">
      #HopeSchool
      </Link>
      <nav>
        <NavLink
          to="/espace-etudiant"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Espace Etudiant
        </NavLink>
        <NavLink
          to="/about"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          À propos
        </NavLink>
        <NavLink
          to="/courses"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Cours
        </NavLink>
        <Link to="login" className="login-link">
          <img src={imageUrl} className="login-icon" />
        </Link>
        <button onClick={fakeLogOut}>X</button>
      </nav>
    </header>
  )
}

export default Header
