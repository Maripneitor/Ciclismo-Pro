import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

function UserDashboardLayout() {
  const { user } = useContext(AuthContext);

  // Enlaces base para todos los usuarios
  const userNavLinks = [
    { to: '/dashboard', icon: 'FiHome', text: 'Inicio' },
    { to: '/dashboard/profile', icon: 'FiUser', text: 'Mi Perfil' },
    { to: '/dashboard/inscripciones', icon: 'FiFileText', text: 'Mis Inscripciones' },
    { to: '/dashboard/teams', icon: 'FiUsers', text: 'Mis Equipos' },
    { to: '/dashboard/orders', icon: 'FiPackage', text: 'Mis Pedidos' }
  ];

  // Enlaces rápidos base
  const userQuickLinks = [
    { to: '/eventos', icon: 'FiMap', text: 'Explorar Eventos' },
    { to: '/store', icon: 'FiShoppingCart', text: 'Ir a la Tienda' }
  ];

  const userStats = [
    { number: '0', label: 'Inscripciones' },
    { number: '0', label: 'Equipos' }
  ];

  return (
    <DashboardLayout
      title="Mi Panel"
      welcomeText="Hola,"
      navLinks={userNavLinks}
      quickLinks={userQuickLinks}
      stats={userStats}
      themeColor="user"
    >
      <Outlet />
    </DashboardLayout>
  );
}

export default UserDashboardLayout;