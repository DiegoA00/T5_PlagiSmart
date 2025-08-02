import { FC } from "react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/dateUtils";

interface FumigationLotCardProps {
  fumigation: any;
  isSelected: boolean;
  observation: string;
  onSelectLot: (id: number) => void;
  onAddObservation: (id: number) => void;
}

export const FumigationLotCard: FC<FumigationLotCardProps> = ({ 
  fumigation, 
  isSelected, 
  observation, 
  onSelectLot, 
  onAddObservation 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">
          Lote #{fumigation.lotNumber}
        </span>
        <label className="flex items-center gap-2 text-sm">
          Seleccionar Lote:
          <input
            type="checkbox"
            className="accent-[#003595]"
            checked={isSelected}
            onChange={() => onSelectLot(fumigation.id)}
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
        {observation ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-yellow-800">Observación agregada:</span>
                <p className="text-yellow-700 mt-1">{observation}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddObservation(fumigation.id)}
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
            onClick={() => onAddObservation(fumigation.id)}
            className="text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            Agregar Observación
          </Button>
        )}
      </div>
    </div>
  );
};