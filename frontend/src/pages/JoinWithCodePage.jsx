import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import Spinner from '../components/Spinner';

function JoinWithCodePage() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!inviteCode.trim()) {
      setError('Por favor ingresa el código de invitación');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/teams/join', {
        enlace_invitacion: inviteCode
      });
      
      navigate('/dashboard/teams', { 
        state: { 
          message: response.data.message || '¡Te has unido al equipo exitosamente!'
        }
      });
    } catch (error) {
      console.error('Error joining team:', error);
      setError(error.response?.data?.message || 'Error al unirse al equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div className="admin-header" style={{ paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div className="header-content">
            <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Unirse a un Equipo</h1>
          </div>
          <div className="header-actions">
            <Link to="/dashboard/teams" className="btn btn-outline">
              ← Volver
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="inviteCode">
              Código de Invitación *
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
              placeholder="Ingresa el código de invitación del equipo"
            />
            <small className="text-muted" style={{ marginTop: '0.5rem' }}>
              Pídele al capitán del equipo que te comparta el código de invitación.
            </small>
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '2rem' }}>
            <Link to="/dashboard/teams" className="btn btn-outline">
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? <Spinner /> : 'Unirse al Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinWithCodePage;