import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function OrganizerLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      backgroundColor: 'var(--neutral-50)'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: 'var(--neutral-800)',
        color: 'white',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            color: 'var(--primary-300)', 
            margin: 0,
            fontSize: '1.5rem'
          }}>
            Panel Organizador
          </h2>
          <small style={{ color: 'var(--neutral-400)' }}>
            Rol: {user?.rol}
          </small>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link 
                to="/organizer/dashboard"
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: 'var(--neutral-200)',
                  textDecoration: 'none',
                  borderRadius: '4px',
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
                📊 Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link 
                to="/organizer/events" // NUEVO: Enlace actualizado
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: 'var(--neutral-200)',
                  textDecoration: 'none',
                  borderRadius: '4px',
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
                🚴 Gestión de Eventos
              </Link>
            </li>
          </ul>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: 'var(--neutral-200)',
              border: '1px solid var(--neutral-600)',
              borderRadius: '4px',
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
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1,
        padding: '2rem'
      }}>
        <Outlet />
      </main>
    </div>
  );
}

export default OrganizerLayout;