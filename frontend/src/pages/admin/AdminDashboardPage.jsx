import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../services/api';
import './AdminCommon.css';
import { 
  FiUsers, FiCalendar, FiDollarSign, FiPackage, 
  FiRefreshCw, FiUser, FiUserCheck, FiShield,
  FiTrendingUp, FiBox, FiCheckCircle, FiShoppingCart,
  FiBarChart2, FiPieChart
} from 'react-icons/fi';
import { SafeDoughnutChart, SafeBarChart } from '../../components/SafeChartComponent';

function AdminDashboardPage() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      setLoading(true);
      setError('');
      
      const response = await apiClient.get('/admin/dashboard-data');
      console.log('✅ Dashboard data received:', response.data);
      
      setData(response.data.data);
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      
      const errorMessage = err.response?.data?.message || 
                          'No se pudieron cargar los datos del dashboard';
      
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Funciones para formatear
  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Datos para gráficos
  const getUserRoleChartData = () => {
    if (!data) return { labels: [], datasets: [] };
    
    const roles = data.stats.usuarios.roles;
    const colors = ['#27ae60', '#f39c12', '#e74c3c'];
    
    return {
      labels: [
        `Usuarios (${roles.usuario})`,
        `Organizadores (${roles.organizador})`, 
        `Admins (${roles.administrador})`
      ],
      datasets: [
        {
          data: [roles.usuario, roles.organizador, roles.administrador],
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 2,
        }
      ]
    };
  };

  const getEventStatusChartData = () => {
    if (!data) return { labels: [], datasets: [] };
    
    const eventos = data.stats.eventos;
    const colors = ['#3498db', '#f39c12', '#27ae60', '#95a5a6'];
    
    return {
      labels: ['Próximos', 'En Curso', 'Finalizados', 'Cancelados'],
      datasets: [
        {
          label: 'Cantidad de Eventos',
          data: [
            eventos.proximos,
            eventos.en_curso,
            eventos.finalizados,
            eventos.cancelados
          ],
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }
      ]
    };
  };

  const getOrdersChartData = () => {
    if (!data) return { labels: [], datasets: [] };
    
    const pedidos = data.stats.pedidos;
    const colors = ['#f39c12', '#27ae60'];
    
    return {
      labels: ['Pendientes', 'Entregados'],
      datasets: [
        {
          label: 'Cantidad de Pedidos',
          data: [pedidos.pendientes, pedidos.entregados],
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }
      ]
    };
  };

  const getRevenueChartData = () => {
    if (!data) return { labels: [], datasets: [] };
    
    return {
      labels: ['Ingresos Totales'],
      datasets: [
        {
          label: 'Ingresos (€)',
          data: [data.stats.pedidos.ingresos_totales],
          backgroundColor: ['#27ae60'],
          borderColor: ['#219652'],
          borderWidth: 2
        }
      ]
    };
  };

  // --- Renderizado de Estados ---
  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3 className="empty-title text-error">Error al Cargar</h3>
          <p className="empty-description">{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={handleRetry}
            style={{ marginTop: '1rem' }}
          >
            <FiRefreshCw style={{ marginRight: '0.5rem' }} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3 className="empty-title">No hay datos</h3>
          <p className="empty-description">No se recibieron datos del dashboard.</p>
          <button className="btn btn-primary" onClick={handleRetry}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-content">
          <h1 className="page-title">Dashboard de Administración</h1>
          <p className="page-subtitle">
            Bienvenido, {user?.nombre_completo}. Resumen completo del sistema.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <button 
              className="btn btn-sm btn-outline" 
              onClick={handleRetry}
            >
              <FiRefreshCw size={14} style={{ marginRight: '0.25rem' }} />
              Actualizar
            </button>
            <span style={{ fontSize: '0.875rem', color: 'var(--app-text-muted)' }}>
              Actualizado: {new Date(data.lastUpdated).toLocaleString('es-ES')}
            </span>
          </div>
        </div>
      </div>

      {/* RESUMEN GENERAL */}
      <div className="admin-card summary-card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--app-text-primary)' }}>
          <FiBarChart2 style={{ marginRight: '0.5rem' }} />
          Resumen General del Sistema
        </h2>
        <div className="stats-grid">
          <div className="stat-card primary">
            <FiUsers size={24} />
            <div className="stat-content">
              <div className="stat-number">{formatNumber(stats.usuarios.total)}</div>
              <div className="stat-label">Usuarios Totales</div>
              <div className="stat-trend positive">
                <FiTrendingUp size={14} />
                +{stats.usuarios.activos_hoy} hoy
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <FiCalendar size={24} />
            <div className="stat-content">
              <div className="stat-number">{formatNumber(stats.eventos.total)}</div>
              <div className="stat-label">Eventos Totales</div>
              <div className="stat-subinfo">{stats.eventos.proximos} próximos</div>
            </div>
          </div>

          <div className="stat-card warning">
            <FiShoppingCart size={24} />
            <div className="stat-content">
              <div className="stat-number">{formatNumber(stats.pedidos.total)}</div>
              <div className="stat-label">Pedidos Totales</div>
              <div className="stat-trend">
                {stats.pedidos.tasa_entrega}% entregados
              </div>
            </div>
          </div>

          <div className="stat-card info">
            <FiDollarSign size={24} />
            <div className="stat-content">
              <div className="stat-number">{formatCurrency(stats.pedidos.ingresos_totales)}</div>
              <div className="stat-label">Ingresos Totales</div>
              <div className="stat-subinfo">
                Ticket: {formatCurrency(stats.pedidos.ticket_promedio)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICOS VISUALES */}
      <div className="admin-grid-view charts-grid">
        <div className="admin-card">
          <h3><FiPieChart className="icon-spacing" /> Distribución de Usuarios por Rol</h3>
          <div className="chart-container">
            <SafeDoughnutChart data={getUserRoleChartData()} />
          </div>
        </div>

        <div className="admin-card">
          <h3><FiBarChart2 className="icon-spacing" /> Estado de los Eventos</h3>
          <div className="chart-container">
            <SafeBarChart 
              data={getEventStatusChartData()} 
              title="Eventos por Estado" 
            />
          </div>
        </div>

        <div className="admin-card">
          <h3><FiBarChart2 className="icon-spacing" /> Distribución de Pedidos</h3>
          <div className="chart-container">
            <SafeBarChart 
              data={getOrdersChartData()} 
              title="Pedidos" 
            />
          </div>
        </div>

        <div className="admin-card">
          <h3><FiDollarSign className="icon-spacing" /> Ingresos del Sistema</h3>
          <div className="chart-container">
            <div className="revenue-display">
              <div className="revenue-amount">
                {formatCurrency(stats.pedidos.ingresos_totales)}
              </div>
              <div className="revenue-details">
                <p><strong>Ticket promedio:</strong> {formatCurrency(stats.pedidos.ticket_promedio)}</p>
                <p><strong>Pedidos entregados:</strong> {formatNumber(stats.pedidos.entregados)}</p>
                <p><strong>Tasa de entrega:</strong> {stats.pedidos.tasa_entrega}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS DETALLADAS */}
      <div className="admin-grid-view detailed-stats">
        <div className="admin-card">
          <h3><FiUsers className="icon-spacing" /> Estadísticas de Usuarios</h3>
          <div className="stats-detail">
            <div className="stat-item">
              <span className="stat-label">Total Registrados:</span>
              <span className="stat-value">{formatNumber(stats.usuarios.total)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Nuevos Hoy:</span>
              <span className="stat-value positive">{formatNumber(stats.usuarios.activos_hoy)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Usuarios Regulares:</span>
              <span className="stat-value">{formatNumber(stats.usuarios.roles.usuario)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Organizadores:</span>
              <span className="stat-value warning">{formatNumber(stats.usuarios.roles.organizador)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Administradores:</span>
              <span className="stat-value error">{formatNumber(stats.usuarios.roles.administrador)}</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3><FiCalendar className="icon-spacing" /> Estadísticas de Eventos</h3>
          <div className="stats-detail">
            <div className="stat-item">
              <span className="stat-label">Total Eventos:</span>
              <span className="stat-value">{formatNumber(stats.eventos.total)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Próximos:</span>
              <span className="stat-value info">{formatNumber(stats.eventos.proximos)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">En Curso:</span>
              <span className="stat-value warning">{formatNumber(stats.eventos.en_curso)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Finalizados:</span>
              <span className="stat-value success">{formatNumber(stats.eventos.finalizados)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cuota Promedio:</span>
              <span className="stat-value">{formatCurrency(stats.eventos.cuota_promedio)}</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3><FiShoppingCart className="icon-spacing" /> Estadísticas de Pedidos</h3>
          <div className="stats-detail">
            <div className="stat-item">
              <span className="stat-label">Total Pedidos:</span>
              <span className="stat-value">{formatNumber(stats.pedidos.total)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pendientes:</span>
              <span className="stat-value warning">{formatNumber(stats.pedidos.pendientes)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Entregados:</span>
              <span className="stat-value success">{formatNumber(stats.pedidos.entregados)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tasa de Entrega:</span>
              <span className="stat-value info">{stats.pedidos.tasa_entrega}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ticket Promedio:</span>
              <span className="stat-value">{formatCurrency(stats.pedidos.ticket_promedio)}</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3><FiBox className="icon-spacing" /> Estadísticas de Productos</h3>
          <div className="stats-detail">
            <div className="stat-item">
              <span className="stat-label">Productos Activos:</span>
              <span className="stat-value">{formatNumber(stats.productos.activos)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Stock Bajo:</span>
              <span className="stat-value warning">{formatNumber(stats.productos.stock_bajo)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sin Stock:</span>
              <span className="stat-value error">{formatNumber(stats.productos.sin_stock)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div className="admin-grid-view tables-grid">
        <div className="admin-table-container">
          <h3><FiUser className="icon-spacing" /> Usuarios Recientes</h3>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.recentUsers?.map(u => (
                  <tr key={u.id_usuario}>
                    <td className="user-name">{u.nombre_completo}</td>
                    <td className="user-email">{u.correo_electronico}</td>
                    <td>
                      <span className={`role-badge role-${u.rol}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="user-date">
                      {new Date(u.fecha_creacion).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-table-container">
          <h3><FiPackage className="icon-spacing" /> Pedidos Recientes</h3>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.map(o => (
                    <tr key={o.id_pedido}>
                      <td className="order-customer">{o.cliente}</td>
                      <td>
                        <span className={`status-badge status-${o.estado}`}>
                          {o.estado}
                        </span>
                      </td>
                      <td className="order-total">
                        {formatCurrency(o.total || 0)}
                      </td>
                      <td className="order-date">
                        {o.fecha_pedido ? new Date(o.fecha_pedido).toLocaleDateString('es-ES') : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No hay pedidos recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;