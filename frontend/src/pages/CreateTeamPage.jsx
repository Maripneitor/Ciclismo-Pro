import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

function CreateTeamPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre del equipo es obligatorio');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/teams', formData);
      navigate('/dashboard/teams');
    } catch (error) {
      console.error('Error creating team:', error);
      setError(error.response?.data?.message || 'Error al crear el equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Crear Nuevo Equipo</h1>
        <Link to="/dashboard/teams" style={{ color: 'var(--primary-500)' }}>
          ← Volver a Mis Equipos
        </Link>
      </div>

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        border: '1px solid #ccc', 
        padding: '2rem', 
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Nombre del Equipo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Los Veloces, Ciclistas Pro, etc."
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Descripción (Opcional)
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Describe tu equipo, objetivos, nivel de experiencia, etc."
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/dashboard/teams">
              <button 
                type="button"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--neutral-600)',
                  border: '1px solid #ccc',
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
                fontSize: '1rem'
              }}
            >
              {loading ? 'Creando...' : 'Crear Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeamPage;