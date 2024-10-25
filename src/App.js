import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import AppRoutes from './appRoutes'; // Importa las rutas que tienes definidas
import LoginSignUp from './loginSignUp'; // Componente LoginSignUp
import { AuthProvider } from "./AuthenticationContext";

const App = () => {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginSignUp />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </AuthProvider>
      </Router>
      
  );
}

export default App;
