import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

function JoinTeamPage() {
  const { inviteToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const joinTeam = async () => {
      try {
        const response = await apiClient.post('/teams/join', {
          enlace_invitacion: inviteToken
        });
        
        // Redirigir a la lista de equipos si es exitoso
        navigate('/dashboard/teams', { 
          replace: true,
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

    if (inviteToken) {
      joinTeam();
    } else {
      setError('Token de invitación no válido');
      setLoading(false);
    }
  }, [inviteToken, navigate]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Uniéndose al equipo...</h2>
        <p>Procesando tu solicitud de unión al equipo.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '2rem', 
          borderRadius: '8px',
          backgroundColor: 'white',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Error</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--neutral-600)' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/dashboard">
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Volver al Dashboard
              </button>
            </Link>
            <Link to="/dashboard/teams">
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: 'var(--primary-500)',
                border: '1px solid var(--primary-500)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Mis Equipos
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default JoinTeamPage;