import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import EventSearchForm from '../components/EventSearchForm';
import './EventsListPage.css';

function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Convertir searchParams a objeto
  const currentFilters = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Pasar los parámetros de búsqueda a la API
        const response = await axios.get('/api/eventos', {
          params: currentFilters
        });
        
        setEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]); // Se ejecuta cuando cambian los searchParams

  const handleSearch = (searchData) => {
    // Actualizar los parámetros de búsqueda en la URL
    setSearchParams(searchData);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES') || '0'}`;
  };

  const getDifficultyColor = (dificultad) => {
    switch (dificultad?.toLowerCase()) {
      case 'principiante': return 'var(--color-success)';
      case 'intermedio': return 'var(--color-warning)';
      case 'avanzado': return 'var(--color-error)';
      default: return 'var(--color-gray-medium)';
    }
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="events-list-page">
      {/* ========== PAGE HEADER ========== */}
      <section className="events-header">
        <div className="container">
          <h1 className="events-title">Todos los Eventos</h1>
          <p className="events-subtitle">
            Descubre y participa en las mejores carreras y rutas ciclistas. 
            Encuentra tu próxima aventura sobre ruedas.
          </p>
        </div>
      </section>

      {/* ========== SEARCH FORM SECTION ========== */}
      <section className="search-section">
        <div className="container">
          <EventSearchForm 
            onSearch={handleSearch} 
            initialData={currentFilters}
          />
          
          {/* Mostrar filtros activos */}
          {hasActiveFilters && (
            <div className="active-filters">
              <div className="active-filters-header">
                <span>Filtros activos:</span>
                <button 
                  onClick={handleClearFilters}
                  className="clear-filters-btn"
                >
                  🗑️ Limpiar todos
                </button>
              </div>
              <div className="filter-tags">
                {Object.entries(currentFilters).map(([key, value]) => (
                  <span key={key} className="filter-tag">
                    {key}: {value}
                    <button 
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete(key);
                        setSearchParams(newParams);
                      }}
                      className="filter-tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== EVENTS CONTENT ========== */}
      <section className="events-content">
        <div className="events-stats">
          <div className="events-count">
            {events.length} Evento{events.length !== 1 ? 's' : ''} Encontrado{events.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' con los filtros aplicados'}
          </div>
          <div className="events-sort">
            <span className="sort-label">Ordenar por:</span>
            <select className="filter-select" style={{ width: 'auto' }}>
              <option value="fecha">Fecha más próxima</option>
              <option value="distancia">Distancia</option>
              <option value="nombre">Nombre</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="events-loading">
            <div className="loading-spinner"></div>
            <p>Buscando eventos emocionantes...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="events-empty">
            <div className="empty-icon">🚴‍♂️</div>
            <h3 className="empty-title">
              {hasActiveFilters ? 'No se encontraron eventos con los filtros aplicados' : 'No se encontraron eventos'}
            </h3>
            <p>
              {hasActiveFilters 
                ? 'Intenta ajustar tus criterios de búsqueda' 
                : 'Pronto habrá nuevos eventos disponibles'
              }
            </p>
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Ver Todos los Eventos
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="events-grid">
              {events.map(event => (
                <Link 
                  key={event.id_evento} 
                  to={`/eventos/${event.id_evento}`}
                  className="event-card"
                >
                  <span className="event-badge">{event.estado}</span>
                  
                  <div className="event-header">
                    <h3 className="event-title">{event.nombre}</h3>
                    <p className="event-location">
                      📍 {event.ubicacion}
                    </p>
                  </div>
                  
                  <div className="event-details">
                    <div className="event-detail">
                      <span className="detail-label">📅 Fecha</span>
                      <span className="detail-value">{formatDate(event.fecha_inicio)}</span>
                    </div>
                    <div className="event-detail">
                      <span className="detail-label">🏁 Distancia</span>
                      <span className="detail-value">{event.distancia_km} km</span>
                    </div>
                    <div className="event-detail">
                      <span className="detail-label">⚡ Dificultad</span>
                      <span 
                        className="detail-value"
                        style={{ color: getDifficultyColor(event.dificultad) }}
                      >
                        {event.dificultad}
                      </span>
                    </div>
                    <div className="event-detail">
                      <span className="detail-label">👥 Cupos</span>
                      <span className="detail-value">{event.maximo_participantes} participantes</span>
                    </div>
                  </div>

                  <div className="event-footer">
                    <span className="event-price">
                      {formatCurrency(event.cuota_inscripcion)}
                    </span>
                    <span className="btn btn-primary btn-sm">
                      Ver Detalles
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginación placeholder */}
            <div className="pagination">
              <button className="pagination-btn" disabled>Anterior</button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">Siguiente</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default EventsListPage;