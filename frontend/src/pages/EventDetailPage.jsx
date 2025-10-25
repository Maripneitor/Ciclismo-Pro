import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/eventos/${id}`);
        setEvent(response.data.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Evento no encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div className="container"><p>Cargando evento...</p></div>;
  if (error) return <div className="container"><p>{error}</p></div>;
  if (!event) return <div className="container"><p>Evento no encontrado</p></div>;

  return (
    <div className="container">
      <h1>{event.nombre}</h1>
      
      {/* Botón de Inscripción */}
      <div style={{ marginBottom: '2rem' }}>
        {isAuthenticated ? (
          <Link to={`/eventos/${id}/register`}>
            <button style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Inscribirme Ahora
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--secondary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Iniciar Sesión para Inscribirme
            </button>
          </Link>
        )}
      </div>

      <div style={{ border: '1px solid #ccc', padding: '2rem', margin: '1rem 0', borderRadius: '8px', backgroundColor: 'white' }}>
        <p><strong>Descripción:</strong> {event.descripcion}</p>
        <p><strong>Fecha de inicio:</strong> {new Date(event.fecha_inicio).toLocaleString()}</p>
        <p><strong>Fecha de fin:</strong> {event.fecha_fin ? new Date(event.fecha_fin).toLocaleString() : 'No especificada'}</p>
        <p><strong>Límite de inscripción:</strong> {event.fecha_limite_inscripcion ? new Date(event.fecha_limite_inscripcion).toLocaleString() : 'No especificado'}</p>
        <p><strong>Ubicación:</strong> {event.ubicacion}</p>
        <p><strong>Distancia:</strong> {event.distancia_km} km</p>
        <p><strong>Elevación total:</strong> {event.elevacion_total} m</p>
        <p><strong>Dificultad:</strong> {event.dificultad}</p>
        <p><strong>Cuota de inscripción:</strong> ${event.cuota_inscripcion}</p>
        <p><strong>Máximo de participantes:</strong> {event.maximo_participantes}</p>
        <p><strong>Tipo:</strong> {event.tipo}</p>
        <p><strong>Estado:</strong> {event.estado}</p>
      </div>
    </div>
  );
}

export default EventDetailPage;