import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './OrganizerLayout.css';

function OrganizerLayout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="organizer-layout">
      {/* ========== SIDEBAR ========== */}
      <nav className="organizer-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Panel Organizador</h2>
          <div className="user-role">
            {user?.nombre_completo || 'Organizador'}
          </div>
        </div>

        <div className="sidebar-nav">
          <Link 
            to="/organizer/dashboard" 
            className={`nav-link ${isActiveLink('/organizer/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link 
            to="/organizer/events" 
            className={`nav-link ${isActiveLink('/organizer/events') ? 'active' : ''}`}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Mis Eventos</span>
          </Link>

          {/* Enlaces rápidos */}
          <div className="sidebar-divider"></div>
          
          <div className="quick-links">
            <h3 className="quick-links-title">Acciones Rápidas</h3>
            <Link to="/eventos" className="quick-link">
              🚴 Explorar Eventos
            </Link>
            <Link to="/dashboard" className="quick-link">
              👤 Mi Panel Personal
            </Link>
            {user && user.rol === 'administrador' && (
              <Link to="/admin/users" className="quick-link">
                🛡️ Panel de Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ========== MAIN CONTENT ========== */}
      <main className="organizer-main">
        <Outlet />
      </main>
    </div>
  );
}

export default OrganizerLayout;