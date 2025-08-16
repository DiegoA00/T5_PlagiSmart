import { FC, useState, useEffect } from "react";
import { SignatureResponse } from "@/types/request";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import apiClient from "@/services/api/apiService";

interface AdminSignaturesViewProps {
  signatures: SignatureResponse[];
  isLoading?: boolean;
}

export const AdminSignaturesView: FC<AdminSignaturesViewProps> = ({
  signatures,
  isLoading = false
}) => {
  const [signatureUrls, setSignatureUrls] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const technicianSignature = signatures.find(sig => sig.signatureType === 'technician');
  const clientSignature = signatures.find(sig => sig.signatureType === 'client');

  const loadSignatureImage = async (signature: SignatureResponse) => {
    const signatureId = signature.id.toString();
    
    if (signatureUrls[signatureId] || loadingImages[signatureId]) {
      return;
    }

    setLoadingImages(prev => ({ ...prev, [signatureId]: true }));
    setImageErrors(prev => ({ ...prev, [signatureId]: false }));

    try {
      const response = await apiClient.get(signature.fileUrl, {
        responseType: 'blob'
      });

      const blobUrl = URL.createObjectURL(response.data);
      setSignatureUrls(prev => ({ ...prev, [signatureId]: blobUrl }));

    } catch (error) {
      setImageErrors(prev => ({ ...prev, [signatureId]: true }));
    } finally {
      setLoadingImages(prev => ({ ...prev, [signatureId]: false }));
    }
  };

  useEffect(() => {
    signatures.forEach(signature => {
      loadSignatureImage(signature);
    });

    return () => {
      Object.values(signatureUrls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [signatures]);

  const renderSignatureImage = (signature: SignatureResponse, altText: string) => {
    const signatureId = signature.id.toString();
    const imageUrl = signatureUrls[signatureId];
    const isLoading = loadingImages[signatureId];
    const hasError = imageErrors[signatureId];

    if (isLoading) {
      return (
        <div className="border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center justify-center h-24">
          <div className="text-gray-500 text-sm">Cargando firma...</div>
        </div>
      );
    }

    if (hasError || !imageUrl) {
      return (
        <div className="border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center justify-center h-24">
          <div className="text-red-500 text-sm text-center">
            Error al cargar la firma
            <br />
            <button 
              onClick={() => loadSignatureImage(signature)}
              className="text-xs text-blue-500 hover:text-blue-700 mt-1"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
        <img 
          src={imageUrl}
          alt={altText}
          className="max-w-full h-24 object-contain mx-auto"
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <CollapsibleSection title="Firmas" defaultOpen>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Cargando firmas...</div>
        </div>
      </CollapsibleSection>
    );
  }

  return (
    <CollapsibleSection title="Firmas" defaultOpen>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-700">
            Firma del Técnico
          </label>
          
          {technicianSignature ? (
            <div className="space-y-3">
              {renderSignatureImage(technicianSignature, "Firma del Técnico")}
              <div className="text-xs text-gray-500 text-center">
                ✓ Firmado por el técnico
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="text-gray-400">
                <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <div className="text-sm">Sin firma del técnico</div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-700">
            Firma del Cliente
          </label>
          
          {clientSignature ? (
            <div className="space-y-3">
              {renderSignatureImage(clientSignature, "Firma del Cliente")}
              <div className="text-xs text-gray-500 text-center">
                ✓ Firmado por el cliente
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="text-gray-400">
                <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <div className="text-sm">Sin firma del cliente</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {signatures.length > 0 && (
        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          <div className="flex justify-between">
            <span>
              {technicianSignature && clientSignature 
                ? "✓ Documento completamente firmado" 
                : "⚠ Documento parcialmente firmado"}
            </span>
            <span>
              Firmas: {signatures.length} de 2
            </span>
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
};