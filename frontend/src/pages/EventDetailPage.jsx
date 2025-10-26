import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './EventDetailPage.css';

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

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES') || '0'}`;
  };

  if (loading) {
    return (
      <div className="event-loading">
        <div className="loading-spinner"></div>
        <p>Cargando información del evento...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-error">
        <div className="error-icon">🚴‍♂️</div>
        <h3 className="error-title">Evento no encontrado</h3>
        <p>{error || 'El evento que buscas no existe o no está disponible.'}</p>
        <Link to="/eventos" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Volver a Eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      {/* ========== HERO SECTION ========== */}
      <section className="event-hero">
        <div className="hero-content">
          <h1 className="event-title">{event.nombre}</h1>
          
          <div className="event-meta">
            <div className="meta-item">
              📅 {formatDate(event.fecha_inicio)}
            </div>
            <div className="meta-item">
              📍 {event.ubicacion}
            </div>
            <div className="meta-item">
              🏁 {event.distancia_km} km
            </div>
            <div className="meta-item">
              ⚡ {event.dificultad}
            </div>
          </div>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to={`/eventos/${id}/register`} className="btn btn-primary registration-button">
                🚀 Inscribirme Ahora
              </Link>
            ) : (
              <Link to="/login" className="btn btn-secondary registration-button">
                🔐 Iniciar Sesión para Inscribirme
              </Link>
            )}
            <Link to="/eventos" className="btn btn-outline" style={{ 
              backgroundColor: 'transparent', 
              borderColor: 'var(--color-white)', 
              color: 'var(--color-white)' 
            }}>
              ← Volver a Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className="event-content">
        {/* Columna Principal */}
        <div className="main-column">
          {/* Descripción del Evento */}
          <section className="content-section">
            <h2 className="section-title">Sobre este Evento</h2>
            <div className="event-description">
              {event.descripcion || (
                <p>
                  Un emocionante evento de ciclismo que reúne a apasionados de las dos ruedas 
                  para disfrutar de una ruta espectacular. Perfecto para ciclistas de todos 
                  los niveles que buscan desafiar sus límites y disfrutar del paisaje.
                </p>
              )}
            </div>
          </section>

          {/* Detalles de la Ruta */}
          <section className="content-section">
            <h2 className="section-title">Detalles de la Ruta</h2>
            <div className="details-grid">
              <div className="detail-card">
                <span className="detail-icon">📏</span>
                <span className="detail-value">{event.distancia_km} km</span>
                <span className="detail-label">Distancia Total</span>
              </div>
              
              <div className="detail-card">
                <span className="detail-icon">⛰️</span>
                <span className="detail-value">{event.elevacion_total || 'N/A'}</span>
                <span className="detail-label">Elevación (m)</span>
              </div>
              
              <div className="detail-card">
                <span className="detail-icon">⚡</span>
                <span className="detail-value">{event.dificultad}</span>
                <span className="detail-label">Dificultad</span>
              </div>
              
              <div className="detail-card">
                <span className="detail-icon">👥</span>
                <span className="detail-value">{event.maximo_participantes}</span>
                <span className="detail-label">Cupos Totales</span>
              </div>
            </div>
          </section>

          {/* Información Adicional */}
          <section className="content-section">
            <h2 className="section-title">Información Importante</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Tipo de Evento</span>
                <span className="info-value">{event.tipo || 'Competitivo'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado</span>
                <span className="info-value" style={{ 
                  color: event.estado === 'proximo' ? 'var(--color-success)' : 'var(--color-gray-medium)',
                  fontWeight: '600'
                }}>
                  {event.estado}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha de Inicio</span>
                <span className="info-value">{formatDate(event.fecha_inicio)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha de Fin</span>
                <span className="info-value">
                  {event.fecha_fin ? formatDate(event.fecha_fin) : 'No especificada'}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Barra Lateral */}
        <div className="sidebar">
          {/* Tarjeta de Registro */}
          <div className="sidebar-card registration-card">
            <div className="registration-price">
              {formatCurrency(event.cuota_inscripcion)}
            </div>
            <p className="registration-label">Cuota de Inscripción</p>
            
            {isAuthenticated ? (
              <Link to={`/eventos/${id}/register`} className="btn btn-secondary registration-button">
                🚀 Inscribirme Ahora
              </Link>
            ) : (
              <Link to="/login" className="btn btn-secondary registration-button">
                🔐 Iniciar Sesión
              </Link>
            )}
            
            <p className="registration-note">
              Incluye: Dorsal, playera oficial, seguro y kit de participante
            </p>
          </div>

          {/* Información Rápida */}
          <div className="sidebar-card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-secondary)' }}>📋 Información Rápida</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Ubicación</span>
                <span className="info-value">{event.ubicacion}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Distancia</span>
                <span className="info-value">{event.distancia_km} km</span>
              </div>
              <div className="info-item">
                <span className="info-label">Dificultad</span>
                <span className="info-value">{event.dificultad}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Cupos</span>
                <span className="info-value">{event.maximo_participantes}</span>
              </div>
            </div>
          </div>

          {/* Organizador (Placeholder) */}
          <div className="sidebar-card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-secondary)' }}>🎯 Organizador</h3>
            <div className="organizer-info">
              <div className="organizer-avatar">
                🚴
              </div>
              <div className="organizer-details">
                <h4>Ciclismo Pro Team</h4>
                <p>Organizador oficial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;