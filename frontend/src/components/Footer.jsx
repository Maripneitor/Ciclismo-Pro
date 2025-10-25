import { Link } from 'react-router-dom';
import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Gracias por suscribirte con: ${email}`);
    setEmail('');
  };

  return (
    <footer style={{
      backgroundColor: 'var(--neutral-800)',
      color: 'white',
      padding: 'var(--spacing-2xl) 0 var(--spacing-xl)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <div>
            <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--primary-300)' }}>Navegación</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <Link to="/" style={{ color: 'var(--neutral-200)', textDecoration: 'none' }}>
                Inicio
              </Link>
              <Link to="/eventos" style={{ color: 'var(--neutral-200)', textDecoration: 'none' }}>
                Eventos
              </Link>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--primary-300)' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <span style={{ color: 'var(--neutral-200)', cursor: 'pointer' }}>Términos y Condiciones</span>
              <span style={{ color: 'var(--neutral-200)', cursor: 'pointer' }}>Política de Privacidad</span>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--primary-300)' }}>Comunidad</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <span style={{ color: 'var(--neutral-200)', cursor: 'pointer' }}>Facebook</span>
              <span style={{ color: 'var(--neutral-200)', cursor: 'pointer' }}>Instagram</span>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--primary-300)' }}>Newsletter</h4>
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  marginBottom: 'var(--spacing-sm)',
                  border: 'none',
                  borderRadius: '4px'
                }}
              />
              <button 
                type="submit"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--primary-500)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--neutral-600)',
          paddingTop: 'var(--spacing-md)',
          textAlign: 'center',
          color: 'var(--neutral-400)'
        }}>
          <p>&copy; 2024 Ciclismo Pro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;