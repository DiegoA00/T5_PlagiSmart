import { FC } from "react";
import { ApiUser } from "@/types/request";
import { GeneralInfoSection } from "./Evidence/GeneralInfoSection";
import { PersonnelSection } from "./Evidence/PersonnelSection";
import { LotDetailsSection } from "./Evidence/LotDetailsSection";
import { EnvironmentalSection } from "./Evidence/EnvironmentalSection";
import { SafetySection } from "./Evidence/SafetySection";
import { SuppliesSection } from "./Evidence/SuppliesSection";
import { ObservationsSection } from "./Evidence/ObservationsSection";
import { ValidationErrorList } from "../Admin/Components/Evidence/components/ValidationErrorList";
import { FumigationData, ValidationErrors } from "../../hooks/useFumigationEvidence";

interface FumigationFormProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  availableTechnicians: ApiUser[];
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
  addToArray: (field: keyof FumigationData, item: any) => void;
  removeFromArray: (field: keyof FumigationData, index: number) => void;
}

export const FumigationForm: FC<FumigationFormProps> = ({
  fumigationData,
  setFumigationData,
  availableTechnicians,
  isEditable,
  fumigationReportSubmitted,
  validationErrors,
  updateField,
  addToArray,
  removeFromArray
}) => {
  return (
    <div className="space-y-4">
      <ValidationErrorList errors={validationErrors} />
      
      <GeneralInfoSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
        validationErrors={validationErrors}
        updateField={updateField}
      />

      <PersonnelSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        availableTechnicians={availableTechnicians}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />

      <LotDetailsSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
        validationErrors={validationErrors}
        updateField={updateField}
        mode="fumigation"
      />

      <EnvironmentalSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
        validationErrors={validationErrors}
        updateField={updateField}
      />

      <SafetySection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
        mode="fumigation"
      />

      <SuppliesSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
        validationErrors={validationErrors}
        updateField={updateField}
        addToArray={addToArray}
        removeFromArray={removeFromArray}
      />

      <ObservationsSection
        fumigationData={fumigationData}
        setFumigationData={setFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />
    </div>
  );
};