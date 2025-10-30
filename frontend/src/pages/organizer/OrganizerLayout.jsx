import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

function OrganizerLayout() {
  const { user } = useContext(AuthContext);

  const organizerNavLinks = [
    { to: '/organizer/dashboard', icon: 'FiBarChart2', text: 'Dashboard' },
    { to: '/organizer/events', icon: 'FiCalendar', text: 'Mis Eventos' },
    { to: '/organizer/events/create', icon: 'FiPlus', text: 'Crear Evento' },
    { to: '/organizer/participants', icon: 'FiUsers', text: 'Participantes' }, // CORREGIDO: ruta correcta
    { to: '/organizer/reports', icon: 'FiTrendingUp', text: 'Reportes' } // CORREGIDO: ruta correcta
  ];

  const organizerQuickLinks = [
    { to: '/eventos', icon: 'FiMap', text: 'Explorar Eventos' },
    { to: '/store', icon: 'FiShoppingCart', text: 'Ir a la Tienda' }
  ];

  const organizerStats = [
    { number: '0', label: 'Eventos Activos' },
    { number: '0', label: 'Total Participantes' }
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