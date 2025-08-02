import { FC, useState, useEffect } from "react";
import { Request } from "@/types/request";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/layouts/Overlay";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/utils/dateUtils";
import { fumigationService } from "@/services/fumigationService";
import { toast } from "sonner";

interface OverlayContentProps {
  request: Request;
  onClose: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  error?: string | null;
}

interface LotObservation {
  lotId: number;
  observation: string;
}

export const OverlayContent: FC<OverlayContentProps> = ({ 
  request, 
  onClose,
  onRefresh,
  isLoading = false,
  error = null
}) => {
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
  
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Revisión de Solicitud de Servicio de Fumigación
        </div>
        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "70vh" }}>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              <p className="font-medium">Error al cargar datos del servidor:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div>
            <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
              Datos Generales del Cliente
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
              <div>
                <span className="font-medium">Nombre de la Empresa:</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-32 inline-block ml-2" />
                ) : (
                  <span className="ml-2">{request.applicationData?.company?.name || "-"}</span>
                )}
              </div>
              
              <div>
                <span className="font-medium">Razón Social:</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-32 inline-block ml-2" />
                ) : (
                  <span className="ml-2">{request.applicationData?.company?.businessName || "-"}</span>
                )}
              </div>
              
              <div>
                <span className="font-medium">RUC:</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-32 inline-block ml-2" />
                ) : (
                  <span className="ml-2">{request.applicationData?.company?.ruc || "-"}</span>
                )}
              </div>
              
              <div>
                <span className="font-medium">Dirección:</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-32 inline-block ml-2" />
                ) : (
                  <span className="ml-2">{request.applicationData?.company?.address || "-"}</span>
                )}
              </div>
              
              <div>
                <span className="font-medium">Teléfono:</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-32 inline-block ml-2" />
                ) : (
                  <span className="ml-2">{request.applicationData?.company?.phoneNumber || "-"}</span>
                )}
              </div>

              <div>
                <span className="font-medium">Nombre Representante Legal:</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-32 inline-block ml-2" />
                ) : (
                  <span className="ml-2">
                    {request.applicationData?.company?.legalRepresentative ? 
                      `${request.applicationData.company.legalRepresentative.firstName || ''} ${request.applicationData.company.legalRepresentative.lastName || ''}`.trim() || "-" : 
                      "-"}
                  </span>
                )}
              </div>

              {request.applicationData?.company?.cosigner && (
                <div>
                  <span className="font-medium">Nombre Cosignatario:</span>
                  {isLoading ? (
                    <Skeleton className="h-4 w-32 inline-block ml-2" />
                  ) : (
                    <span className="ml-2">{request.applicationData?.company?.cosigner || "-"}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
              Datos de Fumigación por Lote
            </div>
            
            {isLoading ? (
              Array(2).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="border rounded bg-white p-4">
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            ) : (
              request.applicationData?.fumigations?.map((fumigation) => (
                <div key={fumigation.id} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      Lote #{fumigation.lotNumber}
                    </span>
                    <label className="flex items-center gap-2 text-sm">
                      Seleccionar Lote:
                      <input
                        type="checkbox"
                        className="accent-[#003595]"
                        checked={selectedLots.includes(fumigation.id.toString())}
                        onChange={() => handleSelectLot(fumigation.id)}
                      />
                    </label>
                  </div>
                  <div className="border rounded bg-white">
                    <div className="grid grid-cols-2 md:grid-cols-5 text-xs font-semibold text-[#003595] border-b border-[#003595] px-4 py-2">
                      <div className="col-span-2">DETALLE</div>
                      <div className="col-span-3">VALOR</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
                      <div className="col-span-2">Fecha y Hora de Fumigación Planificada</div>
                      <div className="col-span-3">{formatDateTime(fumigation.dateTime)}</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
                      <div className="col-span-2">Puerto de Destino</div>
                      <div className="col-span-3">{fumigation.portDestination || "-"}</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
                      <div className="col-span-2">Número de Toneladas</div>
                      <div className="col-span-3">{fumigation.ton || "-"}</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
                      <div className="col-span-2">Calidad</div>
                      <div className="col-span-3">{fumigation.quality || "-"}</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm">
                      <div className="col-span-2">Número de Sacos</div>
                      <div className="col-span-3">{fumigation.sacks || "-"}</div>
                    </div>
                    {fumigation.message && (
                      <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-t border-[#003595]">
                        <div className="col-span-2">Mensaje</div>
                        <div className="col-span-3">{fumigation.message}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    {getLotObservation(fumigation.id) ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium text-yellow-800">Observación agregada:</span>
                            <p className="text-yellow-700 mt-1">{getLotObservation(fumigation.id)}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddObservation(fumigation.id)}
                            className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                          >
                            Editar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddObservation(fumigation.id)}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        Agregar Observación
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {!isLoading && request.applicationData?.fumigations?.length && request.applicationData.fumigations.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  className="accent-[#003595]"
                  id="selectAllLots"
                  checked={selectedLots.length === (request.applicationData?.fumigations?.length ?? 0)}
                  onChange={handleSelectAll}
                />
                <label htmlFor="selectAllLots" className="text-sm text-[#003595]">
                  Seleccionar Todos los Lotes
                </label>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-4 px-8 py-6 border-t border-[#003595] bg-white rounded-b-lg">
          <Button
            variant="secondary"
            className="bg-gray-500 text-white hover:bg-gray-600"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar Revisión
          </Button>
          
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleRejectAll}
            disabled={isLoading || isProcessing}
          >
            {isProcessing ? "Procesando..." : "Rechazar Toda la Solicitud"}
          </Button>
          
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleApprove}
            disabled={isLoading || selectedLots.length === 0 || isProcessing}
          >
            {isProcessing ? "Procesando..." : "Aprobar Lotes Seleccionados"}
          </Button>
        </div>
      </div>
      
      <Overlay open={showObservationForm !== null} onClose={handleCancelObservation}>
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
          <h3 className="text-lg font-semibold mb-4 text-[#003595]">
            Agregar Observación - Lote #{request.applicationData?.fumigations?.find(f => f.id === showObservationForm)?.lotNumber}
          </h3>
          <textarea
            value={tempObservation}
            onChange={(e) => setTempObservation(e.target.value)}
            placeholder="Escriba la observación para este lote..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#003595] focus:border-transparent"
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={handleCancelObservation}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#003595] text-white hover:bg-[#002060]"
              onClick={handleSaveObservation}
            >
              Guardar Observación
            </Button>
          </div>
        </div>
      </Overlay>
      
      <Overlay open={showSuccess} onClose={() => {}}>
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg">
          <div className="text-4xl mb-4 text-green-600">✔</div>
          <div className="text-lg font-semibold mb-2 text-[#003595]">¡Procesamiento exitoso!</div>
          <div className="text-sm text-gray-700 mb-4 text-center max-w-md">
            {successMessage}
          </div>
          <div className="text-xs text-gray-500">
            Esta ventana se cerrará automáticamente en 5 segundos...
          </div>
        </div>
      </Overlay>
    </>
  );
};