import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FiCalendar, 
  FiUsers, 
  FiShoppingBag, 
  FiUser, 
  FiActivity, 
  FiLayout,
  FiTrello,
  FiTarget
} from 'react-icons/fi';
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
    <div className="animate-fadeIn">
      {/* ========== HEADER ========== */}
      <div className="flex flex-column gap-2 mb-5">
        <h1 className="h2 mb-0">
          {getGreeting()}, <span className="text-primary">{user?.nombre_completo?.split(' ')[0] || 'Ciclista'}</span>!
        </h1>
        <p className="text-muted mb-0">
          Bienvenido a tu centro de control. Aquí tienes un resumen de tu actividad ciclista.
        </p>
      </div>
      
      {/* ========== STATS GRID ========== */}
      <div className="grid grid-3 gap-4 mb-5">
        <div className="card stat-card shadow-sm border-left-primary">
          <div className="flex justify-between align-center p-4">
             <div className="flex flex-column">
                <span className="caption uppercase font-bold text-muted text-xs letter-spacing-wide">Inscripciones</span>
                <span className="h2 mb-0">0</span>
             </div>
             <div className="stat-icon-bg bg-primary-alpha text-primary">
               <FiActivity size={24} />
             </div>
          </div>
        </div>
        <div className="card stat-card shadow-sm">
          <div className="flex justify-between align-center p-4">
             <div className="flex flex-column">
                <span className="caption uppercase font-bold text-muted text-xs letter-spacing-wide">Equipos</span>
                <span className="h2 mb-0">0</span>
             </div>
             <div className="stat-icon-bg bg-gray-100 text-secondary">
               <FiUsers size={24} />
             </div>
          </div>
        </div>
        <div className="card stat-card shadow-sm">
          <div className="flex justify-between align-center p-4">
             <div className="flex flex-column">
                <span className="caption uppercase font-bold text-muted text-xs letter-spacing-wide">Pedidos</span>
                <span className="h2 mb-0">0</span>
             </div>
             <div className="stat-icon-bg bg-gray-100 text-secondary">
               <FiShoppingBag size={24} />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-dashboard gap-5">
        {/* Left Column: Quick Actions */}
        <div className="flex flex-column gap-4">
          <h2 className="h4 mb-0">Acciones Recomendadas</h2>
          <div className="grid grid-2 gap-3">
            <Link to="/eventos" className="card p-4 hover-lift shadow-sm">
              <span className="text-primary mb-3 block"><FiLayout size={28} /></span>
              <h3 className="h5 mb-1">Explorar Eventos</h3>
              <p className="text-xs text-muted">Busca tu próximo desafío.</p>
            </Link>
            <Link to="/dashboard/profile" className="card p-4 hover-lift shadow-sm">
              <span className="text-primary mb-3 block"><FiUser size={28} /></span>
              <h3 className="h5 mb-1">Mi Perfil</h3>
              <p className="text-xs text-muted">Gestiona tus datos.</p>
            </Link>
            <Link to="/dashboard/teams" className="card p-4 hover-lift shadow-sm">
              <span className="text-primary mb-3 block"><FiUsers size={28} /></span>
              <h3 className="h5 mb-1">Equipos</h3>
              <p className="text-xs text-muted">Únete a un Team.</p>
            </Link>
            <Link to="/store" className="card p-4 hover-lift shadow-sm">
              <span className="text-primary mb-3 block"><FiShoppingBag size={28} /></span>
              <h3 className="h5 mb-1">Tienda</h3>
              <p className="text-xs text-muted">Equípate pro.</p>
            </Link>
          </div>
        </div>

        {/* Right Column: Activity */}
        <div className="flex flex-column gap-4">
          <h2 className="h4 mb-0">Próximos Eventos</h2>
          <div className="card shadow-sm p-5 flex flex-column flex-center text-center bg-card min-h-200">
             <div className="text-primary opacity-20 mb-3"><FiTarget size={48} /></div>
             <h3 className="h5 text-muted">No tienes eventos próximos</h3>
             <p className="text-xs text-muted mb-4">Inscríbete en eventos para verlos aquí</p>
             <Link to="/eventos" className="btn btn-outline btn-small">Descubrir Eventos</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboardHomePage;
