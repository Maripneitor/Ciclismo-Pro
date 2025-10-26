import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const { isAuthenticated, logoutUser, user } = useContext(AuthContext);
  const { cartItems } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          🚴 Ciclismo Pro
        </Link>

        {/* Navegación Principal */}
        <nav className="nav">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
          <Link to="/eventos" className="nav-link">
            Explorar Eventos
          </Link>
          <Link to="/store" className="nav-link">
            🛍️ Tienda
          </Link>
          
          {/* Enlace al Carrito con contador */}
          <Link to="/cart" className="nav-link cart-link">
            🛒 Carrito
            {cartItems.length > 0 && (
              <span className="cart-badge">
                {cartItems.length}
              </span>
            )}
          </Link>
          
          {/* Enlace para organizadores */}
          {user && (user.rol === 'organizador' || user.rol === 'administrador') && (
            <Link to="/organizer/dashboard" className="nav-link organizer-link">
              🎯 Panel de Organizador
            </Link>
          )}
          
          {/* Enlace para administradores */}
          {user && user.rol === 'administrador' && (
            <Link to="/admin/users" className="nav-link admin-link">
              🛡️ Panel de Admin
            </Link>
          )}
        </nav>

        {/* Botones de Autenticación */}
        <div className="auth-buttons">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button className="header-btn btn-login">
                  Iniciar Sesión
                </button>
              </Link>
              <Link to="/register">
                <button className="header-btn btn-register">
                  Registrarse
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <button className="header-btn btn-dashboard">
                  Mi Dashboard
                </button>
              </Link>
              <button 
                onClick={logoutUser}
                className="header-btn btn-logout"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;