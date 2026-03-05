import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FiHome, 
  FiUser, 
  FiActivity, 
  FiUsers, 
  FiShoppingBag, 
  FiMenu, 
  FiLogOut,
  FiArrowRight,
  FiLayout
} from 'react-icons/fi';
import './UserDashboardLayout.css';

function UserDashboardLayout() {
  const location = useLocation();
  const { user, logoutUser } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="dashboard-wrapper">
      <button 
        className="dashboard-toggle-btn"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        <FiMenu size={24} />
      </button>

      {isSidebarOpen && (
        <div 
          className="sidebar-mask"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside className={`dashboard-aside ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="aside-header">
          <div className="flex align-center gap-2 mb-4">
             <div className="logo-accent"></div>
             <h2 className="h4 text-white mb-0">Ciclismo-Pro</h2>
          </div>
          <div className="user-profile-summary bg-white-alpha-10 p-3 rounded-md">
            <div className="flex align-center gap-3">
              <div className="avatar-small bg-primary rounded-full flex flex-center text-white font-bold">
                {user?.nombre_completo?.[0] || 'C'}
              </div>
              <div className="flex flex-column truncate">
                <span className="text-white font-bold text-sm truncate">{user?.nombre_completo}</span>
                <span className="text-gray-400 text-xs uppercase letter-spacing-wide">Ciclista</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="aside-nav flex-grow">
          <Link 
            to="/dashboard" 
            className={`aside-link ${isActiveLink('/dashboard') && !location.pathname.includes('/dashboard/') ? 'is-active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="aside-icon"><FiHome /></span>
            <span>Inicio</span>
          </Link>

          <Link 
            to="/dashboard/profile" 
            className={`aside-link ${isActiveLink('/dashboard/profile') ? 'is-active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="aside-icon"><FiUser /></span>
            <span>Mi Perfil</span>
          </Link>

          <Link 
            to="/dashboard/inscripciones" 
            className={`aside-link ${isActiveLink('/dashboard/inscripciones') ? 'is-active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="aside-icon"><FiActivity /></span>
            <span>Inscripciones</span>
          </Link>

          <Link 
            to="/dashboard/teams" 
            className={`aside-link ${isActiveLink('/dashboard/teams') ? 'is-active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="aside-icon"><FiUsers /></span>
            <span>Equipos</span>
          </Link>

          <div className="aside-divider"></div>
          
          <div className="aside-section-label">Explorar</div>
          
          <Link to="/eventos" className="aside-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="aside-icon"><FiLayout /></span>
            <span>Ver Eventos</span>
          </Link>

          <Link to="/store" className="aside-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="aside-icon"><FiShoppingBag /></span>
            <span>Tienda</span>
          </Link>
        </nav>

        <div className="aside-footer border-top border-white-alpha-10 pt-4">
          <button 
            className="aside-link w-full border-none bg-transparent cursor-pointer" 
            style={{ paddingLeft: '16px' }}
            onClick={logoutUser}
          >
            <span className="aside-icon"><FiLogOut /></span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-content-area scrollbar-thin">
        <div className="container py-5">
           <Outlet />
        </div>
      </main>
    </div>
  );
}

export default UserDashboardLayout;
