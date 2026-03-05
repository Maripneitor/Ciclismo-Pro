import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { 
  FiChevronLeft, 
  FiActivity, 
  FiMapPin, 
  FiCalendar, 
  FiClock,
  FiExternalLink,
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi';

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

  const formatTime = (seconds) => {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmada': return <span className="badge bg-success-alpha text-success">Confirmada</span>;
      case 'pendiente': return <span className="badge bg-warning-alpha text-warning">Pendiente</span>;
      case 'cancelada': return <span className="badge bg-error-alpha text-error">Cancelada</span>;
      default: return <span className="badge bg-gray-100 text-muted">{status}</span>;
    }
  };

  if (loading) return (
    <div className="flex flex-center py-5 min-h-200">
      <div className="loading-spinner"></div>
    </div>
  );

  if (error) return (
    <div className="card bg-error-alpha p-5 text-center">
      <FiInfo className="text-error mb-3" size={32} />
      <p className="text-error mb-0">{error}</p>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between align-center mb-5">
        <div className="flex flex-column gap-1">
          <h1 className="h2 mb-0">Mis Inscripciones</h1>
          <p className="text-muted text-sm">Gestiona tus participaciones en eventos y consulta tus resultados.</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline btn-small flex align-center gap-1">
          <FiChevronLeft /> Volver
        </Link>
      </div>

      {inscriptions.length === 0 ? (
        <div className="card p-5 text-center bg-card shadow-sm border-dashed">
          <div className="text-primary opacity-20 mb-4"><FiActivity size={64} /></div>
          <h3 className="h4 mb-2">Aún no tienes inscripciones</h3>
          <p className="text-muted mb-4">¿Qué esperas para unirte a tu próxima aventura?</p>
          <Link to="/eventos" className="btn btn-primary">
            Explorar Eventos
          </Link>
        </div>
      ) : (
        <div className="grid grid-1 gap-4">
          {inscriptions.map(inscription => (
            <div key={inscription.id_inscripcion} className="card shadow-sm p-4 bg-card hover-lift">
              <div className="flex justify-between align-start mb-4">
                <div className="flex flex-column gap-1">
                  <h3 className="h4 mb-0 text-main">{inscription.nombre}</h3>
                  <div className="flex align-center gap-3 text-xs text-muted font-bold uppercase letter-spacing-wide">
                    <span className="flex align-center gap-1"><FiCalendar /> {new Date(inscription.fecha_inicio).toLocaleDateString()}</span>
                    <span className="flex align-center gap-1"><FiMapPin /> {inscription.ubicacion}</span>
                  </div>
                </div>
                {getStatusBadge(inscription.status || inscription.estado)}
              </div>

              <div className="grid grid-3 gap-4 py-3 border-top border-bottom border-color mb-4">
                <div className="flex flex-column">
                  <span className="caption text-muted font-bold text-xs uppercase">Distancia</span>
                  <span className="font-bold text-main">{inscription.distancia_km} km</span>
                </div>
                <div className="flex flex-column">
                  <span className="caption text-muted font-bold text-xs uppercase">Dorsal</span>
                  <span className="font-bold text-main">#{inscription.numero_dorsal || 'TBD'}</span>
                </div>
                <div className="flex flex-column">
                  <span className="caption text-muted font-bold text-xs uppercase">Categoría</span>
                  <span className="font-bold text-main truncate" title={inscription.categoria}>{inscription.categoria || 'N/A'}</span>
                </div>
              </div>

              <div className="flex justify-between align-center">
                 <div className="flex align-center gap-3">
                    <Link to={`/eventos/${inscription.id_evento}`} className="btn btn-text btn-small flex align-center gap-1 p-0">
                      Ver Detalles <FiExternalLink />
                    </Link>
                    {inscription.estado === 'confirmada' && (
                      <span className="text-xs text-success font-bold flex align-center gap-1">
                        <FiCheckCircle /> Confirmado
                      </span>
                    )}
                 </div>
                 {inscription.tiempo_total && (
                   <div className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold flex align-center gap-2">
                     <FiClock /> {formatTime(inscription.tiempo_total)}
                   </div>
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
