import { useState, useEffect, useContext } from 'react'; // Importar useContext
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { AuthContext } from '../context/AuthContext'; // Importar AuthContext
import Spinner from '../components/Spinner'; // Importar Spinner

function UserTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext); // <-- OBTENER USUARIO

  // Determinar si el usuario puede crear equipos
  const canCreateTeams = user && (user.rol === 'administrador' || user.rol === 'organizador');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
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

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando tus equipos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <h3 className="empty-title text-error">{error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page"> {/* Usamos admin-page para el layout y padding */}
      
      <div className="admin-header">
        <div className="header-content">
          <h1 className="page-title">Mis Equipos</h1>
          <p className="page-subtitle">Gestiona los equipos a los que perteneces o lideras.</p>
        </div>
        <div className="header-actions">
          {/* ----- INICIO DE LA SOLUCIÓN (Lógica de Roles) ----- */}
          <Link to="/dashboard/teams/join" className="btn btn-secondary">
            Unirse a Equipo
          </Link>
          {canCreateTeams && (
            <Link to="/dashboard/teams/create" className="btn btn-primary">
              + Crear Nuevo Equipo
            </Link>
          )}
          {/* ----- FIN DE LA SOLUCIÓN ----- */}
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3 className="empty-title">No perteneces a ningún equipo aún</h3>
          <p className="empty-description">¡Crea tu primer equipo o únete a uno existente!</p>
          <div className="empty-actions">
            <Link to="/dashboard/teams/join" className="btn btn-secondary">
              Unirse a un Equipo
            </Link>
            {canCreateTeams && (
              <Link to="/dashboard/teams/create" className="btn btn-primary">
                Crear Mi Primer Equipo
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-grid-view" style={{ padding: 0 }}>
          {teams.map(team => (
            <Link 
              key={team.id_equipo} 
              to={`/dashboard/teams/${team.id_equipo}`}
              className="admin-card-link" // Nueva clase para enlaces de tarjeta
            >
              <div className="admin-card">
                <div className="card-header" style={{ borderBottomColor: 'var(--app-text-accent)' }}>
                  <h3 className="card-title">{team.nombre}</h3>
                  {user && team.id_capitan === user.id_usuario && (
                    <span className="status-badge" style={{ backgroundColor: 'var(--app-text-accent)' }}>
                      CAPITÁN
                    </span>
                  )}
                </div>
                {team.descripcion && (
                  <p className="text-muted" style={{ marginBottom: '1rem' }}>
                    {team.descripcion}
                  </p>
                )}
                <div className="flex justify-between text-muted" style={{ fontSize: '0.9rem' }}>
                  <span><strong>Capitán:</strong> {team.nombre_capitan}</span>
                  <span><strong>Creado:</strong> {new Date(team.fecha_creacion).toLocaleDateString()}</span>
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