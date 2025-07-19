import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '../Components/Header';
import { Cover } from '../Components/ui/cover';
import CanvasLines from '../Components/CanvasLines';

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
        <div className="relative w-screen h-screen overflow-hidden home-header-wrapper">
            <div className="block md:hidden">
                <CanvasLines />
            </div>
            <div
                className="hidden md:block fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-1]"
                style={{ backgroundImage: "url('/Banner2.jpg')" }}
            />

            <Header />

            <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center text-center px-4 w-[90%] md:w-2xl gap-y-0.5">
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

                    <p className="text-blue-300 font-semibold px-4 py-2 rounded-md bg-gradient-to-r from-gray-800 to-black">
                        A escola mais foda da internet 💥
                    </p>

                    <button
                        onClick={redirecionarAgendamento}
                        className="bg-black border border-white text-white px-6 py-2 rounded 
        hover:bg-green-400 hover:text-black hover:scale-105 transition cursor-pointer"
                    >
                        Agende sua Aula
                    </button>
                </div>
            </div>
        </div>

    );
}
