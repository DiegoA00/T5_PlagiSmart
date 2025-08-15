import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { SignatureModal } from "./SignatureModal";

interface SignatureConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (technicianSignature: string, clientSignature: string) => void;
  isSubmitting?: boolean;
  reportType: 'fumigation' | 'cleanup';
}

export const SignatureConfirmationModal: FC<SignatureConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  reportType
}) => {
  const [technicianSignature, setTechnicianSignature] = useState<string>('');
  const [clientSignature, setClientSignature] = useState<string>('');
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  const handleConfirm = () => {
    if (technicianSignature && clientSignature) {
      onConfirm(technicianSignature, clientSignature);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTechnicianSignature('');
      setClientSignature('');
      onClose();
    }
  };

  const canConfirm = technicianSignature && clientSignature && !isSubmitting;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">
            Confirmar {reportType === 'fumigation' ? 'Registro de Fumigación' : 'Registro de Descarpe'}
          </h3>
          <p className="text-gray-600 mb-6">
            Para validar este reporte, necesitamos las firmas del técnico y del cliente.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Firma del Técnico</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTechnicianModal(true)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {technicianSignature ? 'Modificar Firma' : 'Capturar Firma'}
                </Button>
                {technicianSignature && (
                  <span className="text-green-600 text-sm">✓ Firmado</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Firma del Cliente</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowClientModal(true)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {clientSignature ? 'Modificar Firma' : 'Capturar Firma'}
                </Button>
                {clientSignature && (
                  <span className="text-green-600 text-sm">✓ Firmado</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={reportType === 'fumigation' ? "bg-[#003595] hover:bg-[#002060] text-white" : "bg-green-600 hover:bg-green-700 text-white"}
            >
              {isSubmitting ? "Procesando..." : "Confirmar y Subir"}
            </Button>
          </div>
        </div>
      </div>

      <SignatureModal
        isOpen={showTechnicianModal}
        onClose={() => setShowTechnicianModal(false)}
        onSave={(signature) => {
          setTechnicianSignature(signature);
          setShowTechnicianModal(false);
        }}
        title="Firma del Técnico"
      />

      <SignatureModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSave={(signature) => {
          setClientSignature(signature);
          setShowClientModal(false);
        }}
        title="Firma del Cliente"
      />
    </>
  );
};