import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo_electronico: '',
    contrasena: '',
    confirmar_contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthTexts = ['', 'Débil', 'Moderada', 'Fuerte', 'Muy fuerte'];
    return { strength, text: strengthTexts[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.contrasena);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!formData.nombre_completo || !formData.correo_electronico || !formData.contrasena) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    if (formData.contrasena !== formData.confirmar_contrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    console.log('Registering user:', {
      nombre_completo: formData.nombre_completo,
      email: formData.correo_electronico
    });

    const result = await registerUser(
      formData.nombre_completo,
      formData.correo_electronico,
      formData.contrasena
    );
    
    if (result.success) {
      navigate('/login', { 
        state: { message: '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.' }
      });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* ========== VISUAL PANEL ========== */}
      <div className="visual-panel">
        <div className="visual-content">
          <span className="visual-icon">🚴‍♀️</span>
          <h1 className="visual-title">Únete a Nosotros</h1>
          <p className="visual-subtitle">
            Crea tu cuenta y comienza tu aventura en el mundo del ciclismo. 
            Accede a eventos exclusivos y conecta con una comunidad apasionada.
          </p>
          
          <div className="visual-features">
            <div className="visual-feature">
              <span className="feature-icon">🎯</span>
              <span>Eventos exclusivos</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">👥</span>
              <span>Comunidad activa</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">📊</span>
              <span>Seguimiento de progreso</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">🛡️</span>
              <span>Inscripciones seguras</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FORM PANEL ========== */}
      <div className="form-panel">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Registrarse</h1>
            <p className="form-subtitle">
              Crea tu cuenta en menos de un minuto
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="nombre_completo" className="form-label">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
                className="form-input"
                disabled={loading}
              />
            </div>

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
              {formData.contrasena && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill ${
                        passwordStrength.strength === 1 ? 'strength-weak' :
                        passwordStrength.strength === 2 ? 'strength-medium' :
                        passwordStrength.strength >= 3 ? 'strength-strong' : ''
                      }`}
                    ></div>
                  </div>
                  <div className="strength-text">
                    {passwordStrength.text}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmar_contrasena" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmar_contrasena"
                name="confirmar_contrasena"
                value={formData.confirmar_contrasena}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="terms-group">
              <input
                type="checkbox"
                id="accept-terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="terms-checkbox"
                disabled={loading}
              />
              <label htmlFor="accept-terms" className="terms-label">
                Acepto los{' '}
                <Link to="/terms" className="terms-link">
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link to="/privacy" className="terms-link">
                  Política de Privacidad
                </Link>
              </label>
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
                  Creando cuenta...
                </span>
              ) : (
                '🚀 Crear Cuenta'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="form-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;