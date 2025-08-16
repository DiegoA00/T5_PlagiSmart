import React, { useState, useEffect } from "react";
import { usersService, UserProfileSetUpRequestDTO } from "@/services/usersService";

interface FormData {
  name: string;
  lastName: string;
  nationalId: string;
  birthday: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  commercialName: string;
  companyName: string;
  companyRUC: string;
  companyAddress: string;
  companyPhone: string;
}

interface UserProfile {
  nationalId: string;
  name: string;
  lastName: string;
  email: string;
  birthday?: string;
  phone?: string;
  country?: string;
  city?: string;
  commercialName?: string;
  companyName?: string;
  companyRUC?: string;
  companyAddress?: string;
  companyPhone?: string;
}

interface CompleteProfileFormProps {
  initialData?: UserProfile | null;
  onSuccess?: () => void;
}

const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastName: "",
    nationalId: "",
    birthday: "",
    country: "",
    city: "",
    phone: "",
    email: "",
    commercialName: "",
    companyName: "",
    companyRUC: "",
    companyAddress: "",
    companyPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        lastName: initialData.lastName || "",
        nationalId: initialData.nationalId || "",
        birthday: initialData.birthday || "",
        country: initialData.country || "",
        city: initialData.city || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        commercialName: initialData.commercialName || "",
        companyName: initialData.companyName || "",
        companyRUC: initialData.companyRUC || "",
        companyAddress: initialData.companyAddress || "",
        companyPhone: initialData.companyPhone || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Limpiar mensajes de error cuando el usuario empiece a escribir
    if (error) {
      setError(null);
    }
    if (success) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpiar errores previos
    setSuccess(false); // Limpiar éxito previo

    try {
      // Función para convertir fecha de yyyy-MM-dd a dd-MM-yyyy
      const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return '';
        
        // Verificar si ya está en formato yyyy-MM-dd
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = dateRegex.exec(dateString);
        
        if (match) {
          const [, year, month, day] = match;
          return `${day}-${month}-${year}`;
        }
        
        return dateString; // Devolver tal como está si no coincide con el formato esperado
      };

      // Validar si hay datos de la compañía
      const hasCompanyData = formData.companyName || formData.companyRUC || 
                           formData.companyAddress || formData.companyPhone;

      if (!hasCompanyData) {
        setError("Por favor complete los datos de la compañía");
        return;
      }

      // Preparar datos en el formato esperado por el backend
      const profileSetupData: UserProfileSetUpRequestDTO = {
        nationalId: formData.nationalId, // Campo nationalId del formulario
        birthday: formatDateForBackend(formData.birthday), // Convertir a formato dd-MM-yyyy
        company: {
          companyName: formData.companyName,
          businessName: formData.commercialName || formData.companyName,
          phoneNumber: formData.companyPhone,
          ruc: formData.companyRUC,
          address: formData.companyAddress,
        },
        country: formData.country,
        city: formData.city,
        personalPhone: formData.phone,
      };

      // Enviar datos al endpoint de profile setup
      await usersService.setupUserProfile(profileSetupData);

      console.log("Perfil configurado exitosamente");
      setSuccess(true);
      setError(null);
      
      // Llamar callback de éxito si está disponible
      if (onSuccess) {
        onSuccess();
      }
      
      // NO limpiar el formulario para permitir ediciones adicionales
      // Solo mostrar mensaje de éxito
      
    } catch (error: any) {
      console.error("Error al configurar perfil:", error);
      const errorMessage = error.message || "Error al configurar el perfil";
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
      <div className='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Nombre</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Apellido</span>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      </div>

      <div className='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Cédula</span>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            pattern="[0-9]{10}"
            title="National ID must be 10 digits"
            required
          />
        </div>
  
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</span>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>

      <div className='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">País</span>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
  
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Ciudad</span>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Teléfono Personal</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      </div>

      <div className='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Información de la Empresa</h2>
      <div className='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/3">
          <span className="block text-sm font-medium text-gray-700">RUC</span>
          <input
            type="text"
            name="companyRUC"
            value={formData.companyRUC}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="w-2/3">
          <span className="block text-sm font-medium text-gray-700">Razón Social</span>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mx-auto w-full flex items-center justify-between gap-10">
        <div className="w-2/3">
          <span className="block text-sm font-medium text-gray-700">Nombre Comercial</span>
          <input
            type="text"
            name="commercialName"
            value={formData.commercialName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="w-1/3">
          <span className="block text-sm font-medium text-gray-700">Teléfono de la Empresa</span>
          <input
            type="tel"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mx-auto w-full flex items-center justify-between gap-10">
        <div className="w-2/3">
          <span className="block text-sm font-medium text-gray-700">Dirección de la Empresa</span>
          <input
            type="tel"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al guardar</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">¡Perfil guardado exitosamente!</h3>
              <p className="mt-1 text-sm text-green-700">Tu información ha sido actualizada correctamente.</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded-md transition ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {loading ? 'Guardando...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
};

export default CompleteProfileForm;
