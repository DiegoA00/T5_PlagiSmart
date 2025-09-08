import { useState, useEffect } from "react";
import { Request } from "@/types/request";
import { fumigationService } from "@/services/fumigationService";
import { toast } from "sonner";

interface LotObservation {
  lotId: number;
  observation: string;
}

export const useRequestApproval = (request: Request, onClose: () => void, onRefresh: () => void) => {
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const [lotObservations, setLotObservations] = useState<LotObservation[]>([]);
  const [showObservationForm, setShowObservationForm] = useState<number | null>(null);
  const [tempObservation, setTempObservation] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const showErrorToast = (title: string, description: string) => {
    toast.error(title, {
      description: description
    });
  };

  useEffect(() => {
    setSelectedLots([]);
    setLotObservations([]);
    setShowObservationForm(null);
    setTempObservation("");
    setShowSuccess(false);
  }, [request]);

  const handleSelectLot = (id: number) => {
    setSelectedLots(prev => {
      const idStr = id.toString();
      return prev.includes(idStr) 
        ? prev.filter(i => i !== idStr) 
        : [...prev, idStr];
    });
  };

  const handleSelectAll = () => {
    if (selectedLots.length === (request.applicationData?.fumigations?.length || 0)) {
      setSelectedLots([]);
    } else {
      const lotIds = request.applicationData?.fumigations?.map(f => f.id.toString()) || [];
      setSelectedLots(lotIds);
    }
  };

  const handleAddObservation = (lotId: number) => {
    setShowObservationForm(lotId);
    const existingObservation = lotObservations.find(obs => obs.lotId === lotId);
    setTempObservation(existingObservation?.observation || "");
  };

  const handleSaveObservation = () => {
    if (!showObservationForm) return;
    
    setLotObservations(prev => {
      const filtered = prev.filter(obs => obs.lotId !== showObservationForm);
      if (tempObservation.trim()) {
        return [...filtered, { lotId: showObservationForm, observation: tempObservation.trim() }];
      }
      return filtered;
    });
    
    setShowObservationForm(null);
    setTempObservation("");
  };

  const handleCancelObservation = () => {
    setShowObservationForm(null);
    setTempObservation("");
  };

  const getLotObservation = (lotId: number): string => {
    return lotObservations.find(obs => obs.lotId === lotId)?.observation || "";
  };

  const validateApprovalAction = (): string | null => {
    const allLots = request.applicationData?.fumigations || [];
    const unselectedLots = allLots.filter(lot => !selectedLots.includes(lot.id.toString()));
    
    if (selectedLots.length === 0) {
      return "Debe seleccionar al menos un lote para aprobar.";
    }
    
    for (const lot of unselectedLots) {
      if (!getLotObservation(lot.id)) {
        return `Debe agregar una observación para el lote #${lot.lotNumber} que será rechazado.`;
      }
    }
    
    return null;
  };

  const handleApprove = async () => {
    const validationError = validateApprovalAction();
    if (validationError) {
      showErrorToast("Observaciones requeridas", validationError);
      return;
    }

    setIsProcessing(true);
    
    try {
      const allLots = request.applicationData?.fumigations || [];
      const approvedCount = selectedLots.length;
      const rejectedCount = allLots.length - approvedCount;
      
      const updatePromises = allLots.map(lot => {
        const isSelected = selectedLots.includes(lot.id.toString());
        const status = isSelected ? "APPROVED" : "REJECTED";
        const message = isSelected ? "" : getLotObservation(lot.id);
        
        return fumigationService.updateFumigationStatus(lot.id, status, message);
      });
      
      await Promise.all(updatePromises);
      
      let message = "";
      if (rejectedCount === 0) {
        message = `Se han aprobado ${approvedCount} lote${approvedCount !== 1 ? 's' : ''} correctamente.`;
      } else if (approvedCount === 0) {
        message = `Se han rechazado ${rejectedCount} lote${rejectedCount !== 1 ? 's' : ''}.`;
      } else {
        message = `Se han aprobado ${approvedCount} lote${approvedCount !== 1 ? 's' : ''} y rechazado ${rejectedCount} lote${rejectedCount !== 1 ? 's' : ''}.`;
      }
      
      setSuccessMessage(message);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        onRefresh();
      }, 5000);
      
    } catch (error: any) {
      showErrorToast("Error al procesar solicitud", error.message || "Ocurrió un error inesperado");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectAll = async () => {
    const allLots = request.applicationData?.fumigations || [];
    
    for (const lot of allLots) {
      if (!getLotObservation(lot.id)) {
        showErrorToast(
          "Observaciones requeridas", 
          `Debe agregar una observación para el lote #${lot.lotNumber} antes de rechazar toda la solicitud.`
        );
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      const updatePromises = allLots.map(lot => 
        fumigationService.updateFumigationStatus(lot.id, "REJECTED", getLotObservation(lot.id))
      );
      
      await Promise.all(updatePromises);
      
      setSuccessMessage(`Se han rechazado todos los ${allLots.length} lote${allLots.length !== 1 ? 's' : ''} de la solicitud.`);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        onRefresh();
      }, 5000);
      
    } catch (error: any) {
      showErrorToast("Error al rechazar solicitud", error.message || "Ocurrió un error inesperado");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    selectedLots,
    lotObservations,
    showObservationForm,
    tempObservation,
    setTempObservation,
    showSuccess,
    successMessage,
    isProcessing,
    handleSelectLot,
    handleSelectAll,
    handleAddObservation,
    handleSaveObservation,
    handleCancelObservation,
    getLotObservation,
    handleApprove,
    handleRejectAll
  };
};