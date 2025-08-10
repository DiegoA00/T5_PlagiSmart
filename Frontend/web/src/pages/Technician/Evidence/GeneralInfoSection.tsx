import { FC } from "react";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "../../Admin/Components/Evidence/shared/CollapsibleSection";
import { FumigationData, ValidationErrors } from "../../../hooks/useFumigationEvidence";

interface GeneralInfoSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors?: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
}

export const GeneralInfoSection: FC<GeneralInfoSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField
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
          <label className="block text-sm font-medium mb-2">Ubicación</label>
          <Input 
            value={fumigationData.location}
            disabled
            className="bg-gray-100"
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
            onChange={(e) => updateField('startTime', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            className={`${validationErrors.startTime ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {validationErrors.startTime && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.startTime}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Hora de Finalización</label>
          <Input 
            type="time"
            value={fumigationData.endTime}
            onChange={(e) => updateField('endTime', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            className={`${validationErrors.endTime ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {validationErrors.endTime && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.endTime}</p>
          )}
          {validationErrors.timeRange && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.timeRange}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2 required-field">Supervisor</label>
          <Input 
            value={fumigationData.supervisor}
            onChange={(e) => updateField('supervisor', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="Nombre del supervisor"
            className={`${validationErrors.supervisor ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {validationErrors.supervisor && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.supervisor}</p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};