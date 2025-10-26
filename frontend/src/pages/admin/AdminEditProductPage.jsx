import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';

function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'ropa',
    inventario: 0,
    activo: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/admin/products/${id}`);
        const product = response.data.data;
        
        setFormData({
          nombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: product.precio || '',
          categoria: product.categoria || 'ropa',
          inventario: product.inventario || 0,
          activo: product.activo !== false
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.response?.data?.message || 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? (name === 'precio' ? parseFloat(value) : parseInt(value)) : 
              value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.precio || formData.inventario < 0) {
      setError('Por favor completa todos los campos obligatorios correctamente');
      setSaving(false);
      return;
    }

    if (formData.precio < 0) {
      setError('El precio debe ser un número positivo');
      setSaving(false);
      return;
    }

    try {
      const response = await apiClient.put(`/admin/products/${id}`, formData);
      
      if (response.data.success) {
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.response?.data?.message || 'Error al actualizar el producto');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando producto...</h2>
        <p>Obteniendo información del producto...</p>
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
          <h1>Editar Producto</h1>
          <p style={{ color: 'var(--neutral-600)' }}>
            Modifica la información del producto
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

          {/* Inventario y Estado */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
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
                Estado del Producto
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.95rem' }}>
                  Producto activo (visible en tienda)
                </span>
              </div>
            </div>
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
              disabled={saving}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: saving ? 'var(--neutral-400)' : 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEditProductPage;