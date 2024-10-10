import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import AppRoutes from './appRoutes'; // Importa las rutas que tienes definidas
import LoginSignUp from './loginSignUp'; // Componente LoginSignUp

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
