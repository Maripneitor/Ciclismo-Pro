import { useState, useEffect } from 'react';
import apiClient from '../services/api';

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
  const [saving, setSaving] = useState(false);
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
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.put('/users/profile', profileData);
      setSuccess('¡Perfil actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>Cargando perfil...</p></div>;

  return (
    <div className="container">
      <h1>Mi Perfil</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ 
        border: '1px solid #ccc', 
        padding: '2rem', 
        margin: '1rem 0',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <h2>Información Personal</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Nombre Completo:</strong>
          </label>
          <input
            type="text"
            name="nombre_completo"
            value={profileData.nombre_completo || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Email:</strong>
          </label>
          <input
            type="email"
            name="correo_electronico"
            value={profileData.correo_electronico || ''}
            disabled
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f5f5f5' }}
          />
          <small>El email no se puede modificar</small>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Fecha de Nacimiento:</strong>
          </label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={profileData.fecha_nacimiento || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Género:</strong>
          </label>
          <select
            name="genero"
            value={profileData.genero || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">Seleccionar</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>
        </div>

        <h3 style={{ marginTop: '2rem' }}>Datos de Ciclismo</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Contacto de Emergencia:</strong>
          </label>
          <input
            type="text"
            name="contacto_emergencia"
            value={profileData.contacto_emergencia || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Teléfono de Emergencia:</strong>
          </label>
          <input
            type="tel"
            name="telefono_emergencia"
            value={profileData.telefono_emergencia || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Talla de Playera:</strong>
          </label>
          <select
            name="talla_playera"
            value={profileData.talla_playera || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Tipo de Bicicleta:</strong>
          </label>
          <select
            name="tipo_bicicleta"
            value={profileData.tipo_bicicleta || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Nivel de Experiencia:</strong>
          </label>
          <select
            name="nivel_experiencia"
            value={profileData.nivel_experiencia || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">Seleccionar</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Profesional">Profesional</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Alergias:</strong>
          </label>
          <textarea
            name="alergias"
            value={profileData.alergias || ''}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Condiciones Médicas:</strong>
          </label>
          <textarea
            name="condiciones_medicas"
            value={profileData.condiciones_medicas || ''}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Dirección:</strong>
          </label>
          <input
            type="text"
            name="direccion"
            value={profileData.direccion || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Ciudad:</strong>
          </label>
          <input
            type="text"
            name="ciudad"
            value={profileData.ciudad || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>País:</strong>
          </label>
          <input
            type="text"
            name="pais"
            value={profileData.pais || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Código Postal:</strong>
          </label>
          <input
            type="text"
            name="codigo_postal"
            value={profileData.codigo_postal || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Marca de Bicicleta:</strong>
          </label>
          <input
            type="text"
            name="marca_bicicleta"
            value={profileData.marca_bicicleta || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Modelo de Bicicleta:</strong>
          </label>
          <input
            type="text"
            name="modelo_bicicleta"
            value={profileData.modelo_bicicleta || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Año de Bicicleta:</strong>
          </label>
          <input
            type="number"
            name="ano_bicicleta"
            value={profileData.ano_bicicleta || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>Talla de Bicicleta:</strong>
          </label>
          <input
            type="text"
            name="talla_bicicleta"
            value={profileData.talla_bicicleta || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          style={{ 
            padding: '0.75rem 2rem', 
            backgroundColor: '#0073e6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}

export default UserProfilePage;