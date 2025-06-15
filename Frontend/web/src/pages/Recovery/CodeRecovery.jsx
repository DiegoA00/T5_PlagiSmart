import CodeFormRecovery from "./Components/CodeFormRecovery";
import "../../App.css";

const CodeRecovery = () => {
  return (
    <div className="flex h-screen bg-white px-10 py-6 gap-10">
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://placehold.co/800x1200.png"
            alt="Anecacao"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold">Lorem Ipsum is simply</h1>
            <p className="text-lg">Lorem Ipsum is simply</p>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg">
          <p className='text-sm text-gray-600 max-w-md mx-auto text-left mt-10 mb-10'>
            Hemos enviado un código de verificación a tu correo electrónico. Por favor, ingresa el código recibido para continuar con el proceso de recuperación de tu contraseña.
          </p>
          <CodeFormRecovery />
        </div>
      </div>
    </div>
  );
};

export default CodeRecovery;
