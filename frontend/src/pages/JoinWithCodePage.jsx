import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

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
    <div className="container">
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto',
        border: '1px solid #ccc', 
        padding: '2rem', 
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Unirse a un Equipo</h1>
          <Link to="/dashboard/teams" style={{ color: 'var(--primary-500)' }}>
            ← Volver
          </Link>
        </div>

        {error && (
          <div style={{ 
            color: 'var(--error)', 
            marginBottom: '1rem', 
            padding: '0.75rem',
            backgroundColor: '#ffe6e6',
            border: '1px solid var(--error)',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Código de Invitación *
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
              placeholder="Ingresa el código de invitación del equipo"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <small style={{ color: 'var(--neutral-500)', marginTop: '0.5rem', display: 'block' }}>
              Pídele al capitán del equipo que te comparta el código de invitación.
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/dashboard/teams">
              <button 
                type="button"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--neutral-600)',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: loading ? 'var(--neutral-400)' : 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Uniéndose...' : 'Unirse al Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinWithCodePage;