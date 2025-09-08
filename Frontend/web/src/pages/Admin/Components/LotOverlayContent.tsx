import { FC } from "react";
import { Button } from "@/components/ui/button";
import { FumigationDetailResponse } from "@/types/request";
import { formatDate } from "@/utils/dateUtils";

export interface LotOverlayProps {
  fumigationDetails: FumigationDetailResponse | null;
  onClose?: () => void;
  loading?: boolean;
}

export const LotOverlayContent: FC<LotOverlayProps> = ({ 
  fumigationDetails,
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
              <span className="font-medium">Representante:</span>
              <span className="ml-2">{fumigationDetails.representative || "-"}</span>
            </div>
          </div>

          <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
            Información del Lote
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <span className="font-medium">Número de Lote:</span>
              <span className="ml-2">{fumigationDetails.lot.lotNumber || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Toneladas:</span>
              <span className="ml-2">{fumigationDetails.lot.tons || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Calidad:</span>
              <span className="ml-2">{fumigationDetails.lot.quality || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Número de Sacos:</span>
              <span className="ml-2">{fumigationDetails.lot.sacks || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Puerto de Destino:</span>
              <span className="ml-2">{fumigationDetails.lot.portDestination || "-"}</span>
            </div>
            <div>
              <span className="font-medium">Fecha Planificada:</span>
              <span className="ml-2">{formatDate(fumigationDetails.plannedDate) || "-"}</span>
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