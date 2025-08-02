import { FC } from "react";
import { Request } from "@/types/request";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequestApproval } from "@/hooks/useRequestApproval";
import { ClientDataSection } from "./ClientDataSection";
import { FumigationLotCard } from "./FumigationLotCard";
import { ObservationModal } from "./ObservationModal";
import { SuccessModal } from "./SuccessModal";

interface OverlayContentProps {
  request: Request;
  onClose: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const OverlayContent: FC<OverlayContentProps> = ({ 
  request, 
  onClose,
  onRefresh,
  isLoading = false,
  error = null
}) => {
  const {
    selectedLots,
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
  } = useRequestApproval(request, onClose, onRefresh);

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
          
          <ClientDataSection request={request} isLoading={isLoading} />
          
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
                <FumigationLotCard
                  key={fumigation.id}
                  fumigation={fumigation}
                  isSelected={selectedLots.includes(fumigation.id.toString())}
                  observation={getLotObservation(fumigation.id)}
                  onSelectLot={handleSelectLot}
                  onAddObservation={handleAddObservation}
                />
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
      
      <ObservationModal
        isOpen={showObservationForm !== null}
        lotNumber={request.applicationData?.fumigations?.find(f => f.id === showObservationForm)?.lotNumber}
        observation={tempObservation}
        onObservationChange={setTempObservation}
        onSave={handleSaveObservation}
        onCancel={handleCancelObservation}
      />
      
      <SuccessModal isOpen={showSuccess} message={successMessage} />
    </>
  );
};