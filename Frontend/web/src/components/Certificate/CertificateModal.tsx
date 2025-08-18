import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCertificate } from '@/hooks/useCertificate';
import { FumigationDetailResponse, FumigationReportResponse, CleanupReportResponse } from '@/types/request';

interface CertificateModalProps {
  fumigationDetails: FumigationDetailResponse;
  fumigationReport: FumigationReportResponse;
  cleanupReport?: CleanupReportResponse;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  fumigationDetails,
  fumigationReport,
  cleanupReport,
  onClose
}) => {
  const {
    template,
    formattedText,
    selectedLanguage,
    setSelectedLanguage,
    copyToClipboard,
    copySuccess,
    isReady
  } = useCertificate(fumigationDetails, fumigationReport, cleanupReport || null);

  if (!isReady || !template) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">No se pueden generar los datos del certificado</div>
          <div className="flex justify-center mt-4">
            <Button onClick={onClose} variant="outline">Cerrar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 h-5/6 flex flex-col">
        <div className="bg-[#003595] text-white rounded-t-lg px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Datos del Certificado</h2>
            <p className="text-blue-100 text-sm">
              Lote {fumigationDetails.lot.lotNumber}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="bg-white text-[#003595] hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setSelectedLanguage('es')}
              variant={selectedLanguage === 'es' ? 'default' : 'outline'}
              className={selectedLanguage === 'es' ? 'bg-[#003595]' : ''}
            >
              Español
            </Button>
            <Button
              onClick={() => setSelectedLanguage('en')}
              variant={selectedLanguage === 'en' ? 'default' : 'outline'}
              className={selectedLanguage === 'en' ? 'bg-[#003595]' : ''}
            >
              English
            </Button>
          </div>

          <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto">
            <div className="bg-white rounded border p-4">
              <div className="grid grid-cols-1 gap-3">
                {template.fields.map((field, index) => (
                  <div key={index} className="flex">
                    <div className="font-medium text-gray-700 w-1/2">
                      {field.label}:
                    </div>
                    <div className="text-gray-900 w-1/2">
                      {field.value || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Texto formateado para copiar:
              </span>
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="bg-[#003595] hover:bg-[#002060]"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <textarea
              value={formattedText}
              readOnly
              className="w-full h-32 text-sm bg-white border rounded p-2 font-mono"
              style={{ resize: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};