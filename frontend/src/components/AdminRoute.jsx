import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner'; // Asegúrate de tener este componente

function AdminRoute() {
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

  const isAdmin = user && user.rol === 'administrador';
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />; // Al dashboard de usuario
  }

  return <Outlet />;
}

export default AdminRoute;