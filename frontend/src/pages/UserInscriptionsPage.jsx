import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

function UserInscriptionsPage() {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        const response = await apiClient.get('/inscripciones/mis-inscripciones');
        setInscriptions(response.data.data);
      } catch (error) {
        console.error('Error fetching inscriptions:', error);
        setError('Error al cargar las inscripciones');
      } finally {
        setLoading(false);
      }
    };

    fetchInscriptions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada': return 'green';
      case 'pendiente': return 'orange';
      case 'cancelada': return 'red';
      case 'completada': return 'blue';
      default: return 'gray';
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="container"><p>Cargando inscripciones...</p></div>;
  if (error) return <div className="container"><p>{error}</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Mis Inscripciones</h1>
        <Link to="/dashboard" style={{ color: 'var(--primary-500)' }}>
          ← Volver al Dashboard
        </Link>
      </div>

      {inscriptions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          border: '2px dashed #ccc', 
          borderRadius: '8px',
          backgroundColor: 'var(--neutral-50)'
        }}>
          <h3>No tienes inscripciones aún</h3>
          <p>¡Explora nuestros eventos y participa!</p>
          <Link to="/eventos">
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Ver Eventos Disponibles
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {inscriptions.map(inscription => (
            <div key={inscription.id_inscripcion} style={{
              border: '1px solid #ccc',
              padding: '1.5rem',
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {/* Header con nombre del evento y estado */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--primary-600)' }}>
                    {inscription.nombre}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--neutral-600)' }}>
                    {new Date(inscription.fecha_inicio).toLocaleDateString()} • {inscription.ubicacion}
                  </p>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: getStatusColor(inscription.estado),
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {inscription.estado.toUpperCase()}
                </span>
              </div>

              {/* Información del evento */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Distancia:</strong> {inscription.distancia_km} km
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Dificultad:</strong> {inscription.dificultad}
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Tipo:</strong> {inscription.tipo}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Estado del evento:</strong> {inscription.estado_evento}
                  </p>
                  {inscription.numero_dorsal && (
                    <p style={{ margin: '0.5rem 0' }}>
                      <strong>Número de dorsal:</strong> {inscription.numero_dorsal}
                    </p>
                  )}
                  {inscription.alias_dorsal && (
                    <p style={{ margin: '0.5rem 0' }}>
                      <strong>Alias dorsal:</strong> {inscription.alias_dorsal}
                    </p>
                  )}
                </div>
              </div>

              {/* Información personal de la inscripción */}
              {(inscription.genero || inscription.fecha_nacimiento || inscription.nombre_contacto_emergencia) && (
                <div style={{ padding: '1rem', backgroundColor: 'var(--neutral-50)', borderRadius: '4px', marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Datos de Inscripción</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {inscription.genero && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Género:</strong> {inscription.genero}
                      </p>
                    )}
                    {inscription.fecha_nacimiento && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Fecha nacimiento:</strong> {new Date(inscription.fecha_nacimiento).toLocaleDateString()}
                      </p>
                    )}
                    {inscription.nombre_contacto_emergencia && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Contacto emergencia:</strong> {inscription.nombre_contacto_emergencia}
                      </p>
                    )}
                    {inscription.telefono_contacto_emergencia && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Teléfono emergencia:</strong> {inscription.telefono_contacto_emergencia}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Resultados de la carrera (si existen) */}
              {(inscription.tiempo_total || inscription.posicion_general || inscription.distancia_completada) && (
                <div style={{ padding: '1rem', backgroundColor: 'var(--primary-50)', borderRadius: '4px', marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Resultados</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                    {inscription.tiempo_total && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Tiempo total:</strong> {formatTime(inscription.tiempo_total)}
                      </p>
                    )}
                    {inscription.posicion_general && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Posición general:</strong> #{inscription.posicion_general}
                      </p>
                    )}
                    {inscription.posicion_categoria && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Posición categoría:</strong> #{inscription.posicion_categoria}
                      </p>
                    )}
                    {inscription.distancia_completada && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Distancia completada:</strong> {inscription.distancia_completada} km
                      </p>
                    )}
                    {inscription.ritmo_promedio && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Ritmo promedio:</strong> {inscription.ritmo_promedio} min/km
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Información de seguimiento GPS */}
              {inscription.ultima_actualizacion_gps && (
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--warning-50)', borderRadius: '4px', marginBottom: '1rem' }}>
                  <p style={{ margin: '0', fontSize: '0.875rem' }}>
                    <strong>Última actualización GPS:</strong> {new Date(inscription.ultima_actualizacion_gps).toLocaleString()}
                  </p>
                  {inscription.modo_emergencia_activado && (
                    <p style={{ margin: '0.25rem 0 0 0', color: 'red', fontWeight: 'bold' }}>
                      ⚠️ MODO EMERGENCIA ACTIVADO
                    </p>
                  )}
                </div>
              )}

              {/* Footer con información de la inscripción */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: 'var(--neutral-500)' }}>
                  Inscrito el: {new Date(inscription.fecha_inscripcion).toLocaleDateString()}
                </small>
                {inscription.url_identificacion && (
                  <a 
                    href={inscription.url_identificacion} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.875rem', color: 'var(--primary-500)' }}
                  >
                    Ver identificación ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserInscriptionsPage;