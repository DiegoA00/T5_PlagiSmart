import React, { useState, useEffect } from "react";
import { usersService, UpdateUserDTO } from "@/services/usersService";
import { companyService, CreateCompanyDTO } from "@/services/companyService";

interface FormData {
  name: string;
  lastName: string;
  id: string;
  gender: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  address: string;
  commercialName: string;
  companyName: string;
  companyRUC: string;
  companyAddress: string;
  companyPhone: string;
  executiveDirector: string;
}

interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  gender?: string;
  commercialName?: string;
  companyName?: string;
  companyRUC?: string;
  companyAddress?: string;
  companyPhone?: string;
  executiveDirector?: string;
}

interface CompleteProfileFormProps {
  initialData?: UserProfile | null;
}

const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastName: "",
    id: "",
    gender: "",
    country: "",
    city: "",
    phone: "",
    email: "",
    address: "",
    commercialName: "",
    companyName: "",
    companyRUC: "",
    companyAddress: "",
    companyPhone: "",
    executiveDirector: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        lastName: initialData.lastName || "",
        id: initialData.id || "",
        gender: initialData.gender || "",
        country: initialData.country || "",
        city: initialData.city || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        commercialName: initialData.commercialName || "",
        companyName: initialData.companyName || "",
        companyRUC: initialData.companyRUC || "",
        companyAddress: initialData.companyAddress || "",
        companyPhone: initialData.companyPhone || "",
        executiveDirector: initialData.executiveDirector || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar datos del usuario
      const userUpdateData: UpdateUserDTO = {
        firstName: formData.name,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        gender: formData.gender,
      };

      // Actualizar información del usuario
      await usersService.updateUserProfile(userUpdateData);

      // Si hay datos de la compañía, crearla
      const hasCompanyData = formData.commercialName || formData.companyName || 
                           formData.companyRUC || formData.companyAddress || 
                           formData.companyPhone;

      if (hasCompanyData) {
        const companyData: CreateCompanyDTO = {
          name: formData.commercialName || formData.companyName,
          businessName: formData.companyName,
          phoneNumber: formData.companyPhone,
          ruc: formData.companyRUC,
          address: formData.companyAddress,
        };

        // Crear la compañía (el backend automáticamente asociará con el usuario autenticado)
        await companyService.createCompany(companyData);
      }

      console.log("Perfil actualizado exitosamente");
      alert("Perfil actualizado exitosamente");
      
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      const errorMessage = error.message || "Error al actualizar el perfil";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Personal info</h2>
      <div className='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Name</span>
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
          <span className="block text-sm font-medium text-gray-700">Last Name</span>
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
          <span className="block text-sm font-medium text-gray-700">ID</span>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
  
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Gender</span>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">Choose an option</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            {/*<option value="other">Other</option>*/}
          </select>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Contact info</h2>

      <div className='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/3">
          <span className="block text-sm font-medium text-gray-700">Country</span>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
  
        <div className="w-1/3">
          <span className="block text-sm font-medium text-gray-700">City</span>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="w-1/3">
          <span className="block text-sm font-medium text-gray-700">Personal phone</span>
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
        <div className="w-1/3">
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
        <div className="w-2/3">
          <span className="block text-sm font-medium text-gray-700">Address</span>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Company data</h2>
      <div className='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Commercial name</span>
          <input
            type="text"
            name="commercialName"
            value={formData.commercialName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="w-1/2">
          <span className="block text-sm font-medium text-gray-700">Company name</span>
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
        <div className="w-1/3">
          <span className="block text-sm font-medium text-gray-700">R.U.C</span>
          <input
            type="text"
            name="companyRUC"
            value={formData.companyRUC}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="w-2/3">
          <span className="block text-sm font-medium text-gray-700">Company address</span>
          <input
            type="tel"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mx-auto w-full flex items-center justify-between gap-10">
        <div className="w-1/3">
          <span className="block text-sm font-medium text-gray-700">Company phone</span>
          <input
            type="tel"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="w-2/3">
          <span className="block text-sm font-medium text-gray-700">Executive director</span>
          <input
            type="text"
            name="executiveDirector"
            value={formData.executiveDirector}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

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
