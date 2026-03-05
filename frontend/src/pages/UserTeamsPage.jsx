import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FiUsers, 
  FiPlus, 
  FiLogIn, 
  FiStar,
  FiChevronRight,
  FiInfo
} from 'react-icons/fi';

function UserTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

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

  if (loading) return (
    <div className="flex flex-center py-5 min-h-200">
      <div className="loading-spinner"></div>
    </div>
  );

  if (error) return (
    <div className="card bg-error-alpha p-5 text-center">
      <FiInfo className="text-error mb-3" size={32} />
      <p className="text-error mb-0">{error}</p>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between align-center mb-5">
        <div className="flex flex-column gap-1">
          <h1 className="h2 mb-0">Mis Equipos</h1>
          <p className="text-muted text-sm">Gestiona tus escuadras y colabora con otros ciclistas.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/teams/join" className="btn btn-outline btn-small flex align-center gap-1">
            <FiLogIn /> Unirse
          </Link>
          <Link to="/dashboard/teams/create" className="btn btn-primary btn-small flex align-center gap-1">
            <FiPlus /> Crear Equipo
          </Link>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="card p-5 text-center bg-card shadow-sm border-dashed">
          <div className="text-primary opacity-20 mb-4"><FiUsers size={64} /></div>
          <h3 className="h4 mb-2">Aún no tienes equipo</h3>
          <p className="text-muted mb-4">¡Forma tu propia escuadra o únete a una existente!</p>
          <div className="flex flex-center gap-3">
            <Link to="/dashboard/teams/join" className="btn btn-outline">Unirse a uno</Link>
            <Link to="/dashboard/teams/create" className="btn btn-primary">Crear el mío</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-2 gap-4">
          {teams.map(team => (
            <Link 
              key={team.id_equipo} 
              to={`/dashboard/teams/${team.id_equipo}`}
              className="card p-4 bg-card hover-lift shadow-sm relative no-underline border-none flex flex-column justify-between"
            >
              <div>
                <div className="flex justify-between align-start mb-3">
                  <div className="flex flex-column gap-1">
                    <h3 className="h4 mb-0 text-main">{team.nombre}</h3>
                    <p className="text-xs text-muted line-clamp-1">{team.descripcion || 'Sin descripción'}</p>
                  </div>
                  {user && team.id_capitan === user.id_usuario && (
                    <span className="badge bg-primary-alpha text-primary font-bold flex align-center gap-1">
                      <FiStar size={12} /> CAPITÁN
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between align-center mt-4 pt-3 border-top border-color">
                  <div className="flex flex-column">
                     <span className="caption text-muted font-bold text-xs uppercase">Capitán</span>
                     <span className="text-sm font-bold text-main truncate">{team.nombre_capitan}</span>
                  </div>
                  <div className="flex flex-column text-right">
                     <span className="caption text-muted font-bold text-xs uppercase">Desde</span>
                     <span className="text-sm text-main">{new Date(team.fecha_creacion).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                 <span className="text-primary text-sm font-bold flex align-center gap-1">
                    Ver Team <FiChevronRight />
                 </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserTeamsPage;
