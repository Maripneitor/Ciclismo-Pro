import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import Spinner from '../../components/Spinner';

function AdminCreateProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'ropa',
    inventario: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (name === 'precio' ? parseFloat(value) : parseInt(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.nombre.trim() || formData.precio === '' || formData.inventario === '') {
      setError('Por favor completa todos los campos obligatorios (*)');
      setLoading(false);
      return;
    }
    if (formData.precio < 0) {
      setError('El precio debe ser un número positivo');
      setLoading(false);
      return;
    }
    if (formData.inventario < 0) {
      setError('El inventario no puede ser negativo');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/admin/products', formData);
      if (response.data.success) {
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.response?.data?.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'ropa', label: 'Ropa' },
    { value: 'accesorios', label: 'Accesorios' },
    { value: 'equipamiento', label: 'Equipamiento' },
    { value: 'nutricion', label: 'Nutrición' },
    { value: 'electronica', label: 'Electrónica' },
    { value: 'otros', label: 'Otros' }
  ];

  return (
    <div className="admin-page">
      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div className="admin-header" style={{ paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div className="header-content">
            <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Crear Nuevo Producto</h1>
            <p className="page-subtitle">Añade un nuevo producto a la tienda</p>
          </div>
          <div className="header-actions">
            <Link to="/admin/products" className="btn btn-outline">
              ← Volver a Productos
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="nombre">Nombre del Producto *</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Camiseta Ciclismo Pro, Casco Aero, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="descripcion">Descripción</label>
            <textarea
              name="descripcion"
              id="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Describe las características, materiales y beneficios..."
            />
          </div>

          <div className="grid grid-2 gap-4 mb-3">
            <div className="form-group">
              <label className="form-label" htmlFor="precio">Precio ($) *</label>
              <input
                type="number"
                name="precio"
                id="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="categoria">Categoría *</label>
              <select
                name="categoria"
                id="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label" htmlFor="inventario">Inventario *</label>
            <input
              type="number"
              name="inventario"
              id="inventario"
              value={formData.inventario}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
            <small className="text-muted" style={{ marginTop: '0.5rem' }}>
              Número de unidades disponibles en stock.
            </small>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/admin/products" className="btn btn-outline">
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? <Spinner /> : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateProductPage;