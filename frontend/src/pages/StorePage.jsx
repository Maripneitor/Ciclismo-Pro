import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import StoreHeroCarousel from '../components/StoreHeroCarousel';
import { FaTag, FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa';
import './StorePage.css';

function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
        setProducts(response.data.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.response?.data?.message || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`¡${product.nombre} añadido al carrito! 🛒\n\nPrecio: $${product.precio}`);
  };

  const getCategoryColor = (categoria) => {
    const colors = {
      'ropa': 'var(--color-primary)',
      'accesorios': 'var(--color-secondary)',
      'equipamiento': 'var(--color-success)',
      'nutricion': 'var(--color-warning)',
      'electronica': 'var(--color-info)',
      'otros': 'var(--color-gray-medium)'
    };
    return colors[categoria] || 'var(--color-gray-medium)';
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES') || '0'}`;
  };

  const getUniqueCategories = () => {
    const categories = products.map(product => product.categoria);
    return ['todos', ...new Set(categories)];
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'ropa': 'Ropa',
      'accesorios': 'Accesorios',
      'equipamiento': 'Equipamiento',
      'nutricion': 'Nutrición',
      'electronica': 'Electrónica',
      'otros': 'Otros',
      'todos': 'Todos los productos'
    };
    return labels[category] || category;
  };

  const filteredProducts = selectedCategory === 'todos' 
    ? products 
    : products.filter(product => product.categoria === selectedCategory);

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Cargando productos...</h2>
          <p>Explorando nuestro catálogo de productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ color: 'var(--color-error)' }}>Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <StoreHeroCarousel />

      {/* Header actualizado para coincidir con el diseño de referencia */}
      <div className="store-header">
        <h1>Tienda de Ciclismo</h1>
        <p>Descubre los mejores productos para ciclistas. Equipamiento, accesorios y mucho más para tu próxima aventura.</p>
      </div>

      <div className="store-stats">
        <div className="stat-card">
          <div className="stat-number">{products.length}</div>
          <p className="stat-label">Productos Disponibles</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getUniqueCategories().length - 1}</div>
          <p className="stat-label">Categorías</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{products.reduce((total, product) => total + product.inventario, 0)}</div>
          <p className="stat-label">Unidades en Stock</p>
        </div>
      </div>

      <div className="category-filters">
        <h3>Filtrar por Categoría</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {getUniqueCategories().map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: selectedCategory === category ? getCategoryColor(category) : 'var(--color-gray-light)',
                color: selectedCategory === category ? 'var(--color-white)' : 'var(--color-gray-dark)',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = getCategoryColor(category);
                  e.currentTarget.style.color = 'var(--color-white)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = 'var(--color-gray-light)';
                  e.currentTarget.style.color = 'var(--color-gray-dark)';
                }
              }}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--color-gray-light)'
        }}>
          <h3 style={{ color: 'var(--color-gray-medium)', marginBottom: '1rem' }}>
            {selectedCategory === 'todos' ? 'No hay productos disponibles' : `No hay productos en la categoría ${getCategoryLabel(selectedCategory)}`}
          </h3>
          <p style={{ color: 'var(--color-gray-medium)' }}>
            {selectedCategory !== 'todos' && 'Prueba con otra categoría o vuelve a "Todos los productos"'}
          </p>
          {selectedCategory !== 'todos' && (
            <button
              onClick={() => setSelectedCategory('todos')}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Ver Todos los Productos
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ 
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2>
              {getCategoryLabel(selectedCategory)} ({filteredProducts.length})
            </h2>
            <small style={{ color: 'var(--color-gray-medium)' }}>
              Mostrando {filteredProducts.length} de {products.length} productos
            </small>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id_producto} className="card product-card">
                <div className="product-image-placeholder">🚴</div>

                <div className="product-category">
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(product.categoria) }}
                  >
                    <FaTag />
                    {getCategoryLabel(product.categoria)}
                  </span>
                </div>

                <h3 className="product-name">{product.nombre}</h3>

                {product.descripcion && (
                  <p className="product-description">
                    {product.descripcion.length > 120 
                      ? `${product.descripcion.substring(0, 120)}...` 
                      : product.descripcion
                    }
                  </p>
                )}

                <div className="product-price-section">
                  <div>
                    <div className="product-price">
                      <FaMoneyBillWave />
                      {formatCurrency(product.precio)}
                    </div>
                    <small className="product-stock">
                      <FaBoxOpen />
                      {product.inventario > 10 ? 'En stock' : `Solo ${product.inventario} unidades`}
                    </small>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary"
                >
                  🛒 Añadir al Carrito
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="store-info">
        <h3>🚴 ¿Necesitas ayuda para elegir?</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          Nuestros expertos en ciclismo están disponibles para asesorarte en la selección del equipo perfecto para tus necesidades.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
            <span>Envío gratuito desde $50</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
            <span>Devoluciones en 30 días</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
            <span>Garantía del fabricante</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StorePage;