import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginSignUp from './loginSignUp';
import Tasks from './tasks';
import Insights from './insights';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/loginSignUp" element={<LoginSignUp />} />
      <Route path="/insights" element={
        <ProtectedRoute>
          <Insights />
        </ProtectedRoute>
        } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks/>
        </ProtectedRoute>
        } />
    </Routes>
  );
}

export default AppRoutes;