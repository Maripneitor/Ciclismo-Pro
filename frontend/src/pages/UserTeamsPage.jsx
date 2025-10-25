import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';

function UserTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Obtener usuario del contexto de autenticación

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get('/teams/my-teams');
        setTeams(response.data.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError('Error al cargar los equipos');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <div className="container"><p>Cargando equipos...</p></div>;
  if (error) return <div className="container"><p>{error}</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Mis Equipos</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/dashboard" style={{ color: 'var(--primary-500)' }}>
            ← Volver al Dashboard
          </Link>
          <Link to="/dashboard/teams/join">
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--secondary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Unirse a Equipo
            </button>
          </Link>
          <Link to="/dashboard/teams/create">
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Crear Nuevo Equipo
            </button>
          </Link>
        </div>
      </div>

      {teams.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          border: '2px dashed #ccc', 
          borderRadius: '8px',
          backgroundColor: 'var(--neutral-50)'
        }}>
          <h3>No perteneces a ningún equipo aún</h3>
          <p>¡Crea tu primer equipo o únete a uno existente!</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <Link to="/dashboard/teams/join">
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--secondary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Unirse a un Equipo
              </button>
            </Link>
            <Link to="/dashboard/teams/create">
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Crear Mi Primer Equipo
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {teams.map(team => (
            <Link 
              key={team.id_equipo} 
              to={`/dashboard/teams/${team.id_equipo}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                border: '1px solid #ccc',
                padding: '1.5rem',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }} onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--primary-600)' }}>
                      {team.nombre}
                    </h3>
                    {team.descripcion && (
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--neutral-600)' }}>
                        {team.descripcion}
                      </p>
                    )}
                  </div>
                  {user && team.id_capitan === user.id_usuario && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'var(--primary-500)',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      CAPITÁN
                    </span>
                  )}
                </div>
                
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: 'var(--neutral-500)' }}>
                    Capitán: {team.nombre_capitan}
                  </small>
                  <small style={{ color: 'var(--neutral-500)' }}>
                    Creado: {new Date(team.fecha_creacion).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserTeamsPage;