import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';

function RegistrationPage() {
  const { id } = useParams();
  
  // Estados para almacenar los datos
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [shirtSizes, setShirtSizes] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    id_categoria: '',
    id_talla_playera: '',
    id_equipo: '',
    alias_dorsal: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setLoading(true);
        
        // Hacer todas las peticiones en paralelo
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

        // Actualizar estados con los datos recibidos
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo mostramos los datos en consola
    console.log('Datos del formulario:', formData);
    console.log('Evento:', event);
    alert('Funcionalidad de pago en desarrollo. Datos del formulario en consola.');
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
    <div className="container">
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        border: '1px solid #ccc', 
        padding: '2rem', 
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Inscripción para: {event.nombre}</h1>
          <Link to={`/eventos/${id}`} style={{ color: 'var(--primary-500)' }}>
            ← Volver al Evento
          </Link>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: 'var(--neutral-50)', 
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Información del Evento</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Fecha:</strong> {new Date(event.fecha_inicio).toLocaleDateString()}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Ubicación:</strong> {event.ubicacion}
              </p>
            </div>
            <div>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Distancia:</strong> {event.distancia_km} km
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Dificultad:</strong> {event.dificultad}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campo: Categoría */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Categoría *
            </label>
            <select
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id_categoria} value={category.id_categoria}>
                  {category.nombre} {category.descripcion ? `- ${category.descripcion}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Campo: Talla de Playera */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Talla de Playera *
            </label>
            <select
              name="id_talla_playera"
              value={formData.id_talla_playera}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Selecciona una talla</option>
              {shirtSizes.map(size => (
                <option key={size.id_talla_playera} value={size.id_talla_playera}>
                  {size.talla} - {size.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Campo: Equipo (Opcional) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Equipo (Opcional)
            </label>
            <select
              name="id_equipo"
              value={formData.id_equipo}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Ninguno (Participar individualmente)</option>
              {userTeams.map(team => (
                <option key={team.id_equipo} value={team.id_equipo}>
                  {team.nombre}
                </option>
              ))}
            </select>
            <small style={{ color: 'var(--neutral-500)', marginTop: '0.5rem', display: 'block' }}>
              Si no seleccionas un equipo, participarás individualmente
            </small>
          </div>

          {/* Campo: Alias Dorsal */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Alias Dorsal (Opcional)
            </label>
            <input
              type="text"
              name="alias_dorsal"
              value={formData.alias_dorsal}
              onChange={handleChange}
              maxLength="3"
              placeholder="Máx. 3 caracteres"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <small style={{ color: 'var(--neutral-500)', marginTop: '0.5rem', display: 'block' }}>
              Este alias aparecerá en tu dorsal durante la carrera
            </small>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--primary-50)', 
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>Resumen de Inscripción</h3>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Cuota de inscripción:</strong> ${event.cuota_inscripcion || '0'}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
              Al continuar, serás redirigido al proceso de pago para completar tu inscripción.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to={`/eventos/${id}`}>
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
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Continuar al Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;