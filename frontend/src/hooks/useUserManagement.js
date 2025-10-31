// /home/maripneitor/Ciclismo-Pro/frontend/src/hooks/useUserManagement.js
import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await apiClient.delete(`/admin/users/${userId}`);
        if (response.data.success) {
          setUsers(prevUsers => prevUsers.filter(user => user.id_usuario !== userId));
          alert('Usuario eliminado correctamente');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleEditUser = (userId) => {
    alert(`Editar usuario ID: ${userId}`);
  };

  const handleCreateUser = () => {
    alert('Crear nuevo usuario');
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id_usuario));
    }
    setSelectAll(!selectAll);
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

  const exportToCSV = () => {
    const usersToExport = selectedUsers.length > 0 
      ? users.filter(user => selectedUsers.includes(user.id_usuario))
      : users;

    const headers = ['ID', 'Nombre Completo', 'Email', 'Rol', 'Fecha de Registro'];
    const csvData = usersToExport.map(user => [
      user.id_usuario,
      `"${user.nombre_completo}"`,
      user.correo_electronico,
      user.rol,
      formatDate(user.fecha_creacion)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const count = selectedUsers.length > 0 ? selectedUsers.length : users.length;
    alert(`Exportando ${count} usuarios a PDF...`);
  };

  const exportToExcel = () => {
    const count = selectedUsers.length > 0 ? selectedUsers.length : users.length;
    alert(`Exportando ${count} usuarios a Excel...`);
  };

  return {
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
  };
};