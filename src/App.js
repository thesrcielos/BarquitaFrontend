import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import AppRoutes from './appRoutes'; // Importa las rutas que tienes definidas
import { useAuth } from "./AuthenticationContext";
import LoadingPage from "./loadingPage";
const App = () => {
  const {loading} = useAuth();

  return loading ? <LoadingPage/> :  (
      <Router>
          <Routes>
            <Route path="/*" element={<AppRoutes/>} />
          </Routes>
      </Router>
      
  );
}

export default App;
