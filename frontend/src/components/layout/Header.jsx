import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggleButton from '../ui/ThemeToggleButton';
import { 
  FiBell, 
  FiShoppingCart, 
  FiUser, 
  FiActivity, 
  FiShoppingBag, 
  FiTarget, 
  FiPlus, 
  FiUsers, 
  FiCalendar, 
  FiLogOut,
  FiMenu,
  FiX,
  FiLayout,
  FiSettings
} from 'react-icons/fi';
import './Header.css';

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = getTotalPrice();

  return (
    <>
      <header className={`header ${!isVisible ? 'header--hidden' : ''} ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo">
            <span className="logo-accent">Ciclismo</span>-Pro
          </Link>

          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/eventos" className="nav-link">Eventos</Link>
            <Link to="/store" className="nav-link">Tienda</Link>
          </nav>

          <div className="header-actions">
            <ThemeToggleButton />
            
            <button className="notifications-btn" aria-label="Notificaciones">
              <FiBell />
            </button>

            <Link to="/cart" className="cart-link">
              <FiShoppingCart />
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
                    {user?.nombre_completo?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="profile-user-name">{user?.nombre_completo?.split(' ')[0]}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="profile-menu">
                    <div className="profile-user-info">
                      {user?.nombre_completo}
                    </div>
                    <Link to="/dashboard/profile" className="profile-menu-item">
                      <FiUser /> Mi Perfil
                    </Link>
                    <Link to="/dashboard/inscripciones" className="profile-menu-item">
                      <FiActivity /> Mis Inscripciones
                    </Link>
                    <Link to="/dashboard/orders" className="profile-menu-item">
                      <FiShoppingBag /> Mis Pedidos
                    </Link>

                    {(user?.rol === 'organizador' || user?.rol === 'administrador') && (
                      <>
                        <div className="profile-menu-divider" />
                        <Link to="/organizer/dashboard" className="profile-menu-item">
                          <FiTarget /> Panel Organizador
                        </Link>
                      </>
                    )}

                    {user?.rol === 'administrador' && (
                      <>
                        <div className="profile-menu-divider" />
                        <Link to="/admin" className="profile-menu-item">
                          <FiSettings /> Panel Admin
                        </Link>
                      </>
                    )}

                    <div className="profile-menu-divider" />
                    <button onClick={logoutUser} className="profile-menu-item logout">
                      <FiLogOut /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons nav-desktop">
                <Link to="/login" className="nav-link">Entrar</Link>
                <Link to="/register" className="btn btn-primary btn-small rounded-full">Registro</Link>
              </div>
            )}

            <button 
              className="hamburger-btn"
              onClick={toggleMenu}
              aria-label="Menú"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="mobile-overlay">
          <div className="mobile-menu animate-fadeIn">
            <button className="close-menu border-none bg-transparent self-end mb-4" onClick={closeMenu}>
              <FiX size={32} />
            </button>
            <Link to="/" className="mobile-link" onClick={closeMenu}>Inicio</Link>
            <Link to="/eventos" className="mobile-link" onClick={closeMenu}>Eventos</Link>
            <Link to="/store" className="mobile-link" onClick={closeMenu}>Tienda</Link>
            <Link to="/cart" className="mobile-link" onClick={closeMenu}>Carrito</Link>
            
            {!isAuthenticated ? (
              <div className="flex flex-column gap-3 mt-4">
                <Link to="/login" className="btn btn-primary" onClick={closeMenu}>Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-outline" onClick={closeMenu}>Registrarse</Link>
              </div>
            ) : (
              <button onClick={logoutUser} className="btn btn-outline-danger mt-4">Cerrar Sesión</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
