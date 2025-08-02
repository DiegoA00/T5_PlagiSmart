import { FC } from "react";
import { CollapsibleSection } from "../shared/CollapsibleSection";

interface SignaturesSectionProps {
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const SignaturesSection: FC<SignaturesSectionProps> = ({ 
  isEditable, 
  fumigationReportSubmitted 
}) => {
  return (
    <CollapsibleSection title="Firmas">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Firma del Técnico</label>
          <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
            Firma digital (pendiente de implementar)
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Firma del Cliente</label>
          <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
            Firma digital (pendiente de implementar)
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};