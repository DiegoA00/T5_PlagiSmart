import { useEffect, useState } from "react";
import { Layout } from "../../layouts/Layout";
import CompleteProfileForm from "../Register/Components/CompleteProfileForm";
import { useAuth } from "@/context/AuthContext";

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

function ClientProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // Aquí harías la llamada a la API para obtener el perfil completo del usuario
        // Por ahora, simularemos con los datos básicos del contexto de autenticación
        if (user) {
          const basicProfile: UserProfile = {
            id: user.id || '',
            name: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            // Estos campos adicionales vendrían de la API
            phone: user.phone || '',
            address: user.address || '',
            country: user.country || '',
            city: user.city || '',
            gender: user.gender || '',
            commercialName: user.commercialName || '',
            companyName: user.companyName || '',
            companyRUC: user.companyRUC || '',
            companyAddress: user.companyAddress || '',
            companyPhone: user.companyPhone || '',
            executiveDirector: user.executiveDirector || '',
          };

          setProfileData(basicProfile);
          
          // Verificar si el perfil está completo
          // Un perfil se considera completo si tiene al menos: nombre, apellido, email, teléfono, dirección
          const isComplete = !!(
            basicProfile.name && 
            basicProfile.lastName && 
            basicProfile.email && 
            basicProfile.phone && 
            basicProfile.address &&
            basicProfile.country &&
            basicProfile.city
          );
          
          setHasCompleteProfile(isComplete);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (isLoading) {
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

  return (
    <Layout>
      <div className="flex bg-white px-10 py-6 gap-10">
        <div className="w-full flex items-center justify-center">
          <div className="w-full p-10 bg-white rounded-lg shadow-lg">
            {hasCompleteProfile ? (
              <ProfileView profileData={profileData} />
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
                <CompleteProfileForm initialData={profileData} />
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
              <span className="block text-sm font-medium text-gray-600">Email</span>
              <p className="text-gray-800">{profileData.email}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Teléfono</span>
              <p className="text-gray-800">{profileData.phone || 'No especificado'}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Género</span>
              <p className="text-gray-800">{profileData.gender || 'No especificado'}</p>
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
              <span className="block text-sm font-medium text-gray-600">Dirección</span>
              <p className="text-gray-800">{profileData.address || 'No especificado'}</p>
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
              <div>
                <span className="block text-sm font-medium text-gray-600">Director Ejecutivo</span>
                <p className="text-gray-800">{profileData.executiveDirector || 'No especificado'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientProfile;