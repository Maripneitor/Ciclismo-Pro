import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import '../admin/AdminCommon.css';

function AdminEventManagementPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get('/admin/events');
        setEvents(response.data.data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const response = await apiClient.put(`/admin/events/${eventId}/status`, {
        nuevoEstado: newStatus
      });
      
      if (response.data.success) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id_evento === eventId
              ? { ...event, estado: newStatus }
              : event
          )
        );
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Error al actualizar el estado del evento');
    }
  };

  const handleFeatureToggle = async (eventId, currentFeaturedStatus) => {
    try {
      const response = await apiClient.put(`/admin/events/${eventId}/feature`, {
        es_destacado: !currentFeaturedStatus
      });
      
      if (response.data.success) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id_evento === eventId
              ? { ...event, es_destacado: !currentFeaturedStatus }
              : event
          )
        );
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Error al actualizar el estado destacado del evento');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'proximo': return 'var(--color-success)';
      case 'activo': return 'var(--color-primary)';
      case 'finalizado': return 'var(--color-info)';
      case 'cancelado': return 'var(--color-error)';
      default: return 'var(--color-gray-medium)';
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* ========== HEADER ========== */}
      <div className="admin-header">
        <div className="header-content">
          <h1 className="page-title">Gestión de Eventos</h1>
          <p className="page-subtitle">
            Administra todos los eventos del sistema
          </p>
        </div>
        <div className="header-actions">
          <Link to="/admin" className="btn btn-outline">
            ← Volver al Panel
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* ========== EVENTS TABLE ========== */}
      <div className="admin-table-container">
        <div className="table-header">
          <h3 className="table-title">Todos los Eventos</h3>
          <p className="table-subtitle">
            {events.length} evento{events.length !== 1 ? 's' : ''} en el sistema
          </p>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3 className="empty-title">No hay eventos</h3>
            <p className="empty-description">
              Los eventos aparecerán aquí una vez que sean creados por los organizadores.
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Organizador</th>
                <th>Fecha</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id_evento}>
                  <td>
                    <div>
                      <strong style={{ color: 'var(--color-secondary)' }}>
                        {event.nombre}
                      </strong>
                      {event.descripcion && (
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: 'var(--color-gray-medium)',
                          marginTop: 'var(--spacing-xs)'
                        }}>
                          {event.descripcion.length > 100 
                            ? `${event.descripcion.substring(0, 100)}...` 
                            : event.descripcion
                          }
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{event.organizador}</td>
                  <td>{formatDate(event.fecha_inicio)}</td>
                  <td>{event.ubicacion}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(event.estado),
                        color: 'var(--color-white)'
                      }}
                    >
                      {event.estado}
                    </span>
                  </td>
                  <td>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={event.es_destacado || false}
                        onChange={() => handleFeatureToggle(event.id_evento, event.es_destacado || false)}
                        className="feature-checkbox"
                      />
                      <span className="checkbox-label">
                        {event.es_destacado ? '⭐ Destacado' : 'Normal'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <select
                        value={event.estado}
                        onChange={(e) => handleStatusChange(event.id_evento, e.target.value)}
                        className="status-select"
                        style={{ 
                          borderColor: getStatusColor(event.estado),
                          color: getStatusColor(event.estado)
                        }}
                      >
                        <option value="proximo">Próximo</option>
                        <option value="activo">Activo</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminEventManagementPage;