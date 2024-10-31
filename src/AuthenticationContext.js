import React, { createContext, useState, useContext, useCallback} from 'react';
import { loginUser, registerUser, getUserDBInfo } from './connectionBackend';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const verifyAuth = async () =>{
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      if (storedToken !== null) {
        setIsAuthenticated(true);
        let role = await getRoles(storedToken);
        setLoading(false);
        return {authenticated:true, role:role};
      }else{
        setIsAuthenticated(false);
        setLoading(false);
        return {authenticated:false};
      }
    }
  
  const getRoles = useCallback(async (token) => {
    try {
      const email = jwtDecode(token).sub;
      let user = await getUserDBInfo(email);
      setUser(user);
      return user.role;
    } catch (error) {
      console.error("Token inválido:", error);
      return [];
    }
  }, []);

  const getUserInfo = useCallback(() =>{
    return user}, [user]);

  const login = async ({email, password}) => {
    const userCredentials = { email: email, password:password };
    setLoading(true);
    try{
      const response = await loginUser(userCredentials);

      if(!response.ok){
        return handleLoginError(response);
      }
      const data = await response.json();
      handleSuccessfulAuthentication(data.token);
      let role = await getRoles(data.token);
      return {authenticated: true, role : role}

    }catch(e){
      return {authenticated: false, error:'Error vuelve a intentarlo mas tarde'};
    }finally{
      setLoading(false);
    }
};

  const register = async (user) => {
    setLoading(true);
    try {
      const response = await registerUser(user);
  
      if (!response.ok) {
        return handleRegistrationError(response.status);
      }
  
      const data = await response.json();
      handleSuccessfulAuthentication(data.token);
      let role = getRoles(data.token);
      return { created: true, role : role };
    } catch (e) {
      console.error("Error en el registro:", e);
      return { created: false, error: 'Error vuelve a intentarlo mas tarde' };
    }finally{
      setLoading(false);
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
    <AuthContext.Provider value={{login, logout, isUserAuthenticated, register, getUserInfo, verifyAuth, loading, setLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
