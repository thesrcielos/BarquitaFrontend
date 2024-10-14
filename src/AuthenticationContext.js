import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser } from './connectionBackend';
// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken !== null) {
      console.log(typeof storedToken);
      console.log(storedToken !== null);
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
    }
  }, []);

  const login = async ({email, password}) => {
    const userCredentials = { email: email, password:password };
    try{
      const response = await loginUser(userCredentials);

      if(!response.ok){
        return handleLoginError(response);
      }
      const data = await response.json();
      handleSuccessfulAuthentication(data.token);
      return {authenticated: true}

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
  
      return { created: true };
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
