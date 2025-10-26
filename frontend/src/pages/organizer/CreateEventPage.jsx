import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';

function CreateEventPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    ubicacion: '',
    distancia_km: '',
    dificultad: 'media',
    cuota_inscripcion: '',
    maximo_participantes: '',
    tipo: 'carrera'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    // Validaciones básicas
    if (!formData.nombre || !formData.fecha_inicio || !formData.ubicacion) {
      setError('Nombre, fecha de inicio y ubicación son campos obligatorios');
      setLoading(false);
      return;
    }

    // Preparar datos para enviar (convertir números)
    const submissionData = {
      ...formData,
      distancia_km: formData.distancia_km ? parseFloat(formData.distancia_km) : null,
      cuota_inscripcion: formData.cuota_inscripcion ? parseFloat(formData.cuota_inscripcion) : 0,
      maximo_participantes: formData.maximo_participantes ? parseInt(formData.maximo_participantes) : null
    };

    try {
      console.log('Creating event with data:', submissionData);
      
      const response = await apiClient.post('/organizer/my-events', submissionData);
      
      alert('¡Evento creado exitosamente!');
      navigate('/organizer/events');
      
    } catch (error) {
      console.error('Error creating event:', error);
      
      let errorMessage = 'Error al crear el evento';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Datos del evento inválidos';
        } else if (error.response.status === 500) {
          errorMessage = 'Error del servidor. Intenta nuevamente.';
        } else {
          errorMessage = error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1>Crear Nuevo Evento</h1>
          <p style={{ color: 'var(--neutral-600)' }}>
            Completa la información para crear un nuevo evento de ciclismo
          </p>
        </div>
        <Link to="/organizer/events">
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--neutral-600)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            ← Volver a Mis Eventos
          </button>
        </Link>
      </div>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        border: '1px solid #ccc', 
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
          {/* Información Básica */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-600)' }}>
              Información Básica
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Nombre del Evento *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Gran Fondo Montaña, Carrera Urbana, etc."
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                placeholder="Describe el evento, recorrido, reglas, etc."
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Fecha de Inicio *
                </label>
                <input
                  type="datetime-local"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Fecha de Fin
                </label>
                <input
                  type="datetime-local"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Ubicación *
              </label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                required
                placeholder="Ej: Parque Central, Ciudad, País"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {/* Detalles del Evento */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-600)' }}>
              Detalles del Evento
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Distancia (km)
                </label>
                <input
                  type="number"
                  name="distancia_km"
                  value={formData.distancia_km}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="0"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Dificultad
                </label>
                <select
                  name="dificultad"
                  value={formData.dificultad}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="facil">Fácil</option>
                  <option value="media">Media</option>
                  <option value="dificil">Difícil</option>
                  <option value="extremo">Extremo</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Tipo de Evento
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="carrera">Carrera</option>
                  <option value="fondo">Gran Fondo</option>
                  <option value="recreativo">Recreativo</option>
                  <option value="competitivo">Competitivo</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Cuota de Inscripción ($)
                </label>
                <input
                  type="number"
                  name="cuota_inscripcion"
                  value={formData.cuota_inscripcion}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Máximo de Participantes
                </label>
                <input
                  type="number"
                  name="maximo_participantes"
                  value={formData.maximo_participantes}
                  onChange={handleChange}
                  min="1"
                  placeholder="Ilimitado"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--primary-50)', 
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>
              Resumen del Evento
            </h4>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
              Al crear el evento, este aparecerá en la lista de eventos disponibles para inscripción.
              Podrás gestionar inscripciones y ver estadísticas desde tu panel de organizador.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/organizer/events">
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
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Creando Evento...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;