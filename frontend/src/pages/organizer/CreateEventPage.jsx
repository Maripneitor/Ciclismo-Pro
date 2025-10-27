import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import Spinner from '../../components/Spinner';

function CreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    ubicacion: '',
    distancia_km: '',
    dificultad: '',
    tipo: '',
    cuota_inscripcion: '',
    maximo_participantes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setError('');
    try {
      const eventData = {
        ...formData,
        distancia_km: parseFloat(formData.distancia_km),
        cuota_inscripcion: parseFloat(formData.cuota_inscripcion),
        maximo_participantes: formData.maximo_participantes ?
parseInt(formData.maximo_participantes) : null
      };

      const response = await apiClient.post('/organizer/my-events', eventData);
      
      alert('¡Evento creado exitosamente!');
      navigate('/organizer/events');
    } catch (error) {
      console.error('Error creating event:', error);
      let errorMessage = 'Error al crear el evento';
      
      if (error.response) {
        errorMessage = error.response.data?.message ||
`Error ${error.response.status}`;
      } else if (error.request) {
        errorMessage = `No se pudo conectar con el servidor.
Verifica tu conexión.`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
          <h1>Crear Nuevo Evento</h1>
          <Link to="/organizer/events" style={{ color: 'var(--primary-500)' }}>
            ← Volver a Mis Eventos
          </Link>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem'
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
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Distancia (km) *
              </label>
              <input
                type="number"
                name="distancia_km"
                value={formData.distancia_km}
                onChange={handleChange}
                required
                min="0"
                step="0.1"
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
                Dificultad *
              </label>
              <select
                name="dificultad"
                value={formData.dificultad}
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
                <option value="">Seleccionar</option>
                <option value="Fácil">Fácil</option>
                <option value="Moderado">Moderado</option>
                <option value="Difícil">Difícil</option>
                <option value="Extremo">Extremo</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Tipo *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
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
                <option value="">Seleccionar</option>
                <option value="Carretera">Carretera</option>
                <option value="Montaña">Montaña</option>
                <option value="Gravel">Gravel</option>
                <option value="Urbano">Urbano</option>
                <option value="Competitivo">Competitivo</option>
                <option value="Recreativo">Recreativo</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
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
                min="0"
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
              disabled={isLoading}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: isLoading ?
'var(--neutral-400)' : 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ?
'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {isLoading ?
<Spinner /> : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;