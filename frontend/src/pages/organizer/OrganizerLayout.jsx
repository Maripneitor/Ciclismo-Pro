import { Outlet } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import apiClient from '../../services/api';
import './OrganizerCommon.css';

function OrganizerLayout() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalEvents: 0, totalParticipants: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/organizer/dashboard-data');
        setStats({
          totalEvents: response.data.data.stats.totalEvents,
          totalParticipants: response.data.data.stats.totalParticipants
        });
      } catch (error) {
        console.error('Error fetching organizer stats:', error);
      }
    };

    fetchStats();
  }, []);

  const organizerNavLinks = [
  { to: '/organizer/dashboard', icon: 'FiBarChart2', text: 'Dashboard' },
  { to: '/organizer/events', icon: 'FiCalendar', text: 'Mis Eventos' },
  { to: '/organizer/events/create', icon: 'FiPlus', text: 'Crear Evento' },
  { to: '/organizer/participants', icon: 'FiUsers', text: 'Participantes' },
  { to: '/organizer/reports', icon: 'FiTrendingUp', text: 'Reportes' }
];

  const organizerQuickLinks = [
    { to: '/eventos', icon: '🗺️', text: 'Explorar Eventos' },
    { to: '/store', icon: '🛒', text: 'Ir a la Tienda' }
  ];

  const organizerStats = [
    { number: stats.totalEvents.toString(), label: 'Eventos Activos' },
    { number: stats.totalParticipants.toString(), label: 'Total Participantes' }
  ];

  return (
    <DashboardLayout
      title="Panel Organizador"
      welcomeText="Organizador"
      navLinks={organizerNavLinks}
      quickLinks={organizerQuickLinks}
      stats={organizerStats}
      themeColor="organizer"
    >
      <Outlet />
    </DashboardLayout>
  );
}

export default OrganizerLayout;