import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../assets/logo.png";
import CanvasLines from '../Components/CanvasLines'

import { useUsuario } from "../data/hooks/useUsuario.jsx";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "../Components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "../Components/ui/alert";

import { Input } from "../Components/ui/input";

export default function Entrar() {
  const navigate = useNavigate();
  const { login, cadastrar, loading } = useUsuario();
  const [isLogin, setIsLogin] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      telefone: ""
    }
  });
  const [alerta, setAlerta] = useState({
    visivel: false,
    tipo: "default",
    titulo: "",
    descricao: ""
  });

  const toggleForm = () => setIsLogin(!isLogin);

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        setLoginLoading(true);
        await login({ email: data.email, senha: data.senha });

        setTimeout(() => {
          setAlerta((prev) => ({ ...prev, visivel: false }));
          navigate("/");
          setLoginLoading(false);
        }, 2000);
      } else {
        await cadastrar({
          ...data,
          onSuccess: () => {
            setIsLogin(true);
            setAlerta({
              visivel: true,
              tipo: "default",
              titulo: "Cadastro realizado com sucesso ✅",
              descricao: "Faça login para continuar.",
            });
            setTimeout(() => {
              setAlerta((prev) => ({ ...prev, visivel: false }));
            }, 3000);
          },
        });
      }
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro desconhecido.";

      setAlerta({
        visivel: true,
        tipo: "destructive",
        titulo: "Erro ao autenticar",
        descricao: mensagemErro,
      });

      setLoginLoading(false);

      setTimeout(() => {
        setAlerta((prev) => ({ ...prev, visivel: false }));
      }, 3000);
    }
  };

  const irParaRecuperarSenha = () => {
    navigate('/recuperar-senha');
  };

  return (
    <div className="bg-black/70 relative h-screen w-screen flex items-center flex-col px-4 overflow-hidden">
      <CanvasLines />
      <button
        onClick={() => navigate("/")}
        className="absolute top-2 left-2 z-20 flex items-center gap-1 
        text-black bg-white/70 border border-black rounded-md px-3 py-1 
        hover:bg-white hover:scale-105 transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      <div className="flex items-center justify-start p-0 h-30 z-10">
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-36" />
        </Link>
      </div>

      <div className="border border-white shadow-lg rounded-xl p-4 w-[90%] max-w-md bg-zinc-900 
      z-10 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 
      scrollbar-track-transparent scrollbar-none">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          {isLogin ? "Entrar" : "Cadastrar"}
        </h2>

        {alerta.visivel && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
            <Alert variant={alerta.tipo} className="bg-black text-white">
              <AlertTitle className="text-white">{alerta.titulo}</AlertTitle>
              <AlertDescription className="text-white">{alerta.descricao}</AlertDescription>
            </Alert>
          </div>
        )}


        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {!isLogin && (
              <FormField
                control={form.control}
                name="nome"
                rules={{
                  required: "O nome é obrigatório",
                  minLength: {
                    value: 3,
                    message: "O nome deve ter pelo menos 3 letras"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome completo" {...field} className="text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "O email é obrigatório",
                validate: (value) => {
                  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                  const dominioValido = /@(gmail|hotmail|outlook|yahoo)\./.test(value);

                  if (!formatoValido) return "Digite um email válido";
                  if (!dominioValido) return "Aceitamos apenas emails gmail, hotmail, outlook e yahoo";
                  return true;
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite seu email"
                      {...field}
                      className="text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              rules={{
                required: "A senha é obrigatória",
                validate: (value) =>
                  (value.match(/\d/g) || []).length >= 3 || "A senha deve conter pelo menos 3 números"
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua senha" {...field} className="text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isLogin && (
              <FormField
                control={form.control}
                name="telefone"
                rules={{
                  required: "O telefone é obrigatório",
                  pattern: {
                    value: /^\d{11}$/,
                    message: "O telefone deve conter 11 números"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Telefone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Digite seu telefone" {...field} className="text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isLogin && (
              <div
                className="text-right text-sm text-white hover:underline cursor-pointer"
                onClick={irParaRecuperarSenha}
              >
                Esqueceu sua senha?
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading || loading}
              className={`w-full font-semibold py-2 rounded transition cursor-pointer border border-white ${loading
                ? "bg-gray-400 text-white"
                : "bg-transparent text-white hover:bg-white hover:text-black"
                }`}
            >
              {isLogin
                ? loginLoading
                  ? "Entrando..."
                  : "Entrar"
                : loading
                  ? "Cadastrando..."
                  : "Cadastrar"}
            </button>
          </form>
        </Form>

        <div className="text-center mt-6 text-sm text-white">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <span
            onClick={toggleForm}
            className="font-semibold cursor-pointer hover:underline"
          >
            {isLogin ? "Cadastre-se" : "Entrar"}
          </span>
        </div>
      </div>
    </div>
  );
}
