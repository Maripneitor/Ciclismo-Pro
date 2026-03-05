import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiExternalLink, 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiChevronRight,
  FiSend,
  FiActivity,
  FiMail,
  FiMapPin
} from 'react-icons/fi';
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
          {/* Columna 1: Brand & Info */}
          <div className="footer-section">
            <div className="flex align-center gap-2 mb-4">
              <FiActivity className="text-primary" size={24} />
              <h4 className="mb-0">Ciclismo Pro</h4>
            </div>
            <p className="text-sm mb-4">
              La plataforma definitiva para ciclistas apasionados. Encuentra eventos, equipos y el mejor equipamiento.
            </p>
            <div className="footer-links">
               <span className="footer-text"><FiMapPin size={14} /> Ciudad de México, MX</span>
               <span className="footer-text"><FiMail size={14} /> soporte@ciclismo-pro.com</span>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div className="footer-section">
            <h4>Navegación</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link"><FiChevronRight size={12} /> Inicio</Link>
              <Link to="/eventos" className="footer-link"><FiChevronRight size={12} /> Eventos</Link>
              <Link to="/store" className="footer-link"><FiChevronRight size={12} /> Tienda</Link>
              <Link to="/dashboard" className="footer-link"><FiChevronRight size={12} /> Dashboard</Link>
            </div>
          </div>

          {/* Columna 3: Comunidad */}
          <div className="footer-section">
            <h4>Comunidad</h4>
            <div className="footer-links">
              <span className="footer-text"><FiFacebook /> Facebook</span>
              <span className="footer-text"><FiInstagram /> Instagram</span>
              <span className="footer-text"><FiTwitter /> Twitter</span>
              <span className="footer-text"><FiExternalLink /> Strava Club</span>
            </div>
          </div>

          {/* Columna 4: Newsletter */}
          <div className="footer-section">
            <h4>Suscríbete</h4>
            <p className="text-sm">
              Recibe noticias sobre eventos y ofertas exclusivas.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Tu email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn flex align-center justify-center gap-2">
                <FiSend /> Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">&copy; {new Date().getFullYear()} Ciclismo Pro. Todos los derechos reservados.</p>
          <div className="footer-tagline">
            PASSION FOR CYCLING, POWERED BY TECHNOLOGY
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
