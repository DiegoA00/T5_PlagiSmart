import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { FumigationData, Supply } from "../hooks/useFumigationData";

interface SuppliesSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const SuppliesSection: FC<SuppliesSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted
}) => {
  const handleSupplyChange = (index: number, field: keyof Supply, value: string) => {
    if (field === 'quantity' || field === 'numberOfStrips') {
      if (value !== "") {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0) {
          return;
        }
      }
    }
    
    setFumigationData(prev => ({
      ...prev,
      supplies: prev.supplies.map((supply, i) => 
        i === index ? { ...supply, [field]: value } : supply
      )
    }));
  };

  const addSupply = () => {
    setFumigationData(prev => ({
      ...prev,
      supplies: [...prev.supplies, { 
        name: "", 
        quantity: "", 
        dosage: "", 
        kindOfSupply: "", 
        numberOfStrips: "" 
      }]
    }));
  };

  const removeSupply = (index: number) => {
    if (fumigationData.supplies.length > 1) {
      setFumigationData(prev => ({
        ...prev,
        supplies: prev.supplies.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <CollapsibleSection title="Suministros Utilizados" defaultOpen required>
      <div className="space-y-4">
        {fumigationData.supplies.map((supply, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded">
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Producto</label>
              <Input 
                value={supply.name}
                onChange={(e) => handleSupplyChange(index, 'name', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Cantidad</label>
              <Input 
                type="number"
                step="0.1"
                min="0"
                value={supply.quantity}
                onChange={(e) => handleSupplyChange(index, 'quantity', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="0.0"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Dosis</label>
              <Input 
                value={supply.dosage}
                onChange={(e) => handleSupplyChange(index, 'dosage', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="ej: 5ml/m2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Tipo</label>
              <Input 
                value={supply.kindOfSupply}
                onChange={(e) => handleSupplyChange(index, 'kindOfSupply', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="Gas, Líquido, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">N° Cintas</label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  min="0"
                  value={supply.numberOfStrips}
                  onChange={(e) => handleSupplyChange(index, 'numberOfStrips', e.target.value)}
                  disabled={!isEditable || fumigationReportSubmitted}
                  placeholder="0"
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                />
                {isEditable && !fumigationReportSubmitted && (
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSupply(index)}
                    disabled={fumigationData.supplies.length === 1}
                  >
                    <Minus size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isEditable && !fumigationReportSubmitted && (
          <Button type="button" variant="outline" onClick={addSupply}>
            <Plus size={16} className="mr-2" />
            Agregar Suministro
          </Button>
        )}
      </div>
    </CollapsibleSection>
  );
};