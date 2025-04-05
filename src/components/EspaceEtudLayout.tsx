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
          Mes Cours
        </NavLink>

        <NavLink
          to="notifications"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Notifications
        </NavLink>
      </nav>
      <Outlet />
    </>
  )
}

export default EspaceEtudLayout
