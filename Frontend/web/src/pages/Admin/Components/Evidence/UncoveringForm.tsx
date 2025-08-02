import { FC } from "react";
import { FumigationDetailResponse } from "@/types/request";

interface UncoveringFormProps {
  fumigationDetails: FumigationDetailResponse | null;
  isEditable: boolean;
}

export const UncoveringForm: FC<UncoveringFormProps> = ({
  fumigationDetails,
  isEditable
}) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Registro de Descarpe disponible después de completar el registro de fumigación</p>
    </div>
  );
};