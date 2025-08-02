import { FC, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FumigationDetailResponse, ApiUser } from "@/types/request";
import { ChevronDown, ChevronUp, Plus, Minus, Check, ChevronsUpDown } from "lucide-react";
import { usersService } from "@/services/usersService";
import { reportsService } from "@/services/reportsService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EvidenceOverlayProps {
  fumigationDetails: FumigationDetailResponse | null;
  isEditable?: boolean;
  onClose?: () => void;
  onSave?: (data: any) => void;
  loading?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

interface Supply {
  name: string;
  quantity: string;
  dosage: string;
  kindOfSupply: string;
  numberOfStrips: string;
}

interface Technician {
  id: number;
  name: string;
  role: string;
}

const CollapsibleSection: FC<CollapsibleSectionProps> = ({ 
  title, 
  defaultOpen = false, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border rounded-md mb-4">
      <div 
        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

export const EvidenceOverlay: FC<EvidenceOverlayProps> = ({
  fumigationDetails,
  isEditable = false,
  onClose,
  onSave,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState("fumigation");
  const [availableTechnicians, setAvailableTechnicians] = useState<ApiUser[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fumigationReportSubmitted, setFumigationReportSubmitted] = useState(false);
  const [technicianComboOpen, setTechnicianComboOpen] = useState(false);
  
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const [fumigationData, setFumigationData] = useState({
    registrationNumber: fumigationDetails?.lot.id?.toString() || "",
    company: fumigationDetails?.company.name || "",
    location: "",
    date: getCurrentDate(),
    startTime: getCurrentTime(),
    endTime: getCurrentTime(),
    selectedTechnician: "",
    technicians: [] as Technician[],
    dimensions: {
      height: "",
      width: "",
      length: ""
    },
    environmentalConditions: {
      temperature: "",
      humidity: ""
    },
    hazards: {
      electricDanger: false,
      fallingDanger: false,
      hitDanger: false
    },
    observations: "",
    supplies: [{ 
      name: "", 
      quantity: "", 
      dosage: "", 
      kindOfSupply: "", 
      numberOfStrips: "" 
    }] as Supply[]
  });

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const response = await usersService.getUsersByRole('TECHNICIAN');
        setAvailableTechnicians(response.content);
      } catch (error) {
        toast.error("Error al cargar técnicos disponibles");
      }
    };

    if (isEditable) {
      loadTechnicians();
    }
  }, [isEditable]);

  const handleTechnicianSelect = (technicianId: string) => {
    const technician = availableTechnicians.find(t => t.id.toString() === technicianId);
    if (technician) {
      setFumigationData(prev => ({
        ...prev,
        selectedTechnician: technicianId,
        technicians: [{
          id: technician.id,
          name: `${technician.firstName} ${technician.lastName}`,
          role: "Técnico"
        }]
      }));
      setTechnicianComboOpen(false);
    }
  };

  const handleSupplyChange = (index: number, field: keyof Supply, value: string) => {
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

  const validateFumigationForm = () => {
    const required = [
      fumigationData.location,
      fumigationData.startTime,
      fumigationData.endTime,
      fumigationData.dimensions.height,
      fumigationData.dimensions.width,
      fumigationData.dimensions.length,
      fumigationData.environmentalConditions.temperature,
      fumigationData.environmentalConditions.humidity
    ];

    if (required.some(field => !field)) {
      toast.error("Por favor complete todos los campos requeridos");
      return false;
    }

    if (fumigationData.technicians.length === 0) {
      toast.error("Debe seleccionar al menos un técnico");
      return false;
    }

    if (fumigationData.supplies.some(supply => 
      !supply.name || !supply.quantity || !supply.dosage || !supply.kindOfSupply || !supply.numberOfStrips
    )) {
      toast.error("Complete todos los campos de suministros");
      return false;
    }

    return true;
  };

  const handleSubmitFumigationReport = async () => {
    if (!validateFumigationForm()) return;

    try {
      const reportData = {
        id: fumigationDetails?.lot.id || 0,
        location: fumigationData.location,
        date: fumigationData.date,
        startTime: fumigationData.startTime,
        endTime: fumigationData.endTime,
        technicians: fumigationData.technicians.map(t => ({ id: t.id })),
        supplies: fumigationData.supplies.map(supply => ({
          name: supply.name,
          quantity: parseFloat(supply.quantity),
          dosage: supply.dosage,
          kindOfSupply: supply.kindOfSupply,
          numberOfStrips: supply.numberOfStrips
        })),
        dimensions: {
          height: parseFloat(fumigationData.dimensions.height),
          width: parseFloat(fumigationData.dimensions.width),
          length: parseFloat(fumigationData.dimensions.length)
        },
        environmentalConditions: {
          temperature: parseFloat(fumigationData.environmentalConditions.temperature),
          humidity: parseFloat(fumigationData.environmentalConditions.humidity)
        },
        industrialSafetyConditions: {
          electricDanger: fumigationData.hazards.electricDanger,
          fallingDanger: fumigationData.hazards.fallingDanger,
          hitDanger: fumigationData.hazards.hitDanger
        },
        observations: fumigationData.observations
      };

      await reportsService.createFumigationReport(reportData);
      setFumigationReportSubmitted(true);
      setShowConfirmDialog(false);
      toast.success("Reporte de fumigación enviado exitosamente");
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al enviar el reporte");
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "uncovering" && !fumigationReportSubmitted) {
      toast.error("Debe completar el registro de fumigación antes de acceder al registro de descarpe");
      return;
    }
    setActiveTab(value);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full max-h-[90vh]">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Cargando evidencias...
        </div>
        <div className="flex items-center justify-center px-8 py-6 flex-1">
          <div className="text-gray-500">Cargando información...</div>
        </div>
      </div>
    );
  }

  if (!fumigationDetails) {
    return (
      <div className="flex flex-col h-full max-h-[90vh]">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
          Error
        </div>
        <div className="flex items-center justify-center px-8 py-6 flex-1">
          <div className="text-red-500">No se pudieron cargar los detalles</div>
        </div>
      </div>
    );
  }

  const selectedTechnician = availableTechnicians.find(t => t.id.toString() === fumigationData.selectedTechnician);

  return (
    <>
      <div className="flex flex-col h-full max-h-[90vh] max-w-6xl w-full">
        <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold flex-shrink-0">
          Evidencias de Fumigación - Lote {fumigationDetails.lot.lotNumber}
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mx-8 mt-4 flex-shrink-0">
              <TabsTrigger value="fumigation">Registro de Fumigación</TabsTrigger>
              <TabsTrigger 
                value="uncovering" 
                disabled={!fumigationReportSubmitted}
                className={!fumigationReportSubmitted ? "opacity-50 cursor-not-allowed" : ""}
              >
                Registro de Descarpe
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fumigation" className="flex-1 overflow-auto px-8 py-4 space-y-4 m-0">
              <CollapsibleSection title="Información General" defaultOpen>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Número de Registro</label>
                    <Input 
                      value={fumigationData.registrationNumber}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Empresa</label>
                    <Input 
                      value={fumigationData.company}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ubicación *</label>
                    <Input 
                      value={fumigationData.location}
                      onChange={(e) => setFumigationData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                      placeholder="Ingrese la ubicación"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha</label>
                    <Input 
                      value={fumigationData.date}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hora de Inicio *</label>
                    <Input 
                      type="time"
                      value={fumigationData.startTime}
                      onChange={(e) => setFumigationData(prev => ({ ...prev, startTime: e.target.value }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hora de Finalización *</label>
                    <Input 
                      type="time"
                      value={fumigationData.endTime}
                      onChange={(e) => setFumigationData(prev => ({ ...prev, endTime: e.target.value }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                    />
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Personal que Interviene" defaultOpen>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Seleccionar Técnico *</label>
                    <Popover open={technicianComboOpen} onOpenChange={setTechnicianComboOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={technicianComboOpen}
                          className={cn(
                            "w-full justify-between",
                            !fumigationData.selectedTechnician && "text-muted-foreground"
                          )}
                          disabled={!isEditable || fumigationReportSubmitted}
                        >
                          {selectedTechnician
                            ? `${selectedTechnician.firstName} ${selectedTechnician.lastName}`
                            : "Seleccione un técnico"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar técnico..." />
                          <CommandList>
                            <CommandEmpty>No se encontraron técnicos.</CommandEmpty>
                            <CommandGroup>
                              {availableTechnicians.map((technician) => (
                                <CommandItem
                                  key={technician.id}
                                  value={`${technician.firstName} ${technician.lastName}`}
                                  onSelect={() => handleTechnicianSelect(technician.id.toString())}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      fumigationData.selectedTechnician === technician.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {technician.firstName} {technician.lastName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {fumigationData.technicians.map((technician, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                        <Input 
                          value={technician.name}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cargo</label>
                        <Input 
                          value={technician.role}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Dimensiones del Lugar" defaultOpen>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Altura (m) *</label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={fumigationData.dimensions.height}
                      onChange={(e) => setFumigationData(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, height: e.target.value }
                      }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ancho (m) *</label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={fumigationData.dimensions.width}
                      onChange={(e) => setFumigationData(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, width: e.target.value }
                      }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Largo (m) *</label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={fumigationData.dimensions.length}
                      onChange={(e) => setFumigationData(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, length: e.target.value }
                      }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Condiciones Ambientales" defaultOpen>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Temperatura (°C) *</label>
                    <Input 
                      type="number"
                      value={fumigationData.environmentalConditions.temperature}
                      onChange={(e) => setFumigationData(prev => ({ 
                        ...prev, 
                        environmentalConditions: { ...prev.environmentalConditions, temperature: e.target.value }
                      }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Humedad (%) *</label>
                    <Input 
                      type="number"
                      value={fumigationData.environmentalConditions.humidity}
                      onChange={(e) => setFumigationData(prev => ({ 
                        ...prev, 
                        environmentalConditions: { ...prev.environmentalConditions, humidity: e.target.value }
                      }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Condiciones de Seguridad Industrial" defaultOpen>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="electric"
                      checked={fumigationData.hazards.electricDanger}
                      onCheckedChange={(checked) => setFumigationData(prev => ({ 
                        ...prev, 
                        hazards: { ...prev.hazards, electricDanger: !!checked }
                      }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                    />
                    <label htmlFor="electric" className="text-sm font-medium">
                      Peligro eléctrico
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="falls"
                      checked={fumigationData.hazards.fallingDanger}
                      onCheckedChange={(checked) => setFumigationData(prev => ({ 
                        ...prev, 
                        hazards: { ...prev.hazards, fallingDanger: !!checked }
                      }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                    />
                    <label htmlFor="falls" className="text-sm font-medium">
                      Peligro de caídas
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hit"
                      checked={fumigationData.hazards.hitDanger}
                      onCheckedChange={(checked) => setFumigationData(prev => ({ 
                        ...prev, 
                        hazards: { ...prev.hazards, hitDanger: !!checked }
                      }))}
                      disabled={!isEditable || fumigationReportSubmitted}
                    />
                    <label htmlFor="hit" className="text-sm font-medium">
                      Peligro de golpes
                    </label>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Suministros Utilizados" defaultOpen>
                <div className="space-y-4">
                  {fumigationData.supplies.map((supply, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded">
                      <div>
                        <label className="block text-sm font-medium mb-2">Producto *</label>
                        <Input 
                          value={supply.name}
                          onChange={(e) => handleSupplyChange(index, 'name', e.target.value)}
                          disabled={!isEditable || fumigationReportSubmitted}
                          placeholder="Nombre del producto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cantidad *</label>
                        <Input 
                          type="number"
                          step="0.1"
                          value={supply.quantity}
                          onChange={(e) => handleSupplyChange(index, 'quantity', e.target.value)}
                          disabled={!isEditable || fumigationReportSubmitted}
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Dosis *</label>
                        <Input 
                          value={supply.dosage}
                          onChange={(e) => handleSupplyChange(index, 'dosage', e.target.value)}
                          disabled={!isEditable || fumigationReportSubmitted}
                          placeholder="ej: 5ml/m2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo *</label>
                        <Input 
                          value={supply.kindOfSupply}
                          onChange={(e) => handleSupplyChange(index, 'kindOfSupply', e.target.value)}
                          disabled={!isEditable || fumigationReportSubmitted}
                          placeholder="Gas, Líquido, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">N° Cintas *</label>
                        <div className="flex gap-2">
                          <Input 
                            value={supply.numberOfStrips}
                            onChange={(e) => handleSupplyChange(index, 'numberOfStrips', e.target.value)}
                            disabled={!isEditable || fumigationReportSubmitted}
                            placeholder="0"
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

              <CollapsibleSection title="Observaciones">
                <textarea 
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={fumigationData.observations}
                  onChange={(e) => setFumigationData(prev => ({ ...prev, observations: e.target.value }))}
                  disabled={!isEditable || fumigationReportSubmitted}
                  placeholder="Observaciones adicionales..."
                />
              </CollapsibleSection>

              <CollapsibleSection title="Firmas">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Firma del Técnico</label>
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                      Firma digital (pendiente de implementar)
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Firma del Cliente</label>
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                      Firma digital (pendiente de implementar)
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </TabsContent>

            <TabsContent value="uncovering" className="flex-1 overflow-auto px-8 py-4 m-0">
              <div className="text-center py-8">
                <p className="text-gray-500">Registro de Descarpe disponible después de completar el registro de fumigación</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-shrink-0">
          {isEditable && !fumigationReportSubmitted && (
            <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-300 bg-white rounded-b-lg">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={() => setShowConfirmDialog(true)}
                className="bg-[#003595] hover:bg-[#002060]"
              >
                Subir Evidencias
              </Button>
            </div>
          )}

          {!isEditable && (
            <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-300 bg-white rounded-b-lg">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar envío de evidencias</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea subir las evidencias de fumigación? Una vez enviadas, no podrá modificar la información.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitFumigationReport} className="bg-[#003595] hover:bg-[#002060]">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};