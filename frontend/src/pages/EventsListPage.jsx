import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import EventSearchForm from '../components/ui/EventSearchForm';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import './EventsListPage.css';

function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Convertir searchParams a objeto
  const currentFilters = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        // Pasar los parámetros de búsqueda a la API
        const response = await axios.get('/api/eventos', {
          params: currentFilters
        });
        
        setEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
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

  // Renderizar skeleton cards para loading
  const renderSkeletonCards = (count = 6) => {
    return Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} />
    ));
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="events-list-page">
      {/* ========== PAGE HEADER ========== */}
      <section className="events-header py-5 bg-dark text-white">
        <div className="container">
          <h1 className="text-white mb-2">Explora Próximos Eventos</h1>
          <p className="caption text-gray-400 max-w-2xl">
            Desde rutas de montaña hasta circuitos urbanos. Filtra por tu nivel y encuentra 
            el desafío que elevará tu pasión por el pedal.
          </p>
        </div>
      </section>

      {/* ========== SEARCH FORM SECTION ========== */}
      <section className="search-section py-4 bg-white border-bottom sticky-top">
        <div className="container">
          <EventSearchForm 
            onSearch={handleSearch} 
            initialData={currentFilters}
          />
          
          {/* Mostrar filtros activos */}
          {hasActiveFilters && (
            <div className="active-filters mt-3">
              <div className="flex justify-between align-center mb-2">
                <span className="caption font-bold">Filtros activos:</span>
                <button 
                  onClick={handleClearFilters}
                  className="btn btn-outline btn-small"
                >
                  🗑️ Limpiar todos
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(currentFilters).map(([key, value]) => (
                  <span key={key} className="badge bg-primary-alpha text-primary flex align-center gap-2 p-2 rounded-full px-4 text-xs font-bold">
                    {key}: {value}
                    <button 
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete(key);
                        setSearchParams(newParams);
                      }}
                      className="border-none bg-none pointer text-primary font-bold"
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
            {isLoading ? (
              'Buscando eventos...'
            ) : (
              `${events.length} Evento${events.length !== 1 ? 's' : ''} Encontrado${events.length !== 1 ? 's' : ''}${hasActiveFilters ? ' con los filtros aplicados' : ''}`
            )}
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

        {isLoading ? (
          <div className="responsive-grid container py-5">
            {renderSkeletonCards(6)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={hasActiveFilters ? "🔍" : "📋"}
            title={
              hasActiveFilters 
                ? "No se encontraron eventos" 
                : "No hay eventos disponibles"
            }
            message={
              hasActiveFilters
                ? "No encontramos eventos que coincidan con tus criterios de búsqueda. Intenta ajustar los filtros o limpiar la búsqueda."
                : "Actualmente no hay eventos programados. Vuelve pronto para descubrir nuevas aventuras deportivas."
            }
            actionButton={
              hasActiveFilters ? (
                <button 
                  onClick={handleClearFilters}
                  className="btn btn-primary"
                >
                  Limpiar Búsqueda
                </button>
              ) : (
                <Link to="/" className="btn btn-primary">
                  Volver al Inicio
                </Link>
              )
            }
            size="large"
          />
        ) : (
          <div className="container py-5">
            <div className="responsive-grid">
              {events.map(event => (
                <Link 
                  key={event.id_evento} 
                  to={`/eventos/${event.id_evento}`}
                  className="card event-card animate-fadeIn"
                >
                  <span className={`event-type-badge ${event.estado}`}>{event.estado}</span>
                  
                  <div className="card-content p-0">
                    <h3 className="event-title h4">{event.nombre}</h3>
                    <p className="caption text-gray-500 mb-2">
                       📍 {event.ubicacion}
                    </p>
                    
                    <div className="flex flex-column gap-2 mt-3">
                      <div className="flex align-center gap-2 text-sm">
                        <span>📅 {formatDate(event.fecha_inicio)}</span>
                      </div>
                      <div className="flex align-center gap-2 text-sm">
                        <span>⚡ Dificultad: </span>
                        <span style={{ color: getDifficultyColor(event.dificultad), fontWeight: 700 }}>
                          {event.dificultad}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer-flex border-top mt-auto pt-3">
                    <span className="price-label">
                      {event.cuota_inscripcion > 0 ? formatCurrency(event.cuota_inscripcion) : 'Gratis'}
                    </span>
                    <span className="btn btn-outline btn-small py-1 px-3">
                      Inscribirse
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginación premium */}
            <div className="flex flex-center gap-2 mt-5">
              <button className="btn btn-outline btn-small opacity-50" disabled>«</button>
              <button className="btn btn-primary btn-small py-1 px-3">1</button>
              <button className="btn btn-outline btn-small py-1 px-3">2</button>
              <button className="btn btn-outline btn-small py-1 px-3">3</button>
              <button className="btn btn-outline btn-small">»</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default EventsListPage;
