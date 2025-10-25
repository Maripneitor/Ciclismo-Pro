import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';

function TeamDetailPage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await apiClient.get(`/teams/${id}`);
        setTeam(response.data.data);
      } catch (error) {
        console.error('Error fetching team:', error);
        setError(error.response?.data?.message || 'Error al cargar el equipo');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) return <div className="container"><p>Cargando equipo...</p></div>;
  if (error) return <div className="container"><p>{error}</p></div>;
  if (!team) return <div className="container"><p>Equipo no encontrado</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>{team.nombre}</h1>
        <Link to="/dashboard/teams" style={{ color: 'var(--primary-500)' }}>
          ← Volver a Mis Equipos
        </Link>
      </div>

      <div style={{ 
        border: '1px solid #ccc', 
        padding: '2rem', 
        borderRadius: '8px',
        backgroundColor: 'white',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-600)', marginBottom: '1rem' }}>Información del Equipo</h2>
          {team.descripcion && (
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              {team.descripcion}
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Capitán:</strong> {team.nombre_capitan}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Fecha de creación:</strong> {new Date(team.fecha_creacion).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Total de miembros:</strong> {team.miembros.length}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ color: 'var(--primary-600)', marginBottom: '1rem' }}>Miembros del Equipo</h2>
          {team.miembros.length === 0 ? (
            <p style={{ color: 'var(--neutral-500)' }}>No hay miembros en este equipo.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {team.miembros.map(member => (
                <div key={member.id_usuario} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  backgroundColor: member.es_capitan ? 'var(--primary-50)' : 'var(--neutral-50)'
                }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>
                      {member.nombre_completo}
                      {member.es_capitan && (
                        <span style={{ 
                          marginLeft: '0.5rem',
                          padding: '0.1rem 0.5rem',
                          backgroundColor: 'var(--primary-500)',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem'
                        }}>
                          Capitán
                        </span>
                      )}
                    </span>
                    <br />
                    <small style={{ color: 'var(--neutral-500)' }}>
                      {member.correo_electronico}
                    </small>
                  </div>
                  <small style={{ color: 'var(--neutral-500)' }}>
                    Se unió: {new Date(member.fecha_union).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamDetailPage;