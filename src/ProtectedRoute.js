import React from 'react';
import { useAuth } from './AuthenticationContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isUserAuthenticated } = useAuth();

  return isUserAuthenticated() ? children : <Navigate to="/loginSignUp" />;
};

export default ProtectedRoute;