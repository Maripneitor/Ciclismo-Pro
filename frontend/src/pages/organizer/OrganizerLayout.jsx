import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './OrganizerLayout.css';

function OrganizerLayout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="organizer-layout">
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <nav className={`organizer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
          <h2 className="sidebar-title">Panel Organizador</h2>
          <div className="user-welcome">
            <span className="welcome-text">Organizador</span>
            <span className="user-name">{user?.nombre_completo || 'Organizador'}</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <Link 
            to="/organizer/dashboard" 
            className={`nav-link ${isActiveLink('/organizer/dashboard') && !location.pathname.includes('/organizer/dashboard/') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link 
            to="/organizer/events" 
            className={`nav-link ${isActiveLink('/organizer/events') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Mis Eventos</span>
          </Link>

          <Link 
            to="/organizer/events/create" 
            className={`nav-link ${isActiveLink('/organizer/events/create') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">➕</span>
            <span className="nav-text">Crear Evento</span>
          </Link>

          <Link 
            to="/organizer/events" 
            className={`nav-link ${isActiveLink('/organizer/events') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Gestión de Eventos</span>
          </Link>

          <Link 
            to="/organizer/reports" 
            className={`nav-link ${isActiveLink('/organizer/reports') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">Reportes</span>
          </Link>

          <div className="sidebar-divider"></div>
          
          <div className="quick-links">
            <h3 className="quick-links-title">Acciones Rápidas</h3>
            <Link to="/dashboard" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
              🏠 Mi Panel Principal
            </Link>
            <Link to="/eventos" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
              🚴 Explorar Eventos
            </Link>
            {user && user.rol === 'administrador' && (
              <Link to="/admin" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
                ⚙️ Panel Administrador
              </Link>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="organizer-stats">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Eventos Activos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Total Participantes</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="organizer-main">
        <Outlet />
      </main>
    </div>
  );
}

export default OrganizerLayout;