import { FC } from "react";
import { CollapsibleSection } from "../../Admin/Components/Evidence/shared/CollapsibleSection";
import { FumigationData } from "../../../hooks/useFumigationEvidence";

interface ObservationsSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const ObservationsSection: FC<ObservationsSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted
}) => {
  return (
    <CollapsibleSection title="Observaciones">
      <textarea 
        className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={fumigationData.observations}
        onChange={(e) => setFumigationData(prev => ({ ...prev, observations: e.target.value }))}
        disabled={!isEditable || fumigationReportSubmitted}
        placeholder="Observaciones adicionales (opcional)..."
      />
    </CollapsibleSection>
  );
};