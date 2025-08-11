import { useState, useEffect } from 'react';
import { usersService, UpdateUserDTO } from '@/services/usersService';
import { companyService, CreateCompanyDTO, CompanyResponse, UpdateCompanyDTO } from '@/services/companyService';
import { ApiUser } from '@/types/request';

// Extender ApiUser para incluir información de perfil completa
interface ExtendedApiUser extends ApiUser {
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  gender?: string;
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  gender: string;
  company?: CompanyResponse | null;
}

interface UseProfileReturn {
  profileData: UserProfileData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (userData: UpdateUserDTO, companyData?: CreateCompanyDTO | UpdateCompanyDTO) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos del usuario
      const user = await usersService.getCurrentUser() as ExtendedApiUser;
      
      // Cargar datos de la compañía (si existe)
      const company = await companyService.getUserCompany();

      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        country: user.country || '',
        city: user.city || '',
        gender: user.gender || '',
        company
      });
    } catch (err: any) {
      setError(err.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    userData: UpdateUserDTO, 
    companyData?: CreateCompanyDTO | UpdateCompanyDTO
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Actualizar datos del usuario
      await usersService.updateUserProfile(userData);

      // Manejar datos de la compañía
      if (companyData) {
        const currentCompany = profileData?.company;
        
        if (currentCompany) {
          // Actualizar compañía existente
          await companyService.updateUserCompany(companyData as UpdateCompanyDTO);
        } else {
          // Crear nueva compañía
          await companyService.createCompany(companyData as CreateCompanyDTO);
        }
      }

      // Recargar el perfil actualizado
      await loadProfile();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
      throw err; // Re-throw para que el componente pueda manejarlo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profileData,
    loading,
    error,
    updateProfile,
    refreshProfile: loadProfile
  };
};
