import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import Spinner from '../components/Spinner';
import './UserProfilePage.css';

function UserProfilePage() {
  const [profileData, setProfileData] = useState({
    nombre_completo: '',
    correo_electronico: '',
    fecha_nacimiento: '',
    genero: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
    talla_playera: '',
    tipo_bicicleta: '',
    nivel_experiencia: '',
    alergias: '',
    condiciones_medicas: '',
    direccion: '',
    ciudad: '',
    pais: '',
    codigo_postal: '',
    marca_bicicleta: '',
    modelo_bicicleta: '',
    ano_bicicleta: '',
    talla_bicicleta: ''
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        setProfileData(response.data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.put('/users/profile', profileData);
      setSuccess('¡Perfil actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="header-content">
          <h1 className="page-title">Mi Perfil</h1>
          <p className="page-subtitle">
            Gestiona tu información personal y preferencias de ciclismo
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-outline">
          ← Volver al Panel
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-sections">
          <section className="form-section">
            <h2 className="section-title">Información Personal</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={profileData.nombre_completo || ''}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  name="correo_electronico"
                  value={profileData.correo_electronico || ''}
                  disabled
                  className="form-input disabled"
                />
                <small className="form-help">El email no se puede modificar</small>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={profileData.fecha_nacimiento || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Género
                </label>
                <select
                  name="genero"
                  value={profileData.genero || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                  <option value="Prefiero no decir">Prefiero no decir</option>
                </select>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">Datos de Ciclismo</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Talla de Playera
                </label>
                <select
                  name="talla_playera"
                  value={profileData.talla_playera || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Seleccionar</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tipo de Bicicleta
                </label>
                <select
                  name="tipo_bicicleta"
                  value={profileData.tipo_bicicleta || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Seleccionar</option>
                  <option value="Carretera">Carretera</option>
                  <option value="Montaña">Montaña</option>
                  <option value="Híbrida">Híbrida</option>
                  <option value="Urbana">Urbana</option>
                  <option value="Gravel">Gravel</option>
                  <option value="Eléctrica">Eléctrica</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Nivel de Experiencia
                </label>
                <select
                  name="nivel_experiencia"
                  value={profileData.nivel_experiencia || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Seleccionar</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Profesional">Profesional</option>
                </select>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">Contacto de Emergencia</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Nombre del Contacto
                </label>
                <input
                  type="text"
                  name="contacto_emergencia"
                  value={profileData.contacto_emergencia || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  name="telefono_emergencia"
                  value={profileData.telefono_emergencia || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">Información Médica</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">
                  Alergias
                </label>
                <textarea
                  name="alergias"
                  value={profileData.alergias || ''}
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Lista cualquier alergia relevante..."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Condiciones Médicas
                </label>
                <textarea
                  name="condiciones_medicas"
                  value={profileData.condiciones_medicas || ''}
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Condiciones médicas que debamos conocer..."
                />
              </div>
            </div>
          </section>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? <Spinner /> : 'Guardar Cambios'}
          </button>
          
          <Link to="/dashboard" className="btn btn-outline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UserProfilePage;