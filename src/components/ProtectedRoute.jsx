import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser } = useApp()

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute