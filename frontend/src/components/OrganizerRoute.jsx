import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function OrganizerRoute() {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Verificar si está autenticado y tiene rol de organizador o administrador
  const isOrganizer = user && (user.rol === 'organizador' || user.rol === 'administrador');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOrganizer) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default OrganizerRoute;