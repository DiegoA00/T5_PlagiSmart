import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerService } from "../../../services/auth/registerService";

const RegisterForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    accept: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Añadir estado para validación de contraseña
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false
  });

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };
    setPasswordValidation(validations);
    return Object.values(validations).every(v => v);
  };

  // Modificar el handleChange existente
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Validar contraseña mientras el usuario escribe
    if (name === 'password') {
      validatePassword(value);
    }
    
    if (error) setError("");
  };

  const validateForm = () => {
    if (!form.firstName.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!form.lastName.trim()) {
      setError("El apellido es requerido");
      return false;
    }
    if (!form.email.trim()) {
      setError("El correo electrónico es requerido");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("El correo electrónico no es válido");
      return false;
    }
    if (!form.password) {
      setError("La contraseña es requerida");
      return false;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (form.password !== form.repeatPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (!form.accept) {
      setError("Debes aceptar la política de privacidad y los términos y condiciones");
      return false;
    }
    if (!validatePassword(form.password)) {
      setError("La contraseña debe cumplir con todos los requisitos");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await registerService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      });

      if (response.success) {
        navigate("/register/success");
      }
    } catch (err) {
      console.error("Register failed:", err);
      
      if (err.status === 409) {
        setError("Este correo electrónico ya está registrado");
      } else if (err.status === 400) {
        setError("Datos de registro inválidos");
      } else {
        setError(err.message || "Error en el registro. Por favor, intente nuevamente");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Ingrese su nombre"
            value={form.firstName}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003595] disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Ingrese su apellido"
            value={form.lastName}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003595] disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Ingrese su correo electrónico"
          value={form.email}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003595] disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <div className="space-y-2">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Ingrese una contraseña"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#003595] disabled:opacity-50"
              aria-describedby="password-requirements"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 cursor-pointer disabled:opacity-50"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Requisitos de la contraseña */}
          <div id="password-requirements" className="text-sm space-y-1 bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">La contraseña debe tener:</h4>
            <ul className="space-y-1">
              <li className={`flex items-center gap-2 ${
                passwordValidation.length ? 'text-green-600' : 'text-gray-600'
              }`}>
                {passwordValidation.length ? '✓' : '○'} Mínimo 8 caracteres
              </li>
              <li className={`flex items-center gap-2 ${
                passwordValidation.upperCase ? 'text-green-600' : 'text-gray-600'
              }`}>
                {passwordValidation.upperCase ? '✓' : '○'} Al menos una mayúscula
              </li>
              <li className={`flex items-center gap-2 ${
                passwordValidation.lowerCase ? 'text-green-600' : 'text-gray-600'
              }`}>
                {passwordValidation.lowerCase ? '✓' : '○'} Al menos una minúscula
              </li>
              <li className={`flex items-center gap-2 ${
                passwordValidation.number ? 'text-green-600' : 'text-gray-600'
              }`}>
                {passwordValidation.number ? '✓' : '○'} Al menos un número
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="repeatPassword"
            name="repeatPassword"
            placeholder="Repita su contraseña"
            value={form.repeatPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#003595] disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="accept"
          name="accept"
          checked={form.accept}
          onChange={handleChange}
          disabled={isLoading}
          className="accent-[#003595] cursor-pointer disabled:opacity-50"
        />
        <label htmlFor="accept" className="text-sm text-gray-600">
          Acepto la{" "}
          <button 
            type="button" 
            onClick={() => navigate('/register/privacy-policy')}
            className="text-[#003595] hover:underline"
          >
            política de privacidad
          </button>{" "}
          y los{" "}
          <button 
            type="button" 
            onClick={() => navigate('/register/terms-and-conditions')}
            className="text-[#003595] hover:underline"
          >
            términos y condiciones
          </button>
        </label>
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
              Registrando...
            </span>
          ) : (
            "Registrarse"
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

export default RegisterForm;
