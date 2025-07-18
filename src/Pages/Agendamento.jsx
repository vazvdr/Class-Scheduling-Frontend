import { useState, useEffect } from 'react';
import { imagens } from '../utils/imagens';
import Header from '../Components/Header';
import { Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import {
  buscarAssuntos,
  buscarProfessoresPorAssunto,
  buscarDisponibilidade,
  criarAgendamento
} from "../data/services/agendamentoService";
import { useNavigate } from 'react-router-dom';

export default function Agendamento() {
  const navigate = useNavigate();
  const [assuntos, setAssuntos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [horarios, setHorarios] = useState({});
  const [datas, setDatas] = useState([]);
  const [etapa, setEtapa] = useState(1);
  const [selecionado, setSelecionado] = useState({
    assunto: null,
    duracao: null,
    professor: null,
    data: "",
    horario: "",
    horariosSelecionados: [],
  });

  const [alerta, setAlerta] = useState({
    tipo: "default",
    titulo: "",
    descricao: "",
    visivel: false,
  });

  const token = localStorage.getItem("token");

  const excedeuPeriodo = (horario, periodo, duracao) => {
    const [hora, minuto] = horario.split(":").map(Number);
    const inicio = new Date();
    inicio.setHours(hora, minuto, 0, 0);

    const fim = new Date(inicio.getTime() + duracao * 60000);

    const limites = {
      manha: [8, 12],
      tarde: [14, 18],
      noite: [19, 22],
    };

    const [inicioPeriodo, fimPeriodo] = limites[periodo];
    const dataFim = new Date();
    dataFim.setHours(fimPeriodo, 0, 0, 0);

    return fim > dataFim;
  }

  // 🔁 Buscar assuntos ao carregar o componente
  useEffect(() => {
    const carregarAssuntos = async () => {
      const dados = await buscarAssuntos();
      setAssuntos(dados);
    };
    carregarAssuntos();
  }, []);

  // 🔁 Buscar professores quando o assunto mudar
  useEffect(() => {
    const carregarProfessores = async () => {
      if (selecionado.assunto?.nome) {
        const professoresEncontrados = await buscarProfessoresPorAssunto(selecionado.assunto.nome);
        setProfessores(professoresEncontrados);
      }
    };
    carregarProfessores();
  }, [selecionado.assunto]);

  // 🔁 Buscar disponibilidade quando entrar na etapa 3
  useEffect(() => {
    const carregarDisponibilidade = async () => {
      if (etapa === 3 && selecionado.assunto?.id && selecionado.professor?.id) {
        try {
          const resposta = await buscarDisponibilidade(selecionado.assunto.id, selecionado.professor.id, token);
          const datasDisponiveis = Object.keys(resposta).sort();
          setHorarios(resposta);
          setDatas(datasDisponiveis);
        } catch (erro) {
          console.error("Erro ao buscar horários:", erro);
        }
      }
    };
    carregarDisponibilidade();
  }, [etapa, selecionado]);

  const handleAgendar = async () => {
    const payload = {
      assuntoId: selecionado.assunto?.id,
      professorId: selecionado.professor?.id,
      data: selecionado.data,
      horario: selecionado.horario,
    };

    try {
      await criarAgendamento(payload, token);

      setAlerta({
        tipo: "success",
        titulo: "Agendamento realizado com sucesso ✅",
        descricao: "Verifique a confirmação no seu email cadastrado.",
        visivel: true,
      });

      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        "Erro desconhecido";

      let alertaErro = {
        tipo: "destructive",
        titulo: "Erro ao agendar",
        descricao: mensagemErro,
        visivel: true,
      };

      if (mensagemErro.includes("conflito com este horário")) {
        alertaErro = {
          tipo: "destructive",
          titulo: "⚠️ Horário indisponível",
          descricao: mensagemErro,
          visivel: true,
        };
      } else if (mensagemErro.includes("Assunto não encontrado")) {
        alertaErro = {
          tipo: "destructive",
          titulo: "Erro no assunto",
          descricao: mensagemErro,
          visivel: true,
        };
      }

      setAlerta(alertaErro);

      // 🔁 Oculta o alerta após 3 segundos
      setTimeout(() => {
        setAlerta(prev => ({ ...prev, visivel: false }));
      }, 3000);
    }
  };

  return (
    <>
      {/* Header fixo */}
      <Header />

      {alerta.visivel && (
        <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[400px]">
          <Alert variant={alerta.tipo} className="shadow-lg bg-black text-white border border-zinc-300 ">
            <AlertTitle>{alerta.titulo}</AlertTitle>
            <AlertDescription>{alerta.descricao}</AlertDescription>
          </Alert>
        </div>
      )}

      <div
        className="relative w-full h-[150px] bg-cover bg-center flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: `url(${imagens.Banner})` }}
      >
        {/* Overlay com blur */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0 rounded-md" />

        {/* Conteúdo centralizado */}
        <div className="z-10">
          <h1 className="text-3xl font-extrabold text-transparent mt-[20%] bg-clip-text bg-gradient-to-r from-green-500 to-blue-400">
            Agendamento de Aulas
          </h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">
            Fique mais perto de ser excelente
          </p>
        </div>
      </div>

      {/* Conteúdo da página */}
      <div className="bg-black/90 w-screen min-h-screen pt-10 px-4">
        {/* Etapas de agendamento */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center md:justify-center lg:justify-start lg:ml-[10%]">
          <div className={`px-4 py-2 rounded ${etapa === 1 ? 'bg-white text-black' : 'bg-zinc-800 border border-white text-white'}`}>
            1 - Selecione o assunto
          </div>
          <div className={`px-4 py-2 rounded ${etapa === 2 ? 'bg-white text-black' : 'bg-zinc-800 border border-white text-white'}`}>
            2 - Selecione o professor
          </div>
          <div className={`px-4 py-2 rounded ${etapa === 3 ? 'bg-white text-black' : 'bg-zinc-800 border border-white text-white'}`}>
            3 - Selecione o horário
          </div>
        </div>

        {/* Container principal com conteúdo + resumo */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
          {/* Conteúdo principal das etapas */}
          <div className="w-full lg:w-[60%] lg:ml-[10%] flex flex-col items-center md:items-center lg:items-start">
            {etapa === 1 && (
              <>
                <h2 className="text-white text-xl font-bold mb-4">Assuntos Disponíveis</h2>
                <div className="w-[98%] sm:w-[80%] md:w-[66%] lg:w-[70%] grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-3 place-items-center">
                  {assuntos.map((assunto) => {
                    const imagem = imagens[assunto.nome];

                    return (
                      <div
                        key={assunto.id}
                        onClick={() =>
                          setSelecionado({
                            ...selecionado,
                            assunto: assunto,
                            duracao: assunto.duracao,
                            professor: "",
                            horario: "",
                          })
                        }
                        className={`w-full max-w-[10rem] cursor-pointer border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${selecionado.assunto?.nome === assunto.nome
                            ? "border-blue-600"
                            : "border-gray-200"
                          }`}
                      >
                        {imagem ? (
                          <img src={imagem} alt={assunto.nome} className="w-full h-28 object-cover" />
                        ) : (
                          <div className="w-full h-28 bg-black flex items-center justify-center">
                            <p className="text-xs text-center text-white">Imagem não encontrada</p>
                          </div>
                        )}
                        <div className="p-2 text-center text-white bg-blue-600">
                          <p className="text-sm font-medium h-8">{assunto.nome}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 mt-6 mb-6">
                  <button disabled className="bg-zinc-700 text-white px-4 py-2 rounded disabled:opacity-50">Voltar</button>
                  <button
                    disabled={!selecionado.assunto}
                    onClick={() => setEtapa(2)}
                    className="bg-zinc-700 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
                  >
                    Próximo
                  </button>
                </div>
              </>
            )}

            {etapa === 2 && (
              <>
                <h2 className="text-white text-xl font-bold mb-4">Professores Disponíveis</h2>
                <div className="w-[98%] sm:w-[70%] md:w-[66%] lg:w-[60%] grid grid-cols-2 sm:grid-cols-3 md:gap-x-0 lg:gap-x-10 xl:gap-x-16 gap-y-3">
                  {professores.map((prof) => {
                    const imagem = imagens[prof.nome];

                    return (
                      <div
                        key={prof.id}
                        onClick={() => setSelecionado({ ...selecionado, professor: prof, horario: "" })}
                        className={`w-40 cursor-pointer border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${selecionado.professor?.id === prof.id ? "border-blue-600" : "border-gray-200"}`}
                      >
                        <div className="w-full h-28 bg-white flex items-center justify-center">
                          {imagem ? (
                            <img
                              src={imagem}
                              alt={prof.nome}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <p className="text-xs text-center text-gray-500">Imagem não encontrada</p>
                          )}
                        </div>
                        <div className="p-2 text-center bg-white">
                          <p className="text-sm font-medium">{prof.nome}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 mt-6">
                  <button onClick={() => setEtapa(1)} className="bg-zinc-700 text-white px-4 py-2 rounded cursor-pointer">Voltar</button>
                  <button
                    disabled={!selecionado.professor}
                    onClick={() => setEtapa(3)}
                    className="bg-zinc-700 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
                  >
                    Próximo
                  </button>
                </div>
              </>
            )}

            {etapa === 3 && (
              <div className="flex flex-col gap-8">
                {/* Datas disponíveis */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">DATAS DISPONÍVEIS</h2>
                  <div className="flex flex-wrap gap-x-0">
                    {Object.keys(horarios).map((data) => {
                      const diaSemana = new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
                        weekday: "short",
                      });
                      const dia = new Date(data + "T00:00:00").getDate();
                      const mes = new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
                        month: "short",
                      });

                      const selecionadoData = selecionado.data === data;

                      return (
                        <div
                          key={data}
                          onClick={() => setSelecionado({ ...selecionado, data, horario: "", horariosSelecionados: [] })}
                          className={`flex flex-col items-center px-2 py-2 rounded-lg cursor-pointer w-14 md:w-20
                ${selecionadoData ? "bg-blue-600 text-black border border-white font-bold" : "bg-neutral-900 border border-white text-white"}
                hover:bg-blue-800 transition-all`}
                        >
                          <span className="text-xs uppercase">{diaSemana}</span>
                          <span className="text-lg font-bold">{dia}</span>
                          <span className="text-xs uppercase">{mes}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Horários disponíveis */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">HORÁRIOS DISPONÍVEIS</h2>
                  <div className="flex flex-col gap-4">
                    {["manha", "tarde", "noite"].map((periodo) => {
                      const horariosPeriodo = horarios?.[selecionado.data]?.[periodo] || [];

                      return (
                        <div key={periodo}>
                          <h3 className="text-white text-sm font-semibold mb-2 uppercase">{periodo}</h3>
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {horariosPeriodo.map((horario) => {
                              const selecionadoHorario = selecionado.horariosSelecionados?.includes(horario);
                              const mostrarX = excedeuPeriodo(horario, periodo, selecionado.duracao || 15);

                              return (
                                <div
                                  key={horario}
                                  className={`relative group text-sm rounded-md px-2 py-1 border text-center cursor-pointer transition-all duration-200
                                    ${selecionadoHorario
                                      ? "bg-blue-600 text-white border-blue-400"
                                      : horario.includes("(ocupado)")
                                        ? "bg-black text-white border-red-600 disabled"
                                        : "bg-black text-white border-white hover:bg-blue-600 disabled"
                                    }`}
                                  onClick={() => {
                                    const horarioBase = horario.replace(" (ocupado)", "");
                                    const blocos = (selecionado.duracao || 15) / 15;

                                    const index = horariosPeriodo.findIndex(h => h.startsWith(horarioBase));
                                    if (index === -1) return;

                                    const slots = horariosPeriodo.slice(index, index + blocos);
                                    const todosLivres = slots.every(h => !h.includes("(ocupado)"));

                                    if (slots.length === blocos && todosLivres) {
                                      const horariosLimpos = slots.map(h => h.replace(" (ocupado)", ""));
                                      setSelecionado({
                                        ...selecionado,
                                        horario: horarioBase,
                                        horariosSelecionados: horariosLimpos,
                                      });
                                    }
                                  }}
                                >
                                  <span className="inline-block font-bold">
                                    {horario.includes("(ocupado)") ? (
                                      <>
                                        <span className="group-hover:hidden">x</span>
                                        <span className="absolute -top-2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 whitespace-nowrap left-1/2">
                                          Agendado
                                        </span>
                                      </>
                                    ) : excedeuPeriodo(horario, periodo, selecionado.duracao || 15) ? (
                                      <>
                                        <span className="group-hover:hidden">{horario}</span>
                                        <span className="hidden group-hover:inline">x</span>
                                      </>
                                    ) : (
                                      horario
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Botões de navegação */}
                  <div className="flex gap-2 mt-6 mb-12 text-center">
                    <button
                      onClick={() => setEtapa(2)}
                      className="bg-zinc-700 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resumo */}
          <div className="w-[80%] md:w-[60%] lg:w-[36%] lg:mr-[5%] mb-[10%] items-center self-center">
            <div className="bg-black text-white rounded-lg shadow-md p-6 lg:h-[380px] flex flex-col justify-between">
              {/* Título com ícone */}
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-white w-6 h-6" />
                <h3 className="text-xl font-semibold">Resumo do Agendamento</h3>
                <hr className="border-t border-zinc-600 mt-1" />
              </div>


              {/* Detalhes */}
              <div className="text-sm space-y-4">
                <div>
                  <p className="font-bold">Assunto:</p>
                  <p>{selecionado.assunto?.nome || "Nenhum selecionado"}</p>
                  <hr className="border-t border-zinc-600 mt-1" />
                </div>
                <div>
                  <p className="font-bold">Duração:</p>
                  <p>{selecionado.assunto?.duracao || "0"} minutos</p>
                  <hr className="border-t border-zinc-600 mt-1" />
                </div>
                <div>
                  <p className="font-bold">Professor:</p>
                  <p>{selecionado.professor?.nome || "Não selecionado ainda"}</p>
                  <hr className="border-t border-zinc-600 mt-1" />
                </div>
                <div>
                  <p className="font-bold">Horário:</p>
                  <p>{selecionado.horario || "Não selecionado ainda"}</p>
                  <hr className="border-t border-zinc-600 mt-1" />
                </div>
              </div>

              {/* Botão Finalizar */}
              <div className="mt-6">
                <button
                  onClick={handleAgendar}
                  disabled={etapa !== 3 || !selecionado.horario}
                  className="w-full bg-blue-700 border border-white text-white px-4 py-2 
                  rounded disabled:opacity-50 cursor-pointer hover:scale-105 transition-all"
                >
                  Finalizar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}