import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}

export default AdminRoute