import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "../Components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../Components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "../Components/ui/alert";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Logo from "../assets/logo.png";
import { redefinirSenha } from "../data/services/usuarioService";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [alerta, setAlerta] = useState({ visivel: false, tipo: "default", titulo: "", descricao: "" });
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      novaSenha: "",
      confirmarSenha: ""
    }
  });

  useEffect(() => {
    if (!token) {
      setAlerta({
        visivel: true,
        tipo: "destructive",
        titulo: "Token inválido ou ausente",
        descricao: "O link de redefinição está incorreto ou expirado."
      });
    }
  }, [token]);

  const onSubmit = async (data) => {
    if (data.novaSenha !== data.confirmarSenha) {
      setAlerta({
        visivel: true,
        tipo: "destructive",
        titulo: "Senhas diferentes",
        descricao: "As senhas não coincidem."
      });
      return;
    }  
    setLoading(true);
    try {
      await redefinirSenha({ token, novaSenha: data.novaSenha });  
      setAlerta({
        visivel: true,
        tipo: "default",
        titulo: "Senha atualizada com sucesso ✅",
        descricao: "Agora você pode fazer login com sua nova senha."
      });  
      setTimeout(() => navigate("/entrar"), 3000);
    } catch (error) {
      setAlerta({
        visivel: true,
        tipo: "destructive",
        titulo: "Erro na redefinição ❌",
        descricao: error.message || "Token expirado ou inválido."
      });
    }
    setLoading(false);
  };  

  return (
    <div className="relative h-screen w-screen flex flex-col items-center px-4 overflow-hidden">
      <img 
      style={{ backgroundImage: "url('/Banner.jpg')" }}
       alt="Fundo" 
       className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" />
      <div className="mt-12 z-10">
        <img src={Logo} alt="Logo" className="h-32" />
      </div>

      <button
        onClick={() => navigate("/entrar")}
        className="absolute top-2 left-2 z-20 flex items-center gap-1 
        text-black bg-white/70 border border-black rounded-md px-3 py-1 
        hover:bg-white hover:scale-105 transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      <div className="border border-white shadow-lg rounded-xl p-4 w-[90%] max-w-md bg-zinc-900 
        z-10 mt-4 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-500">
          Redefinir Senha
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="novaSenha"
              rules={{
                required: "Digite uma nova senha",
                minLength: { value: 3, message: "Mínimo 3 caracteres" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmarSenha"
              rules={{
                required: "Confirme sua nova senha"
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              disabled={loading || !token}
              className={`w-full font-semibold py-2 rounded transition border border-white cursor-pointer ${
                loading || !token
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-transparent text-white hover:bg-white hover:text-black"
              }`}
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
