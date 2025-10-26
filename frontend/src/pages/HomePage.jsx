import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventSearchForm from '../components/EventSearchForm';
import './HomePage.css';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/eventos');
        setEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (searchData) => {
    // Construir query string
    const queryParams = new URLSearchParams();
    
    Object.entries(searchData).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    
    // Redirigir a la página de eventos con los filtros
    navigate(`/eventos${queryString ? `?${queryString}` : ''}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES') || '0'}`;
  };

  return (
    <div className="homepage">
      {/* ========== HERO SECTION ========== */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Tu Próxima Aventura <br />sobre Ruedas te Espera
          </h1>
          <p className="hero-subtitle">
            Descubre los mejores eventos de ciclismo, conéctate con la comunidad 
            y lleva tu pasión al siguiente nivel. Todo en un solo lugar.
          </p>
          
          {/* ========== SEARCH FORM EN HERO ========== */}
          <div className="hero-search">
            <EventSearchForm onSearch={handleSearch} />
          </div>
          
          <div className="hero-buttons">
            <Link to="/eventos" className="btn btn-primary">
              🚴 Explorar Todos los Eventos
            </Link>
            <Link to="/register" className="btn btn-secondary">
              ✨ Unirse a la Comunidad
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">¿Por Qué Elegirnos?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h3 className="feature-title">Eventos Exclusivos</h3>
              <p className="feature-description">
                Accede a carreras únicas organizadas por los mejores promotores 
                de ciclismo. Desde rutas escénicas hasta competencias de élite.
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h3 className="feature-title">Comunidad Activa</h3>
              <p className="feature-description">
                Conéctate con miles de ciclistas, forma equipos y comparte 
                tus logros. La comunidad más grande de ciclismo te espera.
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🛡️</span>
              <h3 className="feature-title">Inscripción Segura</h3>
              <p className="feature-description">
                Proceso de inscripción 100% seguro con seguimiento en tiempo 
                real y soporte dedicado para cada participante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== EVENTS SECTION ========== */}
      <section className="events-section">
        <div className="container">
          <h2 className="section-title">Próximos Eventos</h2>
          <p className="section-subtitle">
            No te pierdas estas increíbles oportunidades para demostrar tu pasión por el ciclismo
          </p>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando eventos emocionantes...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚴‍♂️</div>
              <h3>No hay eventos próximos</h3>
              <p>Pronto anunciaremos nuevas aventuras sobre ruedas</p>
              <Link to="/eventos" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Ver Todos los Eventos
              </Link>
            </div>
          ) : (
            <>
              <div className="events-grid">
                {events.slice(0, 6).map(event => (
                  <Link 
                    key={event.id_evento} 
                    to={`/eventos/${event.id_evento}`}
                    className="event-card"
                  >
                    <div className="event-header">
                      <h3 className="event-title">{event.nombre}</h3>
                      <span className="event-status">Próximo</span>
                    </div>
                    
                    <div className="event-details">
                      <div className="event-detail">
                        <strong>📅 Fecha:</strong>
                        <span>{formatDate(event.fecha_inicio)}</span>
                      </div>
                      <div className="event-detail">
                        <strong>📍 Ubicación:</strong>
                        <span>{event.ubicacion}</span>
                      </div>
                      <div className="event-detail">
                        <strong>🏁 Distancia:</strong>
                        <span>{event.distancia_km} km</span>
                      </div>
                      <div className="event-detail">
                        <strong>⚡ Dificultad:</strong>
                        <span>{event.dificultad}</span>
                      </div>
                    </div>

                    <div className="event-stats">
                      <div className="stat">
                        <span className="stat-value">{event.maximo_participantes}</span>
                        <span className="stat-label">Cupos</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{event.distancia_km}</span>
                        <span className="stat-label">Kilómetros</span>
                      </div>
                    </div>

                    <div className="event-footer">
                      <span className="event-price">
                        {formatCurrency(event.cuota_inscripcion)}
                      </span>
                      <span className="btn btn-primary btn-sm">
                        Más Información
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {events.length > 6 && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Link to="/eventos" className="btn btn-outline">
                    Ver Todos los Eventos ({events.length})
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">¿Listo para Rodar?</h2>
          <p className="cta-description">
            Únete a miles de ciclistas que ya están viviendo experiencias inolvidables. 
            Tu próxima aventura está a solo un clic de distancia.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-secondary">
              🚀 Crear Mi Cuenta
            </Link>
            <Link to="/eventos" className="btn btn-outline" style={{ 
              backgroundColor: 'transparent', 
              borderColor: 'var(--color-white)', 
              color: 'var(--color-white)' 
            }}>
              📋 Explorar Eventos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;