import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { fumigationService, FumigationApplicationRequest, FumigationRequestData } from '@/services/fumigationService';

interface FumigationEntry {
  fumigationDate: string;
  fumigationTime: string;
  destinationPort: string;
  tons: string;
  quality: string;
  bags: string;
  lot: string;
}

interface FormData {
  companyName: string;
  commercialName: string;
  ruc: string;
  address: string;
  phone: string;
  legalRepresentative: string;
  fumigationEntries: FumigationEntry[];
}

interface NewReservationFormProps {
  readonly onClose: () => void;
}

function NewReservationForm({ onClose }: NewReservationFormProps) {
  const { profileData } = useProfile();
  
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    commercialName: '',
    ruc: '',
    address: '',
    phone: '',
    legalRepresentative: '',
    fumigationEntries: [{
      fumigationDate: '',
      fumigationTime: '',
      destinationPort: '',
      tons: '',
      quality: '',
      bags: '',
      lot: '',
    }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auto-rellenar los campos de la compañía cuando se carguen los datos del perfil
  useEffect(() => {
    if (profileData?.company) {
      const company = profileData.company;
      setFormData(prevState => ({
        ...prevState,
        companyName: company.name || '',
        commercialName: company.businessName || '',
        ruc: company.ruc || '',
        address: company.address || '',
        phone: company.phoneNumber || '',
        legalRepresentative: company.legalRepresentative 
          ? `${company.legalRepresentative.firstName} ${company.legalRepresentative.lastName}` 
          : '',
      }));
    }
  }, [profileData]);

  // Función para limpiar los campos de la compañía
  const clearCompanyFields = () => {
    setFormData(prevState => ({
      ...prevState,
      companyName: '',
      commercialName: '',
      ruc: '',
      address: '',
      phone: '',
      legalRepresentative: '',
    }));
  };

  // Función para determinar si un campo fue auto-rellenado
  const isAutoFilled = (fieldName: keyof FormData) => {
    return profileData?.company && formData[fieldName] !== '';
  };
  const reloadCompanyData = () => {
    if (profileData?.company) {
      const company = profileData.company;
      setFormData(prevState => ({
        ...prevState,
        commercialName: company.name || '',
        commpanyName: company.businessName || '',
        ruc: company.ruc || '',
        address: company.address || '',
        phone: company.phoneNumber || '',
        legalRepresentative: company.legalRepresentative 
          ? `${company.legalRepresentative.firstName} ${company.legalRepresentative.lastName}` 
          : '',
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFumigationEntryChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEntries = formData.fumigationEntries.map((entry, i) =>
      i === index ? { ...entry, [name]: value } : entry
    );
    setFormData(prevState => ({
      ...prevState,
      fumigationEntries: updatedEntries
    }));
  };

  const handleAddFumigationEntry = () => {
    setFormData(prevState => ({
      ...prevState,
      fumigationEntries: [...prevState.fumigationEntries, {
        fumigationDate: '',
        fumigationTime: '',
        destinationPort: '',
        tons: '',
        quality: '',
        bags: '',
        lot: '',
      }]
    }));
  };

  const handleRemoveFumigationEntry = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      fumigationEntries: prevState.fumigationEntries.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validar que hay una compañía asociada al usuario
    if (!profileData?.company?.id) {
      setSubmitError('No se encontró información de la empresa. Por favor complete su perfil primero.');
      return;
    }

    // Validar que hay al menos una entrada de fumigación
    if (formData.fumigationEntries.length === 0) {
      setSubmitError('Debe agregar al menos una entrada de fumigación.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Función helper para convertir fecha y hora al formato que espera el backend
      const formatDateTimeForBackend = (date: string, time: string): string => {
        // Convertir de "yyyy-MM-dd" y "HH:mm" a "dd-MM-yyyy HH:mm"
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year} ${time}`;
      };

      // Transformar los datos del formulario al formato que espera el backend
      const fumigations: FumigationRequestData[] = formData.fumigationEntries.map(entry => {
        // Convertir fecha y hora al formato esperado por el backend
        const dateTime = formatDateTimeForBackend(entry.fumigationDate, entry.fumigationTime);
        
        return {
          lotNumber: entry.lot,
          ton: parseFloat(entry.tons) || 0.01, // Backend requiere al menos 0.01
          portDestination: entry.destinationPort.toUpperCase(),
          sacks: parseInt(entry.bags) || 1, // Backend requiere al menos 1
          quality: entry.quality,
          dateTime: dateTime
        };
      });

      const applicationData: FumigationApplicationRequest = {
        company: {
          id: profileData.company.id
        },
        fumigations: fumigations
      };

      console.log('Sending fumigation application:', applicationData);

      await fumigationService.createFumigationApplication(applicationData);
      
      setSubmitSuccess(true);
      setSubmitError(null);
      
      // Mostrar mensaje de éxito por un momento antes de cerrar
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting fumigation application:', error);
      setSubmitError(error.message || 'Error al enviar la solicitud de fumigación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Solicitud de Servicio de Fumigación</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Datos Generales</h3>
            {profileData?.company && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Datos rellenados automáticamente</span>
                <button
                  type="button"
                  onClick={clearCompanyFields}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600"
                  title="Limpiar campos de la empresa"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={reloadCompanyData}
                  className="text-xs bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-green-700"
                  title="Recargar datos del perfil"
                >
                  Recargar
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Nombre de la Empresa:</label>
              <input 
                type="text" 
                name="companyName" 
                id="companyName" 
                value={formData.commercialName} 
                onChange={handleChange} 
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${isAutoFilled('commercialName') ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                required 
              />
            </div>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Razón Social:</label>
              <input 
                type="text" 
                name="businessName" 
                id="businessName" 
                value={formData.companyName} 
                onChange={handleChange} 
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${isAutoFilled('companyName') ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                required 
              />
            </div>
            <div>
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">RUC:</label>
              <input 
                type="text" 
                name="ruc" 
                id="ruc" 
                value={formData.ruc} 
                onChange={handleChange} 
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${isAutoFilled('ruc') ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                required 
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección:</label>
              <input 
                type="text" 
                name="address" 
                id="address" 
                value={formData.address} 
                onChange={handleChange} 
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${isAutoFilled('address') ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                required 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono:</label>
              <input 
                type="text" 
                name="phone" 
                id="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${isAutoFilled('phone') ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                required 
              />
            </div>
            <div>
              <label htmlFor="legalRepresentative" className="block text-sm font-medium text-gray-700">Nombre Representante Legal:</label>
              <input 
                type="text" 
                name="legalRepresentative" 
                id="legalRepresentative" 
                value={formData.legalRepresentative} 
                onChange={handleChange} 
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${isAutoFilled('legalRepresentative') ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                required 
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3">Datos de Fumigación</h3>
          {formData.fumigationEntries.map((entry, index) => (
            <div key={`fumigation-entry-${index}-${entry.fumigationDate || 'new'}`} className="relative border p-4 mb-4 rounded-md">
              <h4 className="text-lg font-medium mb-2">Entrada de Fumigación #{index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor={`fumigationDate-${index}`} className="block text-sm font-medium text-gray-700">Fecha de Fumigación:</label>
                  <input type="date" name="fumigationDate" id={`fumigationDate-${index}`} value={entry.fumigationDate} onChange={(e) => handleFumigationEntryChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label htmlFor={`fumigationTime-${index}`} className="block text-sm font-medium text-gray-700">Hora de Fumigación:</label>
                  <input type="time" name="fumigationTime" id={`fumigationTime-${index}`} value={entry.fumigationTime} onChange={(e) => handleFumigationEntryChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label htmlFor={`destinationPort-${index}`} className="block text-sm font-medium text-gray-700">Puerto de Destino:</label>
                  <input type="text" name="destinationPort" id={`destinationPort-${index}`} value={entry.destinationPort} onChange={(e) => handleFumigationEntryChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label htmlFor={`tons-${index}`} className="block text-sm font-medium text-gray-700"># Toneladas:</label>
                  <input type="number" name="tons" id={`tons-${index}`} value={entry.tons} onChange={(e) => handleFumigationEntryChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label htmlFor={`quality-${index}`} className="block text-sm font-medium text-gray-700">Calidad:</label>
                  <input type="text" name="quality" id={`quality-${index}`} value={entry.quality} onChange={(e) => handleFumigationEntryChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label htmlFor={`bags-${index}`} className="block text-sm font-medium text-gray-700"># Sacos:</label>
                  <input type="number" name="bags" id={`bags-${index}`} value={entry.bags} onChange={(e) => handleFumigationEntryChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label htmlFor={`lot-${index}`} className="block text-sm font-medium text-gray-700"># Lote:</label>
                  <input type="text" name="lot" id={`lot-${index}`} value={entry.lot} onChange={(e) => handleFumigationEntryChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
              </div>
              {formData.fumigationEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFumigationEntry(index)}
                  className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remover
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={handleAddFumigationEntry}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Agregar Entrada de Fumigación
            </button>
          </div>

          {/* Estado de envío y mensajes */}
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800">{submitError}</span>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800">¡Solicitud enviada exitosamente! El formulario se cerrará automáticamente...</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewReservationForm