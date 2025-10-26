import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/orders/my-orders');
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'var(--warning)';
      case 'procesando': return 'var(--info)';
      case 'enviado': return 'var(--primary-500)';
      case 'entregado': return 'var(--success)';
      case 'cancelado': return 'var(--error)';
      default: return 'var(--neutral-500)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'procesando': return 'Procesando';
      case 'enviado': return 'Enviado';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Cargando pedidos...</h2>
          <p>Obteniendo tu historial de compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ color: 'var(--error)' }}>Error</h2>
          <p>{error}</p>
          <Link to="/dashboard">
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Volver al Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1>📦 Mis Pedidos</h1>
          <p style={{ color: 'var(--neutral-600)' }}>
            Revisa el historial de tus compras en la tienda
          </p>
        </div>
        <Link to="/dashboard" style={{ color: 'var(--primary-500)' }}>
          ← Volver al Dashboard
        </Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          border: '2px dashed var(--neutral-200)',
          borderRadius: '8px',
          backgroundColor: 'var(--neutral-50)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: 'var(--neutral-600)', marginBottom: '1rem' }}>
            Aún no tienes pedidos
          </h3>
          <p style={{ color: 'var(--neutral-500)', marginBottom: '2rem' }}>
            ¡Descubre productos increíbles en nuestra tienda y realiza tu primera compra!
          </p>
          <Link to="/store">
            <button style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Explorar Tienda
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Header de la tabla */}
          <div style={{ 
            padding: '1.5rem',
            borderBottom: '1px solid var(--neutral-200)',
            backgroundColor: 'var(--neutral-50)'
          }}>
            <h2 style={{ margin: 0, color: 'var(--neutral-800)' }}>
              Historial de Pedidos
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--neutral-600)' }}>
              Mostrando {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
            </p>
          </div>

          {/* Tabla de pedidos */}
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
                    Estado
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
                    Productos
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
                          marginBottom: '0.25rem'
                        }}>
                          #ORD-{order.id_pedido.toString().padStart(6, '0')}
                        </strong>
                        <small style={{ 
                          color: 'var(--neutral-500)',
                          fontSize: '0.8rem'
                        }}>
                          ID: {order.id_pedido}
                        </small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: 'var(--neutral-700)' }}>
                        {formatDate(order.fecha_creacion)}
                      </div>
                      {order.fecha_actualizacion && (
                        <small style={{ 
                          color: 'var(--neutral-500)',
                          fontSize: '0.8rem',
                          display: 'block',
                          marginTop: '0.25rem'
                        }}>
                          Actualizado: {formatDate(order.fecha_actualizacion)}
                        </small>
                      )}
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
                      <div>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          backgroundColor: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {order.items?.length || 0} producto{order.items?.length !== 1 ? 's' : ''}
                        </span>
                        {order.items && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <details style={{ cursor: 'pointer' }}>
                              <summary style={{ 
                                fontSize: '0.8rem',
                                color: 'var(--primary-500)',
                                fontWeight: '500'
                              }}>
                                Ver productos
                              </summary>
                              <div style={{ 
                                marginTop: '0.5rem',
                                padding: '0.75rem',
                                backgroundColor: 'var(--neutral-50)',
                                borderRadius: '4px',
                                textAlign: 'left'
                              }}>
                                {order.items.map((item, itemIndex) => (
                                  <div key={itemIndex} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.25rem 0',
                                    borderBottom: itemIndex < order.items.length - 1 ? '1px solid var(--neutral-200)' : 'none'
                                  }}>
                                    <span style={{ fontSize: '0.8rem' }}>
                                      {item.nombre_producto}
                                    </span>
                                    <span style={{ 
                                      fontSize: '0.8rem',
                                      fontWeight: '500',
                                      color: 'var(--neutral-600)'
                                    }}>
                                      {item.cantidad} x {formatCurrency(item.precio_unitario)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla */}
          <div style={{ 
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--neutral-200)',
            backgroundColor: 'var(--neutral-50)',
            textAlign: 'center'
          }}>
            <p style={{ 
              margin: 0, 
              color: 'var(--neutral-500)',
              fontSize: '0.9rem'
            }}>
              Si tienes alguna pregunta sobre tus pedidos, contacta a nuestro servicio al cliente.
            </p>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--primary-50)',
        borderRadius: '8px',
        border: '1px solid var(--primary-200)'
      }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>
          📞 ¿Necesitas ayuda con tus pedidos?
        </h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Tiempo de entrega:</strong> 2-5 días hábiles para pedidos estándar.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Seguimiento:</strong> Recibirás un email con el número de seguimiento cuando tu pedido sea enviado.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Devoluciones:</strong> Aceptamos devoluciones dentro de los 30 días posteriores a la entrega.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserOrdersPage;