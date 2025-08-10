import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FumigationDetailResponse, ApiUser } from "@/types/request";
import { usersService } from "@/services/usersService";
import { reportsService } from "@/services/reportsService";
import { FumigationForm } from "./FumigationForm";
import { UncoveringForm } from "./UncoveringForm";
import { useFumigationEvidence } from "@/hooks/useFumigationEvidence";
import { useUncoveringEvidence } from "@/hooks/useUncoveringEvidence";

interface TechnicianEvidenceOverlayProps {
  fumigationDetails: FumigationDetailResponse | null;
  isEditable?: boolean;
  fumigationStatus?: string | null;
  onClose?: () => void;
  onSave?: (data: any) => void;
  loading?: boolean;
}

export const TechnicianEvidenceOverlay: FC<TechnicianEvidenceOverlayProps> = ({
  fumigationDetails,
  isEditable = true,
  fumigationStatus,
  onClose,
  onSave,
  loading = false
}) => {
  const [availableTechnicians, setAvailableTechnicians] = useState<ApiUser[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fumigationReportSubmitted, setFumigationReportSubmitted] = useState(false);
  const [cleanupReportSubmitted, setCleanupReportSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    fumigationData,
    setFumigationData,
    validateFumigationForm,
    validationErrors: fumigationValidationErrors,
    clearValidationErrors: clearFumigationValidationErrors,
    updateField: updateFumigationField,
    addToArray: addToFumigationArray,
    removeFromArray: removeFromFumigationArray,
    resetForm: resetFumigationForm
  } = useFumigationEvidence(fumigationDetails);

  const {
    cleanupData,
    setCleanupData,
    validateForm: validateCleanupForm,
    validationErrors: cleanupValidationErrors,
    clearValidationErrors: clearCleanupValidationErrors,
    updateField: updateCleanupField,
    updateLotDescription,
    updateSafetyConditions,
    addTechnician: addCleanupTechnician,
    removeTechnician: removeCleanupTechnician,
    resetForm: resetCleanupForm
  } = useUncoveringEvidence(fumigationDetails);

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const response = await usersService.getUsersByRole('TECHNICIAN');
        setAvailableTechnicians(response.content);
      } catch (error) {
        console.error("Error loading technicians:", error);
      }
    };

    if (isEditable) {
      loadTechnicians();
    }
  }, [isEditable]);

  const handleSubmitClick = () => {
    if (fumigationStatus === "APPROVED") {
      if (!validateFumigationForm()) {
        return;
      }
    } else if (fumigationStatus === "FUMIGATED") {
      if (!validateCleanupForm()) {
        return;
      }
    }
    
    setShowConfirmDialog(true);
  };

  const handleSubmitFumigationReport = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const formatDateForBackend = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };

      const reportData = {
        id: fumigationDetails?.lot.id || 0,
        location: fumigationData.location.trim(),
        date: formatDateForBackend(fumigationData.date),
        startTime: fumigationData.startTime,
        endTime: fumigationData.endTime,
        supervisor: fumigationData.supervisor.trim(),
        technicians: fumigationData.technicians.map(t => ({ id: t.id })),
        supplies: fumigationData.supplies.map(supply => ({
          name: supply.name.trim(),
          quantity: parseFloat(supply.quantity),
          dosage: supply.dosage.trim(),
          kindOfSupply: supply.kindOfSupply.trim(),
          numberOfStrips: supply.numberOfStrips.trim() || "0"
        })),
        dimensions: {
          height: parseFloat(fumigationData.dimensions.height),
          width: parseFloat(fumigationData.dimensions.width),
          length: parseFloat(fumigationData.dimensions.length)
        },
        environmentalConditions: {
          temperature: parseFloat(fumigationData.environmentalConditions.temperature),
          humidity: parseFloat(fumigationData.environmentalConditions.humidity)
        },
        industrialSafetyConditions: {
          electricDanger: fumigationData.hazards.electricDanger,
          fallingDanger: fumigationData.hazards.fallingDanger,
          hitDanger: fumigationData.hazards.hitDanger
        },
        observations: fumigationData.observations.trim() || ""
      };

      await reportsService.createFumigationReport(reportData);
      
      setFumigationReportSubmitted(true);
      setShowConfirmDialog(false);
      
      onSave?.(reportData);
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting fumigation report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCleanupReport = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const formatDateForBackend = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };

      const reportData = {
        id: fumigationDetails?.lot.id || 0,
        date: formatDateForBackend(cleanupData.date),
        startTime: cleanupData.startTime,
        endTime: cleanupData.endTime,
        supervisor: cleanupData.supervisor.trim(),
        technicians: cleanupData.technicians.map(t => ({ id: t.id })),
        lotDescription: {
          stripsState: cleanupData.lotDescription.stripsState.trim(),
          fumigationTime: cleanupData.lotDescription.fumigationTime,
          ppmFosfina: cleanupData.lotDescription.ppmFosfina
        },
        industrialSafetyConditions: {
          electricDanger: cleanupData.industrialSafetyConditions.electricDanger,
          fallingDanger: cleanupData.industrialSafetyConditions.fallingDanger,
          hitDanger: cleanupData.industrialSafetyConditions.hitDanger,
          otherDanger: cleanupData.industrialSafetyConditions.otherDanger
        }
      };

      await reportsService.createCleanupReport(reportData);
      
      setCleanupReportSubmitted(true);
      setShowConfirmDialog(false);
      
      onSave?.(reportData);
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting cleanup report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = () => {
    if (fumigationStatus === "APPROVED") {
      handleSubmitFumigationReport();
    } else {
      handleSubmitCleanupReport();
    }
  };

  const getTitle = () => {
    if (fumigationStatus === "APPROVED") {
      return `Registro de Fumigación - Lote ${fumigationDetails?.lot?.lotNumber || ''}`;
    } else if (fumigationStatus === "FUMIGATED") {
      return `Registro de Descarpe - Lote ${fumigationDetails?.lot?.lotNumber || ''}`;
    }
    return `Evidencias - Lote ${fumigationDetails?.lot?.lotNumber || ''}`;
  };

  const getButtonText = () => {
    if (fumigationStatus === "APPROVED") {
      return "Subir Registro de Fumigación";
    } else if (fumigationStatus === "FUMIGATED") {
      return "Subir Registro de Descarpe";
    }
    return "Subir Registro";
  };

  const isFormSubmitted = () => {
    if (fumigationStatus === "APPROVED") {
      return fumigationReportSubmitted;
    } else if (fumigationStatus === "FUMIGATED") {
      return cleanupReportSubmitted;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Cargando evidencias...
        </div>
        <div className="flex items-center justify-center px-8 py-6 flex-1">
          <div className="text-gray-500">Cargando información...</div>
        </div>
      </div>
    );
  }

  if (!fumigationDetails) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Error
        </div>
        <div className="flex items-center justify-center px-8 py-6 flex-1">
          <div className="text-red-500">No se pudieron cargar los detalles</div>
        </div>
        <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-300 bg-white rounded-b-lg">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          {getTitle()}
        </div>

        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "70vh" }}>
          {fumigationStatus === "APPROVED" && (
            <FumigationForm
              fumigationData={fumigationData}
              setFumigationData={setFumigationData}
              availableTechnicians={availableTechnicians}
              isEditable={isEditable}
              fumigationReportSubmitted={fumigationReportSubmitted}
              validationErrors={fumigationValidationErrors}
              updateField={updateFumigationField}
              addToArray={addToFumigationArray}
              removeFromArray={removeFromFumigationArray}
            />
          )}

          {fumigationStatus === "FUMIGATED" && (
            <UncoveringForm
              fumigationDetails={fumigationDetails}
              cleanupData={cleanupData}
              setCleanupData={setCleanupData}
              availableTechnicians={availableTechnicians}
              isEditable={isEditable}
              cleanupReportSubmitted={cleanupReportSubmitted}
              validationErrors={cleanupValidationErrors}
              updateField={updateCleanupField}
              updateLotDescription={updateLotDescription}
              updateSafetyConditions={updateSafetyConditions}
              addTechnician={addCleanupTechnician}
              removeTechnician={removeCleanupTechnician}
            />
          )}
        </div>

        <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-300 bg-white rounded-b-lg">
          {isEditable && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              
              {!isFormSubmitted() && (
                <Button 
                  onClick={handleSubmitClick}
                  className={fumigationStatus === "APPROVED" ? "bg-[#003595] hover:bg-[#002060] text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                  disabled={isSubmitting}
                >
                  {getButtonText()}
                </Button>
              )}
            </>
          )}

          {!isEditable && (
            <Button 
              variant="secondary"
              className="bg-[#003595] text-white hover:bg-[#002060]"
              onClick={onClose}
            >
              Cerrar
            </Button>
          )}
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmar envío</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas enviar este registro? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmSubmit}
                className={fumigationStatus === "APPROVED" ? "bg-[#003595] hover:bg-[#002060] text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};