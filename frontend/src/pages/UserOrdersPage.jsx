import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiHelpCircle, 
  FiChevronLeft,
  FiShoppingBag,
  FiInfo,
  FiExternalLink
} from 'react-icons/fi';

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/orders/my-orders');
        setOrders(response.data.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.response?.data?.message || 'Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pendiente': return <span className="badge bg-warning-alpha text-warning flex align-center gap-1"><FiClock /> Pendiente</span>;
      case 'procesando': return <span className="badge bg-secondary-alpha text-secondary flex align-center gap-1"><FiTruck /> Procesando</span>;
      case 'enviado': return <span className="badge bg-primary-alpha text-primary flex align-center gap-1"><FiTruck /> Enviado</span>;
      case 'entregado': return <span className="badge bg-success-alpha text-success flex align-center gap-1"><FiCheckCircle /> Entregado</span>;
      case 'cancelado': return <span className="badge bg-error-alpha text-error flex align-center gap-1"><FiXCircle /> Cancelado</span>;
      default: return <span className="badge bg-gray-100 text-muted">{status}</span>;
    }
  };

  if (loading) return (
    <div className="flex flex-center py-5 min-h-400">
      <div className="loading-spinner"></div>
    </div>
  );

  if (error) return (
    <div className="card bg-error-alpha p-5 text-center">
      <FiInfo className="text-error mb-3" size={32} />
      <p className="text-error mb-4">{error}</p>
      <Link to="/dashboard" className="btn btn-outline btn-small">Volver al Dashboard</Link>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between align-center mb-5">
        <div>
          <h1 className="h2 mb-0">Mis Pedidos</h1>
          <p className="text-muted text-sm">Historial de tus compras en la tienda oficial.</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline btn-small flex align-center gap-1">
          <FiChevronLeft /> Volver
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-5 text-center bg-card shadow-sm border-dashed">
          <div className="text-primary opacity-20 mb-4"><FiShoppingBag size={64} /></div>
          <h3 className="h4 mb-2">Aún no tienes pedidos</h3>
          <p className="text-muted mb-4">¡Descubre productos increíbles en nuestra tienda!</p>
          <Link to="/store" className="btn btn-primary">Explorar Tienda</Link>
        </div>
      ) : (
        <div className="card bg-card shadow-md border-none overflow-hidden">
          <div className="table-container">
            <table className="table w-100">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Fecha</th>
                  <th className="text-center">Estado</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Productos</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id_pedido}>
                    <td>
                      <div className="flex flex-column">
                        <span className="font-bold text-main">#ORD-{order.id_pedido.toString().padStart(6, '0')}</span>
                        <span className="text-xs text-muted">ID: {order.id_pedido}</span>
                      </div>
                    </td>
                    <td>
                       <span className="text-sm text-main">{formatDate(order.fecha_creacion)}</span>
                    </td>
                    <td className="text-center">
                      {getStatusBadge(order.estado)}
                    </td>
                    <td className="text-right">
                      <span className="font-bold text-main">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="text-center">
                      <details className="dropdown-details">
                        <summary className="btn btn-text btn-small text-primary p-0">
                          {order.items?.length || 0} items <FiExternalLink size={12} />
                        </summary>
                        <div className="dropdown-content p-3 shadow-lg rounded-md bg-card border border-color mt-2 text-left absolute right-0">
                           {order.items?.map((item, idx) => (
                             <div key={idx} className="flex justify-between gap-4 py-1 border-bottom border-color last-none">
                               <span className="text-xs text-main">{item.nombre_producto}</span>
                               <span className="text-xs text-muted">x{item.cantidad}</span>
                             </div>
                           ))}
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card bg-primary-alpha p-4 mt-5 border-none flex align-start gap-3">
         <FiHelpCircle className="text-primary" size={24} />
         <div>
            <h4 className="h5 mb-2 text-primary">¿Necesitas ayuda?</h4>
            <div className="grid grid-3 gap-3">
               <div className="text-xs text-muted"><strong className="text-main">Envío:</strong> 2-5 días hábiles.</div>
               <div className="text-xs text-muted"><strong className="text-main">Seguimiento:</strong> Vía email.</div>
               <div className="text-xs text-muted"><strong className="text-main">Devoluciones:</strong> Hasta 30 días.</div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default UserOrdersPage;
