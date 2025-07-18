import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Banner from '../assets/Banner.jpg'
import Header from "../Components/Header";
import { useUsuario } from "../data/hooks/useUsuario";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../Components/ui/form";
import { Input } from "../Components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "../Components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "../Components/ui/alert";

export default function EditarUsuario() {
  const navigate = useNavigate();
  const { editar, deletar } = useUsuario();

  const [alerta, setAlerta] = useState({
    visivel: false,
    titulo: "",
    descricao: "",
  });

  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const form = useForm({
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
    },
  });

  const { handleSubmit, control, setValue } = form;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/entrar");

    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
      setValue("nome", user.nome || "");
      setValue("email", user.email || "");
      setValue("telefone", user.telefone || "");
    }
  }, [navigate, setValue]);

  const onSubmit = async (data) => {
    await editar({
      ...data,
      onSuccess: () => {
        setAlerta({
          visivel: true,
          titulo: "Seus dados foram atualizados com sucesso! ✅",
          descricao: "Você será redirecionado para a página inicial!",
        });
        setTimeout(() => {
          setAlerta({ visivel: false, titulo: "", descricao: "" });
          navigate("/");
        }, 2000);
      },
    });
  };

  const handleDeletar = () => {
    setConfirmarExclusao(true);
  };

  const confirmarDelete = async () => {
    await deletar();
    setConfirmarExclusao(false);
    setAlerta({
      visivel: true,
      titulo: "Sua conta foi excluída com sucesso! ✅",
      descricao: "Você será redirecionado para a página inicial!",
    });
    setTimeout(() => {
      setAlerta({ visivel: false, titulo: "", descricao: "" });
      navigate("/");
    }, 4000);
  };

  return (
    <>
      <div
        className="relative w-screen h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/Banner.jpg')" }}
      >
        <Header className="z-10" />

        {/* Título centralizado entre logo e dropdown */}
        <div
          className="absolute top-0 left-[25%] right-[25%] flex flex-col items-center mt-4 z-50 text-white text-center"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-600 bg-clip-text text-transparent">
            Editar Perfil
          </h1>
          <p className="text-sm text-gray-200">Atualize seus dados</p>
        </div>
        <div className="absolute top-18 right-2 z-20">
          <button
            onClick={handleDeletar}
            className="border border-white bg-red-600 text-white px-2 py-2 rounded-md shadow hover:bg-red-700 cursor-pointer"
          >
            Deletar Conta
          </button>
        </div>

        <div className="flex items-center justify-center h-full w-full">
          <div className="border border-white shadow-lg rounded-xl p-8 
          w-[70%] mt-[15%] md:w-[50%] md:mt-[1%] lg:w-[38%] bg-zinc-900/95 text-white z-10">

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={control}
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
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Novo Nome" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="email"
                  rules={{
                    required: "O email é obrigatório",
                    validate: (value) => {
                      const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                      const dominioValido = /@(gmail|hotmail|outlook|yahoo)\./.test(value);
                      if (!formatoValido) return "Digite um email válido";
                      if (!dominioValido) return "Aceitamos apenas gmail, hotmail, outlook ou yahoo";
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} placeholder="Novo Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="telefone"
                  rules={{
                    required: "O telefone é obrigatório",
                    pattern: {
                      value: /^\d{11}$/,
                      message: "O telefone deve conter exatamente 11 números"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} placeholder="Novo Telefone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="senha"
                  rules={{
                    required: "A senha é obrigatória",
                    validate: (value) =>
                      (value.match(/\d/g) || []).length >= 3 || "A senha deve conter pelo menos 3 números"
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} placeholder="Nova Senha" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  className="w-full bg-transparent border border-white text-white font-semibold 
        py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
                >
                  Atualizar
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {alerta.visivel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Alert className="bg-black text-white rounded-lg p-6 shadow-lg w-[90%] max-w-md text-center">
            <AlertTitle className="text-lg font-bold">{alerta.titulo}</AlertTitle>
            <AlertDescription className="mt-2 text-sm justify-center">{alerta.descricao}</AlertDescription>
          </Alert>
        </div>
      )}

      <AlertDialog open={confirmarExclusao} onOpenChange={setConfirmarExclusao}>
        <AlertDialogContent className="bg-black text-white">
          <AlertDialogHeader className="bg-black text-white">
            <AlertDialogTitle>Deseja realmente excluir sua conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação é permanente e não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarDelete} className="cursor-pointer">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
