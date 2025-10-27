import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UserDashboardLayout.css';

function UserDashboardLayout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="dashboard-layout">
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

      <nav className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
          <h2 className="sidebar-title">Mi Panel</h2>
          <div className="user-welcome">
            <span className="welcome-text">Hola,</span>
            <span className="user-name">{user?.nombre_completo || 'Ciclista'}</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActiveLink('/dashboard') && !location.pathname.includes('/dashboard/') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </Link>

          <Link 
            to="/dashboard/profile" 
            className={`nav-link ${isActiveLink('/dashboard/profile') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Mi Perfil</span>
          </Link>

          <Link 
            to="/dashboard/inscripciones" 
            className={`nav-link ${isActiveLink('/dashboard/inscripciones') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Mis Inscripciones</span>
          </Link>

          <Link 
            to="/dashboard/teams" 
            className={`nav-link ${isActiveLink('/dashboard/teams') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Mis Equipos</span>
          </Link>

          <Link 
            to="/dashboard/orders" 
            className={`nav-link ${isActiveLink('/dashboard/orders') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Mis Pedidos</span>
          </Link>

          <div className="sidebar-divider"></div>
          
          <div className="quick-links">
            <h3 className="quick-links-title">Acciones Rápidas</h3>
            <Link to="/eventos" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
              🚴 Explorar Eventos
            </Link>
            <Link to="/store" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
              🛍️ Ir a la Tienda
            </Link>
            {user && (user.rol === 'organizador' || user.rol === 'administrador') && (
              <Link to="/organizer/dashboard" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
                🎯 Panel Organizador
              </Link>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Inscripciones</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Equipos</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default UserDashboardLayout;