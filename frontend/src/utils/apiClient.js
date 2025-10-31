// frontend/src/utils/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // FALTA /api aquí
  withCredentials: true,
});

// Interceptor para agregar el token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;