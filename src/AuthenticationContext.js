import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser } from './connectionBackend';
import jwtDecode from 'jwt-decode';
// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken !== null) {
      setIsAuthenticated(true);
      role = getRolesFromToken(storedToken)[0];
      navigate(role);
    }else{
      setIsAuthenticated(false);
    }
  }, []);

  function getRolesFromToken(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.roles || []; // Si no hay roles, retorna un array vacío
    } catch (error) {
      console.error("Token inválido:", error);
      return [];
    }
  }

  const navigate = (role) => {
    if(user === 'ROLE_USER'){
      navigate('/tasks');
    }else{
      navigate('/admin');
    }
  }
  const login = async ({email, password}) => {
    const userCredentials = { email: email, password:password };
    try{
      const response = await loginUser(userCredentials);

      if(!response.ok){
        return handleLoginError(response);
      }
      const data = await response.json();
      handleSuccessfulAuthentication(data.token);
      return {authenticated: true, role : getRolesFromToken(data.token)}

    }catch(e){
      return {authenticated: false, error:'Error vuelve a intentarlo mas tarde'};
    }
};

  const register = async (user) => {
    try {
      const response = await registerUser(user);
  
      if (!response.ok) {
        return handleRegistrationError(response.status);
      }
  
      const data = await response.json();
      handleSuccessfulAuthentication(data.token);
  
      return { created: true, role : getRolesFromToken(data.token) };
    } catch (e) {
      console.error("Error en el registro:", e);
      return { created: false, error: 'Error vuelve a intentarlo mas tarde' };
    }
  };
  
  const handleRegistrationError = (response) => {
    let status = response.status;
    if (status === 400) {
      return { created: false, error: 'Datos inválidos' };
    }
    return { created: false, error: 'Error desconocido' };
  };
  
  const handleLoginError = (response) => {
    let status = response.status;
    if (status === 401) {
      return { authenticated: false, error: 'Email o contraseña incorrecto' };
    }
    return { created: false, error: 'Error vuelve a intentarlo mas tarde' };
  }

  const handleSuccessfulAuthentication = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };
  
  const isUserAuthenticated = () => {
    return isAuthenticated;
  }

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{login, logout, isUserAuthenticated, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
