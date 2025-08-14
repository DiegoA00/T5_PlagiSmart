import { FC, useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SignaturePad, SignaturePadRef } from "@/components/ui/signature-pad";
import { signatureService } from "@/services/signatureService";

interface SignatureModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (signatureDataURL: string) => void;
  existingSignature?: string;
  fumigationId?: number;
  cleanupId?: number;
  signatureType?: 'technician' | 'client';
  autoUpload?: boolean;
}

export const SignatureModal: FC<SignatureModalProps> = ({
  isOpen,
  title,
  onClose,
  onSave,
  existingSignature,
  fumigationId,
  cleanupId,
  signatureType,
  autoUpload = false
}) => {
  const signaturePadRef = useRef<SignaturePadRef>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (existingSignature) {
        setHasSignature(true);
        setTimeout(() => {
          signaturePadRef.current?.fromDataURL(existingSignature);
        }, 100);
      } else {
        setHasSignature(false);
      }
    }
  }, [isOpen, existingSignature]);

  const handleSignatureChange = useCallback(() => {
    setHasSignature(true);
  }, []);

  if (!isOpen) return null;

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setHasSignature(false);
  };

  const handleSave = async () => {
    if (signaturePadRef.current) {
      try {
        setIsUploading(true);
        
        const dataURL = signaturePadRef.current.toDataURL("image/jpeg", 0.7);
        
        if (autoUpload && signatureType && (fumigationId || cleanupId)) {
          await signatureService.uploadSignature({
            fumigationId: fumigationId || null,
            cleanupId: cleanupId || null,
            signatureType,
            signatureData: dataURL
          });
        }
        
        onSave(dataURL);
        onClose();
      } catch (error) {
        console.error('Error saving signature:', error);
        alert('Error al guardar la firma. Por favor, inténtelo nuevamente.');
      } finally {
        setIsUploading(false);
      }
    }
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
          
          <div className="mb-6 border-2 border-gray-300 border-dashed rounded-lg p-2">
            <SignaturePad
              ref={signaturePadRef}
              width={600}
              height={300}
              backgroundColor="rgba(255,255,255,1)"
              penColor="black"
              onEnd={handleSignatureChange}
            />
          </div>
          
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleClear}
              className="px-6"
              disabled={!hasSignature || isUploading}
            >
              Limpiar
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUploading}
              className={`px-6 text-white transition-colors ${
                hasSignature 
                  ? "bg-[#003595] hover:bg-[#002060]" 
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {isUploading ? "Guardando..." : hasSignature ? "Guardar Firma" : "Guardar (Vacío)"}
            </Button>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            {hasSignature ? "✓ Firma detectada" : "○ Canvas vacío"}
          </div>
        </div>
      </div>
    </div>
  );
};