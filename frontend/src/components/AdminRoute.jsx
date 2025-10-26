import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminRoute() {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Verificar si está autenticado y tiene rol de administrador
  const isAdmin = user && user.rol === 'administrador';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;