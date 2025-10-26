import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';

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

    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.precio || formData.inventario < 0) {
      setError('Por favor completa todos los campos obligatorios correctamente');
      setLoading(false);
      return;
    }

    if (formData.precio < 0) {
      setError('El precio debe ser un número positivo');
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
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1>Crear Nuevo Producto</h1>
          <p style={{ color: 'var(--neutral-600)' }}>
            Añade un nuevo producto a la tienda
          </p>
        </div>
        <Link to="/admin/products">
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--primary-500)',
            border: '1px solid var(--primary-500)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            ← Volver a Productos
          </button>
        </Link>
      </div>

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        border: '1px solid var(--neutral-200)', 
        padding: '2rem', 
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        {error && (
          <div style={{ 
            color: 'var(--error)', 
            marginBottom: '1rem', 
            padding: '0.75rem',
            backgroundColor: '#ffe6e6',
            border: '1px solid var(--error)',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Camiseta Ciclismo Pro, Casco Aero, etc."
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid var(--neutral-300)', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Describe las características, materiales y beneficios del producto..."
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid var(--neutral-300)', 
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Precio y Categoría */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Precio ($) *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid var(--neutral-300)', 
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid var(--neutral-300)', 
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventario */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Inventario *
            </label>
            <input
              type="number"
              name="inventario"
              value={formData.inventario}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid var(--neutral-300)', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <small style={{ color: 'var(--neutral-500)', marginTop: '0.5rem', display: 'block' }}>
              Número de unidades disponibles en stock
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/admin/products">
              <button 
                type="button"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--neutral-600)',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: loading ? 'var(--neutral-400)' : 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateProductPage;