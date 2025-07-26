import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginService, authService } from "../../../services/auth/loginService";
import { useRoleRedirect } from "../../../hooks/useRoleRedirect";

const LoginForm = () => {
  const navigate = useNavigate();
  const redirect = useRoleRedirect();

  useEffect(() => {
    const checkSession = async () => {
      if (authService.isAuthenticated()) {
        try {
          await loginService.validateSession();
          redirect();
        } catch (error) {
          console.log("Sesión expirada o inválida - Iniciando sesión nuevamente");
          authService.clearAuthData();
        }
      }
    };
    checkSession();
  }, [redirect]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { email, password, rememberMe } = form;
      const response = await loginService.login(email, password, rememberMe);
      if (response.success) {
        redirect();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/login/mailrecovery');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-white rounded-lg w-full"
      noValidate
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#003595] mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Ingresa tu correo electrónico"
          value={form.email}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="w-full px-4 py-2 border border-[#003595] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003595] disabled:opacity-50"
          aria-invalid={error ? "true" : "false"}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#003595] mb-1">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Ingresa tu contraseña"
            value={form.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-4 py-2 border border-[#003595] rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#003595] disabled:opacity-50"
            aria-invalid={error ? "true" : "false"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-[#003595] cursor-pointer"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-[#003595]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleChange}
            disabled={isLoading}
            className="accent-[#003595] cursor-pointer"
          />
          Recuérdame
        </label>
        <button 
          type="button" 
          onClick={handleForgotPassword}
          disabled={isLoading}
          className="cursor-pointer text-[#003595] hover:underline disabled:opacity-50"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#003595] text-white px-6 py-2 rounded-full hover:bg-[#002060] transition-colors w-full sm:w-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⌛</span> 
              Iniciando sesión...
            </span>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </div>

      {error && (
        <div 
          role="alert"
          className="bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-300 flex items-center gap-2 text-sm"
        >
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}
    </form>
  );
};

export default LoginForm;
