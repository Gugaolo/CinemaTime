import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, isLoading } = useApp()

  if (isLoading) {
    return <p className="page">Loading...</p>
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
