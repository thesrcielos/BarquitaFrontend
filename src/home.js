import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tasks from './tasks';
import Insights from './insights';
const Home = () => {
  return (
    <Router>
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-button">Home</Link>
          </li>
          <li>
            <Link to="/insights" className="nav-button">Insights</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Tasks/>} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </Router>
  );
}

export default Home;
