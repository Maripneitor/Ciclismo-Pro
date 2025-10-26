import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`¡Gracias por suscribirte con: ${email}! Te mantendremos informado sobre nuestros eventos.`);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Columna 1: Navegación */}
          <div className="footer-section">
            <h4>Navegación</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">
                Inicio
              </Link>
              <Link to="/eventos" className="footer-link">
                Eventos
              </Link>
              <Link to="/store" className="footer-link">
                Tienda
              </Link>
              <Link to="/dashboard" className="footer-link">
                Mi Dashboard
              </Link>
            </div>
          </div>

          {/* Columna 2: Legal */}
          <div className="footer-section">
            <h4>Legal</h4>
            <div className="footer-links">
              <span className="footer-text">Términos y Condiciones</span>
              <span className="footer-text">Política de Privacidad</span>
              <span className="footer-text">Cookies</span>
              <span className="footer-text">Aviso Legal</span>
            </div>
          </div>

          {/* Columna 3: Comunidad */}
          <div className="footer-section">
            <h4>Comunidad</h4>
            <div className="footer-links">
              <span className="footer-text">Facebook</span>
              <span className="footer-text">Instagram</span>
              <span className="footer-text">Twitter</span>
              <span className="footer-text">Strava Club</span>
            </div>
          </div>

          {/* Columna 4: Newsletter */}
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p style={{ marginBottom: '1rem', color: 'var(--color-gray-light)' }}>
              Suscríbete para recibir noticias sobre eventos y ofertas especiales.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button 
                type="submit"
                className="newsletter-btn"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="footer-bottom">
          <p>&copy; 2024 Ciclismo Pro. Todos los derechos reservados.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            Passion for cycling, powered by technology 🚴‍♂️💨
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;