import { useState, useEffect } from 'react';
import { 
  usersService, 
  UpdateUserDTO, 
  UserProfileSetUpRequestDTO, 
  CompanyCreationDTO,
  UserMeResponse
} from '@/services/usersService';
import { companyService, UpdateCompanyDTO } from '@/services/companyService';

interface UserProfileData {
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  hasCompletedProfile: boolean;
  phone?: string;
  country?: string;
  city?: string;
  birthday?: string;
  company?: {
    id: number;
    name: string;
    businessName: string;
    phoneNumber: string;
    ruc: string;
    address: string;
    legalRepresentative?: {
      id: number;
      firstName: string;
      lastName: string;
    };
  } | null;
}

interface UseProfileReturn {
  profileData: UserProfileData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (userData: UpdateUserDTO, companyData?: CompanyCreationDTO | UpdateCompanyDTO) => Promise<void>;
  setupProfile: (profileData: UserProfileSetUpRequestDTO) => Promise<void>;
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

      // Cargar datos del usuario desde /users/me
      const user: UserMeResponse = await usersService.getCurrentUser();
      
      // Extraer la primera compañía si existe
      const company = user.companies && user.companies.length > 0 ? user.companies[0] : null;

      setProfileData({
        nationalId: user.nationalId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hasCompletedProfile: user.has_completed_profile,
        phone: user.personalPhone,
        country: user.country,
        city: user.city,
        birthday: user.birthday,
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
    companyData?: CompanyCreationDTO | UpdateCompanyDTO
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
          // Crear nueva compañía (usando el servicio de compañía con el formato correcto)
          const companyCreateData = {
            name: (companyData as CompanyCreationDTO).companyName,
            businessName: (companyData as CompanyCreationDTO).businessName,
            phoneNumber: (companyData as CompanyCreationDTO).phoneNumber,
            ruc: (companyData as CompanyCreationDTO).ruc,
            address: (companyData as CompanyCreationDTO).address,
          };
          await companyService.createCompany(companyCreateData);
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

  const setupProfile = async (profileSetupData: UserProfileSetUpRequestDTO) => {
    try {
      setLoading(true);
      setError(null);

      // Enviar datos completos de setup al backend
      await usersService.setupUserProfile(profileSetupData);

      // Recargar el perfil actualizado
      await loadProfile();
    } catch (err: any) {
      setError(err.message || 'Error al configurar el perfil');
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
    setupProfile,
    refreshProfile: loadProfile
  };
};
