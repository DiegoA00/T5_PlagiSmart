import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiUser } from "@/types/request";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { FumigationData } from "../hooks/useFumigationData";

interface PersonnelSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  availableTechnicians: ApiUser[];
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const PersonnelSection: FC<PersonnelSectionProps> = ({
  fumigationData,
  setFumigationData,
  availableTechnicians,
  isEditable,
  fumigationReportSubmitted
}) => {
  const [technicianComboOpen, setTechnicianComboOpen] = useState(false);

  const handleTechnicianSelect = (technicianValue: string) => {
    const technician = availableTechnicians.find(t => 
      `${t.firstName} ${t.lastName}`.toLowerCase() === technicianValue.toLowerCase()
    );
    
    if (technician) {
      const isAlreadyAdded = fumigationData.technicians.some(t => t.id === technician.id);
      
      if (!isAlreadyAdded) {
        const newTechnician = {
          id: technician.id,
          name: `${technician.firstName} ${technician.lastName}`,
          role: "Técnico"
        };

        setFumigationData(prev => ({
          ...prev,
          selectedTechnician: technician.id.toString(),
          technicians: [...prev.technicians, newTechnician]
        }));
      }
      
      setTechnicianComboOpen(false);
    }
  };

  const removeTechnician = (technicianId: number) => {
    setFumigationData(prev => {
      const updatedTechnicians = prev.technicians.filter(t => t.id !== technicianId);
      return {
        ...prev,
        technicians: updatedTechnicians,
        selectedTechnician: updatedTechnicians.length === 0 ? "" : prev.selectedTechnician
      };
    });
  };

  const availableToAdd = availableTechnicians.filter(tech => 
    !fumigationData.technicians.some(addedTech => addedTech.id === tech.id)
  );

  return (
    <CollapsibleSection title="Personal que Interviene" defaultOpen required>
      <div className="space-y-4">
        {isEditable && !fumigationReportSubmitted && availableToAdd.length > 0 && (
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 required-field">Agregar Técnico</label>
            <Popover open={technicianComboOpen} onOpenChange={setTechnicianComboOpen}>
              <PopoverTrigger>
                <div
                  role="combobox"
                  aria-expanded={technicianComboOpen}
                  className={cn(
                    "flex h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer hover:bg-gray-50",
                    "text-muted-foreground"
                  )}
                  onClick={() => setTechnicianComboOpen(!technicianComboOpen)}
                >
                  <span>Seleccione un técnico para agregar</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white border shadow-md z-50" align="start">
                <Command className="bg-white">
                  <CommandInput placeholder="Buscar técnico..." className="h-9" />
                  <CommandList className="bg-white">
                    <CommandEmpty>No se encontraron técnicos disponibles.</CommandEmpty>
                    <CommandGroup className="bg-white">
                      {availableToAdd.map((technician) => (
                        <CommandItem
                          key={technician.id}
                          value={`${technician.firstName} ${technician.lastName}`}
                          onSelect={(value) => handleTechnicianSelect(value)}
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          <Plus className="mr-2 h-4 w-4 text-green-600" />
                          {technician.firstName} {technician.lastName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {fumigationData.technicians.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Técnicos Asignados ({fumigationData.technicians.length})</label>
            {fumigationData.technicians.map((technician, index) => (
              <div key={`${technician.id}-${index}`} className="grid grid-cols-12 gap-4 p-4 border rounded bg-gray-50">
                <div className="col-span-5">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Nombre Completo</label>
                  <Input 
                    value={technician.name}
                    disabled
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Cargo</label>
                  <Input 
                    value={technician.role}
                    disabled
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="col-span-3 flex items-end">
                  {isEditable && !fumigationReportSubmitted && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTechnician(technician.id)}
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      title="Remover técnico"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {fumigationData.technicians.length === 0 && (
          <div className="p-4 border border-dashed border-red-200 rounded-md text-center text-gray-500 bg-red-50">
            <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No hay técnicos asignados</p>
            <p className="text-xs text-red-600 font-medium">⚠️ Se requiere al menos un técnico para continuar</p>
          </div>
        )}

        {isEditable && !fumigationReportSubmitted && availableToAdd.length === 0 && fumigationData.technicians.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">Todos los técnicos disponibles han sido asignados</p>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};