import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import HeroCarousel from '../components/ui/HeroCarousel';
import apiClient from '../services/api';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import EventCarousel from '../components/ui/EventCarousel';
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
      <HeroCarousel />

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Stats Section - Nueva */}
      <section className="stats-section no-print">
        <div className="container flex-mobile-column flex-center gap-5">
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Eventos Activos</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">10k+</span>
            <span className="stat-label">Ciclistas Registrados</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">15+</span>
            <span className="stat-label">Ciudades</span>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">
            <Typewriter
              options={{
                strings: ['Descubre tu próxima aventura', 'Eventos Estelares', 'Experiencias Destacadas'],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
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
        <div className="container">
          <div className="section-header align-start">
            <h2 className="section-title">Próximos Eventos</h2>
            <p className="section-subtitle">No te pierdas estas increíbles oportunidades deportivas</p>
          </div>

          {isLoading ? (
            <div className="responsive-grid">
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
              <div className="responsive-grid">
                {events.slice(0, 6).map(event => (
                  <div key={event.id_evento} className="card event-card animate-fadeIn">
                    <div className="event-type-badge">
                      {getEventTypeIcon(event.tipo)}
                      <span>{event.tipo}</span>
                    </div>
                    
                    <div className="card-content p-0">
                      <h3 className="event-title h4">{event.nombre}</h3>
                      <p className="event-description caption">
                        {event.descripcion || 'Únete a esta increíble experiencia deportiva...'}
                      </p>
                      
                      <div className="event-details-compact">
                        <div className="detail-item-compact">
                          <span>📅 {formatDate(event.fecha_inicio)}</span>
                        </div>
                        <div className="detail-item-compact">
                          <span>📍 {event.ubicacion}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer-flex">
                      <div className="event-price-info">
                        {getDifficultyBadge(event.dificultad)}
                        <span className="price-label">
                          {event.cuota_inscripcion > 0 ? `$${event.cuota_inscripcion}` : 'Gratis'}
                        </span>
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
                <div className="section-actions flex-center mt-5">
                  <Link to="/eventos" className="btn btn-primary">
                    Ver Todos los Eventos ({events.length})
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="community-section bg-dark text-white p-5 mt-5">
        <div className="container flex-mobile-column align-center gap-4">
          <div className="community-info">
            <h2 className="text-white">Únete a la Comunidad</h2>
            <p className="mb-4">Conecta con miles de ciclistas, comparte tus rutas y participa en desafíos exclusivos.</p>
            <div className="flex gap-3">
              <Link to="/register" className="btn btn-primary">Unirse Ahora</Link>
              <Link to="/comunidad" className="btn btn-outline text-white">Saber Más</Link>
            </div>
          </div>
          <div className="community-features grid grid-2 gap-3">
            <div className="card-simple">
              <h4>👥 Grupos</h4>
              <p className="caption">Forma parte de equipos locales.</p>
            </div>
            <div className="card-simple">
              <h4>🏆 Logros</h4>
              <p className="caption">Gana medallas por tus marcas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
