import { useState, useEffect, useCallback } from 'react';
import { CertificateResponse, CertificateField } from '@/types/certificate';
import { certificateService } from '@/services/certificateService';

export const useCertificate = (fumigationId: number | null) => {
  const [certificateData, setCertificateData] = useState<CertificateResponse | null>(null);
  const [template, setTemplate] = useState<CertificateField[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'en'>('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const loadCertificateData = useCallback(async () => {
    if (!fumigationId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await certificateService.getCertificateData(fumigationId);
      setCertificateData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los datos del certificado');
    } finally {
      setLoading(false);
    }
  }, [fumigationId]);

  useEffect(() => {
    if (fumigationId) {
      loadCertificateData();
    }
  }, [fumigationId, loadCertificateData]);

  useEffect(() => {
    if (certificateData) {
      const newTemplate = certificateService.generateTemplate(certificateData, selectedLanguage);
      setTemplate(newTemplate);
    }
  }, [certificateData, selectedLanguage]);

  const copyToClipboard = async () => {
    try {
      const text = certificateService.formatTemplateForCopy(template);
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return {
    certificateData,
    template,
    selectedLanguage,
    setSelectedLanguage,
    loading,
    error,
    copySuccess,
    copyToClipboard
  };
};