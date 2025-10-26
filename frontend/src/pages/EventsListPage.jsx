import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EventsListPage.css';

function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    location: '',
    type: ''
  });

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de filtrado cuando esté implementada
    console.log('Filtros aplicados:', filters);
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

      {/* ========== FILTERS SECTION ========== */}
      <section className="filters-section">
        <div className="filters-container">
          <form onSubmit={handleFilterSubmit} className="filters-form">
            <div className="filter-group">
              <label className="filter-label">Buscar Eventos</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nombre del evento..."
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Dificultad</label>
              <select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Todas las dificultades</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Ubicación</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Ciudad o región..."
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Tipo de Evento</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Todos los tipos</option>
                <option value="carretera">Carretera</option>
                <option value="montaña">Montaña</option>
                <option value="gravel">Gravel</option>
                <option value="urbano">Urbano</option>
              </select>
            </div>
            
            <button type="submit" className="filter-button">
              🔍 Aplicar Filtros
            </button>
          </form>
        </div>
      </section>

      {/* ========== EVENTS CONTENT ========== */}
      <section className="events-content">
        <div className="events-stats">
          <div className="events-count">
            {events.length} Evento{events.length !== 1 ? 's' : ''} Disponible{events.length !== 1 ? 's' : ''}
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
            <h3 className="empty-title">No se encontraron eventos</h3>
            <p>Intenta ajustar tus filtros de búsqueda</p>
            <button 
              onClick={() => setFilters({ search: '', difficulty: '', location: '', type: '' })}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Limpiar Filtros
            </button>
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