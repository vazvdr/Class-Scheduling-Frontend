import axios from 'axios';

const API = 'https://class-scheduling-backend-production.up.railway.app';

function extrairIdDoToken(token) {
  if (!token) return null;

  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));
  return payload.id;
}

export const buscarAssuntos = async () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API}/assuntos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.data);
};

export const buscarProfessoresPorAssunto = async (nomeAssunto) => {
  const assuntos = await buscarAssuntos();
  return assuntos.find(a => a.nome === nomeAssunto)?.professores || [];
};

export const buscarDisponibilidade = (assuntoId, professorId, token) =>
  axios.get(`${API}/disponibilidade`, {
    params: { assuntoId, professorId },
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);

  export const buscarDisponibilidadeParaEdicao = (assuntoId, professorId, agendamentoId, token) =>
  axios.get(`${API}/disponibilidade/editar`, {
    params: { assuntoId, professorId, agendamentoId },
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);

export const criarAgendamento = (payload, token) =>
  axios.post(`${API}/agendamentos`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  export const listarAgendamentos = async () => {
    const token = localStorage.getItem('token');
    const usuarioId = extrairIdDoToken(token);
  
    if (!usuarioId) {
      throw new Error('ID do usuário não encontrado no token');
    }
  
    const response = await axios.get(`${API}/agendamentos/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    return response.data;
  };

  export const buscarAgendamentoPorId = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API}/agendamentos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  };  

  export const editarAgendamentoDoUsuario = async (id, payload, token) => {  
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }
    const res = await axios.put(`${API}/agendamentos/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    return res.data;
  };  

export const deletarAgendamentoDoUsuario = async (id, token) => {
  try {
    await axios.delete(`${API}/agendamentos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error.message);
    throw error;
  }
};

