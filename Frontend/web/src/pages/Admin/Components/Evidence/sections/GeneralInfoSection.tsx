import { FC } from "react";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { FumigationData } from "../hooks/useFumigationData";

interface GeneralInfoSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const GeneralInfoSection: FC<GeneralInfoSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted
}) => {
  return (
    <CollapsibleSection title="Información General" defaultOpen>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Número de Registro</label>
          <Input 
            value={fumigationData.registrationNumber}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Empresa</label>
          <Input 
            value={fumigationData.company}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Ubicación</label>
          <Input 
            value={fumigationData.location}
            onChange={(e) => setFumigationData(prev => ({ ...prev, location: e.target.value }))}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="Ingrese la ubicación"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fecha</label>
          <Input 
            value={fumigationData.date}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Hora de Inicio</label>
          <Input 
            type="time"
            value={fumigationData.startTime}
            onChange={(e) => setFumigationData(prev => ({ ...prev, startTime: e.target.value }))}
            disabled={!isEditable || fumigationReportSubmitted}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Hora de Finalización</label>
          <Input 
            type="time"
            value={fumigationData.endTime}
            onChange={(e) => setFumigationData(prev => ({ ...prev, endTime: e.target.value }))}
            disabled={!isEditable || fumigationReportSubmitted}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};