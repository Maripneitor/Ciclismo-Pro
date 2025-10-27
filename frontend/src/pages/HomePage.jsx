// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import apiClient from '../services/api';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import EventCarousel from '../components/EventCarousel';
import './HomePage.css';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const eventsResponse = await apiClient.get('/eventos');
        setEvents(eventsResponse.data.data || []);
        const featuredResponse = await apiClient.get('/eventos/featured');
        setFeaturedEvents(featuredResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar los eventos');
      } finally {
        setIsLoading(false);
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

  const renderSkeletonCards = (count = 3, featured = false) => {
    return Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} featured={featured} />
    ));
  };

  return (
    <div className="home-page">
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
            <Link to="/register" className="btn btn-outline btn-large">
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

      <section className="featured-section">
        <div className="section-header">
          <Typewriter
            options={{
              strings: ['Descubre tu próxima aventura', 'Eventos Estelares', 'Experiencias Destacadas'],
              autoStart: true,
              loop: true,
            }}
          />
          <p className="section-subtitle">
            Los eventos más esperados de la temporada, seleccionados especialmente para ti
          </p>
        </div>

        {isLoading ? (
          <div className="featured-grid">
            {renderSkeletonCards(3, true)}
          </div>
        ) : featuredEvents.length > 0 ? (
          <EventCarousel events={featuredEvents} />
        ) : (
          <EmptyState
            icon="⭐"
            title="No hay eventos destacados"
            message="Pronto tendremos eventos especiales destacados para ti. Mientras tanto, explora nuestros próximos eventos."
            actionButton={
              <Link to="/eventos" className="btn btn-primary">
                Explorar Todos los Eventos
              </Link>
            }
            size="large"
          />
        )}
      </section>

      <section className="events-section">
        <div className="section-header">
          <h2 className="section-title">
            Próximos Eventos
          </h2>
          <p className="section-subtitle">
            No te pierdas estas increíbles oportunidades deportivas
          </p>
        </div>

        {isLoading ? (
          <div className="events-grid">
            {renderSkeletonCards(6)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No hay eventos próximos"
            message="Actualmente no hay eventos programados. Vuelve pronto para descubrir nuevas aventuras deportivas."
            actionButton={
              <Link to="/eventos" className="btn btn-primary">
                Ver Todos los Eventos
              </Link>
            }
            size="large"
          />
        ) : (
          <>
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

            {events.length > 6 && (
              <div className="section-actions">
                <Link to="/eventos" className="btn btn-outline">
                  Ver Todos los Eventos ({events.length})
                </Link>
              </div>
            )}
          </>
        )}
      </section>

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