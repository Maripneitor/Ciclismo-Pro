import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import Spinner from '../../components/Spinner';
import './OrganizerCommon.css'; // Asegúrate de que esto esté importado en el Layout o aquí

function OrganizerEventDetailPage() {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingInscription, setUpdatingInscription] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError('');
        const [eventResponse, participantsResponse] = await Promise.all([
          apiClient.get(`/eventos/${id}`),
          apiClient.get(`/organizer/my-events/${id}/participants`)
        ]);
        setEventDetails(eventResponse.data.data);
        setParticipants(participantsResponse.data.data.participants || []);
      } catch (error) {
        console.error('Error fetching event data:', error);
        setError(error.response?.data?.message || 'Error al cargar los datos del evento');
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleUpdateStatus = async (inscriptionId, newStatus) => {
    try {
      setUpdatingInscription(inscriptionId);
      const response = await apiClient.put(
        `/admin/inscripciones/${inscriptionId}/status`,
        { estado: newStatus }
      );
      if (response.data.success) {
        setParticipants(prevParticipants =>
          prevParticipants.map(participant =>
            participant.id_inscripcion === inscriptionId
              ? { ...participant, estado: newStatus }
              : participant
          )
        );
      }
    } catch (error) {
      console.error('Error updating inscription status:', error);
      alert(error.response?.data?.message || 'Error al actualizar el estado');
    } finally {
      setUpdatingInscription(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmada': return 'status-active';
      case 'pendiente': return 'status-pending';
      case 'cancelada': return 'status-inactive';
      case 'completada': return 'status-completed';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmada': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      case 'completada': return 'Completada';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="organizer-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Cargando evento...</h2>
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
          <Link to="/organizer/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Volver a Mis Eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="organizer-page">
      <div className="admin-header">
        <div className="header-content">
          <h1 className="page-title">Gestión de: {eventDetails?.nombre}</h1>
          <p className="page-subtitle">
            Detalles del evento y lista de participantes inscritos
          </p>
        </div>
        <div className="header-actions">
          <Link to="/organizer/events" className="btn btn-outline">
            ← Volver a Mis Eventos
          </Link>
        </div>
      </div>

      {/* Información del Evento */}
      {eventDetails && (
        <div className="content-section" style={{ marginBottom: '2rem' }}>
          <h3 className="section-title">Información del Evento</h3>
          <div className="grid grid-3 gap-4">
            <div>
              <p className="mb-1"><strong>Descripción:</strong></p>
              <p className="text-muted">{eventDetails.descripcion || 'Sin descripción'}</p>
            </div>
            <div>
              <p className="mb-1"><strong>Fecha de inicio:</strong></p>
              <p className="text-muted">{formatDate(eventDetails.fecha_inicio)}</p>
            </div>
            <div>
              <p className="mb-1"><strong>Ubicación:</strong></p>
              <p className="text-muted">{eventDetails.ubicacion}</p>
            </div>
            <div>
              <p className="mb-1"><strong>Distancia:</strong></p>
              <p className="text-muted">{eventDetails.distancia_km} km</p>
            </div>
            <div>
              <p className="mb-1"><strong>Dificultad:</strong></p>
              <p className="text-muted">{eventDetails.dificultad}</p>
            </div>
            <div>
              <p className="mb-1"><strong>Estado:</strong></p>
              <p>
                <span className={`status-badge ${getStatusClass(eventDetails.estado)}`}>
                  {getStatusText(eventDetails.estado)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Participantes */}
      <div className="admin-table-container">
        <div className="table-header">
          <div className="table-header-content">
            <h2 className="table-title">Participantes Inscritos</h2>
            <p className="table-subtitle">Total: {participants.length} participantes</p>
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="empty-state" style={{ boxShadow: 'none', border: 'none' }}>
            <div className="empty-icon">👥</div>
            <h3 className="empty-title">No hay participantes inscritos aún</h3>
            <p className="empty-description">Los participantes aparecerán aquí una vez que se inscriban.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Dorsal</th>
                  <th>Alias</th>
                  <th>Fecha Inscripción</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '500' }}>{participant.nombre_completo}</td>
                    <td>{participant.correo_electronico}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(participant.estado)}`}>
                        {getStatusText(participant.estado)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{participant.numero_dorsal || '-'}</td>
                    <td>{participant.alias_dorsal || '-'}</td>
                    <td style={{ fontSize: '0.9rem' }}>{formatDate(participant.fecha_inscripcion)}</td>
                    <td className="text-center">
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        
                        {participant.estado === 'pendiente' && (
                          <button
                            onClick={() => handleUpdateStatus(participant.id_inscripcion, 'confirmada')}
                            disabled={updatingInscription === participant.id_inscripcion}
                            className="action-btn"
                            style={{ backgroundColor: 'var(--app-text-success)' }}
                          >
                            {updatingInscription === participant.id_inscripcion ? <Spinner/> : 'Confirmar'}
                          </button>
                        )}
                        
                        {participant.estado === 'confirmada' && (
                          <button
                            onClick={() => handleUpdateStatus(participant.id_inscripcion, 'cancelada')}
                            disabled={updatingInscription === participant.id_inscripcion}
                            className="action-btn"
                            style={{ backgroundColor: 'var(--app-text-error)' }}
                          >
                            {updatingInscription === participant.id_inscripcion ? <Spinner/> : 'Cancelar'}
                          </button>
                        )}
                        
                        {participant.estado === 'cancelada' && (
                          <button
                            onClick={() => handleUpdateStatus(participant.id_inscripcion, 'pendiente')}
                            disabled={updatingInscription === participant.id_inscripcion}
                            className="action-btn"
                            style={{ backgroundColor: 'var(--app-text-warning)', color: 'var(--app-text-primary)' }}
                          >
                            {updatingInscription === participant.id_inscripcion ? <Spinner/> : 'Reactivar'}
                          </button>
                        )}
                        
                        {participant.estado === 'completada' && (
                          <span style={{ fontStyle: 'italic', fontSize: '0.875rem' }}>
                            Completada
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerEventDetailPage;