import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';

function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'proximo': return 'var(--success)';
      case 'activo': return 'var(--primary-500)';
      case 'finalizado': return 'var(--neutral-500)';
      case 'cancelado': return 'var(--error)';
      default: return 'var(--neutral-400)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'proximo': return 'Próximo';
      case 'activo': return 'Activo';
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
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando eventos...</h2>
        <p>Obteniendo tus eventos creados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--error)' }}>Error</h2>
        <p>{error}</p>
        <Link to="/organizer/dashboard">
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}>
            Volver al Dashboard
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
          <h1>Mis Eventos Creados</h1>
          <p style={{ color: 'var(--neutral-600)' }}>
            Gestiona todos los eventos que has creado como organizador
          </p>
        </div>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--primary-500)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + Crear Nuevo Evento
        </button>
      </div>

      {events.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          border: '2px dashed var(--neutral-300)', 
          borderRadius: '8px',
          backgroundColor: 'var(--neutral-50)'
        }}>
          <h3 style={{ color: 'var(--neutral-600)', marginBottom: '1rem' }}>
            No has creado ningún evento aún
          </h3>
          <p style={{ color: 'var(--neutral-500)', marginBottom: '2rem' }}>
            Comienza creando tu primer evento para organizar carreras
          </p>
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Crear Mi Primer Evento
          </button>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid var(--neutral-200)',
          overflow: 'hidden'
        }}>
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
                  Evento
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
                  Fecha
                </th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: 'var(--neutral-700)'
                }}>
                  Ubicación
                </th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: 'var(--neutral-700)'
                }}>
                  Participantes
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
              {events.map((event) => (
                <tr 
                  key={event.id_evento}
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
                  <td style={{ padding: '1rem' }}>
                    <div>
                      {/* ACTUALIZADO: Convertir nombre en Link */}
                      <Link 
                        to={`/organizer/events/${event.id_evento}`}
                        style={{ 
                          color: 'var(--neutral-800)',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          display: 'block',
                          marginBottom: '0.25rem'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = 'var(--primary-500)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = 'var(--neutral-800)';
                        }}
                      >
                        {event.nombre}
                      </Link>
                      {event.descripcion && (
                        <small style={{ 
                          color: 'var(--neutral-500)',
                          display: 'block',
                          lineHeight: '1.4'
                        }}>
                          {event.descripcion.length > 80 
                            ? `${event.descripcion.substring(0, 80)}...` 
                            : event.descripcion
                          }
                        </small>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(event.estado),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {getStatusText(event.estado)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ color: 'var(--neutral-800)', fontWeight: '500' }}>
                        {formatDate(event.fecha_inicio)}
                      </div>
                      {event.fecha_fin && (
                        <small style={{ color: 'var(--neutral-500)' }}>
                          al {formatDate(event.fecha_fin)}
                        </small>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--neutral-700)' }}>
                    {event.ubicacion}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        color: 'var(--neutral-800)', 
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {event.maximo_participantes || '∞'}
                      </div>
                      <small style={{ color: 'var(--neutral-500)' }}>
                        máx.
                      </small>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      justifyContent: 'center' 
                    }}>
                      <button style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: 'var(--primary-500)',
                        border: '1px solid var(--primary-500)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        Editar
                      </button>
                      <Link to={`/organizer/events/${event.id_evento}`}>
                        <button style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--primary-500)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}>
                          Ver
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resumen de estadísticas */}
      {events.length > 0 && (
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
              {events.length}
            </h3>
            <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Total Eventos</p>
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
              {events.filter(e => e.estado === 'proximo').length}
            </h3>
            <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Próximos</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--neutral-200)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: 'var(--neutral-500)', 
              margin: '0 0 0.5rem 0',
              fontSize: '2rem'
            }}>
              {events.filter(e => e.estado === 'finalizado').length}
            </h3>
            <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Finalizados</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizerEventsPage;