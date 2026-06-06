import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageLoader } from './ui/LoadingSpinner'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="h-screen flex items-center justify-center"><PageLoader /></div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
