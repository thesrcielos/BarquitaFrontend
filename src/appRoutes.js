import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginSignUp from './loginSignUp';
import Tasks from './tasks';
import ProtectedRoute from './ProtectedRoute';
import InsightsUser from './insightsUser';
import AdminPanel from './AdminPanel';
import InsightsAdmin from './insightsAdmin';
import UserProfile from './profile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginSignUp />} />
      <Route path="/insightsUser" element={
        <ProtectedRoute>
          <InsightsUser />
        </ProtectedRoute>
        } />
        <Route path="/insightsAdmin" element={
        <ProtectedRoute>
          <InsightsAdmin/>
        </ProtectedRoute>
        } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks/>
        </ProtectedRoute>
        } />
        <Route path="/admin"
          element = {
          <ProtectedRoute>
              <AdminPanel/>
          </ProtectedRoute>
          }
        />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile/>
          </ProtectedRoute>
        }></Route>
    </Routes>
  );
}

export default AppRoutes;