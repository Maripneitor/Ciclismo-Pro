import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const [formData, setFormData] = useState({
    correo_electronico: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!formData.correo_electronico || !formData.contrasena) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    console.log('Attempting login with:', {
      email: formData.correo_electronico,
      password: formData.contrasena
    });

    const result = await loginUser(formData.correo_electronico, formData.contrasena);
    
    console.log('Login result:', result);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Error desconocido en el login');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="correo_electronico" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo_electronico"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="contrasena" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '1rem', 
              padding: '0.5rem',
              backgroundColor: '#ffe6e6',
              border: '1px solid red',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              backgroundColor: loading ? '#ccc' : '#0073e6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;