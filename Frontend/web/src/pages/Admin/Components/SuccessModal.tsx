import { FC } from "react";
import { Overlay } from "@/layouts/Overlay";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
}

export const SuccessModal: FC<SuccessModalProps> = ({ isOpen, message }) => {
  return (
    <Overlay open={isOpen} onClose={() => {}}>
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg">
        <div className="text-4xl mb-4 text-green-600">✔</div>
        <div className="text-lg font-semibold mb-2 text-[#003595]">¡Procesamiento exitoso!</div>
        <div className="text-sm text-gray-700 mb-4 text-center max-w-md">
          {message}
        </div>
        <div className="text-xs text-gray-500">
          Esta ventana se cerrará automáticamente en 5 segundos...
        </div>
      </div>
    </Overlay>
  );
};