import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "../../Admin/Components/Evidence/shared/CollapsibleSection";
import { SignatureModal } from "@/components/SignatureModal";

interface SignaturesSectionProps {
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  technicianSignature?: string;
  clientSignature?: string;
  onTechnicianSignatureChange?: (signature: string) => void;
  onClientSignatureChange?: (signature: string) => void;
  fumigationId?: number;
  cleanupId?: number;
}

export const SignaturesSection: FC<SignaturesSectionProps> = ({ 
  isEditable, 
  fumigationReportSubmitted,
  technicianSignature,
  clientSignature,
  onTechnicianSignatureChange,
  onClientSignatureChange,
  fumigationId,
  cleanupId
}) => {
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  const handleTechnicianSign = () => {
    setShowTechnicianModal(true);
  };

  const handleClientSign = () => {
    setShowClientModal(true);
  };

  const handleTechnicianSignatureSave = (signature: string) => {
    onTechnicianSignatureChange?.(signature);
  };

  const handleClientSignatureSave = (signature: string) => {
    onClientSignatureChange?.(signature);
  };

  const handleRemoveTechnicianSignature = () => {
    onTechnicianSignatureChange?.("");
  };

  const handleRemoveClientSignature = () => {
    onClientSignatureChange?.("");
  };

  return (
    <>
      <CollapsibleSection title="Firmas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-3">Firma del Técnico</label>
            
            {technicianSignature ? (
              <div className="space-y-3">
                <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
                  <img 
                    src={technicianSignature} 
                    alt="Firma del Técnico" 
                    className="max-w-full h-24 object-contain mx-auto"
                  />
                </div>
                {isEditable && !fumigationReportSubmitted && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTechnicianSign}
                      className="flex-1"
                    >
                      Cambiar Firma
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveTechnicianSignature}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                  Sin firma
                </div>
                {isEditable && !fumigationReportSubmitted && (
                  <Button
                    onClick={handleTechnicianSign}
                    className="w-full mt-3 bg-[#003595] hover:bg-[#002060] text-white"
                  >
                    Firmar
                  </Button>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Firma del Cliente</label>
            
            {clientSignature ? (
              <div className="space-y-3">
                <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
                  <img 
                    src={clientSignature} 
                    alt="Firma del Cliente" 
                    className="max-w-full h-24 object-contain mx-auto"
                  />
                </div>
                {isEditable && !fumigationReportSubmitted && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClientSign}
                      className="flex-1"
                    >
                      Cambiar Firma
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveClientSignature}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                  Sin firma
                </div>
                {isEditable && !fumigationReportSubmitted && (
                  <Button
                    onClick={handleClientSign}
                    className="w-full mt-3 bg-[#003595] hover:bg-[#002060] text-white"
                  >
                    Firmar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      <SignatureModal
        isOpen={showTechnicianModal}
        title="Firma del Técnico"
        onClose={() => setShowTechnicianModal(false)}
        onSave={handleTechnicianSignatureSave}
        existingSignature={technicianSignature}
        fumigationId={fumigationId}
        cleanupId={cleanupId}
        signatureType="technician"
        autoUpload={true}
      />

      <SignatureModal
        isOpen={showClientModal}
        title="Firma del Cliente"
        onClose={() => setShowClientModal(false)}
        onSave={handleClientSignatureSave}
        existingSignature={clientSignature}
        fumigationId={fumigationId}
        cleanupId={cleanupId}
        signatureType="client"
        autoUpload={true}
      />
    </>
  );
};