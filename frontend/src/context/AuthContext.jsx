import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem('token', token);
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User authenticated:', userData);
      } catch (error) {
        console.error('Error parsing token:', error);
        logoutUser();
      }
    }
  }, [token]);

  const registerUser = async (nombre_completo, correo_electronico, contrasena) => {
    try {
      console.log('Registering user:', { nombre_completo, correo_electronico });
      const response = await axios.post('/api/auth/register', {
        nombre_completo,
        correo_electronico,
        contrasena
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        setToken(response.data.token);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Error en el registro' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el registro' 
      };
    }
  };

  const loginUser = async (correo_electronico, contrasena) => {
    try {
      console.log('Logging in user:', { correo_electronico });
      const response = await axios.post('/api/auth/login', {
        correo_electronico,
        contrasena
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        setToken(response.data.token);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Error en el login' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Error en el login';
      
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.response.status === 500) {
          errorMessage = 'Error del servidor. Intenta nuevamente.';
        } else {
          errorMessage = error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const logoutUser = () => {
    console.log('Logging out user');
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