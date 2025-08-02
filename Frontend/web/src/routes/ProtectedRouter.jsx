import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin mr-2">⌛</span> Verificando acceso...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to='/login' replace />;
  }

  return children;
}