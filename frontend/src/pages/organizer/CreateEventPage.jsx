import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import Spinner from '../../components/Spinner';
import { useToast } from '../../context/ToastContext';
// Los estilos vienen de OrganizerCommon.css (cargado por el Layout) y index.css

function CreateEventPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    ubicacion: '',
    distancia_km: '',
    dificultad: 'Moderado', // Valor predeterminado
    tipo: 'Carretera',   // Valor predeterminado
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
        cuota_inscripcion: parseFloat(formData.cuota_inscripcion) || 0, // Asegurar que sea un número
        maximo_participantes: formData.maximo_participantes ?
          parseInt(formData.maximo_participantes) : null
      };

      // Validación simple
      if (!eventData.nombre || !eventData.fecha_inicio || !eventData.ubicacion || !eventData.distancia_km) {
        throw new Error("Por favor completa todos los campos obligatorios (*)");
      }

      const response = await apiClient.post('/organizer/my-events', eventData);
      
      addToast('¡Evento creado exitosamente!', 'success');
      navigate('/organizer/events');
    } catch (error) {
      console.error('Error creating event:', error);
      let errorMessage = error.message || 'Error al crear el evento';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.request) {
        errorMessage = `No se pudo conectar con el servidor. Verifica tu conexión.`;
      }
      
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="organizer-page"> {/* Clase de OrganizerCommon.css */}
      <div className="content-section"> {/* Clase de OrganizerCommon.css */}
        
        <div className="admin-header"> {/* Clase de AdminCommon.css (reutilizada) */}
          <div className="header-content">
            <h1 className="page-title">Crear Nuevo Evento</h1>
          </div>
          <div className="header-actions">
            <Link to="/organizer/events" className="btn btn-outline">
              ← Volver a Mis Eventos
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
            <label className="form-label" htmlFor="nombre">Nombre del Evento *</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
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
            />
          </div>

          <div className="grid grid-2 gap-4 mb-3"> {/* Clases de index.css */}
            <div className="form-group">
              <label className="form-label" htmlFor="fecha_inicio">Fecha de Inicio *</label>
              <input
                type="datetime-local"
                name="fecha_inicio"
                id="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fecha_fin">Fecha de Fin</label>
              <input
                type="datetime-local"
                name="fecha_fin"
                id="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ubicacion">Ubicación *</label>
            <input
              type="text"
              name="ubicacion"
              id="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-3 gap-4 mb-3"> {/* Clases de index.css */}
            <div className="form-group">
              <label className="form-label" htmlFor="distancia_km">Distancia (km) *</label>
              <input
                type="number"
                name="distancia_km"
                id="distancia_km"
                value={formData.distancia_km}
                onChange={handleChange}
                required
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="dificultad">Dificultad *</label>
              <select
                name="dificultad"
                id="dificultad"
                value={formData.dificultad}
                onChange={handleChange}
                required
              >
                <option value="Fácil">Fácil</option>
                <option value="Moderado">Moderado</option>
                <option value="Difícil">Difícil</option>
                <option value="Extremo">Extremo</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tipo">Tipo *</label>
              <select
                name="tipo"
                id="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="Carretera">Carretera</option>
                <option value="Montaña">Montaña</option>
                <option value="Gravel">Gravel</option>
                <option value="Urbano">Urbano</option>
                <option value="Competitivo">Competitivo</option>
                <option value="Recreativo">Recreativo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-2 gap-4 mb-4"> {/* Clases de index.css */}
            <div className="form-group">
              <label className="form-label" htmlFor="cuota_inscripcion">Cuota de Inscripción ($)</label>
              <input
                type="number"
                name="cuota_inscripcion"
                id="cuota_inscripcion"
                value={formData.cuota_inscripcion}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="maximo_participantes">Máximo de Participantes</label>
              <input
                type="number"
                name="maximo_participantes"
                id="maximo_participantes"
                value={formData.maximo_participantes}
                onChange={handleChange}
                min="0"
                placeholder="Sin límite"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3"> {/* Clases de index.css */}
            <Link to="/organizer/events" className="btn btn-outline">
              Cancelar
            </Link>
            <button 
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? <Spinner /> : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;