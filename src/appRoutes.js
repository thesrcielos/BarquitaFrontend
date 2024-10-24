import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginSignUp from './loginSignUp';
import Tasks from './tasks';
import ProtectedRoute from './ProtectedRoute';
import InsightsUser from './insightsUser';
import AdminPage from './adminPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/loginSignUp" element={<LoginSignUp />} />
      <Route path="/insightsuser" element={
        <ProtectedRoute>
          <InsightsUser />
        </ProtectedRoute>
        } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks/>
        </ProtectedRoute>
        } />
        <Route path='/admin'>
          <ProtectedRoute>
              <AdminPage/>
          </ProtectedRoute>
        </Route>
    </Routes>
  );
}

export default AppRoutes;