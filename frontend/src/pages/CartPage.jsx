import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './CartPage.css';

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
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h1>Tu carrito está vacío</h1>
          <p>¡Descubre productos increíbles en nuestra tienda!</p>
          <Link to="/store">
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Explorar Tienda
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-header">
        <h1>🛒 Mi Carrito de Compras</h1>
        <button 
          onClick={clearCart}
          disabled={processing}
          className="btn btn-outline"
          style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
        >
          Vaciar Carrito
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={item.id_producto} className="cart-item">
              <div className="product-image">🚴</div>

              <div className="product-info">
                <h3>{item.nombre}</h3>
                {item.descripcion && (
                  <p className="product-description">
                    {item.descripcion.length > 100 
                      ? `${item.descripcion.substring(0, 100)}...` 
                      : item.descripcion
                    }
                  </p>
                )}
                <div className="product-meta">
                  <span className="category-tag">{item.categoria}</span>
                  <span className="stock-info">Stock: {item.inventario}</span>
                </div>
              </div>

              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id_producto, item.cantidad - 1)}
                  disabled={processing}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{item.cantidad}</span>
                <button
                  onClick={() => handleQuantityChange(item.id_producto, item.cantidad + 1)}
                  disabled={processing || item.cantidad >= item.inventario}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="item-total">
                <div className="total-price">{formatCurrency(item.precio * item.cantidad)}</div>
                <small className="unit-price">{formatCurrency(item.precio)} c/u</small>
                <button
                  onClick={() => removeFromCart(item.id_producto)}
                  disabled={processing}
                  className="remove-btn"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h2 className="summary-header">Resumen del Pedido</h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <div className="summary-row">
              <span>Productos ({getTotalItems()})</span>
              <span style={{ fontWeight: '500' }}>{formatCurrency(getTotalPrice())}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>Gratis</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">{formatCurrency(getTotalPrice())}</span>
            </div>
          </div>

          {!isAuthenticated ? (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary checkout-btn">
                Iniciar Sesión para Comprar
              </button>
            </Link>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="btn btn-primary checkout-btn"
            >
              {processing ? 'Procesando...' : 'Proceder al Pago'}
            </button>
          )}

          <Link to="/store" style={{ textDecoration: 'none' }}>
            <button 
              disabled={processing}
              className="continue-shopping"
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