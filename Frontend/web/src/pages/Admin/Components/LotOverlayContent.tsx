import { FC } from "react";
import { Button } from "@/components/ui/button";
import { FumigationDetailResponse } from "@/types/request";
import { formatDate } from "@/utils/dateUtils";

export interface LotOverlayProps {
  fumigationDetails: FumigationDetailResponse | null;
  isEvidence?: boolean;
  onClose?: () => void;
  loading?: boolean;
}

export const LotOverlayContent: FC<LotOverlayProps> = ({ 
  fumigationDetails,
  isEvidence = false, 
  onClose,
  loading = false
}) => {
  
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Cargando información...
        </div>
        <div className="flex items-center justify-center px-8 py-6" style={{ minHeight: "300px" }}>
          <div className="text-gray-500">Cargando detalles del lote...</div>
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
        <div className="flex items-center justify-center px-8 py-6" style={{ minHeight: "300px" }}>
          <div className="text-red-500">No se pudieron cargar los detalles del lote</div>
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
  
  if (isEvidence) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Evidencias del Lote #{fumigationDetails.lot.lotNumber}
        </div>
        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "70vh" }}>
          <p className="text-gray-500">Las evidencias estarán disponibles próximamente</p>
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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
        Información del Lote a Fumigar
      </div>
      <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "70vh" }}>
        <div>
          <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
            Datos Generales del Cliente
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
            <div>
              <span className="font-medium">Nombre de la Empresa:</span>
              <span className="ml-2">{fumigationDetails.company.name || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Razón Social:</span>
              <span className="ml-2">{fumigationDetails.company.businessName || "-"}</span>
            </div>
            <div>
              <span className="font-medium">RUC:</span>
              <span className="ml-2">{fumigationDetails.company.ruc || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Dirección:</span>
              <span className="ml-2">{fumigationDetails.company.address || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Teléfono:</span>
              <span className="ml-2">{fumigationDetails.company.phoneNumber || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Nombre Representante Legal:</span>
              <span className="ml-2">{fumigationDetails.representative || "-"}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
            Datos de Servicio - Lote #{fumigationDetails.lot.lotNumber}
          </div>
          <div className="border rounded bg-white">
            <div className="grid grid-cols-2 md:grid-cols-5 text-xs font-semibold text-[#003595] border-b border-[#003595] px-4 py-2">
              <div className="col-span-2">DETALLE</div>
              <div className="col-span-3">VALOR</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
              <div className="col-span-2">Fecha y Hora Planificada</div>
              <div className="col-span-3">{formatDate(fumigationDetails.plannedDate) || "-"}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
              <div className="col-span-2">Puerto de Destino</div>
              <div className="col-span-3">{fumigationDetails.lot.portDestination || "-"}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
              <div className="col-span-2">Número de Toneladas</div>
              <div className="col-span-3">{fumigationDetails.lot.tons || "-"}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm border-b border-[#003595]">
              <div className="col-span-2">Calidad</div>
              <div className="col-span-3">{fumigationDetails.lot.quality || "-"}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 px-4 py-2 text-sm">
              <div className="col-span-2">Número de Sacos</div>
              <div className="col-span-3">{fumigationDetails.lot.sacks || "-"}</div>
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