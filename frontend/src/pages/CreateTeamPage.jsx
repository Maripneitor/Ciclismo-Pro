import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import Spinner from '../components/Spinner';

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
      navigate('/dashboard/teams', { 
        state: { 
          message: response.data.message || '¡Equipo creado exitosamente!'
        }
      });
    } catch (error) {
      console.error('Error creating team:', error);
      // El error de "nombre duplicado" ahora será manejado por el backend
      setError(error.response?.data?.message || 'Error al crear el equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div className="admin-header" style={{ paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div className="header-content">
            <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Crear Nuevo Equipo</h1>
          </div>
          <div className="header-actions">
            <Link to="/dashboard/teams" className="btn btn-outline">
              ← Volver
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="nombre">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Los Veloces, Ciclistas Pro, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="descripcion">
              Descripción (Opcional)
            </label>
            <textarea
              name="descripcion"
              id="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Describe tu equipo, objetivos, nivel de experiencia, etc."
            />
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '2rem' }}>
            <Link to="/dashboard/teams" className="btn btn-outline">
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? <Spinner /> : 'Crear Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeamPage;