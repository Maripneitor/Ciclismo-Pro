import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FiHome, 
  FiUser, 
  FiFileText, 
  FiUsers, 
  FiPackage, 
  FiBarChart2,
  FiCalendar,
  FiShoppingCart,
  FiSettings,
  FiPlus,
  FiTrendingUp,
  FiAward,
  FiMap,
  FiStar,
  FiGrid,
  FiMenu,
  FiX
} from 'react-icons/fi';
import './DashboardLayout.css';

function DashboardLayout({ 
  title, 
  welcomeText, 
  navLinks, 
  quickLinks, 
  stats,
  themeColor = 'user',
  children 
}) {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Mapeo de iconos por nombre
  const iconMap = {
    'FiHome': FiHome,
    'FiUser': FiUser,
    'FiFileText': FiFileText,
    'FiUsers': FiUsers,
    'FiPackage': FiPackage,
    'FiBarChart2': FiBarChart2,
    'FiCalendar': FiCalendar,
    'FiShoppingCart': FiShoppingCart,
    'FiSettings': FiSettings,
    'FiPlus': FiPlus,
    'FiTrendingUp': FiTrendingUp,
    'FiAward': FiAward,
    'FiMap': FiMap,
    'FiStar': FiStar,
    'FiGrid': FiGrid
  };

  const renderIcon = (iconName, className = 'nav-icon') => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <div className="dashboard-layout">
      <button 
        className={`mobile-menu-btn theme-${themeColor}`}
        onClick={() => setIsSidebarOpen(true)}
      >
        <FiMenu />
      </button>

      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <nav className={`dashboard-sidebar theme-${themeColor} ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX />
          </button>
          <h2 className="sidebar-title">{title}</h2>
          <div className="user-welcome">
            <span className="welcome-text">{welcomeText}</span>
            <span className="user-name">{user?.nombre_completo || title}</span>
            <span className="user-role">
              {user?.rol?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="sidebar-nav">
          <ul className="nav-list">
            {navLinks.map((link, index) => (
              <li key={index} className="nav-element">
                <Link 
                  to={link.to} 
                  className={`nav-link ${isActiveLink(link.to) ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {renderIcon(link.icon)}
                  <span className="nav-text">{link.text}</span>
                </Link>
              </li>
            ))}
          </ul>

          {quickLinks && quickLinks.length > 0 && (
            <>
              <div className="sidebar-divider"></div>
              
              <div className="quick-links">
                <h3 className="quick-links-title">Acciones Rápidas</h3>
                {quickLinks.map((link, index) => (
                  <Link 
                    key={index}
                    to={link.to} 
                    className="quick-link" 
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {renderIcon(link.icon, 'quick-link-icon')}
                    <span className="quick-link-text">{link.text}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Panel Switching Section - CORREGIDO */}
<div className="sidebar-divider"></div>

<div className="quick-links">
  <h3 className="quick-links-title">Cambiar Panel</h3>
  
  {/* Siempre mostrar enlace al panel de usuario */}
  {!location.pathname.startsWith('/dashboard') && (
    <Link 
      to="/dashboard"
      className="quick-link" 
      onClick={() => setIsSidebarOpen(false)}
    >
      {renderIcon('FiHome', 'quick-link-icon')}
      <span className="quick-link-text">Panel de Usuario</span>
    </Link>
  )}

  {/* Mostrar panel organizador si el usuario es organizador o admin */}
  {user && (user.rol === 'organizador' || user.rol === 'administrador') && 
   !location.pathname.startsWith('/organizer') && (
    <Link 
      to="/organizer/dashboard"
      className="quick-link" 
      onClick={() => setIsSidebarOpen(false)}
    >
      {renderIcon('FiAward', 'quick-link-icon')}
      <span className="quick-link-text">Panel Organizador</span>
    </Link>
  )}

  {/* Mostrar panel admin solo si el usuario es admin */}
  {user && user.rol === 'administrador' && 
   !location.pathname.startsWith('/admin') && (
    <Link 
      to="/admin/dashboard"  // CORREGIDO: usar /admin/dashboard en lugar de /admin
      className="quick-link" 
      onClick={() => setIsSidebarOpen(false)}
    >
      {renderIcon('FiSettings', 'quick-link-icon')}
      <span className="quick-link-text">Panel Administrador</span>
    </Link>
  )}
</div>
        </div>

        {stats && stats.length > 0 && (
          <div className="sidebar-footer">
            <div className="dashboard-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;