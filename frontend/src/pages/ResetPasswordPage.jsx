// frontend/src/pages/ResetPasswordPage.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import './ResetPasswordPage.css';

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nuevaContrasena: '',
    confirmarContrasena: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!formData.nuevaContrasena || !formData.confirmarContrasena) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (formData.nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post(`/api/auth/reset-password/${token}`, {
        nuevaContrasena: formData.nuevaContrasena
      });

      if (response.data.success) {
        setMessage('¡Contraseña actualizada exitosamente!');
        setFormData({ nuevaContrasena: '', confirmarContrasena: '' });
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* ========== VISUAL PANEL ========== */}
      <div className="visual-panel">
        <div className="visual-content">
          <span className="visual-icon">🔄</span>
          <h1 className="visual-title">Nueva Contraseña</h1>
          <p className="visual-subtitle">
            Crea una nueva contraseña segura para tu cuenta. 
            Asegúrate de que sea diferente a las anteriores.
          </p>
          
          <div className="visual-features">
            <div className="visual-feature">
              <span className="feature-icon">🔐</span>
              <span>Contraseña segura</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">✅</span>
              <span>Confirmación requerida</span>
            </div>
            <div className="visual-feature">
              <span className="feature-icon">⚡</span>
              <span>Acceso inmediato</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FORM PANEL ========== */}
      <div className="form-panel">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Nueva Contraseña</h1>
            <p className="form-subtitle">
              Ingresa y confirma tu nueva contraseña
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
                <br />
                <small>Redirigiendo al login...</small>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="nuevaContrasena" className="form-label">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="nuevaContrasena"
                name="nuevaContrasena"
                value={formData.nuevaContrasena}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="form-input"
                disabled={loading}
                minLength="6"
              />
              <small className="form-hint">Mínimo 6 caracteres</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="form-input"
                disabled={loading}
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !!message}
              className="submit-button"
            >
              {loading ? (
                <span className="loading-text">
                  <div className="loading-spinner"></div>
                  Actualizando contraseña...
                </span>
              ) : (
                '🔄 Actualizar Contraseña'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              <Link to="/login" className="form-link">
                ← Volver al Inicio de Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
