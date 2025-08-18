import { FC } from 'react';
import { Copy, Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCertificate } from '@/hooks/useCertificate';

interface CertificateOverlayProps {
  fumigationId: number;
  onClose: () => void;
}

export const CertificateOverlay: FC<CertificateOverlayProps> = ({ fumigationId, onClose }) => {
  const {
    template,
    selectedLanguage,
    setSelectedLanguage,
    loading,
    error,
    copySuccess,
    copyToClipboard
  } = useCertificate(fumigationId);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-lg font-semibold">Cargando certificado...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
          <div className="text-red-600 text-sm mt-2">
            Por favor, intenta nuevamente o contacta al administrador del sistema.
          </div>
        </div>
      </div>
    );
  }

  if (!template || template.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">No hay datos de certificado disponibles</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#003595] text-white p-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Certificado de Fumigación</h2>
            <p className="text-blue-100 mt-1">
              Datos del certificado para copiar y pegar
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedLanguage(selectedLanguage === 'es' ? 'en' : 'es')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Globe className="w-4 h-4 mr-2" />
              {selectedLanguage === 'es' ? 'EN' : 'ES'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Todo
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {template.map((field, index) => (
            <div key={`${field.key}-${index}`} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
                    {field.label}:
                  </div>
                  <div className="text-base text-gray-900 leading-relaxed whitespace-pre-line">
                    {field.value || '-'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(`${field.label}: ${field.value}`);
                    } catch (err) {
                      console.error('Error copying field:', err);
                    }
                  }}
                  className="ml-4 mt-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
                  title="Copiar campo"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-gray-50 p-4 sticky bottom-0">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">
            {selectedLanguage === 'es' 
              ? 'Puedes copiar cada campo individualmente o todos los datos juntos'
              : 'You can copy each field individually or all data together'
            }
          </p>
          <p className="text-xs text-gray-500">
            Certificado generado por ANECACAO - Sistema de Gestión de Fumigación
          </p>
        </div>
      </div>
    </div>
  );
};