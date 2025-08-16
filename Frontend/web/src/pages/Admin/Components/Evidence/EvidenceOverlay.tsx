import { FC, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FumigationDetailResponse, ApiUser, FumigationReportResponse, CleanupReportResponse } from "@/types/request";
import { usersService } from "@/services/usersService";
import { reportsService } from "@/services/reportsService";
import { FumigationForm } from "../../../Technician/FumigationForm";
import { UncoveringForm } from "../../../Technician/UncoveringForm";
import { FumigationReportView } from "./components/FumigationReportView";
import { CleanupReportView } from "./components/CleanupReportView";
import { useFumigationEvidence } from "@/hooks/useFumigationEvidence";
import { useUncoveringEvidence } from "@/hooks/useUncoveringEvidence";

interface EvidenceOverlayProps {
  fumigationDetails: FumigationDetailResponse | null;
  isEditable?: boolean;
  fumigationStatus?: string; // Agregar esta prop para el status
  onClose?: () => void;
  onSave?: (data: any) => void;
  loading?: boolean;
}

export const EvidenceOverlay: FC<EvidenceOverlayProps> = ({
  fumigationDetails,
  isEditable = false,
  fumigationStatus, // Agregar esta prop
  onClose,
  onSave,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState("fumigation");
  const [availableTechnicians, setAvailableTechnicians] = useState<ApiUser[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmType, setConfirmType] = useState<"fumigation" | "cleanup">("fumigation");
  const [fumigationReportSubmitted, setFumigationReportSubmitted] = useState(false);
  const [cleanupReportSubmitted, setCleanupReportSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [fumigationReport, setFumigationReport] = useState<FumigationReportResponse | null>(null);
  const [cleanupReport, setCleanupReport] = useState<CleanupReportResponse | null>(null);
  const [fumigationViewLoading, setFumigationViewLoading] = useState(false);
  const [cleanupViewLoading, setCleanupViewLoading] = useState(false);
  const [fumigationViewError, setFumigationViewError] = useState<string | null>(null);
  const [cleanupViewError, setCleanupViewError] = useState<string | null>(null);
  
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

  useEffect(() => {
    if (fumigationDetails?.lot?.id && !isEditable) {
      console.log('Loading reports based on fumigation status:', fumigationStatus);
      
      if (activeTab === "fumigation") {
        // Solo cargar reporte de fumigación si el status es FUMIGATED o FINISHED
        if (fumigationStatus === "FUMIGATED" || fumigationStatus === "FINISHED") {
          loadFumigationReport();
        } else {
          // Si está APPROVED, mostrar mensaje indicando que no hay reporte aún
          setFumigationViewError("No se ha registrado un reporte de fumigación para este lote aún.");
        }
      } else if (activeTab === "cleanup") {
        // Solo cargar reporte de cleanup si el status es FINISHED
        if (fumigationStatus === "FINISHED") {
          loadCleanupReport();
        } else {
          // Si está APPROVED o FUMIGATED, mostrar mensaje indicando que no hay reporte aún
          setCleanupViewError("No se ha registrado un reporte de descarpe para este lote aún.");
        }
      }
    }
  }, [activeTab, fumigationDetails?.lot?.id, fumigationStatus, isEditable]);

  const getErrorMessage = (error: any): string => {
    if (error.response?.status === 404) {
      return activeTab === "fumigation" 
        ? "No se ha registrado un reporte de fumigación para este lote aún."
        : "No se ha registrado un reporte de descarpe para este lote aún.";
    } else if (error.response?.status === 403) {
      return "No tienes permisos para ver este reporte.";
    } else if (error.response?.status === 500) {
      return "Error interno del servidor. Intenta nuevamente más tarde.";
    }
    return error.message || "Error desconocido al cargar el reporte.";
  };

  const loadFumigationReport = async () => {
    if (fumigationReport || !fumigationDetails?.lot?.id) return;
    
    console.log('Loading fumigation report for lot ID:', fumigationDetails.lot.id);
    setFumigationViewLoading(true);
    setFumigationViewError(null);
    try {
      const report = await reportsService.getFumigationReport(fumigationDetails.lot.id);
      console.log('Fumigation report loaded successfully:', report);
      setFumigationReport(report);
    } catch (error: any) {
      console.error("Error loading fumigation report:", error);
      
      const errorMessage = getErrorMessage(error);
      setFumigationViewError(errorMessage);
    } finally {
      setFumigationViewLoading(false);
    }
  };

  const loadCleanupReport = async () => {
    if (cleanupReport || !fumigationDetails?.lot?.id) {
      console.log('Skipping cleanup report load - already loaded or no lot ID');
      return;
    }
    
    console.log('Loading cleanup report for lot ID:', fumigationDetails.lot.id);
    setCleanupViewLoading(true);
    setCleanupViewError(null);
    try {
      const report = await reportsService.getCleanupReport(fumigationDetails.lot.id);
      console.log('Cleanup report loaded successfully:', report);
      setCleanupReport(report);
    } catch (error: any) {
      console.error("Error loading cleanup report:", error);
      
      const errorMessage = getErrorMessage(error);
      setCleanupViewError(errorMessage);
    } finally {
      setCleanupViewLoading(false);
    }
  };

  const handleSubmitClick = (type: "fumigation" | "cleanup") => {
    if (type === "fumigation") {
      if (!validateFumigationForm()) {
        return;
      }
    } else if (type === "cleanup") {
      if (!validateCleanupForm()) {
        return;
      }
    }
    
    setConfirmType(type);
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
        return `${day}-${month}-${day}`;
      };

      const reportData = {
        id: fumigationDetails?.lot.id || 0,
        date: formatDateForBackend(cleanupData.date),
        startTime: cleanupData.startTime,
        endTime: cleanupData.endTime,
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
    if (confirmType === "fumigation") {
      handleSubmitFumigationReport();
    } else {
      handleSubmitCleanupReport();
    }
  };

  const handleTabChange = (value: string) => {
    console.log('Tab change requested:', value, 'current:', activeTab);
    setActiveTab(value);
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
          Evidencias - Lote {fumigationDetails.lot.lotNumber}
        </div>

        <div className="px-8 py-6 flex-1">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fumigation">Fumigación</TabsTrigger>
              <TabsTrigger value="cleanup">Descarpe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fumigation" className="mt-6">
              {isEditable ? (
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
              ) : (
                <FumigationReportView
                  report={fumigationReport}
                  loading={fumigationViewLoading}
                  error={fumigationViewError}
                />
              )}
            </TabsContent>
            
            <TabsContent value="cleanup" className="mt-6">
              {isEditable ? (
                <UncoveringForm
                  fumigationDetails={fumigationDetails}
                  availableTechnicians={availableTechnicians}
                  cleanupData={cleanupData}
                  setCleanupData={setCleanupData}
                  validationErrors={cleanupValidationErrors}
                  updateField={updateCleanupField}
                  addTechnician={addCleanupTechnician}
                  removeTechnician={removeCleanupTechnician}
                />
              ) : (
                <CleanupReportView
                  report={cleanupReport}
                  loading={cleanupViewLoading}
                  error={cleanupViewError}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-300 bg-white rounded-b-lg">
          {isEditable && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              
              {activeTab === "fumigation" && !fumigationReportSubmitted && (
                <Button 
                  onClick={() => handleSubmitClick("fumigation")}
                  className="bg-[#003595] hover:bg-[#002060] text-white"
                  disabled={isSubmitting}
                >
                  Subir Registro de Fumigación
                </Button>
              )}
              
              {activeTab === "cleanup" && !cleanupReportSubmitted && (
                <Button 
                  onClick={() => handleSubmitClick("cleanup")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  Subir Registro de Descarpe
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
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar envío de {confirmType === "fumigation" ? "registro de fumigación" : "registro de descarpe"}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                ¿Está seguro de que desea subir el {confirmType === "fumigation" ? "registro de fumigación" : "registro de descarpe"}? Una vez enviado, no podrá modificar la información.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmSubmit} 
                disabled={isSubmitting}
                className={confirmType === "fumigation" ? "bg-[#003595] hover:bg-[#002060] text-white" : "bg-green-600 hover:bg-green-700 text-white"}
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