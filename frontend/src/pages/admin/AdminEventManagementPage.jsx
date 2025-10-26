import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';

function AdminEventManagementPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/events');
        setEvents(response.data.data.events || []);
      } catch (error) {
        console.error('Error fetching all events:', error);
        setError(error.response?.data?.message || 'Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'facil': return 'var(--success)';
      case 'media': return 'var(--warning)';
      case 'dificil': return 'var(--error)';
      case 'extrema': return 'var(--primary-700)';
      default: return 'var(--neutral-500)';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'facil': return 'Fácil';
      case 'media': return 'Media';
      case 'dificil': return 'Difícil';
      case 'extrema': return 'Extrema';
      default: return difficulty;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Gratis';
    return `$${amount.toLocaleString('es-ES')}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando eventos...</h2>
        <p>Obteniendo lista completa de eventos de la plataforma...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--error)' }}>Error</h2>
        <p>{error}</p>
        <Link to="/admin/users">
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}>
            Volver a Gestión de Usuarios
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Gestión de Eventos</h1>
        <p style={{ color: 'var(--neutral-600)' }}>
          Supervisa todos los eventos creados en la plataforma
        </p>
      </div>

      {/* Resumen de estadísticas */}
      <div style={{ 
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--primary-600)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {events.length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Total Eventos</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--success)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {events.filter(e => e.estado === 'proximo').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Próximos</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--primary-500)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {events.filter(e => e.estado === 'activo').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Activos</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--neutral-500)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {events.filter(e => e.estado === 'finalizado').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Finalizados</p>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        border: '1px solid var(--neutral-200)',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          padding: '1.5rem',
          borderBottom: '1px solid var(--neutral-200)',
          backgroundColor: 'var(--neutral-50)'
        }}>
          <h2 style={{ margin: 0, color: 'var(--neutral-800)' }}>Lista de Eventos de la Plataforma</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--neutral-600)' }}>
            Mostrando {events.length} eventos en total
          </p>
        </div>

        {events.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            color: 'var(--neutral-500)'
          }}>
            <h3>No hay eventos creados</h3>
            <p>Los eventos aparecerán aquí una vez que los organizadores los creen.</p>
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
                  borderBottom: '2px solid var(--neutral-200)'
                }}>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Evento
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Organizador
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Estado
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Fecha Inicio
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Ubicación
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Distancia
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Dificultad
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Cuota
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
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
                        <strong style={{ 
                          color: 'var(--neutral-800)',
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontSize: '0.95rem'
                        }}>
                          {event.nombre}
                        </strong>
                        {event.descripcion && (
                          <small style={{ 
                            color: 'var(--neutral-500)',
                            display: 'block',
                            lineHeight: '1.4',
                            fontSize: '0.85rem'
                          }}>
                            {event.descripcion.length > 60 
                              ? `${event.descripcion.substring(0, 60)}...` 
                              : event.descripcion
                            }
                          </small>
                        )}
                        <small style={{ 
                          color: 'var(--neutral-400)',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace'
                        }}>
                          ID: #{event.id_evento}
                        </small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ 
                          color: 'var(--neutral-800)', 
                          fontWeight: '500',
                          fontSize: '0.95rem'
                        }}>
                          {event.organizador}
                        </div>
                        <small style={{ 
                          color: 'var(--neutral-500)',
                          fontSize: '0.8rem'
                        }}>
                          ID: #{event.id_organizador}
                        </small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.4rem 1rem',
                        backgroundColor: getStatusColor(event.estado),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {getStatusText(event.estado)}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      color: 'var(--neutral-700)',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {formatDate(event.fecha_inicio)}
                      {event.fecha_fin && (
                        <div style={{ 
                          fontSize: '0.8rem',
                          color: 'var(--neutral-500)',
                          marginTop: '0.25rem'
                        }}>
                          al {formatDate(event.fecha_fin)}
                        </div>
                      )}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      color: 'var(--neutral-700)',
                      fontSize: '0.9rem'
                    }}>
                      {event.ubicacion || '-'}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      color: 'var(--neutral-800)',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}>
                      {event.distancia_km ? `${event.distancia_km} km` : '-'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {event.dificultad && (
                        <span style={{
                          padding: '0.3rem 0.8rem',
                          backgroundColor: getDifficultyColor(event.dificultad),
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          {getDifficultyText(event.dificultad)}
                        </span>
                      )}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      color: event.cuota_inscripcion ? 'var(--neutral-800)' : 'var(--success)',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {formatCurrency(event.cuota_inscripcion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div style={{ 
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Leyenda de estados */}
        <div style={{ 
          padding: '1.5rem',
          backgroundColor: 'var(--neutral-50)',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)'
        }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Leyenda de Estados:</h4>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--success)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Próximo - Evento programado para el futuro</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--primary-500)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Activo - Evento en curso</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--neutral-500)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Finalizado - Evento completado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--error)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Cancelado - Evento cancelado</span>
            </div>
          </div>
        </div>

        {/* Leyenda de dificultad */}
        <div style={{ 
          padding: '1.5rem',
          backgroundColor: 'var(--neutral-50)',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)'
        }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Leyenda de Dificultad:</h4>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--success)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Fácil - Para principiantes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--warning)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Media - Nivel intermedio</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--error)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Difícil - Para ciclistas experimentados</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--primary-700)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Extrema - Solo expertos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEventManagementPage;