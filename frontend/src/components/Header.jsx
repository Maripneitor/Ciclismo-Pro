import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const { isAuthenticated, logoutUser, user } = useContext(AuthContext);
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Cerrar menú al presionar Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    closeMenu();
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          🚴 Ciclismo Pro
        </Link>

        {/* Botón Hamburguesa para móvil */}
        <button 
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navegación Principal */}
        <nav 
          id="main-navigation"
          className={`nav ${isMenuOpen ? 'nav-open' : ''}`}
          aria-label="Navegación principal"
        >
          <Link to="/" className="nav-link" onClick={closeMenu}>
            <span className="nav-icon">🏠</span>
            Inicio
          </Link>
          
          <Link to="/eventos" className="nav-link" onClick={closeMenu}>
            <span className="nav-icon">📅</span>
            Explorar Eventos
          </Link>
          
          <Link to="/store" className="nav-link" onClick={closeMenu}>
            <span className="nav-icon">🛍️</span>
            Tienda
          </Link>
          
          {/* Enlace al Carrito con contador */}
          <Link to="/cart" className="nav-link cart-link" onClick={closeMenu}>
            <span className="nav-icon">🛒</span>
            Carrito
            {totalCartItems > 0 && (
              <span className="cart-badge" aria-label={`${totalCartItems} items en el carrito`}>
                {totalCartItems}
              </span>
            )}
          </Link>
          
          {/* Enlace para organizadores */}
          {user && (user.rol === 'organizador' || user.rol === 'administrador') && (
            <Link to="/organizer/dashboard" className="nav-link organizer-link" onClick={closeMenu}>
              <span className="nav-icon">🎯</span>
              Panel de Organizador
            </Link>
          )}
          
          {/* Enlace para administradores */}
          {user && user.rol === 'administrador' && (
            <Link to="/admin/users" className="nav-link admin-link" onClick={closeMenu}>
              <span className="nav-icon">🛡️</span>
              Panel de Admin
            </Link>
          )}
        </nav>

        {/* Botones de Autenticación */}
        <div className="auth-buttons">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button className="header-btn btn-login" onClick={closeMenu}>
                  Iniciar Sesión
                </button>
              </Link>
              <Link to="/register">
                <button className="header-btn btn-register" onClick={closeMenu}>
                  Registrarse
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <button className="header-btn btn-dashboard" onClick={closeMenu}>
                  Mi Dashboard
                </button>
              </Link>
              <button 
                onClick={handleLogout}
                className="header-btn btn-logout"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overlay para móvil */}
      {isMenuOpen && (
        <div 
          className="mobile-overlay active" 
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
    </header>
  );
}

export default Header;