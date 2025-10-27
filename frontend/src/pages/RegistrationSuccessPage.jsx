import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';

function RegistrationSuccessPage() {
  const { id_evento } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiClient.get(`/eventos/${id_evento}`);
        setEvent(response.data.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Error al cargar los detalles del evento');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id_evento]);

  // Función para formatear fechas para Google Calendar
  const formatDateForGoogle = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  // Construir URL para Google Calendar
  const getGoogleCalendarUrl = () => {
    if (!event) return '#';
    
    const startDate = formatDateForGoogle(event.fecha_inicio);
    const endDate = event.fecha_fin ? formatDateForGoogle(event.fecha_fin) : formatDateForGoogle(event.fecha_inicio);
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.nombre,
      dates: `${startDate}/${endDate}`,
      details: event.descripcion || 'Evento de ciclismo',
      location: event.ubicacion || ''
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Cargando...</h2>
          <p>Preparando tu confirmación de inscripción.</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ color: 'var(--error)' }}>Error</h2>
          <p>{error || 'No se pudieron cargar los detalles del evento'}</p>
          <Link to="/dashboard/inscripciones" className="btn btn-primary">
            Ir a Mis Inscripciones
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        textAlign: 'center',
        padding: '3rem 2rem'
      }}>
        {/* Icono de éxito */}
        <div style={{ 
          fontSize: '6rem', 
          marginBottom: '2rem',
          color: 'var(--color-success)'
        }}>
          ✅
        </div>

        {/* Título principal */}
        <h1 className="event-title" style={{ 
          color: 'var(--color-success)',
          marginBottom: '1.5rem'
        }}>
          ¡Inscripción Exitosa!
        </h1>

        {/* Mensaje de confirmación */}
        <p style={{ 
          fontSize: '1.2rem',
          color: 'var(--color-gray-medium)',
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          Te has inscrito correctamente al evento. ¡Prepárate para una gran experiencia ciclista!
        </p>

        {/* Detalles del evento */}
        <div style={{ 
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-gray-light)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'left'
        }}>
          <h2 style={{ 
            color: 'var(--color-secondary)',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontFamily: 'var(--font-primary)'
          }}>
            {event.nombre}
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>📅 Fecha y Hora</h3>
              <p style={{ margin: 0, color: 'var(--color-gray-medium)' }}>
                {formatDate(event.fecha_inicio)}
                {event.fecha_fin && (
                  <><br />Hasta: {formatDate(event.fecha_fin)}</>
                )}
              </p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>📍 Ubicación</h3>
              <p style={{ margin: 0, color: 'var(--color-gray-medium)' }}>
                {event.ubicacion}
              </p>
            </div>

            {event.distancia_km && (
              <div>
                <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>🏁 Distancia</h3>
                <p style={{ margin: 0, color: 'var(--color-gray-medium)' }}>
                  {event.distancia_km} km
                </p>
              </div>
            )}

            {event.dificultad && (
              <div>
                <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>⚡ Dificultad</h3>
                <p style={{ margin: 0, color: 'var(--color-gray-medium)' }}>
                  {event.dificultad}
                </p>
              </div>
            )}
          </div>

          {event.descripcion && (
            <div>
              <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>📝 Descripción</h3>
              <p style={{ margin: 0, color: 'var(--color-gray-medium)', lineHeight: '1.6' }}>
                {event.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {/* Google Calendar */}
          <a 
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            📅 Añadir a Google Calendar
          </a>

          {/* iCal/Outlook (Placeholder) */}
          <a 
            href="#" 
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              alert('Funcionalidad de iCal/Outlook en desarrollo');
            }}
          >
            📋 Añadir a iCal/Outlook
          </a>
        </div>

        {/* Botón para ir a inscripciones */}
        <div>
          <Link to="/dashboard/inscripciones" className="btn btn-primary">
            🗂️ Ir a Mis Inscripciones
          </Link>
        </div>

        {/* Información adicional */}
        <div style={{ 
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-gray-light)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: '0.9rem',
          color: 'var(--color-gray-medium)'
        }}>
          <p style={{ margin: 0 }}>
            <strong>💡 Recordatorio:</strong> Recibirás un email de confirmación con todos los detalles del evento. 
            No olvides revisar tu equipamiento y llegar con tiempo el día del evento.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSuccessPage;