import { FC } from "react";
import { ApiUser } from "@/types/request";
import { GeneralInfoSection } from "./sections/GeneralInfoSection";
import { PersonnelSection } from "./sections/PersonnelSection";
import { LotDetailsSection } from "./sections/LotDetailsSection";
import { EnvironmentalSection } from "./sections/EnvironmentalSection";
import { SafetySection } from "./sections/SafetySection";
import { SuppliesSection } from "./sections/SuppliesSection";
import { ObservationsSection } from "./sections/ObservationsSection";
import { SignaturesSection } from "./sections/SignaturesSection";
import { ValidationErrorList } from "./components/ValidationErrorList";
import { FumigationData, ValidationErrors } from "./hooks/useFumigationData";

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

      <SignaturesSection 
        isEditable={isEditable}
        fumigationReportSubmitted={fumigationReportSubmitted}
      />
    </div>
  );
};