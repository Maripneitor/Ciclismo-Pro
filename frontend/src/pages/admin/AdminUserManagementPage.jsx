import { useState, useEffect } from 'react';
import apiClient from '../../services/api';

function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingRoles, setUpdatingRoles] = useState({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/users');
        setUsers(response.data.data.users || []);
      } catch (error) {
        console.error('Error fetching all users:', error);
        setError(error.response?.data?.message || 'Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Mostrar estado de carga para este usuario específico
      setUpdatingRoles(prev => ({ ...prev, [userId]: true }));
      
      const response = await apiClient.put(
        `/admin/users/${userId}/role`,
        { nuevoRol: newRole }
      );

      if (response.data.success) {
        // Actualizar el estado local del usuario
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id_usuario === userId
              ? { ...user, rol: newRole }
              : user
          )
        );
        
        console.log(`Rol actualizado para usuario ${userId}: ${newRole}`);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(error.response?.data?.message || 'Error al actualizar el rol');
    } finally {
      // Remover estado de carga para este usuario
      setUpdatingRoles(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'administrador': return 'var(--primary-500)';
      case 'organizador': return 'var(--secondary-500)';
      case 'usuario': return 'var(--neutral-500)';
      default: return 'var(--neutral-400)';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'administrador': return 'Administrador';
      case 'organizador': return 'Organizador';
      case 'usuario': return 'Usuario';
      default: return role;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Cargando usuarios...</h2>
        <p>Obteniendo lista completa de usuarios de la plataforma...</p>
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
        <h1>Gestión de Usuarios</h1>
        <p style={{ color: 'var(--neutral-600)' }}>
          Administra todos los usuarios registrados en la plataforma
        </p>
      </div>

      {/* Resumen de estadísticas */}
      <div style={{ 
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--primary-600)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {users.length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Total Usuarios</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--secondary-600)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {users.filter(u => u.rol === 'organizador').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Organizadores</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--success)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {users.filter(u => u.rol === 'administrador').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Administradores</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--neutral-600)', 
            margin: '0 0 0.5rem 0',
            fontSize: '2rem'
          }}>
            {users.filter(u => u.rol === 'usuario').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontWeight: '500' }}>Usuarios Normales</p>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        border: '1px solid var(--neutral-200)',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          padding: '1.5rem',
          borderBottom: '1px solid var(--neutral-200)',
          backgroundColor: 'var(--neutral-50)'
        }}>
          <h2 style={{ margin: 0, color: 'var(--neutral-800)' }}>Lista de Usuarios Registrados</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--neutral-600)' }}>
            Mostrando {users.length} usuarios en total
          </p>
        </div>

        {users.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            color: 'var(--neutral-500)'
          }}>
            <h3>No hay usuarios registrados</h3>
            <p>Los usuarios aparecerán aquí una vez que se registren en la plataforma.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse' 
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: 'var(--neutral-50)',
                  borderBottom: '2px solid var(--neutral-200)'
                }}>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Nombre Completo
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Email
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Teléfono
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Rol Actual
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Cambiar Rol
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Fecha de Registro
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ID Usuario
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user.id_usuario}
                    style={{ 
                      borderBottom: '1px solid var(--neutral-100)',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ 
                      padding: '1rem', 
                      color: 'var(--neutral-800)', 
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>
                      {user.nombre_completo}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      color: 'var(--neutral-700)',
                      fontSize: '0.95rem'
                    }}>
                      {user.correo_electronico}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      color: 'var(--neutral-700)',
                      fontSize: '0.95rem'
                    }}>
                      {user.telefono || '-'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.4rem 1rem',
                        backgroundColor: getRoleColor(user.rol),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {getRoleText(user.rol)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <select
                        value={user.rol}
                        onChange={(e) => handleRoleChange(user.id_usuario, e.target.value)}
                        disabled={updatingRoles[user.id_usuario]}
                        style={{
                          padding: '0.5rem 1rem',
                          border: '1px solid var(--neutral-300)',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: 'var(--neutral-800)',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          cursor: updatingRoles[user.id_usuario] ? 'not-allowed' : 'pointer',
                          minWidth: '140px',
                          opacity: updatingRoles[user.id_usuario] ? 0.7 : 1,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (!updatingRoles[user.id_usuario]) {
                            e.currentTarget.style.borderColor = 'var(--primary-500)';
                            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 115, 230, 0.1)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!updatingRoles[user.id_usuario]) {
                            e.currentTarget.style.borderColor = 'var(--neutral-300)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <option value="usuario">Usuario</option>
                        <option value="organizador">Organizador</option>
                        <option value="administrador">Administrador</option>
                      </select>
                      {updatingRoles[user.id_usuario] && (
                        <div style={{ 
                          marginTop: '0.5rem',
                          fontSize: '0.75rem',
                          color: 'var(--primary-500)',
                          fontWeight: '500'
                        }}>
                          Actualizando...
                        </div>
                      )}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      color: 'var(--neutral-600)',
                      fontSize: '0.9rem'
                    }}>
                      {formatDate(user.fecha_creacion)}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      color: 'var(--neutral-500)',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace'
                    }}>
                      #{user.id_usuario}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información de uso */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--primary-50)',
        borderRadius: '8px',
        border: '1px solid var(--primary-200)'
      }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>💡 Información sobre Roles:</h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Usuario:</strong> Acceso básico a la plataforma. Puede inscribirse en eventos y unirse a equipos.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Organizador:</strong> Puede crear y gestionar eventos, ver participantes y aprobar inscripciones.
          </p>
          <p style={{ margin: 0, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
            <strong>Administrador:</strong> Acceso completo al sistema. Puede gestionar usuarios, eventos y toda la plataforma.
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--primary-700)', fontSize: '0.9rem', fontWeight: '500' }}>
            ⚠️ <strong>Precaución:</strong> Los cambios de rol son inmediatos y afectan los permisos del usuario.
          </p>
        </div>
      </div>

      {/* Leyenda de roles */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--neutral-50)',
        borderRadius: '8px',
        border: '1px solid var(--neutral-200)'
      }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--neutral-700)' }}>Leyenda de Roles:</h4>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: 'var(--primary-500)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Administrador - Acceso completo al sistema</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: 'var(--secondary-500)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Organizador - Puede crear y gestionar eventos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: 'var(--neutral-500)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Usuario - Acceso básico a la plataforma</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUserManagementPage;