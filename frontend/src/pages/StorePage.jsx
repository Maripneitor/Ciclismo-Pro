import { useState, useEffect } from 'react';
import axios from 'axios';

function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

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
    // Por ahora solo muestra un mensaje, en el futuro se implementará el carrito
    alert(`¡${product.nombre} añadido al carrito! 🛒\n\nPrecio: $${product.precio}`);
  };

  const getCategoryColor = (categoria) => {
    const colors = {
      'ropa': 'var(--primary-500)',
      'accesorios': 'var(--secondary-500)',
      'equipamiento': 'var(--success)',
      'nutricion': 'var(--warning)',
      'electronica': 'var(--info)',
      'otros': 'var(--neutral-500)'
    };
    return colors[categoria] || 'var(--neutral-400)';
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
          <h2 style={{ color: 'var(--error)' }}>Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header de la Tienda */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>🏪 Tienda de Ciclismo</h1>
        <p style={{ color: 'var(--neutral-600)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Descubre los mejores productos para ciclistas. Equipamiento, accesorios y mucho más para tu próxima aventura.
        </p>
      </div>

      {/* Estadísticas */}
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
            {products.length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Productos Disponibles</p>
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
            color: 'var(--secondary-600)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {getUniqueCategories().length - 1}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Categorías</p>
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
            {products.reduce((total, product) => total + product.inventario, 0)}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Unidades en Stock</p>
        </div>
      </div>

      {/* Filtros por Categoría */}
      <div style={{ 
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid var(--neutral-200)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Filtrar por Categoría</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {getUniqueCategories().map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: selectedCategory === category ? getCategoryColor(category) : 'var(--neutral-100)',
                color: selectedCategory === category ? 'white' : 'var(--neutral-700)',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = getCategoryColor(category);
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = 'var(--neutral-100)';
                  e.currentTarget.style.color = 'var(--neutral-700)';
                }
              }}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Productos */}
      {filteredProducts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)'
        }}>
          <h3 style={{ color: 'var(--neutral-500)', marginBottom: '1rem' }}>
            {selectedCategory === 'todos' ? 'No hay productos disponibles' : `No hay productos en la categoría ${getCategoryLabel(selectedCategory)}`}
          </h3>
          <p style={{ color: 'var(--neutral-500)' }}>
            {selectedCategory !== 'todos' && 'Prueba con otra categoría o vuelve a "Todos los productos"'}
          </p>
          {selectedCategory !== 'todos' && (
            <button
              onClick={() => setSelectedCategory('todos')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
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
            <h2 style={{ color: 'var(--neutral-700)' }}>
              {getCategoryLabel(selectedCategory)} ({filteredProducts.length})
            </h2>
            <small style={{ color: 'var(--neutral-500)' }}>
              Mostrando {filteredProducts.length} de {products.length} productos
            </small>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id_producto}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid var(--neutral-200)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Categoría */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    padding: '0.4rem 1rem',
                    backgroundColor: getCategoryColor(product.categoria),
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {getCategoryLabel(product.categoria)}
                  </span>
                </div>

                {/* Nombre del Producto */}
                <h3 style={{ 
                  margin: '0 0 1rem 0',
                  color: 'var(--neutral-800)',
                  fontSize: '1.25rem',
                  lineHeight: '1.4'
                }}>
                  {product.nombre}
                </h3>

                {/* Descripción */}
                {product.descripcion && (
                  <p style={{ 
                    color: 'var(--neutral-600)',
                    lineHeight: '1.5',
                    marginBottom: '1.5rem',
                    flex: 1
                  }}>
                    {product.descripcion.length > 120 
                      ? `${product.descripcion.substring(0, 120)}...` 
                      : product.descripcion
                    }
                  </p>
                )}

                {/* Precio y Stock */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: 'var(--primary-600)'
                    }}>
                      {formatCurrency(product.precio)}
                    </div>
                    <small style={{ 
                      color: product.inventario > 10 ? 'var(--success)' : 'var(--warning)',
                      fontWeight: '500'
                    }}>
                      {product.inventario > 10 ? '✓ En stock' : `Solo ${product.inventario} unidades`}
                    </small>
                  </div>
                </div>

                {/* Botón Añadir al Carrito */}
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: 'var(--primary-500)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-600)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-500)';
                  }}
                >
                  🛒 Añadir al Carrito
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Información Adicional */}
      <div style={{ 
        padding: '2rem',
        backgroundColor: 'var(--primary-50)',
        borderRadius: '8px',
        border: '1px solid var(--primary-200)',
        textAlign: 'center'
      }}>
        <h3 style={{ color: 'var(--primary-700)', marginBottom: '1rem' }}>
          🚴 ¿Necesitas ayuda para elegir?
        </h3>
        <p style={{ color: 'var(--primary-800)', marginBottom: '1.5rem' }}>
          Nuestros expertos en ciclismo están disponibles para asesorarte en la selección del equipo perfecto para tus necesidades.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
            <span style={{ color: 'var(--primary-700)' }}>Envío gratuito desde $50</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
            <span style={{ color: 'var(--primary-700)' }}>Devoluciones en 30 días</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
            <span style={{ color: 'var(--primary-700)' }}>Garantía del fabricante</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StorePage;