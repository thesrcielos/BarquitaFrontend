import Insights from "./insights";
import "./App.css";
import { useAuth } from "./AuthenticationContext";
import { Link } from 'react-router-dom';
import React from "react";

const AdminPage = () => {
  const{logout} = useAuth();
    return <div>
        <nav>
      <ul className="nav-list">
        <li>
          <Link to="/loginSignUp" className="nav-button" onClick={logout}>Logout</Link>
        </li>
      </ul>
    </nav>
        <Insights 
            role={'Admin'}
        />
    </div>
}

export default AdminPage;