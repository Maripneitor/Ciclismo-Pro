import { Link } from 'react-router-dom';

function DashboardPage() {
  return (
    <div className="container">
      <h1>Mi Panel</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--neutral-600)' }}>
        Bienvenido a tu área personal. Gestiona tu perfil y participaciones desde aquí.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        <Link to="/dashboard/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            border: '1px solid #ccc',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}>
            <h3 style={{ color: 'var(--primary-600)', marginBottom: '1rem' }}>👤 Mi Perfil</h3>
            <p style={{ color: 'var(--neutral-600)', margin: 0 }}>
              Actualiza tu información personal y datos de ciclismo.
            </p>
          </div>
        </Link>

        <Link to="/dashboard/inscripciones" style={{ textDecoration: 'none' }}>
          <div style={{
            border: '1px solid #ccc',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}>
            <h3 style={{ color: 'var(--primary-600)', marginBottom: '1rem' }}>📝 Mis Inscripciones</h3>
            <p style={{ color: 'var(--neutral-600)', margin: 0 }}>
              Revisa el estado de tus inscripciones a eventos.
            </p>
          </div>
        </Link>

        <Link to="/eventos" style={{ textDecoration: 'none' }}>
          <div style={{
            border: '1px solid #ccc',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}>
            <h3 style={{ color: 'var(--primary-600)', marginBottom: '1rem' }}>🚴 Explorar Eventos</h3>
            <p style={{ color: 'var(--neutral-600)', margin: 0 }}>
              Descubre nuevos eventos y participa en carreras.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;