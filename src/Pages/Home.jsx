import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '../Components/Header';
import { Cover } from '../Components/ui/cover';

export default function Home() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsuario({
                    nome: decoded.nome,
                    email: decoded.sub,
                });
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
            }
        }
    }, []);

    const redirecionarAgendamento = () => {
        usuario ? navigate('/agendamento') : navigate('/entrar');
    };

    return (
        <>
            <Header />

            {/* Plano de fundo da página */}
            <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
                style={{
                    backgroundImage: "url('/Banner2.webp?v=1')",
                    backgroundAttachment: 'fixed',
                }}

                <div className="flex flex-col items-center text-center px-4 mt-[0%] w-[90%] md:w-2xl gap-y-0.5">
                    {/* Título com gradiente no fundo e texto */}
                    <div className="text-4xl font-bold leading-tight px-4 py-1 rounded-md bg-gradient-to-r from-gray-800/90 to-black/80">
                        <p>
                            <span className="bg-gradient-to-r from-purple-600 to-blue-800 bg-clip-text text-transparent">
                                Seja bem vindo à
                            </span>
                        </p>

                    </div>
                    <Cover className="text-4xl font-bold rounded-lg">
                        Class Scheduling
                    </Cover>
                    {/* Parágrafo extra */}
                    <p className="text-blue-300 font-semibold px-4 py-2 rounded-md bg-gradient-to-r from-gray-800 to-black">
                        A escola mais foda da internet 💥
                    </p>
                    {/* Botão */}
                    <button
                        onClick={redirecionarAgendamento}
                        className="bg-black border border-white text-white px-6 py-2 rounded 
    hover:bg-green-400 hover:text-black hover:scale-105 transition cursor-pointer"
                    >
                        Agende sua Aula
                    </button>
                </div>
            </div>
        </>
    );
}
