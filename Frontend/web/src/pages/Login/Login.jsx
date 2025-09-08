import { useEffect } from "react";
import LoginForm from "./Components/LoginForm";
import LoginHeader from "./Components/LoginHeader";
import { useRoleRedirect } from "../../hooks/useRoleRedirect";
import { useAuth } from "@/context/AuthContext";
import "../../App.css";

const Login = () => {
  const redirect = useRoleRedirect();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      redirect();
    }
  }, [isAuthenticated, loading, redirect]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin mr-2">⌛</span> Cargando...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white px-10 py-6 gap-10">
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/images/login-picture.jpg"
            alt="Anecacao"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute bottom-6 left-6 text-white z-10">
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
              Servicio de Fumigación
            </h1>
            <p className="text-lg opacity-90 drop-shadow-md">
              Control de plagas profesional para granos
            </p>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg">
          <LoginHeader />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
