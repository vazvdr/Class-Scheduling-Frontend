import { Navigate } from "react-router-dom";
import { useAuth } from "../data/contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div className="text-white text-center mt-10">Carregando...</div>;
  }

  return usuario ? children : <Navigate to="/entrar" replace />;
}
