import { useEffect, useState } from "react";
import { Layout } from "../../layouts/Layout";
import CompleteProfileForm from "../Register/Components/CompleteProfileForm";
import { useProfile } from "@/hooks/useProfile";

interface UserProfile {
  nationalId: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  birthday?: string;
  commercialName?: string;
  companyName?: string;
  companyRUC?: string;
  companyAddress?: string;
  companyPhone?: string;
}

function ClientProfile() {
  const { profileData, loading: profileLoading, error, refreshProfile } = useProfile();
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false);

  useEffect(() => {
    if (profileData) {
      // Verificación adicional: si el backend dice que no está completo pero tiene todos los datos
      const hasAllRequiredData = !!(
        profileData.firstName && 
        profileData.lastName && 
        profileData.email && 
        profileData.nationalId &&
        profileData.phone &&
        profileData.country &&
        profileData.city &&
        profileData.company?.name &&
        profileData.company?.ruc
      );
      
      // Usar el campo has_completed_profile del backend para determinar si el perfil está completo
      // Con fallback a verificación manual si tiene todos los datos
      const shouldShowCompleteProfile = profileData.hasCompletedProfile || hasAllRequiredData;
      setHasCompleteProfile(shouldShowCompleteProfile);
    }
  }, [profileData]);

  const convertToFormData = (data: any) => {
    if (!data) return null;
    
    return {
      nationalId: data.nationalId || '',
      name: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      country: data.country || '',
      city: data.city || '',
      birthday: data.birthday || '',
      companyName: data.company?.name || '',
      commercialName: data.company?.businessName || '',
      companyRUC: data.company?.ruc || '',
      companyAddress: data.company?.address || '',
      companyPhone: data.company?.phoneNumber || '',
    };
  };

  if (profileLoading) {
    return (
      <Layout>
        <div className="flex bg-white px-10 py-6 gap-10">
          <div className="w-full flex items-center justify-center">
            <div className="w-full p-10 bg-white rounded-lg shadow-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando información del perfil...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex bg-white px-10 py-6 gap-10">
          <div className="w-full flex items-center justify-center">
            <div className="w-full p-10 bg-white rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el perfil</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={refreshProfile}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex bg-white px-10 py-6 gap-10">
        <div className="w-full flex items-center justify-center">
          <div className="w-full p-10 bg-white rounded-lg shadow-lg">
            {hasCompleteProfile ? (
              <ProfileView profileData={convertToFormData(profileData)} />
            ) : (
              <div>
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Completa tu perfil
                  </h3>
                  <p className="text-yellow-700">
                    Para acceder a todas las funcionalidades de la plataforma, necesitas completar tu información personal y empresarial.
                  </p>
                </div>
                <CompleteProfileForm 
                  initialData={convertToFormData(profileData)}
                  onSuccess={() => refreshProfile()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface ProfileViewProps {
  readonly profileData: UserProfile | null;
}

function ProfileView({ profileData }: ProfileViewProps) {
  if (!profileData) return null;

  // Función helper para formatear fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No especificado';
    
    // Si la fecha viene en formato ISO (yyyy-MM-dd), la convertimos a formato más legible
    if (dateString.includes('-') && dateString.length === 10) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Información Personal</h3>
          <div className="space-y-3">
            <div>
              <span className="block text-sm font-medium text-gray-600">Nombre</span>
              <p className="text-gray-800">{profileData.name}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Apellido</span>
              <p className="text-gray-800">{profileData.lastName}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Cédula</span>
              <p className="text-gray-800">{profileData.nationalId || 'No especificado'}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Fecha de Nacimiento</span>
              <p className="text-gray-800">{formatDate(profileData.birthday)}</p>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Información de Contacto</h3>
          <div className="space-y-3">
            <div>
              <span className="block text-sm font-medium text-gray-600">País</span>
              <p className="text-gray-800">{profileData.country || 'No especificado'}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Ciudad</span>
              <p className="text-gray-800">{profileData.city || 'No especificado'}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Teléfono Personal</span>
              <p className="text-gray-800">{profileData.phone || 'No especificado'}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Email</span>
              <p className="text-gray-800">{profileData.email}</p>
            </div>
          </div>
        </div>

        {/* Información de la Empresa */}
        {(profileData.companyName || profileData.commercialName) && (
          <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Información de la Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-600">Nombre Comercial</span>
                <p className="text-gray-800">{profileData.commercialName || 'No especificado'}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">Razón Social</span>
                <p className="text-gray-800">{profileData.companyName || 'No especificado'}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">RUC</span>
                <p className="text-gray-800">{profileData.companyRUC || 'No especificado'}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">Teléfono de la Empresa</span>
                <p className="text-gray-800">{profileData.companyPhone || 'No especificado'}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">Dirección de la Empresa</span>
                <p className="text-gray-800">{profileData.companyAddress || 'No especificado'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientProfile;