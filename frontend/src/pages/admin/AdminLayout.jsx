import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

function AdminLayout() {
  const { user } = useContext(AuthContext);

  const adminNavLinks = [
    { to: '/admin/dashboard', icon: 'FiBarChart2', text: 'Dashboard' },
    { to: '/admin/users', icon: 'FiUsers', text: 'Gestión de Usuarios' },
    { to: '/admin/events', icon: 'FiCalendar', text: 'Todos los Eventos' },
    { to: '/admin/products', icon: 'FiShoppingCart', text: 'Gestión de Productos' },
    { to: '/admin/orders', icon: 'FiPackage', text: 'Pedidos' },
    { to: '/admin/settings', icon: 'FiSettings', text: 'Configuración' }
  ];

  const adminQuickLinks = [
    { to: '/eventos', icon: 'FiMap', text: 'Explorar Eventos' },
    { to: '/store', icon: 'FiShoppingCart', text: 'Ir a la Tienda' }
  ];

  const adminStats = [
    { number: '0', label: 'Usuarios' },
    { number: '0', label: 'Eventos' }
  ];

  return (
    <DashboardLayout
      title="Panel Administrador"
      welcomeText="Administrador"
      navLinks={adminNavLinks}
      quickLinks={adminQuickLinks}
      stats={adminStats}
      themeColor="admin"
    >
      <Outlet />
    </DashboardLayout>
  );
}

export default AdminLayout;