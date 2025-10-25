import { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
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
      <h1>Bienvenido a Ciclismo Pro</h1>
      <section>
        <h2>Próximos Eventos</h2>
        {loading ? (
          <p>Cargando eventos...</p>
        ) : (
          <div>
            {events.map(event => (
              <div key={event.id_evento} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
                <h3>{event.nombre}</h3>
                <p><strong>Fecha:</strong> {new Date(event.fecha_inicio).toLocaleDateString()}</p>
                <p><strong>Ubicación:</strong> {event.ubicacion}</p>
                <p><strong>Distancia:</strong> {event.distancia_km} km</p>
                <p><strong>Dificultad:</strong> {event.dificultad}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;