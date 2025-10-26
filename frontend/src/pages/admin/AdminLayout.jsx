import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isActiveLink = (path) => {
    return location.pathname.startsWith(path) ? {
      backgroundColor: 'var(--neutral-700)',
      color: 'white',
      borderLeftColor: 'var(--primary-500)'
    } : {};
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      backgroundColor: 'var(--neutral-50)'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'var(--neutral-900)',
        color: 'white',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            color: 'var(--primary-300)', 
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            🛡️ Panel Admin
          </h2>
          <small style={{ color: 'var(--neutral-400)', display: 'block', marginTop: '0.5rem' }}>
            Rol: <strong style={{ color: 'var(--secondary-300)' }}>{user?.rol}</strong>
          </small>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link 
                to="/admin/users"
                style={{
                  display: 'block',
                  padding: '0.875rem 1rem',
                  color: 'var(--neutral-200)',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  borderLeft: '3px solid transparent',
                  ...isActiveLink('/admin/users')
                }}
                onMouseOver={(e) => {
                  if (!isActiveLink('/admin/users').backgroundColor) {
                    e.currentTarget.style.backgroundColor = 'var(--neutral-800)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderLeftColor = 'var(--primary-500)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActiveLink('/admin/users').backgroundColor) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--neutral-200)';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }
                }}
              >
                👥 Gestión de Usuarios
              </Link>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link 
                to="/admin/events"
                style={{
                  display: 'block',
                  padding: '0.875rem 1rem',
                  color: 'var(--neutral-200)',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  borderLeft: '3px solid transparent',
                  ...isActiveLink('/admin/events')
                }}
                onMouseOver={(e) => {
                  if (!isActiveLink('/admin/events').backgroundColor) {
                    e.currentTarget.style.backgroundColor = 'var(--neutral-800)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderLeftColor = 'var(--primary-500)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActiveLink('/admin/events').backgroundColor) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--neutral-200)';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }
                }}
              >
                🚴 Gestión de Eventos
              </Link>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link 
                to="/admin/products"
                style={{
                  display: 'block',
                  padding: '0.875rem 1rem',
                  color: 'var(--neutral-200)',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  borderLeft: '3px solid transparent',
                  ...isActiveLink('/admin/products')
                }}
                onMouseOver={(e) => {
                  if (!isActiveLink('/admin/products').backgroundColor) {
                    e.currentTarget.style.backgroundColor = 'var(--neutral-800)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderLeftColor = 'var(--primary-500)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActiveLink('/admin/products').backgroundColor) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--neutral-200)';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }
                }}
              >
                🛍️ Gestión de Tienda
              </Link>
            </li>
            {/* Espacio para futuras rutas de admin */}
            <li style={{ marginBottom: '0.75rem' }}>
              <div style={{
                display: 'block',
                padding: '0.875rem 1rem',
                color: 'var(--neutral-500)',
                borderRadius: '6px',
                borderLeft: '3px solid transparent',
                fontStyle: 'italic'
              }}>
                📊 Estadísticas (Próximamente)
              </div>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <div style={{
                display: 'block',
                padding: '0.875rem 1rem',
                color: 'var(--neutral-500)',
                borderRadius: '6px',
                borderLeft: '3px solid transparent',
                fontStyle: 'italic'
              }}>
                ⚙️ Configuración (Próximamente)
              </div>
            </li>
          </ul>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--neutral-700)', paddingTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Link to="/dashboard">
              <button style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: 'var(--primary-300)',
                border: '1px solid var(--primary-500)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-500)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--primary-300)';
              }}
              >
                🏠 Ir al Dashboard
              </button>
            </Link>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: 'var(--neutral-200)',
              border: '1px solid var(--neutral-600)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--neutral-700)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--neutral-200)';
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1,
        padding: '2rem',
        overflow: 'auto'
      }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;