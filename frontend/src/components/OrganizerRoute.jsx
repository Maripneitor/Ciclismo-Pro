import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner'; // Asegúrate de tener este componente

function OrganizerRoute() {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="loading" style={{ height: '100vh', display: 'grid', placeContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = user && (user.rol === 'organizador' || user.rol === 'administrador');
  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default OrganizerRoute;