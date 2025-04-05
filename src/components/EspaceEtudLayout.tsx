import { NavLink, Outlet } from 'react-router-dom'

function EspaceEtudLayout() {
  const activeStyles = {
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: '#161616',
  }

  return (
    <>
      <nav className="host-nav">
        <NavLink
          to="."
          end
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Mes Données
        </NavLink>

        <NavLink
          to="mes-cours"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Mes Cours
        </NavLink>

        <NavLink
          to="notifications"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Notifications
        </NavLink>

        <NavLink
          to="support"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Support
        </NavLink>
      </nav>
      <Outlet />
    </>
  )
}

export default EspaceEtudLayout
