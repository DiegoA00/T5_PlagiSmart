import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { FumigationData } from "../hooks/useFumigationData";

interface SafetySectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  mode?: "fumigation" | "cleanup";
}

export const SafetySection: FC<SafetySectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  mode = "fumigation"
}) => {
  const handleHazardChange = (hazardType: keyof typeof fumigationData.hazards, checked: boolean) => {
    setFumigationData(prev => ({
      ...prev,
      hazards: {
        ...prev.hazards,
        [hazardType]: checked
      }
    }));
  };

  return (
    <CollapsibleSection title="Condiciones de Seguridad Industrial" defaultOpen>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="electric"
            checked={fumigationData.hazards.electricDanger}
            onCheckedChange={(checked) => handleHazardChange('electricDanger', !!checked)}
            disabled={!isEditable || fumigationReportSubmitted}
          />
          <label htmlFor="electric" className="text-sm font-medium">
            Peligro Eléctrico
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="falls"
            checked={fumigationData.hazards.fallingDanger}
            onCheckedChange={(checked) => handleHazardChange('fallingDanger', !!checked)}
            disabled={!isEditable || fumigationReportSubmitted}
          />
          <label htmlFor="falls" className="text-sm font-medium">
            Peligro de Caída
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hits"
            checked={fumigationData.hazards.hitDanger}
            onCheckedChange={(checked) => handleHazardChange('hitDanger', !!checked)}
            disabled={!isEditable || fumigationReportSubmitted}
          />
          <label htmlFor="hits" className="text-sm font-medium">
            Peligro de Golpe
          </label>
        </div>
        {mode === "cleanup" && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="other"
              checked={fumigationData.hazards.otherDanger}
              onCheckedChange={(checked) => handleHazardChange('otherDanger', !!checked)}
              disabled={!isEditable || fumigationReportSubmitted}
            />
            <label htmlFor="other" className="text-sm font-medium">
              Otro Peligro
            </label>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};