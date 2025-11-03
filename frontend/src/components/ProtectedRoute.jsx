import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner'; // Asegúrate de tener este componente

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useContext(AuthContext); // Obtén isLoading

  if (isLoading) {
    return (
      <div className="loading" style={{ height: '100vh', display: 'grid', placeContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;