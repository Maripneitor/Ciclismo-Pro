import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import Spinner from '../../components/Spinner';
import './OrganizerCommon.css'; // Asegúrate de que esto esté importado en el Layout o aquí

function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/organizer/my-events');
        setEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching organizer events:', error);
        setError(error.response?.data?.message || 'Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'proximo': return 'status-active'; // Verde
      case 'en_curso': return 'status-completed'; // Azul/Info (Tu BD usa 'en_curso'?)
      case 'activo': return 'status-completed'; // Añadido por si acaso
      case 'finalizado': return 'status-pending'; // Naranja/Warning (para "pasado")
      case 'cancelado': return 'status-inactive'; // Rojo
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'proximo': return 'Próximo';
      case 'activo': return 'Activo';
      case 'en_curso': return 'En Curso';
      case 'finalizado': return 'Finalizado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="organizer-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Cargando eventos...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organizer-page">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2 className="empty-title text-error">Error al Cargar</h2>
          <p className="empty-description">{error}</p>
          <Link to="/organizer/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="organizer-page">
      <div className="admin-header">
        <div className="header-content">
          <h1 className="page-title">Mis Eventos Creados</h1>
          <p className="page-subtitle">
            Gestiona todos los eventos que has creado como organizador
          </p>
        </div>
        <div className="header-actions">
          <Link to="/organizer/events/create" className="btn btn-primary">
            + Crear Nuevo Evento
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3 className="empty-title">No has creado ningún evento aún</h3>
          <p className="empty-description">
            Comienza creando tu primer evento para organizar carreras.
          </p>
          <Link to="/organizer/events/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Crear Mi Primer Evento
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Ubicación</th>
                  <th className="text-center">Participantes</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id_evento}>
                    <td>
                      <Link to={`/organizer/events/${event.id_evento}`} className="link-table-title">
                        {event.nombre}
                      </Link>
                      {event.descripcion && (
                        <small className="prevent-overflow" style={{ color: 'var(--app-text-muted)', display: 'block', maxWidth: '300px' }}>
                          {event.descripcion}
                        </small>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(event.estado)}`}>
                        {getStatusText(event.estado)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>
                        {formatDate(event.fecha_inicio)}
                      </div>
                      {event.fecha_fin && (
                        <small style={{ color: 'var(--app-text-muted)' }}>
                          al {formatDate(event.fecha_fin)}
                        </small>
                      )}
                    </td>
                    <td style={{ color: 'var(--app-text-muted)' }}>
                      {event.ubicacion}
                    </td>
                    <td className="text-center">
                      <strong style={{ fontSize: '1.1rem' }}>
                        {event.maximo_participantes || '∞'}
                      </strong>
                      <br />
                      <small style={{ color: 'var(--app-text-muted)' }}>
                        máx.
                      </small>
                    </td>
                    <td className="text-center">
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <Link to={`/organizer/events/${event.id_evento}/edit`} className="action-btn action-btn--edit">
                          Editar
                        </Link>
                        <Link to={`/organizer/events/${event.id_evento}`} className="action-btn action-btn--view">
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizerEventsPage;