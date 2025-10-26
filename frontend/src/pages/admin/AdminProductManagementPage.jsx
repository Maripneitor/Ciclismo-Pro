import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';

function AdminProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/products');
        setProducts(response.data.data.products || []);
      } catch (error) {
        console.error('Error fetching all products:', error);
        setError(error.response?.data?.message || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const getStatusColor = (activo) => {
    return activo ? 'var(--success)' : 'var(--error)';
  };

  const getStatusText = (activo) => {
    return activo ? 'Activo' : 'Inactivo';
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES') || '0'}`;
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando productos...</h2>
        <p>Obteniendo lista completa de productos de la tienda...</p>
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1>Gestión de Tienda</h1>
          <p style={{ color: 'var(--neutral-600)' }}>
            Administra todos los productos de la tienda
          </p>
        </div>
        <Link to="/admin/products/create">
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            + Crear Nuevo Producto
          </button>
        </Link>
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
            {products.length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Total Productos</p>
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
            {products.filter(p => p.activo).length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Productos Activos</p>
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
            {products.filter(p => p.inventario > 0).length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>En Stock</p>
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
            {products.filter(p => p.inventario === 0).length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Sin Stock</p>
        </div>
      </div>

      {/* Lista de Productos */}
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
          <h2 style={{ margin: 0, color: 'var(--neutral-800)' }}>Lista de Productos</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--neutral-600)' }}>
            Mostrando {products.length} productos en total
          </p>
        </div>

        {products.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            color: 'var(--neutral-500)'
          }}>
            <h3>No hay productos en la tienda</h3>
            <p>Crea el primer producto para comenzar a vender en la tienda.</p>
            <Link to="/admin/products/create">
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Crear Primer Producto
              </button>
            </Link>
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
                    Producto
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
                    Categoría
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
                    Precio
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
                    Inventario
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
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr 
                    key={product.id_producto}
                    style={{ 
                      borderBottom: '1px solid var(--neutral-100)',
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
                          {product.nombre}
                        </strong>
                        {product.descripcion && (
                          <small style={{ 
                            color: 'var(--neutral-500)',
                            display: 'block',
                            lineHeight: '1.4',
                            fontSize: '0.85rem'
                          }}>
                            {product.descripcion.length > 80 
                              ? `${product.descripcion.substring(0, 80)}...` 
                              : product.descripcion
                            }
                          </small>
                        )}
                        <small style={{ 
                          color: 'var(--neutral-400)',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace'
                        }}>
                          ID: #{product.id_producto}
                        </small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.4rem 1rem',
                        backgroundColor: getCategoryColor(product.categoria),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {product.categoria}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      color: 'var(--neutral-800)',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {formatCurrency(product.precio)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.4rem 1rem',
                        backgroundColor: product.inventario > 0 ? 'var(--success)' : 'var(--error)',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {product.inventario} unidades
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.4rem 1rem',
                        backgroundColor: getStatusColor(product.activo),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {getStatusText(product.activo)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Link to={`/admin/products/edit/${product.id_producto}`}>
                        <button style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--primary-500)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          Editar
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductManagementPage;