import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, logoutUser, user } = useContext(AuthContext);

  return (
    <header style={{
      backgroundColor: 'var(--primary-500)',
      color: 'white',
      padding: 'var(--spacing-md) 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}>
          🚴 Ciclismo Pro
        </Link>

        <nav style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Inicio
          </Link>
          <Link to="/eventos" style={{ color: 'white', textDecoration: 'none' }}>
            Explorar Eventos
          </Link>
          
          {/* Enlace para organizadores */}
          {user && (user.rol === 'organizador' || user.rol === 'administrador') && (
            <Link to="/organizer/dashboard" style={{ 
              color: 'var(--secondary-300)', 
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              🎯 Panel de Organizador
            </Link>
          )}
          
          {/* NUEVO: Enlace para administradores */}
          {user && user.rol === 'administrador' && (
            <Link to="/admin/users" style={{ 
              color: 'var(--warning)', 
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              🛡️ Panel de Admin
            </Link>
          )}
        </nav>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Iniciar Sesión
                </button>
              </Link>
              <Link to="/register">
                <button style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'white',
                  color: 'var(--primary-500)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Registrarse
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <button style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: 'var(--spacing-sm)'
                }}>
                  Mi Dashboard
                </button>
              </Link>
              <button 
                onClick={logoutUser}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
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