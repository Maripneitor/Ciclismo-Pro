import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Spinner from '../components/ui/Spinner';

function RegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [shirtSizes, setShirtSizes] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  
  const [formData, setFormData] = useState({
    id_categoria: '',
    id_talla_playera: '',
    id_equipo: '',
    alias_dorsal: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setLoading(true);
        
        const [
          eventResponse,
          categoriesResponse,
          shirtSizesResponse,
          teamsResponse
        ] = await Promise.all([
          apiClient.get(`/eventos/${id}`),
          apiClient.get(`/eventos/${id}/categories`),
          apiClient.get('/data/tallas-playera'),
          apiClient.get('/teams/my-teams')
        ]);

        setEvent(eventResponse.data.data);
        setCategories(categoriesResponse.data.data);
        setShirtSizes(shirtSizesResponse.data.data);
        setUserTeams(teamsResponse.data.data);

      } catch (error) {
        console.error('Error fetching registration data:', error);
        setError('Error al cargar los datos de inscripción');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.id_categoria || !formData.id_talla_playera) {
      setError('La categoría y la talla de playera son obligatorias');
      setIsLoading(false);
      return;
    }

    try {
      const inscriptionData = {
        id_evento: parseInt(id),
        id_categoria: parseInt(formData.id_categoria),
        id_talla_playera: parseInt(formData.id_talla_playera),
        alias_dorsal: formData.alias_dorsal || null,
        id_equipo: formData.id_equipo ? parseInt(formData.id_equipo) : null
      };

      const response = await apiClient.post('/inscripciones', inscriptionData);
      
      alert('¡Inscripción exitosa!');
      navigate(`/eventos/${id}/success`);

    } catch (error) {
      console.error('Error creating inscription:', error);
      
      let errorMessage = 'Error al crear la inscripción';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Ya estás inscrito en este evento';
        } else if (error.response.status === 500) {
          errorMessage = 'Error del servidor. Intenta nuevamente.';
        } else {
          errorMessage = error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Cargando formulario de inscripción...</h2>
          <p>Preparando todos los datos necesarios para tu inscripción.</p>
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
          <Link to={`/eventos/${id}`}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Volver al Evento
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Evento no encontrado</h2>
          <Link to="/eventos">
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Ver Todos los Eventos
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-xl max-w-2xl mx-auto p-5">
        <div className="flex justify-between align-center mb-5">
          <h1 className="h2 mb-0">Inscripción: {event.nombre}</h1>
          <Link to={`/eventos/${id}`} className="caption font-bold text-primary">
            ← Volver
          </Link>
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-5">
          <h3 className="h5 mb-3">Resumen del Evento</h3>
          <div className="grid grid-2 gap-3 text-sm">
            <div className="flex flex-column gap-1">
              <span className="font-bold">📅 Fecha:</span>
              <span>{new Date(event.fecha_inicio).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-column gap-1">
              <span className="font-bold">📍 Ubicación:</span>
              <span>{event.ubicacion}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-column gap-4">
          <div className="form-group">
            <label className="form-label">Categoría *</label>
            <select
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id_categoria} value={category.id_categoria}>
                  {category.nombre} {category.descripcion ? `- ${category.descripcion}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Talla de Playera *</label>
            <select
              name="id_talla_playera"
              value={formData.id_talla_playera}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Selecciona una talla</option>
              {shirtSizes.map(size => (
                <option key={size.id_talla_playera} value={size.id_talla_playera}>
                  {size.talla} - {size.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Equipo (Opcional)</label>
            <select
              name="id_equipo"
              value={formData.id_equipo}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Ninguno (Participar individualmente)</option>
              {userTeams.map(team => (
                <option key={team.id_equipo} value={team.id_equipo}>
                  {team.nombre}
                </option>
              ))}
            </select>
            <p className="caption mt-1">Si no seleccionas un equipo, participarás individualmente</p>
          </div>

          <div className="form-group">
            <label className="form-label">Alias Dorsal (Opcional)</label>
            <input
              type="text"
              name="alias_dorsal"
              value={formData.alias_dorsal}
              onChange={handleChange}
              maxLength="3"
              placeholder="Máx. 3 caracteres"
              className="form-control"
            />
            <p className="caption mt-1">Este alias aparecerá en tu dorsal durante la carrera</p>
          </div>

          <div className="bg-primary-alpha p-4 rounded-md mb-4">
            <h3 className="h5 mb-2 text-primary">Resumen de Inscripción</h3>
            <p className="font-bold">Cuota: ${event.cuota_inscripcion || '0'}</p>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Link to={`/eventos/${id}`} className="btn btn-outline">
              Cancelar
            </Link>
            <button 
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? <Spinner /> : 'Confirmar Inscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
