import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

const Home = () => {
  return (
    <nav>
      <ul className="nav-list">
        <li>
          <Link to="/tasks" className="nav-button">Home</Link>
        </li>
        <li>
          <Link to="/insights" className="nav-button">Insights</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Home;