import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 
import { useAuth } from './AuthenticationContext';
const Home = () => {
  const{logout} = useAuth();
  return (
    <nav>
      <ul className="nav-list">
        <li>
          <Link to="/tasks" className="nav-button">Home</Link>
        </li>
        <li>
          <Link to="/insightsUser" className="nav-button">Insights</Link>
        </li>
        <li>
          <Link to="/" className="nav-button" onClick={logout}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Home;