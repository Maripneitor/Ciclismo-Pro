import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Tabs from '../components/ui/Tabs';
import EventMap from '../components/ui/EventMap';
import './EventDetailPage.css';

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const mapPosition = [9.8585, -98.4745];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/eventos/${id}`);
        setEvent(response.data.data);
      } catch (error) {
        setError('Evento no encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsStickyBarVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="event-detail-page bg-light">
      {/* ========== EVENT HERO ========== */}
      <section className="event-hero-premium relative overflow-hidden bg-dark text-white py-5">
        <div className="container relative z-10 py-5">
          <div className="flex flex-column gap-2 mb-4 animate-fadeIn">
            <span className="badge bg-primary-alpha text-primary self-start px-4">{event.estado}</span>
            <h1 className="display-1 text-white mb-0">{event.nombre}</h1>
            <p className="h4 text-gray-400 font-normal">
              📍 {event.ubicacion} • 📅 {new Date(event.fecha_inicio).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-5 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex align-center gap-2 bg-white-alpha-10 p-3 rounded-md border-white-alpha-10 backdrop-blur">
              <span className="text-2xl">🏁</span>
              <div className="flex flex-column">
                <span className="caption text-gray-400 uppercase font-bold text-xs">Distancia</span>
                <span className="font-bold">{event.distancia_km} km</span>
              </div>
            </div>
            <div className="flex align-center gap-2 bg-white-alpha-10 p-3 rounded-md border-white-alpha-10 backdrop-blur">
              <span className="text-2xl">⚡</span>
              <div className="flex flex-column">
                <span className="caption text-gray-400 uppercase font-bold text-xs">Dificultad</span>
                <span className="font-bold">{event.dificultad}</span>
              </div>
            </div>
            <div className="flex align-center gap-2 bg-white-alpha-10 p-3 rounded-md border-white-alpha-10 backdrop-blur">
              <span className="text-2xl">👥</span>
              <div className="flex flex-column">
                <span className="caption text-gray-400 uppercase font-bold text-xs">Cupos</span>
                <span className="font-bold">{event.maximo_participantes}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-overlay-gradient"></div>
      </section>

      {/* ========== STICKY NAV/CTA ========== */}
      <div className={`sticky-cta-bar ${isStickyBarVisible ? 'is-visible' : ''} bg-white shadow-lg border-bottom`}>
        <div className="container flex justify-between align-center py-2">
          <div className="flex align-center gap-3">
            <h4 className="mb-0 font-bold hidden-mobile">{event.nombre}</h4>
            <span className="price-label text-primary">{formatCurrency(event.cuota_inscripcion)}</span>
          </div>
          {isAuthenticated ? (
            <Link to={`/eventos/${id}/register`} className="btn btn-primary px-5">Inscribirme</Link>
          ) : (
            <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
          )}
        </div>
      </div>

      <div className="container py-5">
        <div className="grid grid-dashboard gap-5">
          {/* Main Content */}
          <div className="flex flex-column gap-5">
            <div className="card shadow-sm p-0 overflow-hidden">
              <Tabs variant="premium">
                <div label="Descripción" className="p-5">
                  <h2 className="h3 mb-4">Sobre esta carrera</h2>
                  <div className="text-gray-600 line-height-relaxed mb-5">
                    {event.descripcion || (
                      <p>
                        Prepárate para una experiencia inigualable. Esta ruta ha sido diseñada 
                        para desafiar hasta a los ciclistas más experimentados, ofreciendo 
                        vistas espectaculares y un entorno competitivo pero amigable.
                      </p>
                    )}
                  </div>
                  
                  <h3 className="h4 mb-4">Información de la Ruta</h3>
                  <div className="grid grid-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <span className="font-bold block mb-1">🏁 Inicio:</span>
                      <span className="text-gray-600">{formatDate(event.fecha_inicio)}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <span className="font-bold block mb-1">📍 Punto de Encuentro:</span>
                      <span className="text-gray-600">{event.ubicacion}</span>
                    </div>
                  </div>
                </div>

                <div label="Mapa y Ruta" className="p-0">
                  <EventMap position={mapPosition} />
                </div>

                <div label="Categorías" className="p-5">
                   <h2 className="h3 mb-4">Categorías Disponibles</h2>
                   <p className="text-gray-500 mb-4">Selecciona tu categoría al momento de inscribirte.</p>
                   {/* Aquí se podrían mapear categorías reales si existieran en el estado */}
                   <div className="flex flex-column gap-3">
                     <div className="flex justify-between align-center p-3 border rounded-md">
                       <span className="font-bold">Elite Masculino/Femenino</span>
                       <span className="badge bg-dark text-white text-xs">Avanzado</span>
                     </div>
                     <div className="flex justify-between align-center p-3 border rounded-md">
                       <span className="font-bold">Master A/B/C</span>
                       <span className="badge bg-gray-200 text-gray-700 text-xs">Intermedio</span>
                     </div>
                   </div>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-column gap-4">
            <div className="card shadow-xl border-primary-alpha-20 bg-white p-5 sticky-top-offset">
              <div className="flex flex-column align-center text-center gap-3">
                <span className="caption uppercase font-bold text-gray-400">Total Inscripción</span>
                <span className="display-2 font-black text-secondary leading-none">
                  {formatCurrency(event.cuota_inscripcion)}
                </span>
                <p className="text-sm text-gray-500 mb-4">
                  Incluye kit de competidor, seguro médico y medalla de finalista.
                </p>
                {isAuthenticated ? (
                  <Link to={`/eventos/${id}/register`} className="btn btn-primary w-full py-3">
                    Inscribirme Ahora
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-secondary w-full py-3">
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>

            <div className="card shadow-sm p-4">
              <h4 className="h5 mb-3">Detalles Técnicos</h4>
              <ul className="list-none flex flex-column gap-3 p-0 m-0">
                <li className="flex justify-between text-sm py-2 border-bottom">
                  <span className="text-gray-500">Elevación:</span>
                  <span className="font-bold">{event.elevacion_total || '450m'}</span>
                </li>
                <li className="flex justify-between text-sm py-2 border-bottom">
                  <span className="text-gray-500">Superficie:</span>
                  <span className="font-bold">Asfalto / Mixto</span>
                </li>
                <li className="flex justify-between text-sm py-2 border-bottom">
                  <span className="text-gray-500">Hidratación:</span>
                  <span className="font-bold">3 Puntos</span>
                </li>
              </ul>
            </div>

            <div className="card shadow-sm p-4 bg-dark text-white">
              <h4 className="h5 mb-3 text-white">Organiza</h4>
              <div className="flex align-center gap-3">
                <div className="stat-icon-small bg-primary rounded-full p-2 flex flex-center">
                  🚲
                </div>
                <div className="flex flex-column">
                  <span className="font-bold">Ciclismo-Pro Team</span>
                  <span className="text-xs text-gray-400">Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
