import { FC } from "react";
import { Button } from "@/components/ui/button";
import { LotStatus, CompletedLot } from "@/types/lot";
import { Request } from "@/types/request";
import { REQUESTS } from "@/constants/exampleRequests";

// Interfaz que acepta cualquier tipo de lote
export interface LotOverlayProps {
  lot: LotStatus | CompletedLot;
  isEvidence?: boolean;
  onClose?: () => void;
}

export const LotOverlayContent: FC<LotOverlayProps> = ({ 
  lot, 
  isEvidence = false, 
  onClose 
}) => {
  // Encuentra la solicitud a la que pertenece este lote
  const parentRequest = REQUESTS.find(req => 
    req.lots.some(l => l.id === lot.id)
  );

  // Determina si es un lote completado
  const isCompletedLot = 'completionDate' in lot && 'uncoveringDate' in lot;
  
  if (isEvidence) {
    // Contenido para evidencias
    return (
      <div className="flex flex-col h-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Evidencias del {isCompletedLot ? 'Servicio' : 'Lote'} #{lot.id}
        </div>
        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "70vh" }}>
          <p className="text-gray-500">Las evidencias estarán disponibles próximamente</p>
          {/* Aquí irá el contenido de las evidencias en el futuro */}
        </div>
        <div className="flex justify-end gap-4 px-8 py-6 border-t border-[#003595] bg-white rounded-b-lg">
          <Button
            variant="secondary"
            className="bg-[#003595] text-white hover:bg-[#002060]"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  // Contenido para ver más información
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
        {isCompletedLot ? 'Información del Servicio Finalizado' : 'Información del Lote a Fumigar'}
      </div>
      <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "70vh" }}>
        {parentRequest && (
          <div>
            <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
              Datos Generales del Cliente
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
              <div>
                <span className="font-medium">Nombre de la Empresa:</span>
                <span className="ml-2">{parentRequest.companyName || parentRequest.client}</span>
              </div>
              <div>
                <span className="font-medium">Razón Social:</span>
                <span className="ml-2">{parentRequest.companyLegalName || "-"}</span>
              </div>
              <div>
                <span className="font-medium">RUC:</span>
                <span className="ml-2">{parentRequest.ruc || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Dirección:</span>
                <span className="ml-2">{parentRequest.address || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Teléfono:</span>
                <span className="ml-2">{parentRequest.phone || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Nombre Representante Legal:</span>
                <span className="ml-2">{parentRequest.legalRep || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Contacto Planta:</span>
                <span className="ml-2">{parentRequest.plantContact || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Consignatario (Opcional):</span>
                <span className="ml-2">{parentRequest.consignee || "-"}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
            Datos de {isCompletedLot ? 'Servicio' : 'Fumigación'} - Lote #{lot.id}
          </div>
          <div className="border rounded bg-white">
            <div className="grid grid-cols-2 md:grid-cols-5 text-xs font-semibold text-[#003595] border-b border-[#003595] px-4 py-2">
              <div className="col-span-2">DETALLE</div>
              <div className="col-span-3">VALOR</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
              <div className="col-span-2">Fecha y Hora de Fumigación</div>
              <div className="col-span-3">{lot.fumigationDate}</div>
            </div>
            {isCompletedLot && (
              <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
                <div className="col-span-2">Fecha y Hora de Descarpe</div>
                <div className="col-span-3">{(lot as CompletedLot).uncoveringDate}</div>
              </div>
            )}
            {isCompletedLot && (
              <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
                <div className="col-span-2">Fecha de Finalización</div>
                <div className="col-span-3">{(lot as CompletedLot).completionDate}</div>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
              <div className="col-span-2">Puerto de Destino</div>
              <div className="col-span-3">{lot.destinationPort}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
              <div className="col-span-2"># Toneladas</div>
              <div className="col-span-3">{lot.tons}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
              <div className="col-span-2">Calidad Grado</div>
              <div className="col-span-3">{lot.grade}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm">
              <div className="col-span-2"># Sacos</div>
              <div className="col-span-3">{lot.sacks}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 px-8 py-6 border-t border-[#003595] bg-white rounded-b-lg">
        <Button
          variant="secondary"
          className="bg-[#003595] text-white hover:bg-[#002060]"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
};