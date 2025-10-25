import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container">
      <h1>Todos los Eventos</h1>
      {loading ? (
        <p>Cargando eventos...</p>
      ) : (
        <div>
          {events.map(event => (
            <div key={event.id_evento} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
              <h3>
                <Link to={`/eventos/${event.id_evento}`}>
                  {event.nombre}
                </Link>
              </h3>
              <p><strong>Fecha:</strong> {new Date(event.fecha_inicio).toLocaleDateString()}</p>
              <p><strong>Ubicación:</strong> {event.ubicacion}</p>
              <p><strong>Distancia:</strong> {event.distancia_km} km</p>
              <p><strong>Dificultad:</strong> {event.dificultad}</p>
              <p><strong>Cupos disponibles:</strong> {event.maximo_participantes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsListPage;