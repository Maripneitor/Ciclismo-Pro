import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

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
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
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
      email: formData.correo_electronico
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
    <div className="auth-container">
      {/* ========== VISUAL PANEL ========== */}
      <div className="visual-panel">
        <div className="visual-content">
          <span className="visual-icon">🚴‍♂️</span>
          <h1 className="visual-title">Bienvenido de Vuelta</h1>
          <p className="visual-subtitle">
            Accede a tu cuenta para gestionar tus inscripciones, 
            unirte a equipos y descubrir nuevos eventos ciclistas.
          </p>
          
          <div className="visual-features">
            <div className="visual-feature">
              <span className="feature-icon">✅</span>
              <span>Gestiona tus inscripciones</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">👥</span>
              <span>Únete a equipos</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">🎯</span>
              <span>Descubre eventos exclusivos</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">📊</span>
              <span>Revisa tu progreso</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FORM PANEL ========== */}
      <div className="form-panel">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Iniciar Sesión</h1>
            <p className="form-subtitle">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="correo_electronico" className="form-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo_electronico"
                name="correo_electronico"
                value={formData.correo_electronico}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="form-input"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <span className="loading-text">
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Iniciando sesión...
                </span>
              ) : (
                '🚀 Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="form-footer">
  <p>
    ¿No tienes cuenta?{' '}
    <Link to="/register" className="form-link">
      Regístrate aquí
    </Link>
  </p>
  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
    <Link to="/forgot-password" className="form-link">
      ¿Olvidaste tu contraseña?
    </Link>
  </p>
</div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;