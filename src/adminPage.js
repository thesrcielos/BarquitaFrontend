import Insights from "./insights";
import "/App.css";

const AdminPage = () => {
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