import { FC } from "react";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { FumigationData } from "../hooks/useFumigationData";

interface EnvironmentalSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const EnvironmentalSection: FC<EnvironmentalSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted
}) => {
  const handleEnvironmentalChange = (field: keyof typeof fumigationData.environmentalConditions, value: string) => {
    const numericValue = parseFloat(value);
    
    // Validaciones específicas
    if (value !== "") {
      if (isNaN(numericValue)) return; // No es un número válido
      
      if (field === 'humidity') {
        // Solo validar humedad: 0-100%
        if (numericValue < 0 || numericValue > 100) return;
      }
      // Para temperatura: sin restricciones de rango, solo que sea un número válido
    }
    
    setFumigationData(prev => ({ 
      ...prev, 
      environmentalConditions: { ...prev.environmentalConditions, [field]: value }
    }));
  };

  return (
    <CollapsibleSection title="Condiciones Ambientales" defaultOpen required>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Temperatura (°C) *</label>
          <Input 
            type="number"
            value={fumigationData.environmentalConditions.temperature}
            onChange={(e) => handleEnvironmentalChange('temperature', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="0"
            onKeyDown={(e) => {
              if (e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Humedad (%) *</label>
          <Input 
            type="number"
            min="0"
            max="100"
            value={fumigationData.environmentalConditions.humidity}
            onChange={(e) => handleEnvironmentalChange('humidity', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="0"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Rango: 0% a 100%</p>
        </div>
      </div>
    </CollapsibleSection>
  );
};