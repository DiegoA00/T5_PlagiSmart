import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FumigationDetailResponse, ApiUser } from "@/types/request";
import { usersService } from "@/services/usersService";
import { reportsService } from "@/services/reportsService";
import { signatureService } from "@/services/signatureService";
import { FumigationForm } from "./FumigationForm";
import { UncoveringForm } from "./UncoveringForm";
import { SignatureConfirmationModal } from "@/components/SignatureConfirmationModal";
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
  const [showSignatureConfirmation, setShowSignatureConfirmation] = useState(false);
  const [fumigationReportSubmitted, setFumigationReportSubmitted] = useState(false);
  const [cleanupReportSubmitted, setCleanupReportSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportId, setReportId] = useState<number | null>(null);
  
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
    
    setShowSignatureConfirmation(true);
  };

  const handleSignatureConfirmation = async (technicianSignature: string, clientSignature: string) => {
    setIsSubmitting(true);
    
    try {
      console.log("🔄 Iniciando proceso completo...");
      
      const reportData = await createReport();
      console.log("✅ Reporte creado exitosamente");

      const createdReport = fumigationStatus === "APPROVED" 
        ? await reportsService.getFumigationReport(fumigationDetails?.lot.id || 0)
        : await reportsService.getCleanupReport(fumigationDetails?.lot.id || 0);
      
      console.log("📝 Subiendo firmas para reporte ID:", createdReport.id);

      await signatureService.uploadSignature({
        fumigationId: fumigationStatus === "APPROVED" ? createdReport.id : null,
        cleanupId: fumigationStatus === "FUMIGATED" ? createdReport.id : null,
        signatureType: 'technician',
        signatureData: technicianSignature
      });
      console.log("✅ Firma del técnico subida");

      await signatureService.uploadSignature({
        fumigationId: fumigationStatus === "APPROVED" ? createdReport.id : null,
        cleanupId: fumigationStatus === "FUMIGATED" ? createdReport.id : null,
        signatureType: 'client',
        signatureData: clientSignature
      });
      console.log("✅ Firma del cliente subida");

      if (fumigationStatus === "APPROVED") {
        setFumigationReportSubmitted(true);
      } else {
        setCleanupReportSubmitted(true);
      }

      setShowSignatureConfirmation(false);
      onSave?.({});
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("❌ Error en el proceso:", error);
      alert(`Error al procesar el registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createReport = async () => {
    const formatDateForBackend = (dateString: string) => {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    };

    console.log("=== CREATING REPORT ===");
    console.log("Fumigation Details:", fumigationDetails);
    console.log("Lot ID being sent:", fumigationDetails?.lot.id);

    if (fumigationStatus === "APPROVED") {
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

      console.log("Report data being sent:", reportData);
      await reportsService.createFumigationReport(reportData);
      return reportData;
    } else {
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
      return reportData;
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

      <SignatureConfirmationModal
        isOpen={showSignatureConfirmation}
        onClose={() => {
          if (!isSubmitting) {
            setShowSignatureConfirmation(false);
          }
        }}
        onConfirm={handleSignatureConfirmation}
        isSubmitting={isSubmitting}
        reportType={fumigationStatus === "APPROVED" ? 'fumigation' : 'cleanup'}
      />
    </>
  );
};