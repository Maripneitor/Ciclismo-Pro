import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
// Importa los estilos comunes que ahora están en el Layout
// (No es necesario importar OrganizerCommon.css aquí) 

function RegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setLoading(true);
        setError(''); // Limpia errores anteriores
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
        addToast('Error al cargar los datos de inscripción', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrationData();
  }, [id, addToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.id_categoria || !formData.id_talla_playera) {
      const errorMessage = 'La categoría y la talla de playera son obligatorias';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      setIsSubmitting(false);
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
      
      addToast('¡Inscripción exitosa!', 'success');
      // Asegúrate que la ruta de éxito use el 'id'
      navigate(`/eventos/${id}/success`); 

    } catch (error) {
      console.error('Error creating inscription:', error);
      let errorMessage = 'Error al crear la inscripción';
      if (error.response) {
        errorMessage = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state" style={{ minHeight: '60vh' }}>
          <div className="loading-spinner"></div>
          <h2>Cargando formulario de inscripción...</h2>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2 className="empty-title text-error">Error</h2>
          <p className="empty-description">{error}</p>
          <Link to={`/eventos/${id}`} className="btn btn-primary">
            Volver al Evento
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Usamos 'admin-card' porque es un panel genérico con los estilos correctos */ }
      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div className="admin-header" style={{ paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div className="header-content">
            <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Inscripción de Evento</h1>
            <p className="page-subtitle">Estás a punto de inscribirte en:</p>
            <h2 className="page-title" style={{ fontSize: '1.5rem', color: 'var(--app-text-accent)', marginTop: '0.5rem' }}>{event.nombre}</h2>
          </div>
          <div className="header-actions">
            <Link to={`/eventos/${id}`} className="btn btn-outline">
              ← Volver
            </Link>
          </div>
        </div>
        
        {/* Usamos 'content-section' para un fondo diferenciado */ }
        <div className="content-section" style={{ padding: '1.5rem', backgroundColor: 'var(--app-bg-primary)', boxShadow: 'none', marginBottom: '2rem' }}>
          <h3 className="section-title" style={{ border: 'none', padding: 0, fontSize: '1.25rem' }}>Detalles del Evento</h3>
          <div className="grid grid-2 gap-4">
            <div>
              <p className="mb-1"><strong>Fecha:</strong></p>
              <p className="text-muted">{new Date(event.fecha_inicio).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="mb-1"><strong>Ubicación:</strong></p>
              <p className="text-muted">{event.ubicacion}</p>
            </div>
            <div>
              <p className="mb-1"><strong>Distancia:</strong></p>
              <p className="text-muted">{event.distancia_km} km</p>
            </div>
            <div>
              <p className="mb-1"><strong>Dificultad:</strong></p>
              <p className="text-muted">{event.dificultad}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-error" role="alert" style={{ margin: '1.5rem 0' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="id_categoria">Categoría *</label>
            <select name="id_categoria" id="id_categoria" value={formData.id_categoria} onChange={handleChange} required>
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id_categoria} value={category.id_categoria}>
                  {category.nombre} {category.descripcion ? `- ${category.descripcion}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="id_talla_playera">Talla de Playera *</label>
            <select name="id_talla_playera" id="id_talla_playera" value={formData.id_talla_playera} onChange={handleChange} required>
              <option value="">Selecciona una talla</option>
              {shirtSizes.map(size => (
                <option key={size.id_talla_playera} value={size.id_talla_playera}>
                  {size.talla} - {size.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="id_equipo">Equipo (Opcional)</label>
            <select name="id_equipo" id="id_equipo" value={formData.id_equipo} onChange={handleChange}>
              <option value="">Ninguno (Participar individualmente)</option>
              {userTeams.map(team => (
                <option key={team.id_equipo} value={team.id_equipo}>
                  {team.nombre}
                </option>
              ))}
            </select>
            <small className="text-muted" style={{ marginTop: '0.5rem' }}>
              Si no seleccionas un equipo, participarás individualmente.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="alias_dorsal">Alias en Dorsal (Opcional)</label>
            <input
              type="text"
              name="alias_dorsal"
              id="alias_dorsal"
              value={formData.alias_dorsal}
              onChange={handleChange}
              maxLength="3"
              placeholder="Máx. 3 caracteres"
            />
            <small className="text-muted" style={{ marginTop: '0.5rem' }}>
              Este alias (ej. "MAX") aparecerá en tu dorsal.
            </small>
          </div>

          <div className="content-section" style={{ padding: '1.5rem', backgroundColor: 'var(--app-bg-primary)', boxShadow: 'none', margin: '2rem 0' }}>
            <h3 className="section-title" style={{ border: 'none', padding: 0, fontSize: '1.25rem' }}>Resumen de Inscripción</h3>
            <p className="mb-1">
              <strong>Cuota de inscripción:</strong>
            </p>
            <h2 style={{ color: 'var(--app-text-accent)', marginTop: 0 }}>
              ${event.cuota_inscripcion || '0.00'}
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Al hacer clic en "Confirmar Inscripción", serás inscrito en el evento.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Link to={`/eventos/${id}`} className="btn btn-outline">
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? <Spinner /> : 'Confirmar Inscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;