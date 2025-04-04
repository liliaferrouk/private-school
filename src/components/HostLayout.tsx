import { NavLink, Outlet } from 'react-router-dom'

function HostLayout() {
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
          Dashboard
        </NavLink>

        <NavLink
          to="income"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Income
        </NavLink>

        <NavLink
          to="courses"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Vans
        </NavLink>

        <NavLink
          to="reviews"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Reviews
        </NavLink>
      </nav>
      <Outlet />
    </>
  )
}

export default HostLayout
