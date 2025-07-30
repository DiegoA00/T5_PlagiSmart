import { Navigate } from 'react-router-dom'
import { authService } from '@/services/auth/loginService'

export default function ProtectedRoute({ allowedRoles, children }) {
  const user = authService.getUserData()
  
  if (!authService.isAuthenticated() || !user) {
    return <Navigate to='/login' replace />
  }
  
  const userRoles = user.roles?.map(r => r.name) || []
  const hasPermission = allowedRoles.some(role => userRoles.includes(role))
  
  if (!hasPermission) {
    return <Navigate to='/login' replace />
  }
  
  return children
}