import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Navbar() {
  const { currentUser, logout } = useApp()

  async function handleLogout() {
    await logout()
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        CINEMA TIME
      </Link>

      <nav className="nav-actions">
        {!currentUser && (
          <>
            <Link to="/sign-up" className="small-btn light-btn">Sign up</Link>
            <Link to="/login" className="small-btn">Login</Link>
          </>
        )}

        {currentUser && (
          <>
            {currentUser.role === 'admin' && (
              <>
                <Link to="/admin/approve" className="small-btn light-btn">Approve</Link>
                <Link to="/admin/add-movie" className="small-btn light-btn">Add movie</Link>
              </>
            )}

            {currentUser.role === 'user' && (
              <Link to="/submit-suggestion" className="small-btn light-btn">
                Submit suggestion
              </Link>
            )}

            <Link to="/profile" className="small-btn light-btn">Profile</Link>
            <button className="small-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
