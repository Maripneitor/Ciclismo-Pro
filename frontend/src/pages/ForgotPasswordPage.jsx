// frontend/src/pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/api/auth/forgot-password', {
        correo_electronico: email
      });

      if (response.data.success) {
        setMessage('Si tu correo existe, recibirás un enlace de recuperación');
        setEmail('');
      } else {
        setError(response.data.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* ========== VISUAL PANEL ========== */}
      <div className="visual-panel">
        <div className="visual-content">
          <span className="visual-icon">🔐</span>
          <h1 className="visual-title">Recuperar Contraseña</h1>
          <p className="visual-subtitle">
            Te enviaremos un enlace seguro a tu correo electrónico 
            para que puedas restablecer tu contraseña.
          </p>
          
          <div className="visual-features">
            <div className="visual-feature">
              <span className="feature-icon">📧</span>
              <span>Recibe un enlace seguro</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">⏱️</span>
              <span>Válido por 10 minutos</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">🔒</span>
              <span>Proceso completamente seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FORM PANEL ========== */}
      <div className="form-panel">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Recuperar Contraseña</h1>
            <p className="form-subtitle">
              Ingresa tu correo electrónico y te enviaremos un enlace de recuperación
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {message && (
              <div className="form-success">
                {message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
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
                  Enviando enlace...
                </span>
              ) : (
                '📧 Enviar Enlace de Recuperación'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className="form-link">
                Iniciar Sesión
              </Link>
            </p>
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="form-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;