import { FC, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FumigationDetailResponse, ApiUser } from "@/types/request";
import { usersService } from "@/services/usersService";
import { reportsService } from "@/services/reportsService";
import { toast } from "sonner";
import { FumigationForm } from "./FumigationForm";
import { UncoveringForm } from "./UncoveringForm";
import { useFumigationData } from "./hooks/useFumigationData";

interface EvidenceOverlayProps {
  fumigationDetails: FumigationDetailResponse | null;
  isEditable?: boolean;
  onClose?: () => void;
  onSave?: (data: any) => void;
  loading?: boolean;
}

export const EvidenceOverlay: FC<EvidenceOverlayProps> = ({
  fumigationDetails,
  isEditable = false,
  onClose,
  onSave,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState("fumigation");
  const [availableTechnicians, setAvailableTechnicians] = useState<ApiUser[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fumigationReportSubmitted, setFumigationReportSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    fumigationData,
    setFumigationData,
    validateFumigationForm,
    resetForm
  } = useFumigationData(fumigationDetails);

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        console.log("Cargando técnicos...");
        const response = await usersService.getUsersByRole('TECHNICIAN');
        console.log("Técnicos cargados:", response.content);
        setAvailableTechnicians(response.content);
      } catch (error) {
        console.error("Error al cargar técnicos:", error);
        toast.error("Error al cargar técnicos disponibles");
      }
    };

    if (isEditable) {
      loadTechnicians();
    }
  }, [isEditable]);

  const handleSubmitFumigationReport = async () => {
    if (isSubmitting) return; // Evitar doble clic
    
    console.log("Iniciando envío de reporte...");
    
    if (!validateFumigationForm()) {
      console.log("Validación fallida");
      return;
    }

    setIsSubmitting(true);

    try {
      // Formatear la fecha para el backend (dd-MM-yyyy)
      const formatDateForBackend = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      // Formatear los datos según el backend espera
      const reportData = {
        id: fumigationDetails?.lot.id || 0,
        location: fumigationData.location.trim(),
        date: formatDateForBackend(fumigationData.date), // Formato dd-MM-yyyy
        startTime: fumigationData.startTime,
        endTime: fumigationData.endTime,
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

      console.log("Datos a enviar:", reportData);
      console.log("Fecha formateada:", reportData.date);

      await reportsService.createFumigationReport(reportData);
      
      // Solo un toast de éxito
      setFumigationReportSubmitted(true);
      setShowConfirmDialog(false);
      toast.success("Reporte de fumigación enviado exitosamente");
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      
      // Solo un toast de error específico
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('400')) {
          toast.error("Error en los datos enviados. Verifique que todos los campos estén correctamente completados.");
        } else if (errorMessage.includes('Invalid value') || errorMessage.includes('LocalDate')) {
          toast.error("Error en el formato de fecha. Verifique que la fecha sea válida.");
        } else if (errorMessage.includes('403')) {
          toast.error("No tiene permisos para realizar esta acción.");
        } else if (errorMessage.includes('401')) {
          toast.error("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
        } else {
          toast.error(`Error al enviar el reporte: ${errorMessage}`);
        }
      } else {
        toast.error("Error desconocido al enviar el reporte");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "uncovering" && !fumigationReportSubmitted) {
      toast.error("Debe completar el registro de fumigación antes de acceder al registro de descarpe");
      return;
    }
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
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header fijo */}
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Evidencias de Fumigación - Lote {fumigationDetails.lot.lotNumber}
        </div>

        {/* Contenido con scroll limitado - siguiendo el patrón de OverlayContent */}
        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "70vh" }}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="fumigation">Registro de Fumigación</TabsTrigger>
              <TabsTrigger 
                value="uncovering" 
                disabled={!fumigationReportSubmitted}
                className={!fumigationReportSubmitted ? "opacity-50 cursor-not-allowed" : ""}
              >
                Registro de Descarpe
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fumigation" className="mt-0">
              <FumigationForm
                fumigationData={fumigationData}
                setFumigationData={setFumigationData}
                availableTechnicians={availableTechnicians}
                isEditable={isEditable}
                fumigationReportSubmitted={fumigationReportSubmitted}
              />
            </TabsContent>

            <TabsContent value="uncovering" className="mt-0">
              <UncoveringForm
                fumigationDetails={fumigationDetails}
                isEditable={isEditable}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer fijo */}
        <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-300 bg-white rounded-b-lg">
          {isEditable && !fumigationReportSubmitted && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button 
                onClick={() => setShowConfirmDialog(true)}
                className="bg-[#003595] hover:bg-[#002060]"
                disabled={isSubmitting}
              >
                Subir Evidencias
              </Button>
            </>
          )}

          {!isEditable && (
            <Button variant="outline" onClick={onClose}>
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
                Confirmar envío de evidencias
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                ¿Está seguro de que desea subir las evidencias de fumigación? Una vez enviadas, no podrá modificar la información.
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
                onClick={handleSubmitFumigationReport} 
                className="bg-[#003595] hover:bg-[#002060]"
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