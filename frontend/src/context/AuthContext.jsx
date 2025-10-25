import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, [token]);

  const registerUser = async (nombre_completo, correo_electronico, contrasena) => {
    try {
      const response = await axios.post('/api/auth/register', {
        nombre_completo,
        correo_electronico,
        contrasena
      });
      
      if (response.data.success) {
        setToken(response.data.token);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el registro' 
      };
    }
  };

  const loginUser = async (correo_electronico, contrasena) => {
    try {
      const response = await axios.post('/api/auth/login', {
        correo_electronico,
        contrasena
      });
      
      if (response.data.success) {
        setToken(response.data.token);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el login' 
      };
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated,
      registerUser,
      loginUser,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};