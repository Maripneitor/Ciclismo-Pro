import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Spinner from '../../components/Spinner';
import { FiCalendar, FiUsers, FiDollarSign, FiClock, FiCheck, FiPlus, FiMap, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import './OrganizerCommon.css'; // Importa los estilos comunes

function OrganizerDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(''); // Limpia errores anteriores
        const response = await apiClient.get('/organizer/dashboard-data');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching organizer dashboard:', error);
        setError(error.response?.data?.message || 'Error al cargar el panel de organizador');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getSafeData = () => {
    if (!dashboardData || !dashboardData.data) {
      return {
        user: { id: '', rol: '', nombre: '' },
        stats: {
          totalEvents: 0, upcomingEvents: 0, activeEvents: 0, completedEvents: 0,
          totalParticipants: 0, pendingRegistrations: 0, confirmedParticipants: 0,
          totalRevenue: 0, pendingPayments: 0
        },
        upcomingEvents: [], quickActions: []
      };
    }
    return dashboardData.data;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (error) { return 'Fecha inválida'; }
  };

  if (loading) {
    return (
      <div className="organizer-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Cargando panel de organizador...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organizer-page">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2 className="empty-title text-error">Error al Cargar</h2>
          <p className="empty-description">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const safeData = getSafeData();
  const hasUpcomingEvents = safeData.upcomingEvents && safeData.upcomingEvents.length > 0;
  const hasPendingTasks = safeData.stats.pendingRegistrations > 0 || safeData.stats.pendingPayments > 0;
  const hasQuickActions = safeData.quickActions && safeData.quickActions.length > 0;

  return (
    <div className="organizer-page">
      <div className="admin-header">
        <div className="header-content">
          <h1 className="page-title">Panel de Organizador</h1>
          <p className="page-subtitle">
            Bienvenido, {safeData.user.nombre || 'Organizador'}. Aquí tienes un resumen de tu actividad.
          </p>
        </div>
      </div>

      <div className="admin-grid-view" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', padding: 0 }}>
        <StatCard
          title="Eventos Totales"
          value={safeData.stats.totalEvents}
          subtitle="Todos tus eventos"
          icon={<FiCalendar />}
          color="primary"
        />
        <StatCard
          title="Próximos Eventos"
          value={safeData.stats.upcomingEvents}
          subtitle="Por comenzar"
          icon={<FiClock />}
          color="warning"
        />
        <StatCard
          title="Participantes Totales"
          value={safeData.stats.totalParticipants}
          subtitle="Inscritos en total"
          icon={<FiUsers />}
          color="success"
        />
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(safeData.stats.totalRevenue)}
          subtitle="Confirmado"
          icon={<FiDollarSign />}
          color="info"
        />
      </div>

      <div className="grid grid-2 gap-4" style={{ marginTop: '2rem', alignItems: 'start' }}>
        
        <div className="flex flex-column gap-4">
          
          <div className="content-section">
            <h3 className="section-title">Tareas Pendientes</h3>
            <div className="flex flex-column gap-3">
              {safeData.stats.pendingRegistrations > 0 && (
                <Link to="/organizer/participants" className="task-card task-card-warning">
                  <span className="task-icon"><FiUsers /></span>
                  <div className="task-info">
                    <strong>{safeData.stats.pendingRegistrations} Inscripciones por aprobar</strong>
                    <small>Revisa y confirma las inscripciones pendientes.</small>
                  </div>
                  <span className="task-arrow">→</span>
                </Link>
              )}
              {safeData.stats.pendingPayments > 0 && (
                <Link to="/organizer/participants" className="task-card task-card-error">
                  <span className="task-icon"><FiDollarSign /></span>
                  <div className="task-info">
                    <strong>{safeData.stats.pendingPayments} Pagos pendientes</strong>
                    <small>Gestiona los pagos pendientes de confirmación.</small>
                  </div>
                  <span className="task-arrow">→</span>
                </Link>
              )}
              {!hasPendingTasks && (
                <div className="empty-state" style={{ padding: '2rem', boxShadow: 'none' }}>
                  <div className="empty-icon"><FiCheck /></div>
                  <h3 className="empty-title">¡No hay tareas pendientes!</h3>
                </div>
              )}
            </div>
          </div>

          {hasUpcomingEvents && (
            <div className="content-section">
              <h3 className="section-title">Próximos Eventos</h3>
              <div className="flex flex-column gap-3">
                {safeData.upcomingEvents.map((event) => (
                  <Link key={event.id_evento} to={`/organizer/events/${event.id_evento}`} className="list-item-card">
                    <div>
                      <strong className="list-item-title">{event.nombre || 'Evento sin nombre'}</strong>
                      <small className="list-item-subtitle">
                        {formatDate(event.fecha_inicio)} • {event.ubicacion || 'Ubicación no disponible'}
                      </small>
                    </div>
                    <span className="list-item-arrow">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-column gap-4">
          
          <div className="content-section">
            <h3 className="section-title">Acciones Rápidas</h3>
            <div className="flex flex-column gap-3">
              {hasQuickActions ? (
                safeData.quickActions.map((action, index) => (
                  <Link key={index} to={action.path || '#'} className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                    {action.icon === 'FiPlus' && <FiPlus />}
                    {action.icon === 'FiUsers' && <FiUsers />}
                    {action.icon === 'FiTrendingUp' && <FiTrendingUp />}
                    {action.label || 'Acción'}
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/organizer/events/create" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                    <FiPlus /> Crear Evento
                  </Link>
                  <Link to="/organizer/events" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <FiCalendar /> Ver Mis Eventos
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="content-section">
            <h3 className="section-title">Métricas Adicionales</h3>
            <ul className="stat-list">
              <li>
                <span>Eventos Activos</span>
                <strong>{safeData.stats.activeEvents}</strong>
              </li>
              <li>
                <span>Eventos Finalizados</span>
                <strong>{safeData.stats.completedEvents}</strong>
              </li>
              <li>
                <span>Participantes Confirmados</span>
                <strong>{safeData.stats.confirmedParticipants}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboardPage;