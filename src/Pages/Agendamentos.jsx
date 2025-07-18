import { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Banner from '../assets/banner.png';
import { useAgendamento } from '../data/hooks/useAgendamento';
import { Calendar, CalendarOff, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../Components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "../Components/ui/alert";

export default function Agendamentos() {
  const { agendamentos, carregarAgendamentosDoUsuario, deletarAgendamento } = useAgendamento();
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [datasFuturas, setDatasFuturas] = useState([]);
  const [agendamentosAgrupados, setAgendamentosAgrupados] = useState({});
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState(null);
  const [alerta, setAlerta] = useState({
    tipo: "success",
    titulo: "Agendamento excluído com sucesso!",
    descricao: "O agendamento foi removido da sua lista.",
    visivel: false,
  });

  const navigate = useNavigate();

  const gerarProximosDiasUteis = () => {
    const diasUteis = [];
    let dataAtual = new Date();
  
    while (diasUteis.length < 7) {
      const diaSemana = dataAtual.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) {
        const dataFormatada = dataAtual.toISOString().slice(0, 10);
        if (!diasUteis.includes(dataFormatada)) {
          diasUteis.push(dataFormatada);
        }
      }
      dataAtual.setDate(dataAtual.getDate() + 1);
    }
  
    return diasUteis;
  };  

  useEffect(() => {
    const dias = gerarProximosDiasUteis();
    setDatasFuturas(dias);
    setDataSelecionada(dias[0]);
  }, []); 

  useEffect(() => {
    const carregar = async () => {
      await carregarAgendamentosDoUsuario();
    };
    carregar();
  }, []);

  useEffect(() => {
    const agrupados = {};
    agendamentos.forEach((a) => {
      const dataFormatada = a.data;
      if (!agrupados[dataFormatada]) {
        agrupados[dataFormatada] = [];
      }
      agrupados[dataFormatada].push(a);
    });
    setAgendamentosAgrupados(agrupados);
  }, [agendamentos]);

  const handleEditar = (id) => navigate(`/agendamento/${id}/editar`);

  return (
    <>
      <Header />

      {alerta.visivel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="rounded-lg p-4 shadow-lg w-[80%] max-w-md text-center">
            <Alert className='bg-black text-white'>
              <AlertTitle className="text-lg font-bold">{alerta.titulo}</AlertTitle>
              <AlertDescription className="text-sm justify-center">{alerta.descricao}</AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <div
        className="relative w-full h-[150px] bg-cover bg-center flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0 rounded-md" />
        <div className="z-10">
          <h1 className="text-3xl font-extrabold text-transparent mt-[20%] bg-clip-text bg-gradient-to-r from-purple-500 to-blue-400">
            Meus Agendamentos
          </h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">
            Veja e gerencie seus agendamentos
          </p>
        </div>
      </div>

      <div className="min-w-screen min-h-screen bg-zinc-900 px-4 py-10 flex flex-col items-center gap-10">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4">SUAS AULAS</h2>
          <div className="flex flex-wrap gap-1 w-[100%] justify-center">
            {datasFuturas.length === 0 ? (
              <p className="text-white">Nenhuma data encontrada.</p>
            ) : (
              datasFuturas.map((data) => {
                const diaSemana = new Date(data + "T00:00:00").toLocaleDateString('pt-BR', { weekday: 'short' });
                const dia = new Date(data + "T00:00:00").getDate();
                const mes = new Date(data + "T00:00:00").toLocaleDateString('pt-BR', { month: 'short' });

                return (
                  <div
                    key={data}
                    onClick={() => setDataSelecionada(data)}
                    className={`flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10 py-2 rounded-lg cursor-pointer
                    ${dataSelecionada === data ? 'bg-blue-600 border border-white text-black font-bold' : 'bg-neutral-900 border border-white text-white'}
                    hover:bg-blue-800 transition-all`}
                  >
                    <span className="text-xs uppercase">{diaSemana}</span>
                    <span className="text-lg font-bold">{dia}</span>
                    <span className="text-xs uppercase">{mes}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="w-[60%] sm:w-[50%] md:w-[70%] grid gap-4">
          {dataSelecionada && agendamentosAgrupados[dataSelecionada]?.length > 0 ? (
            agendamentosAgrupados[dataSelecionada].map((a) => (
              <div
                key={a.id}
                className="bg-zinc-800 border border-white p-4 rounded-lg shadow-md text-white 
                   flex flex-col md:flex-row justify-between items-center"
              >
                <div className="flex flex-col items-center justify-center w-full md:w-1/4 text-center mb-4 md:mb-0">
                  <Calendar size={32} className="text-blue-400 mb-2" />
                  <p className="text-lg font-semibold">{a.nomeProfessor || 'Professor não informado'}</p>
                </div>

                <div className="flex flex-col items-center justify-center w-full md:w-1/4 text-center mb-4 md:mb-0">
                  <p className="text-xl font-bold text-gray-300">Assunto:</p>
                  <p className="text-md font-semibold">{a.nomeAssunto || 'Assunto não informado'}</p>
                </div>

                <div className="flex flex-col items-center justify-center w-full md:w-1/4 text-center mb-4 md:mb-0">
                  <p className="text-xl font-bold text-gray-300">Horário:</p>
                  <p className="text-md font-semibold">{a.horario || 'Horário não informado'}</p>
                </div>

                <div className="flex gap-2 justify-center w-full md:w-1/4">
                  <button
                    onClick={() => handleEditar(a.id)}
                    className="bg-yellow-400 text-white hover:text-black transition p-2 rounded-md cursor-pointer"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => setAgendamentoParaExcluir(a.id)}
                    className="bg-red-600 text-white hover:text-black transition p-2 rounded-md cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center text-lg flex flex-col items-center gap-2">
              <CalendarOff size={80} className="text-gray-500 mt-[8%]" />
              Nenhum agendamento para esta data.
            </p>
          )}
        </div>
      </div>

      <AlertDialog open={!!agendamentoParaExcluir} onOpenChange={(open) => !open && setAgendamentoParaExcluir(null)}>
        <AlertDialogContent className='bg-black text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não poderá ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='text-black cursor-pointer'
            onClick={() => setAgendamentoParaExcluir(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction className='cursor-pointer'
              onClick={async () => {
                await deletarAgendamento(agendamentoParaExcluir);
                await carregarAgendamentosDoUsuario();
                setAgendamentoParaExcluir(null);
                setAlerta({
                  tipo: "success",
                  titulo: "Agendamento excluído com sucesso!",
                  descricao: "O agendamento foi removido da sua lista.",
                  visivel: true,
                });
                setTimeout(() => {
                  setAlerta((a) => ({ ...a, visivel: false }));
                }, 3000);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
