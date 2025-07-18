import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  loginUsuario,
  cadastrarUsuario,
  editarUsuario,
  deletarUsuario
} from '../services/usuarioService.jsx';
import { useAuth } from '../contexts/AuthContext';

export function useUsuario() {
  const [loading, setLoading] = useState(false);
  const { login: loginContext } = useAuth();

  const login = async ({ email, senha }) => {
    try {
      const data = await loginUsuario({ email, senha });
      localStorage.setItem('token', data.token);
  
      // Notifica o contexto que o usuário logou
      loginContext(data.token, data.usuario); // <- muito importante!
    } catch (err) {
      throw err;
    }
  };

  const cadastrar = async ({ nome, email, senha, telefone, onSuccess }) => {
    try {
      setLoading(true);
      await cadastrarUsuario({ nome, email, senha, telefone });
      if (onSuccess) onSuccess();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editar = async ({ nome, email, senha, telefone, onSuccess }) => {
    try {
      await editarUsuario({ nome, email, senha, telefone });
      if (onSuccess) onSuccess();
    } catch (err) {
      throw err; 
    }
  };

  const deletar = async () => {
    try {
      await deletarUsuario();
      localStorage.removeItem("token");
    } catch (err) {
      throw err; 
    }
  };

  return {
    login,
    cadastrar,
    editar,
    deletar,
    loading
  };
}
