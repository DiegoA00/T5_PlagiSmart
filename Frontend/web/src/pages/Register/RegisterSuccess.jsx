import { useNavigate } from "react-router-dom";
import "../../App.css";

const RegisterSuccess = () => {
  const navigate = useNavigate();

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
        <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#003595] mb-4">¡Bienvenido!</h2>
            <p className="text-lg text-gray-700">
              Tu cuenta ha sido creada exitosamente.
            </p>
          </div>

          <div className="py-4">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">✓</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Para comenzar a usar PlagiSmart, inicia sesión con tu cuenta.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#003595] text-white px-6 py-3 rounded-full hover:bg-[#002060] transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="pt-4 text-sm text-gray-600">
            <p>
              Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterSuccess;