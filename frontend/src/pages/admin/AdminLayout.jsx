import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AdminLayout.css';

function AdminLayout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="admin-layout">
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

      <nav className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
          <h2 className="sidebar-title">Panel Administrador</h2>
          <div className="user-welcome">
            <span className="welcome-text">Administrador</span>
            <span className="user-name">{user?.nombre_completo || 'Administrador'}</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <Link 
            to="/admin/dashboard" 
            className={`nav-link ${isActiveLink('/admin/dashboard') && !location.pathname.includes('/admin/dashboard/') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link 
            to="/admin/users" 
          	className={`nav-link ${isActiveLink('/admin/users') ? 'active' : ''}`}
          	onClick={() => setIsSidebarOpen(false)}
          >
          	<span className="nav-icon">👥</span>
          	<span className="nav-text">Gestión de Usuarios</span>
          </Link>

          <Link 
          	to="/admin/events" 
          	className={`nav-link ${isActiveLink('/admin/events') ? 'active' : ''}`}
          	onClick={() => setIsSidebarOpen(false)}
          >
          	<span className="nav-icon">🎯</span>
          	<span className="nav-text">Todos los Eventos</span>
          </Link>

          <Link 
          	to="/admin/products" 
          	className={`nav-link ${isActiveLink('/admin/products') ? 'active' : ''}`}
          	onClick={() => setIsSidebarOpen(false)}
          >
          	<span className="nav-icon">🛒</span>
          	<span className="nav-text">Gestión de Productos</span>
          </Link>

          <Link 
          	to="/admin/orders" 
          	className={`nav-link ${isActiveLink('/admin/orders') ? 'active' : ''}`}
          	onClick={() => setIsSidebarOpen(false)}
          >
          	<span className="nav-icon">📦</span>
          	<span className="nav-text">Pedidos</span>
          </Link>

          <Link 
          	to="/admin/settings" 
          	className={`nav-link ${isActiveLink('/admin/settings') ? 'active' : ''}`}
          	onClick={() => setIsSidebarOpen(false)}
          >
          	<span className="nav-icon">⚙️</span>
          	<span className="nav-text">Configuración</span>
          </Link>

          <div className="sidebar-divider"></div>
          
          <div className="quick-links">
          	<h3 className="quick-links-title">Paneles</h3>
          	<Link to="/dashboard" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
          	  🏠 Panel de Usuario
          	</Link>
          	<Link to="/organizer/dashboard" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
          	  🎯 Panel Organizador
          	</Link>
          	<Link to="/eventos" className="quick-link" onClick={() => setIsSidebarOpen(false)}>
          	  🚴 Explorar Eventos
          	</Link>
          </div>
      	</div>

      	<div className="sidebar-footer">
        	<div className="admin-stats">
          	<div className="stat-item">
  	          <span className="stat-number">0</span>
  	          <span className="stat-label">Usuarios</span>
  	        </div>
          	<div className="stat-item">
  	          <span className="stat-number">0</span>
  	          <span className="stat-label">Eventos</span>
  	        </div>
        	</div>
      	</div>
      </nav>

    	<main className="admin-main">
      	<Outlet />
    	</main>
    </div>
  );
}

export default AdminLayout;