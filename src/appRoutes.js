import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginSignUp from './loginSignUp';
import Tasks from './tasks';
import Insights from './insights';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/loginSignUp" element={<LoginSignUp />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/tasks" element={<Tasks/>} />
    </Routes>
  );
}

export default AppRoutes;