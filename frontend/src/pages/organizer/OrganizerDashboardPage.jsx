import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';

// Iconos simples (puedes reemplazar con react-icons después)
const IconCalendar = () => <span>📅</span>;
const IconUsers = () => <span>👥</span>;
const IconDollar = () => <span>💰</span>;
const IconCheck = () => <span>✅</span>;
const IconClock = () => <span>⏰</span>;
const IconTrendUp = () => <span>📈</span>;

function OrganizerDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
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

  // Función segura para obtener datos con valores por defecto
  const getSafeData = () => {
    if (!dashboardData || !dashboardData.data) {
      return {
        user: { id: '', rol: '', nombre: '' },
        stats: {
          totalEvents: 0,
          upcomingEvents: 0,
          activeEvents: 0,
          completedEvents: 0,
          totalParticipants: 0,
          pendingRegistrations: 0,
          confirmedParticipants: 0,
          totalRevenue: 0,
          pendingPayments: 0
        },
        upcomingEvents: [],
        features: [],
        quickActions: []
      };
    }
    return dashboardData.data;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando panel de organizador...</h2>
        <p>Obteniendo datos del sistema...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--error)' }}>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const safeData = getSafeData();
  const hasUpcomingEvents = safeData.upcomingEvents && safeData.upcomingEvents.length > 0;
  const hasPendingTasks = safeData.stats.pendingRegistrations > 0 || safeData.stats.pendingPayments > 0;
  const hasQuickActions = safeData.quickActions && safeData.quickActions.length > 0;

  return (
    <div>
      {/* Cabecera */}
      <div style={{ marginBottom: '2rem' }}>
        <h1>Panel de Organizador</h1>
        <p style={{ color: 'var(--neutral-600)' }}>
          Bienvenido al área exclusiva para organizadores y administradores
        </p>
      </div>

      {/* Mensaje de bienvenida */}
      <div style={{ 
        backgroundColor: 'var(--primary-50)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '1px solid var(--primary-200)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ color: 'var(--primary-700)', marginBottom: '0.5rem' }}>
            ¡Hola, {safeData.user.nombre || 'Organizador'}!
          </h2>
          <p style={{ margin: 0, color: 'var(--primary-600)' }}>
            {dashboardData?.message || 'Bienvenido a tu panel'} - Aquí tienes un resumen de tu actividad
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/profile">
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: 'var(--primary-600)',
              border: '1px solid var(--primary-600)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}>
              Editar Perfil
            </button>
          </Link>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Resumen General</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            title="Eventos Totales"
            value={safeData.stats.totalEvents}
            subtitle="Todos tus eventos"
            icon={<IconCalendar />}
            color="primary"
          />
          <StatCard
            title="Próximos Eventos"
            value={safeData.stats.upcomingEvents}
            subtitle="Por comenzar"
            icon={<IconClock />}
            color="warning"
          />
          <StatCard
            title="Participantes Totales"
            value={safeData.stats.totalParticipants}
            subtitle="Inscritos en total"
            icon={<IconUsers />}
            color="success"
          />
          <StatCard
            title="Ingresos Totales"
            value={formatCurrency(safeData.stats.totalRevenue)}
            subtitle="Acumulado"
            icon={<IconDollar />}
            color="info"
          />
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Columna izquierda - Tareas y Eventos */}
        <div>
          {/* Tareas Pendientes */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            border: '1px solid var(--neutral-200)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Tareas Pendientes</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {safeData.stats.pendingRegistrations > 0 && (
                <Link 
                  to="/organizer/participants" 
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: 'var(--warning-light)',
                    border: '1px solid var(--warning)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ 
                        backgroundColor: 'var(--warning)', 
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {safeData.stats.pendingRegistrations}
                      </span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--neutral-800)' }}>
                          Inscripciones por aprobar
                        </p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                          Revisa y confirma las inscripciones pendientes
                        </p>
                      </div>
                    </div>
                    <span style={{ color: 'var(--neutral-500)' }}>→</span>
                  </div>
                </Link>
              )}

              {safeData.stats.pendingPayments > 0 && (
                <Link 
                  to="/organizer/participants" 
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: 'var(--error-light)',
                    border: '1px solid var(--error)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ 
                        backgroundColor: 'var(--error)', 
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {safeData.stats.pendingPayments}
                      </span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--neutral-800)' }}>
                          Pagos pendientes
                        </p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                          Gestiona los pagos pendientes de confirmación
                        </p>
                      </div>
                    </div>
                    <span style={{ color: 'var(--neutral-500)' }}>→</span>
                  </div>
                </Link>
              )}

              {!hasPendingTasks && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: 'var(--neutral-500)'
                }}>
                  <IconCheck />
                  <p style={{ margin: '0.5rem 0 0 0' }}>¡No hay tareas pendientes!</p>
                </div>
              )}
            </div>
          </div>

          {/* Próximos Eventos */}
          {hasUpcomingEvents && (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              border: '1px solid var(--neutral-200)',
              padding: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Próximos Eventos</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {safeData.upcomingEvents.map((event) => (
                  <Link 
                    key={event.id_evento}
                    to={`/organizer/events/${event.id_evento}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: 'var(--neutral-50)',
                      border: '1px solid var(--neutral-200)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                      <div>
                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: 'var(--neutral-800)' }}>
                          {event.nombre || 'Evento sin nombre'}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                          {formatDate(event.fecha_inicio)} • {event.ubicacion || 'Ubicación no disponible'}
                        </p>
                      </div>
                      <span style={{ color: 'var(--neutral-500)' }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha - Acciones Rápidas */}
        <div>
          {/* Acciones Rápidas */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            border: '1px solid var(--neutral-200)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Acciones Rápidas</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {hasQuickActions ? (
                safeData.quickActions.map((action, index) => (
                  <Link 
                    key={index}
                    to={action.path || '#'}
                    style={{ textDecoration: 'none' }}
                  >
                    <button style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--primary-500)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}>
                      <span>{action.icon || '⚡'}</span>
                      {action.label || 'Acción'}
                    </button>
                  </Link>
                ))
              ) : (
                // Acciones por defecto si no vienen del backend
                <>
                  <Link to="/organizer/events/create" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--primary-500)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>➕</span>
                      Crear Evento
                    </button>
                  </Link>
                  <Link to="/organizer/events" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>📅</span>
                      Ver Mis Eventos
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Estadísticas Secundarias */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            border: '1px solid var(--neutral-200)',
            padding: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Métricas Adicionales</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--neutral-600)', fontSize: '0.9rem' }}>Eventos Activos</span>
                <span style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                  {safeData.stats.activeEvents}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--neutral-600)', fontSize: '0.9rem' }}>Eventos Finalizados</span>
                <span style={{ fontWeight: '600', color: 'var(--neutral-500)' }}>
                  {safeData.stats.completedEvents}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--neutral-600)', fontSize: '0.9rem' }}>Participantes Confirmados</span>
                <span style={{ fontWeight: '600', color: 'var(--success)' }}>
                  {safeData.stats.confirmedParticipants}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboardPage;StatCard.jsx