import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AdminCommon.css';

function AdminDashboardPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Dashboard del Administrador</h1>
        <p>Bienvenido al panel de administración, {user?.nombre_completo}</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Usuarios Totales</h3>
          <div className="stat-number">0</div>
        </div>
        <div className="stat-card">
          <h3>Eventos Activos</h3>
          <div className="stat-number">0</div>
        </div>
        <div className="stat-card">
          <h3>Pedidos Hoy</h3>
          <div className="stat-number">0</div>
        </div>
        <div className="stat-card">
          <h3>Ingresos</h3>
          <div className="stat-number">$0</div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Actividad Reciente</h2>
        <div className="activity-list">
          <p>No hay actividad reciente para mostrar.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;