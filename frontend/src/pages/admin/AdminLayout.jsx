import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AdminLayout.css';

function AdminLayout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="admin-layout">
      {/* ========== SIDEBAR ========== */}
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Panel Administrador</h2>
          <div className="user-role">
            {user?.nombre_completo || 'Administrador'}
            <div className="admin-badge">Admin</div>
          </div>
        </div>

        <div className="sidebar-nav">
          <Link 
            to="/admin/users" 
            className={`nav-link ${isActiveLink('/admin/users') ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Gestión de Usuarios</span>
          </Link>

          <Link 
            to="/admin/events" 
            className={`nav-link ${isActiveLink('/admin/events') ? 'active' : ''}`}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Gestión de Eventos</span>
          </Link>

          <Link 
            to="/admin/products" 
            className={`nav-link ${isActiveLink('/admin/products') ? 'active' : ''}`}
          >
            <span className="nav-icon">🛍️</span>
            <span className="nav-text">Gestión de Tienda</span>
          </Link>

          <Link 
            to="/admin/orders" 
            className={`nav-link ${isActiveLink('/admin/orders') ? 'active' : ''}`}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Gestión de Pedidos</span>
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
            <Link to="/organizer/dashboard" className="quick-link">
              🎯 Panel Organizador
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== MAIN CONTENT ========== */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;