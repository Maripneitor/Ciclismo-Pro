import { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function OrganizerDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/organizer/dashboard-data');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching organizer dashboard:', error);
        setError(error.response?.data?.message || 'Error al cargar el panel de organizador');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando panel de organizador...</h2>
        <p>Obteniendo datos del sistema...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--error)' }}>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Panel de Organizador</h1>
        <p style={{ color: 'var(--neutral-600)' }}>
          Bienvenido al área exclusiva para organizadores y administradores
        </p>
      </div>

      {dashboardData && (
        <div>
          {/* Mensaje de bienvenida */}
          <div style={{ 
            backgroundColor: 'var(--primary-50)', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid var(--primary-200)'
          }}>
            <h2 style={{ color: 'var(--primary-700)', marginBottom: '1rem' }}>
              {dashboardData.message}
            </h2>
            <p>ID de usuario: {dashboardData.data.user.id}</p>
            <p>Rol: <strong>{dashboardData.data.user.rol}</strong></p>
          </div>

          {/* Estadísticas */}
          <div style={{ marginBottom: '2rem' }}>
            <h3>Estadísticas del Sistema</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--neutral-200)',
                textAlign: 'center'
              }}>
                <h4 style={{ color: 'var(--primary-600)', margin: '0 0 0.5rem 0' }}>
                  {dashboardData.data.stats.totalEvents}
                </h4>
                <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Eventos Totales</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--neutral-200)',
                textAlign: 'center'
              }}>
                <h4 style={{ color: 'var(--secondary-600)', margin: '0 0 0.5rem 0' }}>
                  {dashboardData.data.stats.pendingRegistrations}
                </h4>
                <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Inscripciones Pendientes</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--neutral-200)',
                textAlign: 'center'
              }}>
                <h4 style={{ color: 'var(--success)', margin: '0 0 0.5rem 0' }}>
                  {dashboardData.data.stats.activeParticipants}
                </h4>
                <p style={{ margin: 0, color: 'var(--neutral-600)' }}>Participantes Activos</p>
              </div>
            </div>
          </div>

          {/* Funcionalidades disponibles */}
          <div>
            <h3>Funcionalidades Disponibles</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem',
              marginTop: '1rem'
            }}>
              {dashboardData.data.features.map((feature, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-200)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: 'var(--primary-500)' }}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizerDashboardPage;