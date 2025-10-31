// /home/maripneitor/Ciclismo-Pro/frontend/src/pages/admin/AdminUserManagementPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserManagement } from '../../hooks/useUserManagement';
import '../admin/AdminCommon.css';
import '../admin/AdminBase.css';
import '../admin/AdminComponents.css';

// IMPORTACIONES DE ICONOS
import { 
  FiUsers, 
  FiArrowLeft, 
  FiPieChart, 
  FiList, 
  FiUser, 
  FiMail, 
  FiShield, 
  FiCalendar,
  FiAlertCircle,
  FiGrid,
  FiMinimize2,
  FiMaximize2,
  FiLayers,
  FiSquare,
  FiPlus,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';

function AdminUserManagementPage() {
  const {
    users,
    loading,
    error,
    selectedUsers,
    selectAll,
    handleRoleChange,
    handleDeleteUser,
    handleEditUser,
    handleCreateUser,
    handleSelectUser,
    handleSelectAll,
    formatDate,
    getRoleColor,
    exportToCSV,
    exportToPDF,
    exportToExcel
  } = useUserManagement();

  // Estados para controles de tabla
  const [tableDensity, setTableDensity] = useState('comfortable');
  const [tableStyle, setTableStyle] = useState('flat');
  const [tableView, setTableView] = useState('list');

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
          <h1 className="page-title">
            <FiUsers style={{ marginRight: '1rem', verticalAlign: 'bottom' }} />
            Gestión de Usuarios
          </h1>
          <p className="page-subtitle">
            Administra los usuarios del sistema y sus roles
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={handleCreateUser}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiPlus />
            Crear Usuario
          </button>
          <Link to="/admin" className="btn btn-outline">
            <FiArrowLeft style={{ marginRight: '0.5rem' }} />
            Volver al Panel
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiAlertCircle />
          {error}
        </div>
      )}

      {/* ========== STATS CARD ========== */}
      <div className="admin-card">
        <div className="card-header">
          <h2 className="card-title">
            <FiPieChart style={{ marginRight: '0.5rem', verticalAlign: 'bottom' }} />
            Resumen de Usuarios
          </h2>
          <div className="card-actions">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-md)',
              fontSize: '0.9rem',
              color: 'var(--color-gray-medium)'
            }}>
              <strong>Total: {users.length} registros</strong>
              {selectedUsers.length > 0 && (
                <span style={{ 
                  background: 'var(--color-primary)', 
                  color: 'white', 
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.8rem'
                }}>
                  {selectedUsers.length} seleccionados
                </span>
              )}
            </div>
          </div>
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
              {users.filter(u => u.rol === 'administrador').length}
            </div>
            <div style={{ color: 'var(--color-gray-medium)' }}>Administradores</div>
          </div>
        </div>
      </div>

      {/* ========== USERS TABLE ========== */}
      <div className={`
        admin-table-container 
        view-${tableDensity}
        view-${tableStyle}
        view-${tableView}
      `}>
        <div className="table-header">
          <div className="table-header-content">
            <h3 className="table-title">
              <FiList style={{ marginRight: '0.5rem', verticalAlign: 'bottom' }} />
              Lista de Usuarios
            </h3>
            <p className="table-subtitle">
              {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
              {selectedUsers.length > 0 && ` • ${selectedUsers.length} seleccionado${selectedUsers.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* BOTONES DE EXPORTACIÓN - SOLO CUANDO HAY SELECCIONADOS */}
            {selectedUsers.length > 0 && (
              <div className="control-group" style={{ background: 'rgba(0, 123, 255, 0.1)', padding: 'var(--spacing-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '600', padding: '0 var(--spacing-sm)' }}>
                  Exportar selección:
                </span>
                <div className="export-buttons-group compact">
                  <button 
                    className="export-button csv export-button-sm"
                    onClick={exportToCSV}
                    title="Exportar selección a CSV"
                  >
                    <div className="docs">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="download">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </div>
                  </button>
                  <button 
                    className="export-button excel export-button-sm"
                    onClick={exportToExcel}
                    title="Exportar selección a Excel"
                  >
                    <div className="docs">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="download">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </div>
                  </button>
                  <button 
                    className="export-button pdf export-button-sm"
                    onClick={exportToPDF}
                    title="Exportar selección a PDF"
                  >
                    <div className="docs">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="download">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* CONTROLES DE VISTA DE TABLA */}
            <div className="table-style-controls">
              {/* Grupo: Controles de Visualización */}
              <div className="control-group">
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-medium)', padding: '0 var(--spacing-sm)' }}>
                  Vista:
                </span>
                <button 
                  className={`control-btn ${tableView === 'list' ? 'active' : ''}`}
                  onClick={() => setTableView('list')}
                  title="Vista de Lista"
                >
                  <FiList />
                </button>
                <button 
                  className={`control-btn ${tableView === 'grid' ? 'active' : ''}`}
                  onClick={() => setTableView('grid')}
                  title="Vista de Grid"
                >
                  <FiGrid />
                </button>
              </div>

              {/* Grupo: Controles de Densidad */}
              <div className="control-group">
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-medium)', padding: '0 var(--spacing-sm)' }}>
                  Densidad:
                </span>
                <button 
                  className={`control-btn ${tableDensity === 'comfortable' ? 'active' : ''}`}
                  onClick={() => setTableDensity('comfortable')}
                  title="Vista Cómoda"
                >
                  <FiMaximize2 />
                </button>
                <button 
                  className={`control-btn ${tableDensity === 'compact' ? 'active' : ''}`}
                  onClick={() => setTableDensity('compact')}
                  title="Vista Compacta"
                >
                  <FiMinimize2 />
                </button>
              </div>
              
              {/* Grupo: Controles de Estilo */}
              <div className="control-group">
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-medium)', padding: '0 var(--spacing-sm)' }}>
                  Estilo:
                </span>
                <button 
                  className={`control-btn ${tableStyle === 'flat' ? 'active' : ''}`}
                  onClick={() => setTableStyle('flat')}
                  title="Estilo Plano"
                >
                  <FiSquare />
                </button>
                <button 
                  className={`control-btn ${tableStyle === 'striped' ? 'active' : ''}`}
                  onClick={() => setTableStyle('striped')}
                  title="Estilo Rayado"
                >
                  <FiLayers />
                </button>
              </div>

              {/* Grupo: Exportación Global */}
              <div className="control-group">
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-medium)', padding: '0 var(--spacing-sm)' }}>
                  Exportar:
                </span>
                <div className="export-buttons-group compact">
                  <button 
                    className="export-button csv export-button-sm"
                    onClick={exportToCSV}
                    title="Exportar todo a CSV"
                  >
                    <div className="docs">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="download">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </div>
                  </button>
                  <button 
                    className="export-button excel export-button-sm"
                    onClick={exportToExcel}
                    title="Exportar todo a Excel"
                  >
                    <div className="docs">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="download">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </div>
                  </button>
                  <button 
                    className="export-button pdf export-button-sm"
                    onClick={exportToPDF}
                    title="Exportar todo a PDF"
                  >
                    <div className="docs">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="download">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FiUsers /></div>
            <h3 className="empty-title">No hay usuarios registrados</h3>
            <p className="empty-description">
              Los usuarios aparecerán aquí una vez que se registren en la plataforma.
            </p>
            <button 
              className="btn btn-primary"
              onClick={handleCreateUser}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'var(--spacing-md)' }}
            >
              <FiPlus />
              Crear Primer Usuario
            </button>
          </div>
        ) : (
          <>
            {/* VISTA DE LISTA (TABLA) */}
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer' }}
                      title="Seleccionar todos"
                    />
                  </th>
                  <th><FiUser style={{ marginRight: '0.5rem', verticalAlign: 'bottom' }} /> Usuario</th>
                  <th><FiMail style={{ marginRight: '0.5rem', verticalAlign: 'bottom' }} /> Email</th>
                  <th><FiShield style={{ marginRight: '0.5rem', verticalAlign: 'bottom' }} /> Rol</th>
                  <th><FiCalendar style={{ marginRight: '0.5rem', verticalAlign: 'bottom' }} /> Fecha Registro</th>
                  <th style={{ width: '200px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user.id_usuario}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id_usuario)}
                        onChange={() => handleSelectUser(user.id_usuario)}
                        style={{ cursor: 'pointer' }}
                        title="Seleccionar usuario"
                      />
                    </td>
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
                        <button
                          className="action-btn action-btn-secondary"
                          onClick={() => handleEditUser(user.id_usuario)}
                          title="Editar usuario"
                          style={{ minWidth: '40px' }}
                        >
                          <FiEdit />
                        </button>
                        <select
                          value={user.rol}
                          onChange={(e) => handleRoleChange(user.id_usuario, e.target.value)}
                          className="filter-select"
                          style={{ minWidth: '130px' }}
                          title="Cambiar rol"
                        >
                          <option value="usuario">Usuario</option>
                          <option value="organizador">Organizador</option>
                          <option value="administrador">Administrador</option>
                        </select>
                        <button
                          className="action-btn action-btn-outline"
                          onClick={() => handleDeleteUser(user.id_usuario)}
                          title="Eliminar usuario"
                          style={{ minWidth: '40px' }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* VISTA DE GRID (TARJETAS) */}
            <div className="admin-grid-view">
              {users.map((user, index) => (
                <div 
                  className="admin-grid-card" 
                  key={user.id_usuario}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id_usuario)}
                      onChange={() => handleSelectUser(user.id_usuario)}
                      style={{ cursor: 'pointer', marginTop: '2px' }}
                      title="Seleccionar usuario"
                    />
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button
                        className="action-btn action-btn-secondary"
                        onClick={() => handleEditUser(user.id_usuario)}
                        title="Editar usuario"
                        style={{ padding: 'var(--spacing-xs)' }}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="action-btn action-btn-outline"
                        onClick={() => handleDeleteUser(user.id_usuario)}
                        title="Eliminar usuario"
                        style={{ padding: 'var(--spacing-xs)' }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <h4 className="grid-card-title">{user.nombre_completo}</h4>
                  <p className="grid-card-email">{user.correo_electronico}</p>
                  
                  <div className="grid-card-meta">
                    <span className="grid-card-id">ID: {user.id_usuario}</span>
                    <span 
                      className="status-badge" 
                      style={{ 
                        backgroundColor: getRoleColor(user.rol), 
                        color: 'var(--color-white)' 
                      }}
                    >
                      {user.rol}
                    </span>
                  </div>

                  <p className="grid-card-date">Registro: {formatDate(user.fecha_creacion)}</p>
                  
                  <div className="grid-card-actions">
                    <select
                      value={user.rol}
                      onChange={(e) => handleRoleChange(user.id_usuario, e.target.value)}
                      className="filter-select"
                      title="Cambiar rol"
                    >
                      <option value="usuario">Usuario</option>
                      <option value="organizador">Organizador</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminUserManagementPage;