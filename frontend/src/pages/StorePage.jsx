import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext'; // <-- 1. IMPORTAR EL HOOK
import StoreHeroCarousel from '../components/StoreHeroCarousel';
import { FaTag, FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa';
import './StorePage.css';

function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { addToCart } = useCart();
  const { addToast } = useToast(); // <-- 2. LLAMAR AL HOOK

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
    // <-- 3. REEMPLAZAR ALERT CON ADDTOAST -->
    addToast(`¡${product.nombre} añadido al carrito!`, 'success');
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
        <div className="loading-state" style={{ minHeight: '60vh' }}>
          <div className="loading-spinner"></div>
          <h2>Cargando productos...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2 className="empty-title text-error">Error al Cargar</h2>
          <p className="empty-description">{error}</p>
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

      {/* Header actualizado */}
      <div className="store-header">
        <h1>Tienda de Ciclismo</h1>
        <p>Descubre los mejores productos para ciclistas. Equipamiento, accesorios y mucho más para tu próxima aventura.</p>
      </div>

      {/* Usamos admin-grid-view y admin-card para unificar estilos */}
      <div className="admin-grid-view" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', padding: 0, marginBottom: '2rem' }}>
        <div className="admin-card text-center">
          <h3 className="stat-number">{products.length}</h3>
          <p className="stat-label">Productos Disponibles</p>
        </div>
        <div className="admin-card text-center">
          <h3 className="stat-number">{getUniqueCategories().length - 1}</h3>
          <p className="stat-label">Categorías</p>
        </div>
        <div className="admin-card text-center">
          <h3 className="stat-number">{products.reduce((total, product) => total + product.inventario, 0)}</h3>
          <p className="stat-label">Unidades en Stock</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h3 className="section-title" style={{ border: 'none', padding: 0, margin: 0, marginBottom: '1rem' }}>Filtrar por Categoría</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {getUniqueCategories().map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <h3 className="empty-title">
            {selectedCategory === 'todos' ? 'No hay productos disponibles' : `No hay productos en la categoría ${getCategoryLabel(selectedCategory)}`}
          </h3>
          <p className="empty-description">
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
          <div className="admin-header" style={{ padding: 0, marginBottom: '1rem' }}>
            <div className="header-content">
              <h2 className="page-title" style={{ fontSize: '1.75rem' }}>
                {getCategoryLabel(selectedCategory)} ({filteredProducts.length})
              </h2>
            </div>
            <small className="text-muted">
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
                    <small className="product-stock" style={{ color: product.inventario > 5 ? 'var(--app-text-success)' : 'var(--app-text-warning)' }}>
                      <FaBoxOpen />
                      {product.inventario > 10 ? 'En stock' : `Solo ${product.inventario} unidades`}
                    </small>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary"
                  style={{ width: '100%' }} // Asegura que el botón ocupe todo el ancho
                >
                  🛒 Añadir al Carrito
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default StorePage;