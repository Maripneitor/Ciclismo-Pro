import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

function Header() {
  const { isAuthenticated, logoutUser, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logoutUser();
    closeMenu();
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          🚴 Ciclismo Pro
        </Link>

        <nav className="nav-desktop">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/eventos" className="nav-link">Eventos</Link>
          <Link to="/store" className="nav-link">Tienda</Link>
          {user?.rol === 'organizador' && (
            <Link to="/organizer/dashboard" className="nav-link">Panel Organizador</Link>
          )}
          {user?.rol === 'administrador' && (
            <Link to="/admin/users" className="nav-link">Panel Admin</Link>
          )}
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
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
              <>
                <Link to="/dashboard">
                  <button className="header-btn btn-dashboard">Dashboard</button>
                </Link>
                <button onClick={handleLogout} className="header-btn btn-logout">
                  Cerrar Sesión
                </button>
              </>
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
            {user?.rol === 'organizador' && (
              <Link to="/organizer/dashboard" className="mobile-link" onClick={closeMenu}>
                Panel Organizador
              </Link>
            )}
            {user?.rol === 'administrador' && (
              <Link to="/admin/users" className="mobile-link" onClick={closeMenu}>
                Panel Admin
              </Link>
            )}
            <div className="mobile-auth">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="mobile-link" onClick={closeMenu}>Iniciar Sesión</Link>
                  <Link to="/register" className="mobile-link" onClick={closeMenu}>Registrarse</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="mobile-link" onClick={closeMenu}>Mi Dashboard</Link>
                  <button onClick={handleLogout} className="mobile-link logout-btn">
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;