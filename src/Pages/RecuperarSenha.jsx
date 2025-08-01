import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Logo from "../assets/logo.png";
import CanvasLines from '../Components/CanvasLines';

import { Input } from "../Components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../Components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "../Components/ui/alert";

import { useState } from "react";
import { enviarLinkRecuperacaoSenha } from "../data/services/usuarioService";

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState({ visivel: false });
  const [loading, setLoading] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleEnviar = async (data) => {
    setLoading(true);
    setBloqueado(true); // desativa permanentemente após o clique
    const resultado = await enviarLinkRecuperacaoSenha(data.email);

    setAlerta({
      visivel: true,
      tipo: resultado.sucesso ? "default" : "destructive",
      titulo: resultado.sucesso ? "Email enviado com sucesso ✅" : "Erro ao enviar o email ❌",
      descricao: resultado.mensagem,
    });

    setTimeout(() => {
      setAlerta((prev) => ({ ...prev, visivel: false }));
    }, 4000);

    setLoading(false);
  };

  return (
    <div className="bg-black/70 relative h-screen w-screen flex flex-col items-center px-4 overflow-hidden">
      <CanvasLines />
      <button
        onClick={() => navigate("/entrar")}
        className="absolute top-2 left-2 z-20 flex items-center gap-1 
    text-black bg-white/70 border border-black rounded-md px-3 py-1 
    hover:bg-white hover:scale-105 transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      <div className="mt-2 z-10">
        <img src={Logo} alt="Logo" className="h-40" />
      </div>

      <div className="border border-white shadow-lg rounded-xl p-4 w-[80%] max-w-md bg-zinc-900 
    z-10 mt-4 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 
    scrollbar-track-transparent">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-red-600 to-blue-500 text-transparent bg-clip-text">
          Recuperar Senha
        </h2>

        {alerta.visivel && (
          <div className="mb-4 bg-black text-white">
            <Alert variant={alerta.tipo} className="bg-black text-white">
              <AlertTitle>{alerta.titulo}</AlertTitle>
              <AlertDescription>{alerta.descricao}</AlertDescription>
            </Alert>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEnviar)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "O email é obrigatório",
                validate: (value) => {
                  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                  const dominioValido = /@(gmail|hotmail|outlook|yahoo)\./.test(value);
                  if (!formatoValido) return "Digite um email válido";
                  if (!dominioValido) return "Aceitamos apenas gmail, hotmail, outlook ou yahoo";
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite seu email cadastrado"
                      className="text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={loading || bloqueado}
              className={`w-full font-semibold py-2 rounded transition cursor-pointer border border-white 
    ${(loading || bloqueado)
                  ? "bg-black text-white cursor-not-allowed"
                  : "bg-transparent text-white hover:bg-white hover:text-black"
                }`}
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
