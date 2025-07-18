import { useState } from 'react';
import {
  buscarAssuntos,
  buscarProfessoresPorAssunto,
  buscarDisponibilidade,
  buscarDisponibilidadeParaEdicao,
  criarAgendamento,
  editarAgendamentoDoUsuario,
  deletarAgendamentoDoUsuario,
  listarAgendamentos
} from '../services/agendamentoService';

export function useAgendamento() {
  const [assuntos, setAssuntos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [horarios, setHorarios] = useState({});
  const [datas, setDatas] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarAssuntos = async () => {
    try {
      const data = await buscarAssuntos();
      setAssuntos(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao carregar assuntos');
    }
  };

  const carregarProfessores = async (assuntoId) => {
    try {
      const data = await buscarProfessoresPorAssunto(assuntoId);
      setProfessores(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao carregar professores');
    }
  };

  const carregarDisponibilidade = async ({ assuntoId, professorId }) => {
    try {
      const data = await buscarDisponibilidade({ assuntoId, professorId });
      setHorarios(data);
      setDatas(Object.keys(data).sort());
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao carregar disponibilidade');
    }
  };

  const carregarDisponibilidadeParaEdicao = async ({ assuntoId, professorId, agendamentoId }) => {
    try {
      const data = await buscarDisponibilidadeParaEdicao(assuntoId, professorId, agendamentoId, token);
      setHorarios(data);
      setDatas(Object.keys(data).sort());
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao carregar disponibilidade para edição');
    }
  };  

  const carregarAgendamentosDoUsuario = async () => {
    try {
      setLoading(true);
      const data = await listarAgendamentos();
      setAgendamentos(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao carregar seus agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const agendar = async ({ assuntoId, professorId, data, horario }) => {
    try {
      setLoading(true);
      await criarAgendamento({ assuntoId, professorId, data, horario });
      alert("Agendamento realizado com sucesso!");
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro desconhecido";

      if (mensagemErro.includes("horário já está ocupado")) {
      } else {
        alert("Erro ao agendar: " + mensagemErro);
      }
    } finally {
      setLoading(false);
    }
  };

  const editarAgendamento = async (id, payload) => {
    try {
      const data = await editarAgendamentoDoUsuario(id, payload);
      return data;
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao editar agendamento');
    }
  };

  const deletarAgendamento = async (id) => {
    const token = localStorage.getItem('token'); 
    if (!token) return;

    await deletarAgendamentoDoUsuario(id, token);
    await carregarAgendamentosDoUsuario();
  };

  return {
    assuntos,
    professores,
    horarios,
    datas,
    agendamentos,
    carregarAssuntos,
    carregarProfessores,
    carregarDisponibilidade,
    carregarAgendamentosDoUsuario,
    agendar,
    editarAgendamento,
    deletarAgendamento,
    loading
  };
}
