import axios from 'axios';

const API = 'http://Class-scheduling-backend-env.eba-erpy66ix.sa-east-1.elasticbeanstalk.com/usuarios';

export const loginUsuario = async (payload) => {
  const res = await axios.post(`${API}/login`, payload);
  return res.data;
};

export const cadastrarUsuario = async (payload) => {
  const res = await axios.post(`${API}/cadastrar`, payload);
  return res.data;
};

export const editarUsuario = async (payload) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API}/editar`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deletarUsuario = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${API}/deletar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const enviarLinkRecuperacaoSenha = async (email) => {
  try {
    const response = await axios.post(`${API}/recuperar-senha`, {
      email,
    });

    return {
      sucesso: true,
      mensagem: "Verifique sua caixa de entrada ou spam!",
    };
  } catch (error) {
    const mensagem =
      error.response?.data?.message ||
      "Esse email não está cadastrado ou houve um erro.";

    return {
      sucesso: false,
      mensagem,
    };
  }
};

export const redefinirSenha = async ({ token, novaSenha }) => {
  try {
    const response = await axios.post(`${API}/redefinir-senha`, {
      token,
      novaSenha
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao redefinir a senha" };
  }
};
