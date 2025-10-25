import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div style={{ border: '1px solid #ccc', padding: '2rem', margin: '1rem 0' }}>
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