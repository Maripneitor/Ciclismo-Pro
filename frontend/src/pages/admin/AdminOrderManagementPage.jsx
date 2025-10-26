import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';

function AdminOrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatuses, setUpdatingStatuses] = useState({});

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/orders');
        setOrders(response.data.data.orders || []);
      } catch (error) {
        console.error('Error fetching all orders:', error);
        setError(error.response?.data?.message || 'Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatuses(prev => ({ ...prev, [orderId]: true }));
      
      const response = await apiClient.put(
        `/admin/orders/${orderId}/status`,
        { nuevoEstado: newStatus }
      );

      if (response.data.success) {
        // Actualizar el estado local del pedido
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id_pedido === orderId
              ? { 
                  ...order, 
                  estado: newStatus,
                  fecha_actualizacion: new Date().toISOString()
                }
              : order
          )
        );
        
        console.log(`Estado actualizado para pedido ${orderId}: ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.response?.data?.message || 'Error al actualizar el estado del pedido');
    } finally {
      setUpdatingStatuses(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'var(--warning)';
      case 'confirmado': return 'var(--info)';
      case 'procesando': return 'var(--primary-500)';
      case 'enviado': return 'var(--secondary-500)';
      case 'entregado': return 'var(--success)';
      case 'cancelado': return 'var(--error)';
      default: return 'var(--neutral-500)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'confirmado': return 'Confirmado';
      case 'procesando': return 'Procesando';
      case 'enviado': return 'Enviado';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusOptions = () => {
    return [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'confirmado', label: 'Confirmado' },
      { value: 'procesando', label: 'Procesando' },
      { value: 'enviado', label: 'Enviado' },
      { value: 'entregado', label: 'Entregado' },
      { value: 'cancelado', label: 'Cancelado' }
    ];
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando pedidos...</h2>
        <p>Obteniendo todos los pedidos de la plataforma...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--error)' }}>Error</h2>
        <p>{error}</p>
        <Link to="/admin/users">
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}>
            Volver a Gestión de Usuarios
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Gestión de Pedidos</h1>
        <p style={{ color: 'var(--neutral-600)' }}>
          Administra y actualiza el estado de todos los pedidos de la tienda
        </p>
      </div>

      {/* Resumen de estadísticas */}
      <div style={{ 
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--primary-600)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {orders.length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Total Pedidos</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--warning)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {orders.filter(o => o.estado === 'pendiente').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Pendientes</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--primary-500)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {orders.filter(o => o.estado === 'procesando').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Procesando</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--success)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {orders.filter(o => o.estado === 'entregado').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Entregados</p>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        border: '1px solid var(--neutral-200)',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          padding: '1.5rem',
          borderBottom: '1px solid var(--neutral-200)',
          backgroundColor: 'var(--neutral-50)'
        }}>
          <h2 style={{ margin: 0, color: 'var(--neutral-800)' }}>Todos los Pedidos</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--neutral-600)' }}>
            Mostrando {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            color: 'var(--neutral-500)'
          }}>
            <h3>No hay pedidos en el sistema</h3>
            <p>Los pedidos aparecerán aquí una vez que los usuarios realicen compras.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse' 
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: 'var(--neutral-50)',
                  borderBottom: '2px solid var(--neutral-200)'
                }}>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Pedido
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Cliente
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Fecha
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Productos
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'right', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Estado Actual
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Gestionar Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr 
                    key={order.id_pedido}
                    style={{ 
                      borderBottom: index < orders.length - 1 ? '1px solid var(--neutral-100)' : 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <strong style={{ 
                          color: 'var(--neutral-800)',
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontSize: '0.95rem'
                        }}>
                          #ORD-{order.id_pedido.toString().padStart(6, '0')}
                        </strong>
                        <small style={{ 
                          color: 'var(--neutral-500)',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace'
                        }}>
                          ID: #{order.id_pedido}
                        </small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ 
                          color: 'var(--neutral-800)', 
                          fontWeight: '500',
                          fontSize: '0.95rem'
                        }}>
                          {order.cliente}
                        </div>
                        <small style={{ 
                          color: 'var(--neutral-500)',
                          fontSize: '0.8rem'
                        }}>
                          {order.correo_electronico}
                        </small>
                        <br />
                        <small style={{ 
                          color: 'var(--neutral-400)',
                          fontSize: '0.75rem'
                        }}>
                          ID: #{order.id_usuario}
                        </small>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      color: 'var(--neutral-700)',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {formatDate(order.fecha_creacion)}
                      {order.fecha_actualizacion && (
                        <div style={{ 
                          fontSize: '0.8rem',
                          color: 'var(--neutral-500)',
                          marginTop: '0.25rem'
                        }}>
                          Actualizado: {formatDate(order.fecha_actualizacion)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.4rem 0.8rem',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-700)',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {order.items_count || 0} producto{order.items_count !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'right',
                      color: 'var(--neutral-800)',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: getStatusColor(order.estado),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {getStatusText(order.estado)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <select
                        value={order.estado}
                        onChange={(e) => handleStatusChange(order.id_pedido, e.target.value)}
                        disabled={updatingStatuses[order.id_pedido]}
                        style={{
                          padding: '0.5rem 1rem',
                          border: '1px solid var(--neutral-300)',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: 'var(--neutral-800)',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          cursor: updatingStatuses[order.id_pedido] ? 'not-allowed' : 'pointer',
                          minWidth: '140px',
                          opacity: updatingStatuses[order.id_pedido] ? 0.7 : 1,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (!updatingStatuses[order.id_pedido]) {
                            e.currentTarget.style.borderColor = 'var(--primary-500)';
                            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 115, 230, 0.1)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!updatingStatuses[order.id_pedido]) {
                            e.currentTarget.style.borderColor = 'var(--neutral-300)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {getStatusOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {updatingStatuses[order.id_pedido] && (
                        <div style={{ 
                          marginTop: '0.5rem',
                          fontSize: '0.75rem',
                          color: 'var(--primary-500)',
                          fontWeight: '500'
                        }}>
                          Actualizando...
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información de gestión */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--primary-50)',
        borderRadius: '8px',
        border: '1px solid var(--primary-200)'
      }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>💡 Guía de Estados:</h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Pendiente:</strong> Pedido recibido, pendiente de confirmación.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Confirmado:</strong> Pedido confirmado y en preparación.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Procesando:</strong> Pedido en proceso de empaquetado.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Enviado:</strong> Pedido enviado al cliente.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Entregado:</strong> Pedido entregado al cliente.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Cancelado:</strong> Pedido cancelado (no reembolsable automáticamente).
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderManagementPage;