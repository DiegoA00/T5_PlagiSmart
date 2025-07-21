import { FC, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LotStatus, CompletedLot } from "@/types/lot";
import { ChevronDown, ChevronUp } from "lucide-react";

interface EvidenceOverlayProps {
  lot: LotStatus | CompletedLot;
  isEditable?: boolean; // true para técnicos, false para administradores
  onClose?: () => void;
  onSave?: (data: any) => void;
}

// Componente para secciones colapsables
interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
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
  lot,
  isEditable = false,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState("fumigation");
  
  // Estados para los formularios (mantenemos los mismos)
  const [fumigationData, setFumigationData] = useState({
    registrationNumber: lot.id || "",
    company: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "07:00",
    endTime: "09:00",
    supervisor: "",
    personnel: [{ name: "", role: "", signature: null }],
    dimensions: "",
    temperature: "",
    humidity: "",
    hazards: {
      electrical: false,
      falls: false,
      runOver: false
    },
    observations: "",
    supplies: [{ product: "", quantity: "", dosage: "", fumigationType: "", tapeCount: "" }],
    technicianSignature: null,
    clientSignature: null
  });
  
  const [uncoveringData, setUncoveringData] = useState({
    registrationNumber: lot.id || "",
    company: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "07:00",
    endTime: "09:00",
    supervisor: "",
    personnel: [{ name: "", role: "", signature: null }],
    tapeStatus: true,
    fumigationTime: "72",
    ppmPhosphine: "1000",
    hazards: {
      electrical: false,
      falls: false,
      runOver: false
    },
    technicianSignature: null,
    clientSignature: null
  });
  
  const handleSave = () => {
    if (onSave) {
      onSave({
        fumigation: fumigationData,
        uncovering: uncoveringData
      });
    }
    
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Encabezado fijo */}
      <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 flex-shrink-0">
        <h2 className="text-xl font-semibold">
          Evidencias - Lote #{lot.id}
        </h2>
      </div>
      
      {/* Tabs y contenido con scroll */}
      <Tabs
        defaultValue="fumigation"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="border-b border-gray-200 flex-shrink-0 bg-white">
          <TabsList className="bg-transparent p-0 w-full justify-start">
            <TabsTrigger 
              value="fumigation" 
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#003595] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
            >
              Registro de Fumigación
            </TabsTrigger>
            <TabsTrigger 
              value="uncovering"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#003595] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
            >
              Registro de Descarpe
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <TabsContent value="fumigation" className="m-0 h-full">
            {isEditable ? (
              <FumigationForm data={fumigationData} setData={setFumigationData} lot={lot} />
            ) : (
              <FumigationView data={fumigationData} lot={lot} />
            )}
          </TabsContent>
          
          <TabsContent value="uncovering" className="m-0 h-full">
            {isEditable ? (
              <UncoveringForm data={uncoveringData} setData={setUncoveringData} lot={lot} />
            ) : (
              <UncoveringView data={uncoveringData} lot={lot} />
            )}
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Pie fijo con botones */}
      <div className="flex justify-end gap-4 px-8 py-6 border-t border-[#003595] bg-white rounded-b-lg flex-shrink-0">
        {isEditable && (
          <Button 
            type="button" 
            onClick={handleSave}
            className="bg-[#003595] text-white hover:bg-[#002060]"
          >
            Guardar Evidencias
          </Button>
        )}
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
};

// Componentes para el formulario de fumigación
interface FumigationFormProps {
  data: any;
  setData: (data: any) => void;
  lot: LotStatus | CompletedLot;
}

const FumigationForm: FC<FumigationFormProps> = ({ data, setData, lot }) => {
  const handleChange = (field: string, value: any) => {
    setData({
      ...data,
      [field]: value
    });
  };
  
  const handlePersonnelChange = (index: number, field: string, value: any) => {
    const updatedPersonnel = [...data.personnel];
    updatedPersonnel[index] = { ...updatedPersonnel[index], [field]: value };
    handleChange('personnel', updatedPersonnel);
  };
  
  const addPersonnel = () => {
    handleChange('personnel', [...data.personnel, { name: "", role: "", signature: null }]);
  };
  
  const handleSupplyChange = (index: number, field: string, value: any) => {
    const updatedSupplies = [...data.supplies];
    updatedSupplies[index] = { ...updatedSupplies[index], [field]: value };
    handleChange('supplies', updatedSupplies);
  };
  
  const addSupply = () => {
    handleChange('supplies', [...data.supplies, { product: "", quantity: "", dosage: "", fumigationType: "", tapeCount: "" }]);
  };

  // Cargar datos conocidos del lote
  const loadLotData = () => {
    handleChange('tons', lot.tons);
    handleChange('quality', lot.grade);
    handleChange('bags', lot.sacks);
    handleChange('destination', lot.destinationPort);
  };
  
  return (
    <div className="space-y-4">
      {/* Información básica - siempre visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nº Registro</label>
          <Input 
            value={data.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Empresa</label>
          <Input 
            value={data.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha</label>
          <Input 
            type="date"
            value={data.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>
      
      {/* Datos generales - colapsable pero abierta por defecto */}
      <CollapsibleSection title="Datos Generales" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ubicación</label>
            <Input 
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hora Inicio</label>
            <Input 
              type="time"
              value={data.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hora Fin</label>
            <Input 
              type="time"
              value={data.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Supervisor</label>
            <Input 
              value={data.supervisor}
              onChange={(e) => handleChange('supervisor', e.target.value)}
            />
          </div>
        </div>
      </CollapsibleSection>
      
      {/* Personal - colapsable */}
      <CollapsibleSection title="Personal que interviene">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Nombre Completo</th>
                <th className="px-4 py-2 text-left">Cargo</th>
                <th className="px-4 py-2 text-left">Firma</th>
              </tr>
            </thead>
            <tbody>
              {data.personnel.map((person: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <Input 
                      value={person.name}
                      onChange={(e) => handlePersonnelChange(index, 'name', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      value={person.role}
                      onChange={(e) => handlePersonnelChange(index, 'role', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePersonnelChange(index, 'signature', URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addPersonnel} 
          className="mt-2"
        >
          Agregar Personal
        </Button>
      </CollapsibleSection>
      
      {/* Información del Lote - colapsable pero abierta por defecto */}
      <CollapsibleSection title="Información del Lote" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ID de Lote</label>
            <Input value={lot.id} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Dimensiones</label>
            <Input 
              value={data.dimensions}
              onChange={(e) => handleChange('dimensions', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Toneladas</label>
            <Input 
              type="number"
              value={data.tons || lot.tons}
              onChange={(e) => handleChange('tons', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Calidad</label>
            <Input 
              value={data.quality || lot.grade}
              onChange={(e) => handleChange('quality', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium"># Sacos</label>
            <Input 
              type="number"
              value={data.bags || lot.sacks}
              onChange={(e) => handleChange('bags', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Destino</label>
            <Input 
              value={data.destination || lot.destinationPort}
              onChange={(e) => handleChange('destination', e.target.value)}
            />
          </div>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={loadLotData} 
          className="mt-4"
        >
          Cargar Datos del Lote
        </Button>
      </CollapsibleSection>
      
      {/* Condiciones - colapsable */}
      <CollapsibleSection title="Condiciones Ambientales y de Seguridad">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Condiciones Ambientales</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Temperatura (°C)</label>
                <Input 
                  type="number"
                  value={data.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Humedad (%)</label>
                <Input 
                  type="number"
                  value={data.humidity}
                  onChange={(e) => handleChange('humidity', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Condiciones de Seguridad</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="electrical"
                  checked={data.hazards.electrical}
                  onCheckedChange={(checked) => {
                    handleChange('hazards', {
                      ...data.hazards,
                      electrical: !!checked
                    });
                  }}
                />
                <label htmlFor="electrical" className="text-sm">
                  Peligro Eléctrico
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="falls"
                  checked={data.hazards.falls}
                  onCheckedChange={(checked) => {
                    handleChange('hazards', {
                      ...data.hazards,
                      falls: !!checked
                    });
                  }}
                />
                <label htmlFor="falls" className="text-sm">
                  Peligro de Caídas
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="runOver"
                  checked={data.hazards.runOver}
                  onCheckedChange={(checked) => {
                    handleChange('hazards', {
                      ...data.hazards,
                      runOver: !!checked
                    });
                  }}
                />
                <label htmlFor="runOver" className="text-sm">
                  Peligro de Atropellos
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Observaciones</h4>
          <textarea
            className="min-w-full p-2 border rounded-md"
            rows={2}
            value={data.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
          />
        </div>
      </CollapsibleSection>
      
      {/* Insumos - colapsable */}
      <CollapsibleSection title="Insumos Utilizados">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-left">Cantidad</th>
                <th className="px-4 py-2 text-left">Dosis</th>
                <th className="px-4 py-2 text-left">Tipo de Fumigación</th>
                <th className="px-4 py-2 text-left"># Cintas</th>
              </tr>
            </thead>
            <tbody>
              {data.supplies.map((supply: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <Input 
                      value={supply.product}
                      onChange={(e) => handleSupplyChange(index, 'product', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      value={supply.quantity}
                      onChange={(e) => handleSupplyChange(index, 'quantity', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      value={supply.dosage}
                      onChange={(e) => handleSupplyChange(index, 'dosage', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      value={supply.fumigationType}
                      onChange={(e) => handleSupplyChange(index, 'fumigationType', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      value={supply.tapeCount}
                      onChange={(e) => handleSupplyChange(index, 'tapeCount', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addSupply} 
          className="mt-2"
        >
          Agregar Insumo
        </Button>
      </CollapsibleSection>
      
      {/* Firmas - colapsable pero abierta por defecto */}
      <CollapsibleSection title="Firmas" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Firma del Técnico</label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleChange('technicianSignature', URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            {data.technicianSignature && (
              <div className="mt-2 p-2 border rounded-md">
                <img 
                  src={data.technicianSignature} 
                  alt="Firma técnico" 
                  className="h-20 object-contain"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Firma del Cliente</label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleChange('clientSignature', URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            {data.clientSignature && (
              <div className="mt-2 p-2 border rounded-md">
                <img 
                  src={data.clientSignature} 
                  alt="Firma cliente" 
                  className="h-20 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

// Componente para mostrar la información de fumigación (modo administrador)
// Usa la misma estructura de secciones colapsables
const FumigationView: FC<{ data: any; lot: LotStatus | CompletedLot }> = ({ data, lot }) => {
  return (
    <div className="space-y-4">
      {/* Información básica - siempre visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Nº Registro</p>
          <p className="font-medium">{data.registrationNumber || lot.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Empresa</p>
          <p>{data.company || "-"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Fecha</p>
          <p>{data.date ? new Date(data.date).toLocaleDateString() : "-"}</p>
        </div>
      </div>
      
      {/* Datos generales */}
      <CollapsibleSection title="Datos Generales" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Ubicación</p>
            <p>{data.location || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hora Inicio/Fin</p>
            <p>{data.startTime || "-"} - {data.endTime || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Supervisor</p>
            <p>{data.supervisor || "-"}</p>
          </div>
        </div>
      </CollapsibleSection>
      
      {/* Resto de las secciones usando CollapsibleSection */}
      <CollapsibleSection title="Personal que interviene">
        {data.personnel && data.personnel.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Nombre Completo</th>
                  <th className="px-4 py-2 text-left">Cargo</th>
                  <th className="px-4 py-2 text-left">Firma</th>
                </tr>
              </thead>
              <tbody>
                {data.personnel.map((person: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{person.name || "-"}</td>
                    <td className="px-4 py-2">{person.role || "-"}</td>
                    <td className="px-4 py-2">
                      {person.signature ? (
                        <img 
                          src={person.signature} 
                          alt="Firma" 
                          className="h-10 object-contain"
                        />
                      ) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No hay personal registrado</p>
        )}
      </CollapsibleSection>
      
      <CollapsibleSection title="Información del Lote" defaultOpen={true}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">ID de Lote</p>
            <p>{lot.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Dimensiones</p>
            <p>{data.dimensions || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Toneladas</p>
            <p>{data.tons || lot.tons}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Calidad</p>
            <p>{data.quality || lot.grade}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500"># Sacos</p>
            <p>{data.bags || lot.sacks}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Destino</p>
            <p>{data.destination || lot.destinationPort}</p>
          </div>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Condiciones Ambientales y de Seguridad">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Condiciones Ambientales</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Temperatura</p>
                <p>{data.temperature ? `${data.temperature}°C` : "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Humedad</p>
                <p>{data.humidity ? `${data.humidity}%` : "-"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Condiciones de Seguridad</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className={`w-4 h-4 mr-2 border ${data.hazards?.electrical ? 'bg-blue-500' : 'bg-white'}`}></div>
                <span>Peligro Eléctrico</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 mr-2 border ${data.hazards?.falls ? 'bg-blue-500' : 'bg-white'}`}></div>
                <span>Peligro de Caídas</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 mr-2 border ${data.hazards?.runOver ? 'bg-blue-500' : 'bg-white'}`}></div>
                <span>Peligro de Atropellos</span>
              </div>
            </div>
          </div>
        </div>
        
        {data.observations && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Observaciones</h4>
            <p className="p-3 bg-gray-50 rounded-md">{data.observations}</p>
          </div>
        )}
      </CollapsibleSection>
      
      <CollapsibleSection title="Insumos Utilizados">
        {data.supplies && data.supplies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-left">Cantidad</th>
                  <th className="px-4 py-2 text-left">Dosis</th>
                  <th className="px-4 py-2 text-left">Tipo de Fumigación</th>
                  <th className="px-4 py-2 text-left"># Cintas</th>
                </tr>
              </thead>
              <tbody>
                {data.supplies.map((supply: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{supply.product || "-"}</td>
                    <td className="px-4 py-2">{supply.quantity || "-"}</td>
                    <td className="px-4 py-2">{supply.dosage || "-"}</td>
                    <td className="px-4 py-2">{supply.fumigationType || "-"}</td>
                    <td className="px-4 py-2">{supply.tapeCount || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No hay insumos registrados</p>
        )}
      </CollapsibleSection>
      
      <CollapsibleSection title="Firmas" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Firma del Técnico</h4>
            {data.technicianSignature ? (
              <div className="p-2 border rounded-md">
                <img 
                  src={data.technicianSignature} 
                  alt="Firma técnico" 
                  className="h-20 object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-500">No disponible</p>
            )}
          </div>
          <div>
            <h4 className="font-medium mb-2">Firma del Cliente</h4>
            {data.clientSignature ? (
              <div className="p-2 border rounded-md">
                <img 
                  src={data.clientSignature} 
                  alt="Firma cliente" 
                  className="h-20 object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-500">No disponible</p>
            )}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

// Props para el formulario de descarpe
interface UncoveringFormProps {
  data: any;
  setData: (data: any) => void;
  lot: LotStatus | CompletedLot;
}

// El componente UncoveringForm utilizaría el mismo patrón de CollapsibleSection
const UncoveringForm: FC<UncoveringFormProps> = ({ data, setData, lot }) => {
  // ... lógica actual
  const handleChange = (field: string, value: any) => {
    setData({
      ...data,
      [field]: value
    });
  };
  
  const handlePersonnelChange = (index: number, field: string, value: any) => {
    const updatedPersonnel = [...data.personnel];
    updatedPersonnel[index] = { ...updatedPersonnel[index], [field]: value };
    handleChange('personnel', updatedPersonnel);
  };
  
  const addPersonnel = () => {
    handleChange('personnel', [...data.personnel, { name: "", role: "", signature: null }]);
  };
  
  // Estructura similar a FumigationForm pero con secciones colapsables
  return (
    <div className="space-y-4">
      {/* Información básica - siempre visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nº Registro</label>
          <Input 
            value={data.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Empresa</label>
          <Input 
            value={data.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha</label>
          <Input 
            type="date"
            value={data.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>
      
      {/* Resto de secciones colapsables similares a FumigationForm */}
      <CollapsibleSection title="Datos Generales" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ubicación</label>
            <Input 
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hora Inicio</label>
            <Input 
              type="time"
              value={data.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hora Fin</label>
            <Input 
              type="time"
              value={data.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Supervisor</label>
            <Input 
              value={data.supervisor}
              onChange={(e) => handleChange('supervisor', e.target.value)}
            />
          </div>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Personal que interviene">
        {/* Contenido del personal, similar al FumigationForm */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Nombre Completo</th>
                <th className="px-4 py-2 text-left">Cargo</th>
                <th className="px-4 py-2 text-left">Firma</th>
              </tr>
            </thead>
            <tbody>
              {data.personnel.map((person: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <Input 
                      value={person.name}
                      onChange={(e) => handlePersonnelChange(index, 'name', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      value={person.role}
                      onChange={(e) => handlePersonnelChange(index, 'role', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePersonnelChange(index, 'signature', URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addPersonnel} 
          className="mt-2"
        >
          Agregar Personal
        </Button>
      </CollapsibleSection>
      
      <CollapsibleSection title="Información del Lote" defaultOpen={true}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ID de Lote</label>
            <Input value={lot.id} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Toneladas</label>
            <Input 
              type="number"
              value={data.tons || lot.tons}
              onChange={(e) => handleChange('tons', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Calidad</label>
            <Input 
              value={data.quality || lot.grade}
              onChange={(e) => handleChange('quality', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium"># Sacos</label>
            <Input 
              type="number"
              value={data.bags || lot.sacks}
              onChange={(e) => handleChange('bags', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Destino</label>
            <Input 
              value={data.destination || lot.destinationPort}
              onChange={(e) => handleChange('destination', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado Cintas</label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={data.tapeStatus ? "ok" : "notOk"}
              onChange={(e) => handleChange('tapeStatus', e.target.value === "ok")}
            >
              <option value="ok">OK</option>
              <option value="notOk">No OK</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tiempo Fumigación (horas)</label>
            <Input 
              type="number"
              value={data.fumigationTime}
              onChange={(e) => handleChange('fumigationTime', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">PPM Fosfina</label>
            <Input 
              type="number"
              value={data.ppmPhosphine}
              onChange={(e) => handleChange('ppmPhosphine', e.target.value)}
            />
          </div>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Condiciones de Seguridad">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="electrical-uncovering"
              checked={data.hazards.electrical}
              onCheckedChange={(checked) => {
                handleChange('hazards', {
                  ...data.hazards,
                  electrical: !!checked
                });
              }}
            />
            <label htmlFor="electrical-uncovering" className="text-sm">
              Peligro Eléctrico
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="falls-uncovering"
              checked={data.hazards.falls}
              onCheckedChange={(checked) => {
                handleChange('hazards', {
                  ...data.hazards,
                  falls: !!checked
                });
              }}
            />
            <label htmlFor="falls-uncovering" className="text-sm">
              Peligro de Caídas
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="runOver-uncovering"
              checked={data.hazards.runOver}
              onCheckedChange={(checked) => {
                handleChange('hazards', {
                  ...data.hazards,
                  runOver: !!checked
                });
              }}
            />
            <label htmlFor="runOver-uncovering" className="text-sm">
              Peligro de Atropellos
            </label>
          </div>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Firmas" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Firma del Técnico</label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleChange('technicianSignature', URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            {data.technicianSignature && (
              <div className="mt-2 p-2 border rounded-md">
                <img 
                  src={data.technicianSignature} 
                  alt="Firma técnico" 
                  className="h-20 object-contain"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Firma del Cliente</label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleChange('clientSignature', URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            {data.clientSignature && (
              <div className="mt-2 p-2 border rounded-md">
                <img 
                  src={data.clientSignature} 
                  alt="Firma cliente" 
                  className="h-20 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

// Componente UncoveringView similar a FumigationView con secciones colapsables
const UncoveringView: FC<{ data: any; lot: LotStatus | CompletedLot }> = ({ data, lot }) => {
  return (
    <div className="space-y-4">
      {/* Información básica - siempre visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Nº Registro</p>
          <p className="font-medium">{data.registrationNumber || lot.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Empresa</p>
          <p>{data.company || "-"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Fecha</p>
          <p>{data.date ? new Date(data.date).toLocaleDateString() : "-"}</p>
        </div>
      </div>
      
      {/* Resto de secciones colapsables */}
      {/* Implementación similar a FumigationView */}
      <CollapsibleSection title="Datos Generales" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Ubicación</p>
            <p>{data.location || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hora Inicio/Fin</p>
            <p>{data.startTime || "-"} - {data.endTime || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Supervisor</p>
            <p>{data.supervisor || "-"}</p>
          </div>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Personal que interviene">
        {data.personnel && data.personnel.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Nombre Completo</th>
                  <th className="px-4 py-2 text-left">Cargo</th>
                  <th className="px-4 py-2 text-left">Firma</th>
                </tr>
              </thead>
              <tbody>
                {data.personnel.map((person: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{person.name || "-"}</td>
                    <td className="px-4 py-2">{person.role || "-"}</td>
                    <td className="px-4 py-2">
                      {person.signature ? (
                        <img 
                          src={person.signature} 
                          alt="Firma" 
                          className="h-10 object-contain"
                        />
                      ) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No hay personal registrado</p>
        )}
      </CollapsibleSection>
      
      <CollapsibleSection title="Información del Lote" defaultOpen={true}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">ID de Lote</p>
            <p>{lot.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Toneladas</p>
            <p>{data.tons || lot.tons}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Calidad</p>
            <p>{data.quality || lot.grade}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500"># Sacos</p>
            <p>{data.bags || lot.sacks}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Destino</p>
            <p>{data.destination || lot.destinationPort}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estado Cintas</p>
            <p>{data.tapeStatus ? "OK" : "No OK"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tiempo Fumigación</p>
            <p>{data.fumigationTime ? `${data.fumigationTime} horas` : "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">PPM Fosfina</p>
            <p>{data.ppmPhosphine || "-"}</p>
          </div>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Condiciones de Seguridad">
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`w-4 h-4 mr-2 border ${data.hazards?.electrical ? 'bg-blue-500' : 'bg-white'}`}></div>
            <span>Peligro Eléctrico</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 mr-2 border ${data.hazards?.falls ? 'bg-blue-500' : 'bg-white'}`}></div>
            <span>Peligro de Caídas</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 mr-2 border ${data.hazards?.runOver ? 'bg-blue-500' : 'bg-white'}`}></div>
            <span>Peligro de Atropellos</span>
          </div>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Firmas" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Firma del Técnico</h4>
            {data.technicianSignature ? (
              <div className="p-2 border rounded-md">
                <img 
                  src={data.technicianSignature} 
                  alt="Firma técnico" 
                  className="h-20 object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-500">No disponible</p>
            )}
          </div>
          <div>
            <h4 className="font-medium mb-2">Firma del Cliente</h4>
            {data.clientSignature ? (
              <div className="p-2 border rounded-md">
                <img 
                  src={data.clientSignature} 
                  alt="Firma cliente" 
                  className="h-20 object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-500">No disponible</p>
            )}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};