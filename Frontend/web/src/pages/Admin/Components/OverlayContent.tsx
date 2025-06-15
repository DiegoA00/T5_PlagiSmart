import { FC, useState, useEffect } from "react";
import { Request } from "@/types/request";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/layouts/Overlay";

export const OverlayContent: FC<{
  request: Request;
  onClose?: () => void;
}> = ({ request, onClose }) => {
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setSelectedLots([]);
    setShowSuccess(false);
  }, [request]);

  const allSelected = selectedLots.length === request.lots.length && request.lots.length > 0;

  const handleLotCheckbox = (lotId: string) => {
    setSelectedLots((prev) =>
      prev.includes(lotId)
        ? prev.filter((id) => id !== lotId)
        : [...prev, lotId]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedLots([]);
    } else {
      setSelectedLots(request.lots.map((lot) => lot.id));
    }
  };

  const handleApprove = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      if (onClose) onClose();
    }, 2500);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Revisión de Solicitud de Servicio de Fumigación
        </div>
        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "70vh" }}>
          <div>
            <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
              Datos Generales del Cliente
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
              <div>
                <span className="font-medium">Nombre de la Empresa:</span>
                <span className="ml-2">{request.companyName || request.client}</span>
              </div>
              <div>
                <span className="font-medium">Razón Social:</span>
                <span className="ml-2">{request.companyLegalName || "-"}</span>
              </div>
              <div>
                <span className="font-medium">RUC:</span>
                <span className="ml-2">{request.ruc || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Dirección:</span>
                <span className="ml-2">{request.address || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Teléfono:</span>
                <span className="ml-2">{request.phone || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Nombre Representante Legal:</span>
                <span className="ml-2">{request.legalRep || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Contacto Planta:</span>
                <span className="ml-2">{request.plantContact || "-"}</span>
              </div>
              <div>
                <span className="font-medium">Consignatario (Opcional):</span>
                <span className="ml-2">{request.consignee || "-"}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
              Datos de Fumigación por Lote
            </div>
            {request.lots.map((lot) => (
              <div key={lot.id} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Lote #{lot.id}</span>
                  <label className="flex items-center gap-2 text-sm">
                    Seleccionar Lote:
                    <input
                      type="checkbox"
                      className="accent-[#003595]"
                      checked={selectedLots.includes(lot.id)}
                      onChange={() => handleLotCheckbox(lot.id)}
                    />
                  </label>
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
            ))}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                className="accent-[#003595]"
                id="selectAllLots"
                checked={allSelected}
                onChange={handleSelectAll}
              />
              <label htmlFor="selectAllLots" className="text-sm text-[#003595]">
                Seleccionar Todos los Lotes
              </label>
            </div>
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
            disabled={selectedLots.length === 0}
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