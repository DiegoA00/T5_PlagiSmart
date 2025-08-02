import { FC, useState, useEffect } from "react";
import { Request } from "@/types/request";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/layouts/Overlay";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/utils/dateUtils";

interface OverlayContentProps {
  request: Request;
  onClose: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const OverlayContent: FC<OverlayContentProps> = ({ 
  request, 
  onClose,
  isLoading = false,
  error = null
}) => {
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    setSelectedLots([]);
    setShowSuccess(false);
  }, [request]);

  const handleApprove = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      if (onClose) onClose();
    }, 2500);
  };

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
            className="bg-[#003595] text-white hover:bg-[#002060]"
            onClick={onClose}
          >
            Cancelar Revisión
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleApprove}
            disabled={isLoading || selectedLots.length === 0}
          >
            Aprobar Lotes Seleccionados
          </Button>
        </div>
      </div>
      
      <Overlay open={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="flex flex-col items-center justify-center p-10">
          <div className="text-4xl mb-4 text-green-600">✔</div>
          <div className="text-lg font-semibold mb-2 text-[#003595]">¡Aprobación exitosa!</div>
          <div className="text-sm text-gray-700 mb-4 text-center">
            Los lotes seleccionados han sido aprobados correctamente.
          </div>
          <Button
            className="bg-[#003595] text-white hover:bg-[#002060] mt-2"
            onClick={() => {
              setShowSuccess(false);
              if (onClose) onClose();
            }}
          >
            Cerrar
          </Button>
        </div>
      </Overlay>
    </>
  );
};