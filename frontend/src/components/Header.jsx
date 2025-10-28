import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';
import './Header.css';

function Header() {
  const { isAuthenticated, logoutUser, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const profileMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => {
    logoutUser();
    setIsProfileMenuOpen(false);
    closeMenu();
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className={`header ${!isVisible ? 'header--hidden' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo">
            🚴 Ciclismo Pro
          </Link>

          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/eventos" className="nav-link">Eventos</Link>
            <Link to="/store" className="nav-link">Tienda</Link>
          </nav>

          <div className="header-actions">
            <ThemeToggleButton />
            
            <button className="notifications-btn" aria-label="Notificaciones">
              🔔
            </button>

            <Link to="/cart" className="cart-link">
              🛒
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
            </Link>

            <div className="auth-buttons">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <button className="header-btn btn-login">Iniciar Sesión</button>
                  </Link>
                  <Link to="/register">
                    <button className="header-btn btn-register">Registrarse</button>
                  </Link>
                </>
              ) : (
                <div className="profile-menu-container" ref={profileMenuRef}>
                  <button 
                    className="profile-toggle" 
                    onClick={toggleProfileMenu}
                    aria-label="Menú de perfil"
                  >
                    👤
                  </button>
                  {isProfileMenuOpen && (
                    <div className="profile-menu">
                      <div className="profile-user-info">
                        {user?.nombre_completo || user?.email}
                      </div>
                      
                      <Link to="/dashboard/profile" className="profile-menu-item">
                        👤 Mi Perfil
                      </Link>
                      <Link to="/dashboard/inscripciones" className="profile-menu-item">
                        📝 Mis Inscripciones
                      </Link>
                      <Link to="/dashboard/orders" className="profile-menu-item">
                        🛍️ Mis Pedidos
                      </Link>

                      {(user?.rol === 'organizador' || user?.rol === 'administrador') && (
                        <>
                          <hr className="profile-menu-divider" />
                          <Link to="/organizer/dashboard" className="profile-menu-item">
                            🎯 Panel de Organizador
                          </Link>
                          <Link to="/organizer/events/create" className="profile-menu-item">
                            ➕ Acceso Rápido: Crear Evento
                          </Link>
                        </>
                      )}

                      {user?.rol === 'administrador' && (
                        <>
                          <hr className="profile-menu-divider" />
                          <Link to="/admin" className="profile-menu-item">
                            👥 Panel de Admin
                          </Link>
                          <Link to="/admin/users" className="profile-menu-item">
                            👤 Gestión de Usuarios
                          </Link>
                          <Link to="/admin/events" className="profile-menu-item">
                            📅 Gestión de Eventos
                          </Link>
                        </>
                      )}

                      <hr className="profile-menu-divider" />
                      <button onClick={handleLogout} className="profile-menu-item logout">
                        🚪 Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button 
            className="hamburger-btn"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="mobile-overlay">
          <div className="mobile-menu">
            <button className="close-menu" onClick={closeMenu}>✕</button>
            <div className="mobile-theme-toggle">
              <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
                {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
              </button>
            </div>
            <Link to="/" className="mobile-link" onClick={closeMenu}>Inicio</Link>
            <Link to="/eventos" className="mobile-link" onClick={closeMenu}>Eventos</Link>
            <Link to="/store" className="mobile-link" onClick={closeMenu}>Tienda</Link>
            <Link to="/cart" className="mobile-link" onClick={closeMenu}>
              Carrito {totalCartItems > 0 && `(${totalCartItems})`}
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard/profile" className="mobile-link" onClick={closeMenu}>Mi Perfil</Link>
                {user?.rol === 'organizador' && (
                  <Link to="/organizer/dashboard" className="mobile-link" onClick={closeMenu}>
                    Panel Organizador
                  </Link>
                )}
                {user?.rol === 'administrador' && (
                  <Link to="/admin" className="mobile-link" onClick={closeMenu}>
                    Panel Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="mobile-link logout-btn">
                  Cerrar Sesión
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="mobile-auth">
                <Link to="/login" className="mobile-link" onClick={closeMenu}>Iniciar Sesión</Link>
                <Link to="/register" className="mobile-link" onClick={closeMenu}>Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;