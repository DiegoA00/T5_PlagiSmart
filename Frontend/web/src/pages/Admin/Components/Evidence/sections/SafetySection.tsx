import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { FumigationData } from "../hooks/useFumigationData";

interface SafetySectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const SafetySection: FC<SafetySectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted
}) => {
  return (
    <CollapsibleSection title="Condiciones de Seguridad Industrial" defaultOpen>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="electric"
            checked={fumigationData.hazards.electricDanger}
            onCheckedChange={(checked) => setFumigationData(prev => ({ 
              ...prev, 
              hazards: { ...prev.hazards, electricDanger: !!checked }
            }))}
            disabled={!isEditable || fumigationReportSubmitted}
          />
          <label htmlFor="electric" className="text-sm font-medium">
            Peligro eléctrico
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="falls"
            checked={fumigationData.hazards.fallingDanger}
            onCheckedChange={(checked) => setFumigationData(prev => ({ 
              ...prev, 
              hazards: { ...prev.hazards, fallingDanger: !!checked }
            }))}
            disabled={!isEditable || fumigationReportSubmitted}
          />
          <label htmlFor="falls" className="text-sm font-medium">
            Peligro de caídas
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hit"
            checked={fumigationData.hazards.hitDanger}
            onCheckedChange={(checked) => setFumigationData(prev => ({ 
              ...prev, 
              hazards: { ...prev.hazards, hitDanger: !!checked }
            }))}
            disabled={!isEditable || fumigationReportSubmitted}
          />
          <label htmlFor="hit" className="text-sm font-medium">
            Peligro de golpes
          </label>
        </div>
      </div>
    </CollapsibleSection>
  );
};