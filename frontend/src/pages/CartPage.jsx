import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice,
    getTotalItems 
  } = useCart();

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`;
  };

  const handleQuantityChange = (id_producto, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id_producto, newQuantity);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setProcessing(true);
    try {
      const response = await apiClient.post('/api/orders', { 
        items: cartItems 
      });
      
      if (response.data.success) {
        clearCart();
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.message || 'Error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h1>Tu carrito está vacío</h1>
          <p style={{ 
            color: 'var(--neutral-600)', 
            fontSize: '1.1rem',
            marginBottom: '2rem'
          }}>
            ¡Descubre productos increíbles en nuestra tienda!
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
        <h1>🛒 Mi Carrito de Compras</h1>
        <button 
          onClick={clearCart}
          disabled={processing}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--error)',
            border: '1px solid var(--error)',
            borderRadius: '4px',
            cursor: processing ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            opacity: processing ? 0.6 : 1
          }}
        >
          Vaciar Carrito
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Lista de Productos */}
        <div>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid var(--neutral-200)',
            overflow: 'hidden'
          }}>
            {cartItems.map((item, index) => (
              <div 
                key={item.id_producto}
                style={{
                  padding: '1.5rem',
                  borderBottom: index < cartItems.length - 1 ? '1px solid var(--neutral-100)' : 'none',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto auto',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                {/* Imagen del producto (placeholder) */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'var(--neutral-100)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  🚴
                </div>

                {/* Información del producto */}
                <div>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0',
                    color: 'var(--neutral-800)'
                  }}>
                    {item.nombre}
                  </h3>
                  {item.descripcion && (
                    <p style={{ 
                      margin: '0 0 0.5rem 0',
                      color: 'var(--neutral-600)',
                      fontSize: '0.9rem'
                    }}>
                      {item.descripcion.length > 100 
                        ? `${item.descripcion.substring(0, 100)}...` 
                        : item.descripcion
                      }
                    </p>
                  )}
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-700)',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {item.categoria}
                    </span>
                    <span style={{
                      color: 'var(--neutral-500)',
                      fontSize: '0.8rem'
                    }}>
                      Stock: {item.inventario}
                    </span>
                  </div>
                </div>

                {/* Controles de cantidad */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => handleQuantityChange(item.id_producto, item.cantidad - 1)}
                    disabled={processing}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'var(--neutral-100)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: processing ? 0.6 : 1
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    padding: '0 1rem',
                    fontWeight: 'bold',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id_producto, item.cantidad + 1)}
                    disabled={processing || item.cantidad >= item.inventario}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: (item.cantidad >= item.inventario || processing) ? 'var(--neutral-300)' : 'var(--neutral-100)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: (item.cantidad >= item.inventario || processing) ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: processing ? 0.6 : 1
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Precio y botón eliminar */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.5rem'
                }}>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold',
                    color: 'var(--primary-600)'
                  }}>
                    {formatCurrency(item.precio * item.cantidad)}
                  </div>
                  <small style={{ color: 'var(--neutral-500)' }}>
                    {formatCurrency(item.precio)} c/u
                  </small>
                  <button
                    onClick={() => removeFromCart(item.id_producto)}
                    disabled={processing}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'transparent',
                      color: 'var(--error)',
                      border: '1px solid var(--error)',
                      borderRadius: '4px',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      fontSize: '0.8rem',
                      opacity: processing ? 0.6 : 1
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen del Pedido */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          padding: '1.5rem',
          position: 'sticky',
          top: '2rem'
        }}>
          <h2 style={{ 
            margin: '0 0 1.5rem 0',
            color: 'var(--neutral-800)',
            borderBottom: '1px solid var(--neutral-200)',
            paddingBottom: '1rem'
          }}>
            Resumen del Pedido
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ color: 'var(--neutral-600)' }}>Productos ({getTotalItems()})</span>
              <span style={{ fontWeight: '500' }}>{formatCurrency(getTotalPrice())}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ color: 'var(--neutral-600)' }}>Envío</span>
              <span style={{ color: 'var(--success)', fontWeight: '500' }}>Gratis</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--neutral-200)'
            }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total</span>
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '1.25rem',
                color: 'var(--primary-600)'
              }}>
                {formatCurrency(getTotalPrice())}
              </span>
            </div>
          </div>

          {!isAuthenticated ? (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'var(--secondary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                Iniciar Sesión para Comprar
              </button>
            </Link>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={processing}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: processing ? 'var(--neutral-400)' : 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: processing ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}
            >
              {processing ? 'Procesando...' : 'Proceder al Pago'}
            </button>
          )}

          <Link to="/store" style={{ textDecoration: 'none' }}>
            <button 
              disabled={processing}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: 'var(--primary-500)',
                border: '1px solid var(--primary-500)',
                borderRadius: '8px',
                cursor: processing ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                opacity: processing ? 0.6 : 1
              }}
            >
              Seguir Comprando
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;