import "./home.css";
import {React} from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "./AuthenticationContext";

const AdminMenu = () => {
    const{logout} = useAuth();
    return (
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/admin" className="nav-button">Home</Link>
          </li>
          <li>
            <Link to="/insightsAdmin" className="nav-button">Insights</Link>
          </li>
          <li>
            <Link to="/profile" className="nav-button">Profile</Link>
          </li>
          <li>
            <Link to="/" className="nav-button" onClick={logout}>Logout</Link>
          </li>
        </ul>
      </nav>
    );
  }

export default AdminMenu;