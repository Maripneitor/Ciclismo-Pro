import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/api';

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
        
        // Hacer ambas peticiones en paralelo
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
        `/api/admin/inscripciones/${inscriptionId}/status`,
        { estado: newStatus }
      );

      if (response.data.success) {
        // Actualizar el estado local del participante
        setParticipants(prevParticipants =>
          prevParticipants.map(participant =>
            participant.id_inscripcion === inscriptionId
              ? { ...participant, estado: newStatus }
              : participant
          )
        );
        
        console.log(`Estado actualizado a: ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating inscription status:', error);
      alert(error.response?.data?.message || 'Error al actualizar el estado');
    } finally {
      setUpdatingInscription(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada': return 'var(--success)';
      case 'pendiente': return 'var(--warning)';
      case 'cancelada': return 'var(--error)';
      case 'completada': return 'var(--primary-500)';
      default: return 'var(--neutral-400)';
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando evento...</h2>
        <p>Obteniendo detalles y lista de participantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--error)' }}>Error</h2>
        <p>{error}</p>
        <Link to="/organizer/events">
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}>
            Volver a Mis Eventos
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1>Gestión de: {eventDetails?.nombre}</h1>
          <p style={{ color: 'var(--neutral-600)' }}>
            Detalles del evento y lista de participantes inscritos
          </p>
        </div>
        <Link to="/organizer/events">
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--primary-500)',
            border: '1px solid var(--primary-500)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            ← Volver a Mis Eventos
          </button>
        </Link>
      </div>

      {/* Información del Evento */}
      {eventDetails && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid var(--neutral-200)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: 'var(--primary-600)', marginBottom: '1rem' }}>Información del Evento</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem' 
          }}>
            <div>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Descripción:</strong> {eventDetails.descripcion || 'Sin descripción'}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Fecha de inicio:</strong> {formatDate(eventDetails.fecha_inicio)}
              </p>
              {eventDetails.fecha_fin && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Fecha de fin:</strong> {formatDate(eventDetails.fecha_fin)}
                </p>
              )}
            </div>
            <div>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Ubicación:</strong> {eventDetails.ubicacion}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Distancia:</strong> {eventDetails.distancia_km} km
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Dificultad:</strong> {eventDetails.dificultad}
              </p>
            </div>
            <div>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Estado:</strong> 
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: getStatusColor(eventDetails.estado),
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {getStatusText(eventDetails.estado)}
                </span>
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Máximo participantes:</strong> {eventDetails.maximo_participantes || '∞'}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Tipo:</strong> {eventDetails.tipo}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Participantes */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        border: '1px solid var(--neutral-200)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '1.5rem',
          borderBottom: '1px solid var(--neutral-200)',
          backgroundColor: 'var(--neutral-50)'
        }}>
          <h2 style={{ margin: 0, color: 'var(--neutral-800)' }}>Participantes Inscritos</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--neutral-600)' }}>
            Total: {participants.length} participantes
          </p>
        </div>

        {participants.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            color: 'var(--neutral-500)'
          }}>
            <h3>No hay participantes inscritos aún</h3>
            <p>Los participantes aparecerán aquí una vez que se inscriban en el evento.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse' 
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: 'var(--neutral-50)',
                  borderBottom: '1px solid var(--neutral-200)'
                }}>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    Nombre Completo
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    Email
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    Estado
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    Número Dorsal
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    Alias Dorsal
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    Fecha Inscripción
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr 
                    key={index}
                    style={{ 
                      borderBottom: '1px solid var(--neutral-100)',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '1rem', color: 'var(--neutral-800)', fontWeight: '500' }}>
                      {participant.nombre_completo}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--neutral-700)' }}>
                      {participant.correo_electronico}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getStatusColor(participant.estado),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {getStatusText(participant.estado)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--neutral-800)', fontWeight: 'bold' }}>
                      {participant.numero_dorsal || '-'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--neutral-700)' }}>
                      {participant.alias_dorsal || '-'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--neutral-600)' }}>
                      {formatDate(participant.fecha_inscripcion)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        justifyContent: 'center' 
                      }}>
                        {/* Botón Confirmar para inscripciones pendientes */}
                        {participant.estado === 'pendiente' && (
                          <button 
                            onClick={() => handleUpdateStatus(participant.id_inscripcion, 'confirmada')}
                            disabled={updatingInscription === participant.id_inscripcion}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: updatingInscription === participant.id_inscripcion ? 'var(--neutral-400)' : 'var(--success)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updatingInscription === participant.id_inscripcion ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {updatingInscription === participant.id_inscripcion ? '...' : 'Confirmar'}
                          </button>
                        )}
                        
                        {/* Botón Cancelar para inscripciones confirmadas */}
                        {participant.estado === 'confirmada' && (
                          <button 
                            onClick={() => handleUpdateStatus(participant.id_inscripcion, 'cancelada')}
                            disabled={updatingInscription === participant.id_inscripcion}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: updatingInscription === participant.id_inscripcion ? 'var(--neutral-400)' : 'var(--error)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updatingInscription === participant.id_inscripcion ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {updatingInscription === participant.id_inscripcion ? '...' : 'Cancelar'}
                          </button>
                        )}
                        
                        {/* Botón Reactivar para inscripciones canceladas */}
                        {participant.estado === 'cancelada' && (
                          <button 
                            onClick={() => handleUpdateStatus(participant.id_inscripcion, 'pendiente')}
                            disabled={updatingInscription === participant.id_inscripcion}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: updatingInscription === participant.id_inscripcion ? 'var(--neutral-400)' : 'var(--warning)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updatingInscription === participant.id_inscripcion ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {updatingInscription === participant.id_inscripcion ? '...' : 'Reactivar'}
                          </button>
                        )}
                        
                        {/* Estado completado - sin acciones */}
                        {participant.estado === 'completada' && (
                          <span style={{
                            padding: '0.5rem 1rem',
                            color: 'var(--neutral-500)',
                            fontSize: '0.875rem',
                            fontStyle: 'italic'
                          }}>
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

      {/* Resumen de estadísticas de participantes */}
      {participants.length > 0 && (
        <div style={{ 
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--neutral-200)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: 'var(--primary-600)', 
              margin: '0 0 0.5rem 0',
              fontSize: '2rem'
            }}>
              {participants.length}
            </h3>
            <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Total Inscritos</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--neutral-200)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: 'var(--success)', 
              margin: '0 0 0.5rem 0',
              fontSize: '2rem'
            }}>
              {participants.filter(p => p.estado === 'confirmada').length}
            </h3>
            <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Confirmados</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--neutral-200)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: 'var(--warning)', 
              margin: '0 0 0.5rem 0',
              fontSize: '2rem'
            }}>
              {participants.filter(p => p.estado === 'pendiente').length}
            </h3>
            <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Pendientes</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--neutral-200)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: 'var(--error)', 
              margin: '0 0 0.5rem 0',
              fontSize: '2rem'
            }}>
              {participants.filter(p => p.estado === 'cancelada').length}
            </h3>
            <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Cancelados</p>
          </div>
        </div>
      )}

      {/* Leyenda de estados */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--neutral-50)',
        borderRadius: '8px',
        border: '1px solid var(--neutral-200)'
      }}>
        <h4 style={{ marginBottom: '0.5rem', color: 'var(--neutral-700)' }}>Leyenda de Estados:</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--warning)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.875rem' }}>Pendiente - Esperando confirmación</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--success)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.875rem' }}>Confirmada - Participante activo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--error)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.875rem' }}>Cancelada - Inscripción anulada</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerEventDetailPage;