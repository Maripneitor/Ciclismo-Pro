import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import './AdminCommon.css'; // Asegúrate que esta importación esté presente

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

  // --- Funciones de Ayuda ---

  const getStatusColor = (activo) => {
    return activo ? 'var(--app-text-success)' : 'var(--app-text-error)'; // Usa tokens semánticos
  };

  const getStatusText = (activo) => {
    return activo ? 'Activo' : 'Inactivo';
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-ES') || '0'}`;
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

  // --- Renderizado de Estados ---

  if (loading) {
    return (
      <div className="loading-state"> {/* Clase de AdminCommon.css */}
        <div className="loading-spinner"></div> {/* Clase de index.css */}
        <h2>Cargando productos...</h2>
        <p>Obteniendo lista completa de productos de la tienda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state"> {/* Clase de AdminCommon.css */}
        <div className="empty-icon">⚠️</div>
        <h2 className="text-error">Error al cargar productos</h2>
        <p>{error}</p>
        <Link to="/admin/dashboard" className="btn btn-primary">
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  // --- Renderizado Principal ---

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-content">
          <h1 className="page-title">Gestión de Tienda</h1>
          <p className="page-subtitle">
            Administra todos los productos de la tienda
          </p>
        </div>
        <div className="header-actions">
          <Link to="/admin/products/create" className="btn btn-primary">
            + Crear Nuevo Producto
          </Link>
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <div className="admin-grid-view" style={{ padding: 0, marginBottom: '2rem' }}>
        <div className="admin-card text-center">
          <h3 className="stat-number" style={{ color: 'var(--app-text-accent)' }}>
            {products.length}
          </h3>
          <p className="stat-label">Total Productos</p>
        </div>
        <div className="admin-card text-center">
          <h3 className="stat-number" style={{ color: 'var(--app-text-success)' }}>
            {products.filter(p => p.activo).length}
          </h3>
          <p className="stat-label">Productos Activos</p>
        </div>
        <div className="admin-card text-center">
          <h3 className="stat-number" style={{ color: 'var(--app-text-secondary)' }}>
            {products.filter(p => p.inventario > 0).length}
          </h3>
          <p className="stat-label">En Stock</p>
        </div>
        <div className="admin-card text-center">
          <h3 className="stat-number" style={{ color: 'var(--app-text-warning)' }}>
            {products.filter(p => p.inventario === 0).length}
          </h3>
          <p className="stat-label">Sin Stock</p>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="admin-table-container">
        <div className="table-header">
          <div className="table-header-content">
            <h2 className="table-title">Lista de Productos</h2>
            <p className="table-subtitle">
              Mostrando {products.length} productos en total
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No hay productos en la tienda</h3>
            <p className="empty-description">Crea el primer producto para comenzar a vender en la tienda.</p>
            <Link to="/admin/products/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Crear Primer Producto
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Categoría</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Inventario</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id_producto}>
                    <td>
                      <div>
                        <strong style={{ color: 'var(--app-text-secondary)' }}>
                          {product.nombre}
                        </strong>
                        {product.descripcion && (
                          <small className="prevent-overflow" style={{ color: 'var(--app-text-muted)', display: 'block', maxWidth: '300px' }}>
                            {product.descripcion}
                          </small>
                        )}
                        <small style={{ color: 'var(--app-text-muted)', opacity: 0.7, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                          ID: #{product.id_producto}
                        </small>
                      </div>
                    </td>
                    <td className="text-center">
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: getCategoryColor(product.categoria),
                          color: 'white',
                          borderRadius: '20px'
                        }}>
                        {product.categoria}
                      </span>
                    </td>
                    <td className="text-center" style={{ fontWeight: 'bold' }}>
                      {formatCurrency(product.precio)}
                    </td>
                    <td className="text-center">
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: product.inventario > 0 ? 'var(--app-text-success)' : 'var(--app-text-error)',
                          color: 'white',
                          borderRadius: '20px'
                        }}>
                        {product.inventario} unidades
                      </span>
                    </td>
                    <td className="text-center">
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(product.activo),
                          color: 'white',
                          borderRadius: '20px'
                        }}>
                        {getStatusText(product.activo)}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link to={`/admin/products/edit/${product.id_producto}`} className="action-btn action-btn--edit">
                        Editar
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