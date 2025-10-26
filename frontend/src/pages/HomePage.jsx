import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import './HomePage.css';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener eventos normales
        const eventsResponse = await apiClient.get('/eventos');
        setEvents(eventsResponse.data.data || []);
        
        // Obtener eventos destacados
        const featuredResponse = await apiClient.get('/eventos/featured');
        setFeaturedEvents(featuredResponse.data.data || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getEventTypeIcon = (tipo) => {
    switch (tipo) {
      case 'carrera': return '🏃‍♂️';
      case 'ciclismo': return '🚴‍♂️';
      case 'triatlon': return '🏊‍♂️';
      case 'senderismo': return '🥾';
      case 'aventura': return '🧗‍♂️';
      default: return '🎯';
    }
  };

  const getDifficultyBadge = (dificultad) => {
    const difficultyColors = {
      principiante: '#10b981',
      intermedio: '#f59e0b',
      avanzado: '#ef4444',
      experto: '#7c3aed'
    };

    return (
      <span 
        className="difficulty-badge"
        style={{ backgroundColor: difficultyColors[dificultad] || '#6b7280' }}
      >
        {dificultad}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ========== HERO SECTION ========== */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Descubre tu próxima 
            <span className="highlight"> aventura deportiva</span>
          </h1>
          <p className="hero-subtitle">
            Únete a eventos únicos, conecta con otros apasionados del deporte 
            y supera tus límites. Desde carreras urbanas hasta expediciones en la naturaleza.
          </p>
          <div className="hero-actions">
            <Link to="/eventos" className="btn btn-primary btn-large">
              Explorar Eventos
            </Link>
            <Link to="/registro" className="btn btn-outline btn-large">
              Crear Cuenta
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="floating-card card-1">🏃‍♂️</div>
            <div className="floating-card card-2">🚴‍♀️</div>
            <div className="floating-card card-3">🥾</div>
            <div className="floating-card card-4">🏅</div>
          </div>
        </div>
      </section>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* ========== FEATURED EVENTS SECTION ========== */}
      {featuredEvents.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <div className="section-badge">
              ⭐ Eventos Estelares
            </div>
            <h2 className="section-title">
              Experiencias Destacadas
            </h2>
            <p className="section-subtitle">
              Los eventos más esperados de la temporada, seleccionados especialmente para ti
            </p>
          </div>

          <div className="featured-grid">
            {featuredEvents.map(event => (
              <div key={event.id_evento} className="featured-card">
                <div className="card-header">
                  <div className="event-type">
                    {getEventTypeIcon(event.tipo)}
                    <span>{event.tipo}</span>
                  </div>
                  <div className="featured-badge">
                    ⭐ Destacado
                  </div>
                </div>
                
                <div className="card-content">
                  <h3 className="event-title">{event.nombre}</h3>
                  <p className="event-description">
                    {event.descripcion || 'Una experiencia deportiva única te espera...'}
                  </p>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{formatDate(event.fecha_inicio)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{event.ubicacion}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📏</span>
                      <span>{event.distancia_km} km</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="event-meta">
                    {getDifficultyBadge(event.dificultad)}
                    {event.cuota_inscripcion > 0 ? (
                      <span className="price-tag">
                        ${event.cuota_inscripcion}
                      </span>
                    ) : (
                      <span className="price-tag free">
                        Gratis
                      </span>
                    )}
                  </div>
                  <Link 
                    to={`/eventos/${event.id_evento}`}
                    className="btn btn-primary btn-small"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========== UPCOMING EVENTS SECTION ========== */}
      <section className="events-section">
        <div className="section-header">
          <h2 className="section-title">
            Próximos Eventos
          </h2>
          <p className="section-subtitle">
            No te pierdas estas increíbles oportunidades deportivas
          </p>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3 className="empty-title">No hay eventos próximos</h3>
            <p className="empty-description">
              Pronto tendremos nuevas aventuras deportivas para ti.
            </p>
            <Link to="/eventos" className="btn btn-primary">
              Ver Todos los Eventos
            </Link>
          </div>
        ) : (
          <div className="events-grid">
            {events.slice(0, 6).map(event => (
              <div key={event.id_evento} className="event-card">
                <div className="card-header">
                  <div className="event-type">
                    {getEventTypeIcon(event.tipo)}
                    <span>{event.tipo}</span>
                  </div>
                  {event.es_destacado && (
                    <div className="featured-indicator">
                      ⭐
                    </div>
                  )}
                </div>
                
                <div className="card-content">
                  <h3 className="event-title">{event.nombre}</h3>
                  <p className="event-description">
                    {event.descripcion || 'Únete a esta increíble experiencia deportiva...'}
                  </p>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{formatDate(event.fecha_inicio)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{event.ubicacion}</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="event-meta">
                    {getDifficultyBadge(event.dificultad)}
                    {event.cuota_inscripcion > 0 ? (
                      <span className="price-tag">
                        ${event.cuota_inscripcion}
                      </span>
                    ) : (
                      <span className="price-tag free">
                        Gratis
                      </span>
                    )}
                  </div>
                  <Link 
                    to={`/eventos/${event.id_evento}`}
                    className="btn btn-outline btn-small"
                  >
                    Más Info
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {events.length > 6 && (
          <div className="section-actions">
            <Link to="/eventos" className="btn btn-outline">
              Ver Todos los Eventos ({events.length})
            </Link>
          </div>
        )}
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            ¿Por qué unirte a nuestra comunidad?
          </h2>
        </div>
        
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Eventos Diversos</h3>
            <p className="feature-description">
              Desde carreras urbanas hasta aventuras en la naturaleza, 
              encuentra el evento perfecto para tus intereses.
            </p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Comunidad Activa</h3>
            <p className="feature-description">
              Conecta con otros entusiastas del deporte, comparte experiencias 
              y crea recuerdos inolvidables.
            </p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">Logros y Reconocimiento</h3>
            <p className="feature-description">
              Gana medallas, mejora tus marcas personales y sé reconocido 
              por tus logros deportivos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;