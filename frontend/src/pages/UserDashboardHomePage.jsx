import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UserDashboardHomePage.css';

function UserDashboardHomePage() {
  const { user } = useContext(AuthContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="dashboard-home">
      {/* ========== HEADER ========== */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">
            {getGreeting()}, {user?.nombre_completo?.split(' ')[0] || 'Ciclista'}!
          </h1>
          <p className="welcome-subtitle">
            Bienvenido a tu centro de control. Gestiona tus actividades ciclistas desde aquí.
          </p>
        </div>
        
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <div className="stat-number">0</div>
              <div className="stat-label">Inscripciones Activas</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-number">0</div>
              <div className="stat-label">Equipos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <div className="stat-number">0</div>
              <div className="stat-label">Pedidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== QUICK ACTIONS ========== */}
      <div className="quick-actions-section">
        <h2 className="section-title">Acciones Rápidas</h2>
        <div className="actions-grid">
          <Link to="/dashboard/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3 className="action-title">Mi Perfil</h3>
            <p className="action-description">
              Actualiza tu información personal y preferencias de ciclismo
            </p>
            <span className="action-link">Gestionar →</span>
          </Link>

          <Link to="/eventos" className="action-card">
            <div className="action-icon">🚴</div>
            <h3 className="action-title">Explorar Eventos</h3>
            <p className="action-description">
              Descubre nuevos eventos y participa en carreras emocionantes
            </p>
            <span className="action-link">Explorar →</span>
          </Link>

          <Link to="/dashboard/teams" className="action-card">
            <div className="action-icon">👥</div>
            <h3 className="action-title">Mis Equipos</h3>
            <p className="action-description">
              Gestiona tus equipos y colabora con otros ciclistas
            </p>
            <span className="action-link">Ver equipos →</span>
          </Link>

          <Link to="/store" className="action-card">
            <div className="action-icon">🛍️</div>
            <h3 className="action-title">Tienda</h3>
            <p className="action-description">
              Descubre equipamiento y accesorios para ciclistas
            </p>
            <span className="action-link">Ir a tienda →</span>
          </Link>

          <Link to="/dashboard/inscripciones" className="action-card">
            <div className="action-icon">📝</div>
            <h3 className="action-title">Mis Inscripciones</h3>
            <p className="action-description">
              Revisa el estado de tus inscripciones a eventos
            </p>
            <span className="action-link">Ver inscripciones →</span>
          </Link>

          <Link to="/dashboard/orders" className="action-card">
            <div className="action-icon">📦</div>
            <h3 className="action-title">Mis Pedidos</h3>
            <p className="action-description">
              Revisa tu historial de compras y estado de pedidos
            </p>
            <span className="action-link">Ver pedidos →</span>
          </Link>
        </div>
      </div>

      {/* ========== RECENT ACTIVITY ========== */}
      <div className="recent-activity-section">
        <h2 className="section-title">Actividad Reciente</h2>
        <div className="activity-empty">
          <div className="empty-icon">📊</div>
          <h3>No hay actividad reciente</h3>
          <p>Tu actividad aparecerá aquí cuando participes en eventos o realices acciones</p>
          <Link to="/eventos" className="btn btn-primary">
            Explorar Eventos
          </Link>
        </div>
      </div>

      {/* ========== UPCOMING EVENTS ========== */}
      <div className="upcoming-events-section">
        <h2 className="section-title">Próximos Eventos</h2>
        <div className="events-empty">
          <div className="empty-icon">🎯</div>
          <h3>No tienes eventos próximos</h3>
          <p>Inscríbete en eventos para verlos aquí</p>
          <Link to="/eventos" className="btn btn-outline">
            Descubrir Eventos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserDashboardHomePage;