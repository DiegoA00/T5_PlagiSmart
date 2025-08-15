import { FC } from "react";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "../../Admin/Components/Evidence/shared/CollapsibleSection";
import { FumigationData, ValidationErrors } from "../../../hooks/useFumigationEvidence";

interface EnvironmentalSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors?: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
}

export const EnvironmentalSection: FC<EnvironmentalSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField
}) => {
  const handleEnvironmentalChange = (field: keyof typeof fumigationData.environmentalConditions, value: string) => {
    updateField('environmentalConditions', {
      ...fumigationData.environmentalConditions,
      [field]: value
    });
  };

  return (
    <CollapsibleSection title="Condiciones Ambientales" defaultOpen>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Temperatura (°C)</label>
          <Input 
            type="number"
            step="0.1"
            value={fumigationData.environmentalConditions.temperature}
            onChange={(e) => handleEnvironmentalChange('temperature', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="0.0"
            className={`${validationErrors.temperature ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {validationErrors.temperature && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.temperature}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Humedad (%)</label>
          <Input 
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={fumigationData.environmentalConditions.humidity}
            onChange={(e) => handleEnvironmentalChange('humidity', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="0.0"
            className={`${validationErrors.humidity ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {validationErrors.humidity && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.humidity}</p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};