import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/layouts/Overlay";

interface ObservationModalProps {
  isOpen: boolean;
  lotNumber: string | undefined;
  observation: string;
  onObservationChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ObservationModal: FC<ObservationModalProps> = ({
  isOpen,
  lotNumber,
  observation,
  onObservationChange,
  onSave,
  onCancel
}) => {
  return (
    <Overlay open={isOpen} onClose={onCancel}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 className="text-lg font-semibold mb-4 text-[#003595]">
          Agregar Observación - Lote #{lotNumber}
        </h3>
        <textarea
          value={observation}
          onChange={(e) => onObservationChange(e.target.value)}
          placeholder="Escriba la observación para este lote..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#003595] focus:border-transparent"
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="bg-[#003595] text-white hover:bg-[#002060]" onClick={onSave}>
            Guardar Observación
          </Button>
        </div>
      </div>
    </Overlay>
  );
};