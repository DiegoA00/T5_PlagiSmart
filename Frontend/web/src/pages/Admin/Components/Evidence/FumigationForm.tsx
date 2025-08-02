import { FC } from "react";
import { ApiUser } from "@/types/request";
import { GeneralInfoSection } from "./sections/GeneralInfoSection";
import { PersonnelSection } from "./sections/PersonnelSection";
import { DimensionsSection } from "./sections/DimensionsSection";
import { EnvironmentalSection } from "./sections/EnvironmentalSection";
import { SafetySection } from "./sections/SafetySection";
import { SuppliesSection } from "./sections/SuppliesSection";
import { ObservationsSection } from "./sections/ObservationsSection";
import { SignaturesSection } from "./sections/SignaturesSection";
import { FumigationData } from "./hooks/useFumigationData";

interface FumigationFormProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  availableTechnicians: ApiUser[];
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const FumigationForm: FC<FumigationFormProps> = ({
  fumigationData,
  setFumigationData,
  availableTechnicians,
  isEditable,
  fumigationReportSubmitted
}) => {
  return (
    <div className="space-y-4">
      <GeneralInfoSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />

      <PersonnelSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        availableTechnicians={availableTechnicians}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />

      <DimensionsSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />

      <EnvironmentalSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />

      <SafetySection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />

      <SuppliesSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />

      <ObservationsSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />

      <SignaturesSection
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />
    </div>
  );
};