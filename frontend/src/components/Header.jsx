import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';
import './Header.css';

// Importar iconos de react-icons
import { 
  FaBell, 
  FaShoppingCart, 
  FaUserCircle, 
  FaUser, 
  FaClipboardList,
  FaBoxOpen,
  FaTachometerAlt,
  FaPlus,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaCalendar,
  FaStore
} from 'react-icons/fa';

function Header() {
  const { isAuthenticated, logoutUser, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { cartItems, getTotalPrice } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
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
      setIsScrolled(currentScrollY > 50);
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
  const totalPrice = getTotalPrice();

  return (
    <>
      <header className={`header ${!isVisible ? 'header--hidden' : ''} ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo">SportNexus</Link>
          <nav className="nav-desktop">
            <Link to="/" className="nav-link">
              <FaHome /> Inicio
            </Link>
            <Link to="/eventos" className="nav-link">
              <FaCalendar /> Eventos
            </Link>
            <Link to="/store" className="nav-link">
              <FaStore /> Tienda
            </Link>
          </nav>
          <div className="header-actions">
            <ThemeToggleButton />
            <button className="notifications-btn" aria-label="Notificaciones">
              <FaBell />
            </button>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart />
              {totalCartItems > 0 && (
                <>
                  <span className="cart-price">${totalPrice.toFixed(2)}</span>
                  <span className="cart-badge">{totalCartItems}</span>
                </>
              )}
            </Link>
            {isAuthenticated && user ? (
              <div className="profile-menu-container" ref={profileMenuRef}>
                <button className="profile-section" onClick={toggleProfileMenu}>
                  <div className="profile-avatar">
                    {user?.nombre_completo?.[0]?.toUpperCase() || <FaUserCircle />}
                  </div>
                  <span className="profile-user-name">{user?.nombre_completo}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="profile-menu">
                    <div className="profile-user-info">
                      {user?.nombre_completo || user?.email}
                    </div>
                    <Link to="/dashboard/profile" className="profile-menu-item">
                      <FaUser /> Mi Perfil
                    </Link>
                    <Link to="/dashboard/inscripciones" className="profile-menu-item">
                      <FaClipboardList /> Mis Inscripciones
                    </Link>
                    <Link to="/dashboard/orders" className="profile-menu-item">
                      <FaBoxOpen /> Mis Pedidos
                    </Link>
                    {(user?.rol === 'organizador' || user?.rol === 'administrador') && (
                      <>
                        <hr className="profile-menu-divider" />
                        <Link to="/organizer/dashboard" className="profile-menu-item">
                          <FaTachometerAlt /> Panel de Organizador
                        </Link>
                        <Link to="/organizer/events/create" className="profile-menu-item">
                          <FaPlus /> Crear Evento
                        </Link>
                      </>
                    )}
                    {user?.rol === 'administrador' && (
                      <>
                        <hr className="profile-menu-divider" />
                        <Link to="/admin" className="profile-menu-item">
                          <FaTachometerAlt /> Panel de Admin
                        </Link>
                        <Link to="/admin/users" className="profile-menu-item">
                          <FaUsers /> Gestión de Usuarios
                        </Link>
                        <Link to="/admin/events" className="profile-menu-item">
                          <FaCalendarAlt /> Gestión de Eventos
                        </Link>
                      </>
                    )}
                    <hr className="profile-menu-divider" />
                    <button onClick={handleLogout} className="profile-menu-item logout">
                      <FaSignOutAlt /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-login">Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-register">Registrarse</Link>
              </div>
            )}
            <button 
              className="hamburger-btn"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="mobile-overlay">
          <div className="mobile-menu">
            <button className="close-menu" onClick={closeMenu}>
              <FaTimes />
            </button>
            <div className="mobile-theme-toggle">
              <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
                {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
              </button>
            </div>
            <Link to="/" className="mobile-link" onClick={closeMenu}>
              <FaHome /> Inicio
            </Link>
            <Link to="/eventos" className="mobile-link" onClick={closeMenu}>
              <FaCalendar /> Eventos
            </Link>
            <Link to="/store" className="mobile-link" onClick={closeMenu}>
              <FaStore /> Tienda
            </Link>
            <Link to="/cart" className="mobile-link" onClick={closeMenu}>
              <FaShoppingCart /> Carrito {totalCartItems > 0 && `(${totalCartItems})`}
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard/profile" className="mobile-link" onClick={closeMenu}>
                  <FaUser /> Mi Perfil
                </Link>
                {user?.rol === 'organizador' && (
                  <Link to="/organizer/dashboard" className="mobile-link" onClick={closeMenu}>
                    <FaTachometerAlt /> Panel Organizador
                  </Link>
                )}
                {user?.rol === 'administrador' && (
                  <Link to="/admin" className="mobile-link" onClick={closeMenu}>
                    <FaTachometerAlt /> Panel Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="mobile-link logout-btn">
                  <FaSignOutAlt /> Cerrar Sesión
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