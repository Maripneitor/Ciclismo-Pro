// frontend/src/pages/admin/AdminUserManagementPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import '../admin/AdminCommon.css';
function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/admin/users');
        setUsers(response.data.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/role`, {
        nuevoRol: newRole
      });
      if (response.data.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id_usuario === userId
              ? { ...user, rol: newRole }
              : user
          )
        );
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error al actualizar el rol del usuario');
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };
  const getRoleColor = (rol) => {
    switch (rol) {
      case 'administrador': return 'var(--color-warning)';
      case 'organizador': return 'var(--color-primary)';
      case 'usuario': return 'var(--color-success)';
      default: return 'var(--color-gray-medium)';
    }
  };
  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* ========== HEADER ========== */}
      <div className="admin-header">
        <div className="header-content">
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">
            Administra los usuarios del sistema y sus roles
          </p>
        </div>
        <div className="header-actions">
          <Link to="/admin" className="btn btn-outline">
            ← Volver al Panel
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* ========== STATS CARD ========== */}
      <div className="admin-card">
        <div className="card-header">
          <h2 className="card-title">Resumen de Usuarios</h2>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--spacing-lg)' 
        }}>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontFamily: 'var(--font-primary)', 
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {users.length}
            </div>
            <div style={{ color: 'var(--color-gray-medium)' }}>Total Usuarios</div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontFamily: 'var(--font-primary)', 
              color: 'var(--color-success)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {users.filter(u => u.rol === 'usuario').length}
            </div>
            <div style={{ color: 'var(--color-gray-medium)' }}>Usuarios Normales</div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontFamily: 'var(--font-primary)', 
              color: 'var(--color-warning)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {users.filter(u => u.rol === 'organizador').length}
            </div>
            <div style={{ color: 'var(--color-gray-medium)' }}>Organizadores</div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontFamily: 'var(--font-primary)', 
              color: 'var(--color-error)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {users.filter(u => 
u.rol === 'administrador').length}
            </div>
            <div style={{ color: 'var(--color-gray-medium)' }}>Administradores</div>
          </div>
        </div>
      </div>

      {/* ========== USERS TABLE ========== */}
      <div className="admin-table-container">
        <div className="table-header">
          <h3 className="table-title">Lista de Usuarios</h3>
          <p className="table-subtitle">
            {users.length} usuario{users.length !== 1 ?
's' : ''} registrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>

        {users.length === 0 ?
(
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3 className="empty-title">No hay usuarios registrados</h3>
            <p className="empty-description">
              Los usuarios aparecerán aquí una vez que se registren en la plataforma.
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id_usuario}>
                  <td>
                    <div>
                      <strong style={{ color: 'var(--color-secondary)' }}>
                        {user.nombre_completo}
                      </strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-medium)' }}>
                        ID: {user.id_usuario}
                      </div>
                    </div>
                  </td>
                  <td>{user.correo_electronico}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getRoleColor(user.rol),
                        color: 'var(--color-white)'
                      }}
                    >
                      {user.rol}
                    </span>
                  </td>
                  <td>{formatDate(user.fecha_creacion)}</td>
                  <td>
                    <div className="table-actions">
                      <select
                        value={user.rol}
                        onChange={(e) => handleRoleChange(user.id_usuario, e.target.value)}
                        className="filter-select"
                        style={{ minWidth: '120px' }}
                      >
                        <option value="usuario">Usuario</option>
                        <option value="organizador">Organizador</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminUserManagementPage;