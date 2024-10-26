import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import AppRoutes from './appRoutes'; // Importa las rutas que tienes definidas

const App = () => {
  return (
      <Router>
          <Routes>
            <Route path="/*" element={<AppRoutes/>} />
          </Routes>
      </Router>
      
  );
}

export default App;
