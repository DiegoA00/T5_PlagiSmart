import { FC, useState, useEffect } from "react";
import { FumigationDetailResponse, ApiUser } from "@/types/request";
import { useCleanupData, CleanupData } from "./hooks/useCleanupData";
import { ValidationErrorList } from "./components/ValidationErrorList";
import { GeneralInfoSection } from "./sections/GeneralInfoSection";
import { PersonnelSection } from "./sections/PersonnelSection";
import { LotDetailsSection } from "./sections/LotDetailsSection";
import { SafetySection } from "./sections/SafetySection";
import { SignaturesSection } from "./sections/SignaturesSection";

interface UncoveringFormProps {
  fumigationDetails: FumigationDetailResponse | null;
  isEditable: boolean;
  availableTechnicians?: ApiUser[];
  cleanupData?: CleanupData;
  setCleanupData?: React.Dispatch<React.SetStateAction<CleanupData>>;
  validationErrors?: any;
  updateField?: (field: keyof CleanupData, value: any) => void;
  updateLotDescription?: (field: string, value: any) => void;
  updateSafetyConditions?: (field: string, value: boolean) => void;
  addTechnician?: (technician: any) => void;
  removeTechnician?: (index: number) => void;
}

export const UncoveringForm: FC<UncoveringFormProps> = ({
  fumigationDetails,
  isEditable,
  availableTechnicians = [],
  cleanupData: externalCleanupData,
  setCleanupData: externalSetCleanupData,
  validationErrors: externalValidationErrors,
  updateField: externalUpdateField,
  updateLotDescription: externalUpdateLotDescription,
  updateSafetyConditions: externalUpdateSafetyConditions,
  addTechnician: externalAddTechnician,
  removeTechnician: externalRemoveTechnician,
}) => {
  const internalHook = useCleanupData(fumigationDetails);
  
  const cleanupData = externalCleanupData || internalHook.cleanupData;
  const setCleanupData = externalSetCleanupData || internalHook.setCleanupData;
  const validationErrors = externalValidationErrors || internalHook.validationErrors;
  const updateField = externalUpdateField || internalHook.updateField;
  const updateLotDescription = externalUpdateLotDescription || internalHook.updateLotDescription;
  const updateSafetyConditions = externalUpdateSafetyConditions || internalHook.updateSafetyConditions;
  const addTechnician = externalAddTechnician || internalHook.addTechnician;
  const removeTechnician = externalRemoveTechnician || internalHook.removeTechnician;

  const [fumigationData, setFumigationData] = useState(() => {
    return {
      fumigationId: "",
      registrationNumber: fumigationDetails?.lot?.lotNumber || "",
      company: "Anecacao",
      location: fumigationDetails?.lot?.address || "",
      date: cleanupData.date,
      startTime: cleanupData.startTime,
      endTime: cleanupData.endTime,
      supervisor: "",
      lotDetails: {
        lotNumber: fumigationDetails?.lot?.lotNumber || "",
        tons: fumigationDetails?.lot?.tons || "",
        quality: fumigationDetails?.lot?.quality || "",
        sacks: fumigationDetails?.lot?.sacks || "",
        portDestination: fumigationDetails?.lot?.portDestination || "",
        stripsState: cleanupData.lotDescription.stripsState,
        fumigationTime: cleanupData.lotDescription.fumigationTime.toString(),
        ppmFosfina: cleanupData.lotDescription.ppmFosfina.toString()
      },
      dimensions: { height: "", width: "", length: "" },
      technicians: cleanupData.technicians.map(t => ({
        id: t.id,
        name: `${t.firstName} ${t.lastName}`,
        role: "Técnico"
      })),
      selectedTechnician: "",
      supplies: [],
      environmentalConditions: { temperature: "", humidity: "" },
      hazards: {
        electricDanger: cleanupData.industrialSafetyConditions.electricDanger,
        fallingDanger: cleanupData.industrialSafetyConditions.fallingDanger,
        hitDanger: cleanupData.industrialSafetyConditions.hitDanger,
        otherDanger: cleanupData.industrialSafetyConditions.otherDanger
      },
      observations: ""
    };
  });

  useEffect(() => {
    setFumigationData(prev => ({
      ...prev,
      date: cleanupData.date,
      startTime: cleanupData.startTime,
      endTime: cleanupData.endTime,
      technicians: cleanupData.technicians.map(t => ({
        id: t.id,
        name: `${t.firstName} ${t.lastName}`,
        role: "Técnico"
      })),
      lotDetails: {
        ...prev.lotDetails,
        stripsState: cleanupData.lotDescription.stripsState,
        fumigationTime: cleanupData.lotDescription.fumigationTime.toString(),
        ppmFosfina: cleanupData.lotDescription.ppmFosfina.toString()
      },
      hazards: {
        electricDanger: cleanupData.industrialSafetyConditions.electricDanger,
        fallingDanger: cleanupData.industrialSafetyConditions.fallingDanger,
        hitDanger: cleanupData.industrialSafetyConditions.hitDanger,
        otherDanger: cleanupData.industrialSafetyConditions.otherDanger
      }
    }));
  }, [cleanupData]);

  const updateFumigationField = (field: any, value: any) => {
    setFumigationData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'date') {
      updateField('date', value);
    } else if (field === 'startTime') {
      updateField('startTime', value);
    } else if (field === 'endTime') {
      updateField('endTime', value);
    } else if (field === 'lotDetails') {
      if (value.stripsState !== undefined) {
        updateLotDescription('stripsState', value.stripsState);
      }
      if (value.fumigationTime !== undefined) {
        updateLotDescription('fumigationTime', parseInt(value.fumigationTime) || 0);
      }
      if (value.ppmFosfina !== undefined) {
        updateLotDescription('ppmFosfina', parseInt(value.ppmFosfina) || 0);
      }
    }
  };

  const handleSetFumigationData = (updateFn: any) => {
    if (typeof updateFn === 'function') {
      setFumigationData(prev => {
        const newData = updateFn(prev);
        
        if (newData.date !== prev.date) {
          updateField('date', newData.date);
        }
        if (newData.startTime !== prev.startTime) {
          updateField('startTime', newData.startTime);
        }
        if (newData.endTime !== prev.endTime) {
          updateField('endTime', newData.endTime);
        }
        if (JSON.stringify(newData.technicians) !== JSON.stringify(prev.technicians)) {
          setCleanupData(prevCleanup => ({
            ...prevCleanup,
            technicians: newData.technicians.map((t: any) => ({
              id: t.id,
              firstName: t.name.split(' ')[0],
              lastName: t.name.split(' ').slice(1).join(' ')
            }))
          }));
        }
        if (JSON.stringify(newData.lotDetails) !== JSON.stringify(prev.lotDetails)) {
          if (newData.lotDetails.stripsState !== prev.lotDetails.stripsState) {
            updateLotDescription('stripsState', newData.lotDetails.stripsState);
          }
          if (newData.lotDetails.fumigationTime !== prev.lotDetails.fumigationTime) {
            updateLotDescription('fumigationTime', parseInt(newData.lotDetails.fumigationTime) || 0);
          }
          if (newData.lotDetails.ppmFosfina !== prev.lotDetails.ppmFosfina) {
            updateLotDescription('ppmFosfina', parseInt(newData.lotDetails.ppmFosfina) || 0);
          }
        }
        if (JSON.stringify(newData.hazards) !== JSON.stringify(prev.hazards)) {
          Object.keys(newData.hazards).forEach(key => {
            if (newData.hazards[key] !== prev.hazards[key]) {
              updateSafetyConditions(key, newData.hazards[key]);
            }
          });
        }
        
        return newData;
      });
    }
  };

  if (!isEditable) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Vista de solo lectura del registro de descarpe</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ValidationErrorList errors={Object.values(validationErrors).filter(Boolean)} />

      <GeneralInfoSection
        fumigationData={fumigationData}
        setFumigationData={handleSetFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={false}
        validationErrors={validationErrors}
        updateField={updateFumigationField}
      />

      <PersonnelSection
        fumigationData={fumigationData}
        setFumigationData={handleSetFumigationData}
        availableTechnicians={availableTechnicians}
        isEditable={isEditable}
        fumigationReportSubmitted={false}
      />

      <LotDetailsSection
        fumigationData={fumigationData}
        setFumigationData={handleSetFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={false}
        validationErrors={validationErrors}
        updateField={updateFumigationField}
        mode="cleanup"
      />

      <SafetySection
        fumigationData={fumigationData}
        setFumigationData={handleSetFumigationData}
        isEditable={isEditable}
        fumigationReportSubmitted={false}
        mode="cleanup"
      />

      <SignaturesSection
        isEditable={isEditable}
        fumigationReportSubmitted={false}
      />
    </div>
  );
};