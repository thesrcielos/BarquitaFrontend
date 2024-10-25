import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginSignUp from './loginSignUp';
import Tasks from './tasks';
import ProtectedRoute from './ProtectedRoute';
import InsightsUser from './insightsUser';
import AdminPage from './adminPage';
import { AuthProvider } from './AuthenticationContext';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/loginSignUp" element={<LoginSignUp />} />
      <Route path="/insights" element={
        <ProtectedRoute>
          <InsightsUser />
        </ProtectedRoute>
        } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks/>
        </ProtectedRoute>
        } />
        <Route path='/admin'
          element = {
          <ProtectedRoute>
              <AdminPage/>
          </ProtectedRoute>
          }
        />
    </Routes>
  );
}

export default AppRoutes;