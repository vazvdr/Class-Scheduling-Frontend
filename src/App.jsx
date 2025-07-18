import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Agendamento from './Pages/Agendamento';
import Agendamentos from './Pages/Agendamentos';
import Entrar from './Pages/Entrar';
import RecuperarSenha from './Pages/RecuperarSenha';
import RedefinirSenha from './Pages/RedefinirSenha';
import EditarUsuario from './Pages/EditarUsuario';
import EditarAgendamento from './Pages/EditarAgendamento';
import PrivateRoute from '../src/Components/PrivateRoute';
import { useAuth } from './data/contexts/AuthContext';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        

        {/* Rotas protegidas */}
        <Route
          path="/agendamento"
          element={
            <PrivateRoute>
              <Agendamento />
            </PrivateRoute>
          }
        />
        <Route
          path="/agendamentos"
          element={
            <PrivateRoute>
              <Agendamentos />
            </PrivateRoute>
          }
        />
        <Route
          path="/agendamento/:id/editar"
          element={
            <PrivateRoute>
              <EditarAgendamento />
            </PrivateRoute>
          }
        />
        <Route
          path="/editarUsuario"
          element={
            <PrivateRoute>
              <EditarUsuario />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
