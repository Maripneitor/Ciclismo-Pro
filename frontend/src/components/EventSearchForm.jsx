import { useState } from 'react';
import './EventSearchForm.css';

function EventSearchForm({ onSearch, initialData = {} }) {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    ubicacion: initialData.ubicacion || '',
    dificultad: initialData.dificultad || '',
    tipo: initialData.tipo || '',
    fecha_inicio: initialData.fecha_inicio || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpiar campos vacíos antes de enviar
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    
    onSearch(cleanedData);
  };

  const handleClear = () => {
    setFormData({
      nombre: '',
      ubicacion: '',
      dificultad: '',
      tipo: '',
      fecha_inicio: ''
    });
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-grid">
        <div className="search-group">
          <label className="search-label">🔍 Nombre del evento</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Buscar por nombre..."
            className="search-input"
          />
        </div>
        
        <div className="search-group">
          <label className="search-label">📍 Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ciudad o región..."
            className="search-input"
          />
        </div>
        
        <div className="search-group">
          <label className="search-label">⚡ Dificultad</label>
          <select
            name="dificultad"
            value={formData.dificultad}
            onChange={handleChange}
            className="search-select"
          >
            <option value="">Todas las dificultades</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>
        
        <div className="search-group">
          <label className="search-label">🚴 Tipo de evento</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="search-select"
          >
            <option value="">Todos los tipos</option>
            <option value="carretera">Carretera</option>
            <option value="montaña">Montaña</option>
            <option value="gravel">Gravel</option>
            <option value="urbano">Urbano</option>
          </select>
        </div>
        
        <div className="search-group">
          <label className="search-label">📅 Fecha desde</label>
          <input
            type="date"
            name="fecha_inicio"
            value={formData.fecha_inicio}
            onChange={handleChange}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="search-actions">
        <button type="submit" className="search-button search-button-primary">
          🔍 Buscar Eventos
        </button>
        <button 
          type="button" 
          onClick={handleClear}
          className="search-button search-button-secondary"
        >
          🗑️ Limpiar
        </button>
      </div>
    </form>
  );
}

export default EventSearchForm;