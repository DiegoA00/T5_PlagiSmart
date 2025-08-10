import { FC, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignaturePad, SignaturePadRef } from "@/components/ui/signature-pad";

interface SignatureModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (signatureDataURL: string) => void;
  existingSignature?: string;
}

export const SignatureModal: FC<SignatureModalProps> = ({
  isOpen,
  title,
  onClose,
  onSave,
  existingSignature
}) => {
  const signaturePadRef = useRef<SignaturePadRef>(null);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen && signaturePadRef.current) {
      const checkSignature = () => {
        if (signaturePadRef.current) {
          setHasSignature(!signaturePadRef.current.isEmpty());
        }
      };
      
      checkSignature();
      const timer = setTimeout(checkSignature, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setHasSignature(false);
  };

  const handleSave = () => {
    if (signaturePadRef.current) {
      const dataURL = signaturePadRef.current.toDataURL();
      onSave(dataURL);
      onClose();
    }
  };

  const handleSignatureChange = () => {
    setHasSignature(!signaturePadRef.current?.isEmpty());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="bg-[#003595] text-white rounded-t-lg px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="p-6 flex-1 flex flex-col items-center">
          <div className="mb-4">
            <p className="text-gray-600 text-center">
              Firme en el área de abajo usando su dedo o mouse
            </p>
          </div>
          
          <div className="mb-6">
            <SignaturePad
              ref={signaturePadRef}
              width={600}
              height={300}
              backgroundColor="rgba(255,255,255,1)"
              penColor="black"
              onEnd={handleSignatureChange}
              onBegin={handleSignatureChange}
            />
          </div>
          
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleClear}
              className="px-6"
            >
              Limpiar
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#003595] hover:bg-[#002060] text-white px-6"
            >
              Guardar Firma
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};