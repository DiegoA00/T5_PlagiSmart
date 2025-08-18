import { Layout } from "../../layouts/Layout";
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useParams } from "react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { fumigationReportsService, FumigationReport, CleanupReport, Signature } from "@/services/fumigationReportsService";
import { useProfile } from "@/hooks/useProfile";
import apiClient from "@/services/api/apiService";

interface HeaderData {
  label: string;
  value: string;
}

interface PersonalInfo {
  name: string;
  position: string;
}

interface RequestDetail {
  lot: string;
  dimension: string;
  tons: string;
  quality: string;
  sacks: string;
  destination: string;
}

interface SupplyDetail {
  product: string;
  quantity: string;
  dose: string;
  fumigationMethod: string;
  ribbonsNumber: string;
}

interface LotDetail {
  lot: string;
  tons: string;
  quality: string;
  sacks: string;
  destination: string;
  ribbonsStatus: string;
  fumigationTime: string;
  ppmFosfine: string;
}

interface GridData {
  label: string;
  value: string;
}

// Interface para la solicitud de fumigación
interface FumigationRequest {
  id: number;
  lotNumber: string;
  ton: number;
  portDestination: string;
  sacks: number;
  quality: string;
  status: "APPROVED" | "REJECTED" | "PENDING" | "FAILED" | "FINISHED";
  message: string;
  dateTime: string;
}

interface DocumentSection {
  type: 'company-info' | 'header' | 'lot-request-details' | 'info' | 'personal-info' | 'request-details' | 'fumigation-conditions' | 'cleanup-conditions' | 'supplies-details' | 'lot-details' | 'signatures' | 'single-signature' | 'text' | 'grid' | 'footer';
  data?: any[];
  signatures?: (string | { name: string; imageUrl?: string; signature?: Signature })[];
  signature?: string;
  content1?: string;
  content2?: string;
  content3?: string;
}

interface DocumentContent {
  mainTitle: string;
  subtitle: string;
  sections: DocumentSection[];
}

interface Document {
  type: string;
  title: string;
  fileName: string;
  content: DocumentContent;
}

type DocumentsData = Record<string, Document[]>;

function ReservationDocuments() {
  console.log('ReservationDocuments component renderizando...');
  const { lotId } = useParams<{ lotId: string }>();
  console.log('Parámetro recibido lotId:', lotId);

  // Estados para manejar las URLs de las firmas
  const [signatureUrls, setSignatureUrls] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [signaturesLoadedCount, setSignaturesLoadedCount] = useState(0); // Para forzar re-renders

  // Función para cargar una imagen de firma desde el backend (memoizada para evitar re-creaciones)
  const loadSignatureImage = useCallback(async (signature: Signature) => {
    const signatureId = signature.id.toString();

    console.log(`Cargando imagen para firma ID: ${signatureId}, URL: ${signature.fileUrl}`);
    
    setLoadingImages(prev => {
      if (prev[signatureId]) return prev; // Ya se está cargando
      return { ...prev, [signatureId]: true };
    });
    
    setImageErrors(prev => ({ ...prev, [signatureId]: false }));

    try {
      const response = await apiClient.get(signature.fileUrl, {
        responseType: 'blob'
      });

      const blobUrl = URL.createObjectURL(response.data);
      
      setSignatureUrls(prev => {
        if (prev[signatureId]) return prev; // Ya cargada
        return { ...prev, [signatureId]: blobUrl };
      });
      
      setSignaturesLoadedCount(prev => prev + 1);
      
      console.log(`Imagen cargada exitosamente para firma ID: ${signatureId}`);

    } catch (error) {
      console.error('Error cargando imagen de firma:', error);
      setImageErrors(prev => ({ ...prev, [signatureId]: true }));
    } finally {
      setLoadingImages(prev => ({ ...prev, [signatureId]: false }));
    }
  }, []); // Sin dependencias para evitar re-creaciones

  // Función separada para obtener todas las firmas de los reportes
  const getAllSignatures = (): Signature[] => {
    const signatures: Signature[] = [];
    
    if (fumigationReport?.signatures) {
      signatures.push(...fumigationReport.signatures);
    }
    
    if (cleanupReport?.signatures) {
      signatures.push(...cleanupReport.signatures);
    }
    
    return signatures;
  };

  // Función helper para procesar las firmas desde la base de datos (sin lógica de carga)
  const processSignatures = (signatures: Signature[]): { name: string; imageUrl?: string; signature?: Signature }[] => {
    const processedSignatures: { name: string; imageUrl?: string; signature?: Signature }[] = [];
    
    // Buscar firma del técnico
    const technicianSignature = signatures.find(sig => sig.signatureType === 'technician');
    if (technicianSignature) {
      processedSignatures.push({
        name: "Técnico Responsable Anecacao",
        imageUrl: signatureUrls[technicianSignature.id.toString()],
        signature: technicianSignature
      });
    } else {
      processedSignatures.push({
        name: "Técnico Responsable Anecacao"
      });
    }
    
    // Buscar firma del cliente
    const clientSignature = signatures.find(sig => sig.signatureType === 'client');
    if (clientSignature) {
      processedSignatures.push({
        name: "Cliente",
        imageUrl: signatureUrls[clientSignature.id.toString()],
        signature: clientSignature
      });
    } else {
      processedSignatures.push({
        name: "Cliente"
      });
    }
    
  return processedSignatures;
  };
  
  const { profileData } = useProfile();
  const [fumigationReport, setFumigationReport] = useState<FumigationReport | null>(null);
  const [cleanupReport, setCleanupReport] = useState<CleanupReport | null>(null);
  const [fumigationRequest, setFumigationRequest] = useState<FumigationRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noDataFound, setNoDataFound] = useState(false);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      // Liberar las URLs de blob cuando se desmonta el componente
      Object.values(signatureUrls).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [signatureUrls]);

  // Función para limpiar los estados de firmas
  const clearSignatureStates = useCallback(() => {
    setSignatureUrls({});
    setLoadingImages({});
    setImageErrors({});
  }, []);

  // Nuevo useEffect que se ejecuta solo cuando cambian los reportes
  useEffect(() => {
    // Limpiar estados anteriores cuando cambien los reportes
    clearSignatureStates();
  }, [fumigationReport?.id, cleanupReport?.id, fumigationRequest?.id, clearSignatureStates]);

  // Función auxiliar para convertir blob URL a data URL (más compatible con html2canvas)
  const convertBlobToDataUrl = useCallback(async (blobUrl: string): Promise<string> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error convirtiendo blob a data URL:', error);
      throw error;
    }
  }, []);

  // Función para preparar imágenes de firmas para el PDF
  const prepareSignatureImagesForPDF = useCallback(async (element: HTMLElement) => {
    const signatureImages = element.querySelectorAll('img[alt*="Firma de"]');
    const conversions: Promise<void>[] = [];

    signatureImages.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.src.startsWith('blob:')) {
        const conversion = convertBlobToDataUrl(imgElement.src)
          .then(dataUrl => {
            console.log(`Convertida firma blob a data URL: ${imgElement.alt}`);
            imgElement.src = dataUrl;
          })
          .catch(error => {
            console.error(`Error convirtiendo firma ${imgElement.alt}:`, error);
          });
        conversions.push(conversion);
      }
    });

    if (conversions.length > 0) {
      console.log(`Convirtiendo ${conversions.length} firmas blob a data URLs...`);
      await Promise.all(conversions);
      console.log('Conversión de firmas completada');
    }
  }, [convertBlobToDataUrl]);

  // Función para forzar la carga completa de todas las imágenes
  const ensureAllImagesLoaded = useCallback(async (element: HTMLElement): Promise<void> => {
    const allImages = element.querySelectorAll('img');
    const loadPromises: Promise<void>[] = [];
    
    allImages.forEach(img => {
      if (!img.complete) {
        const loadPromise = new Promise<void>((resolve) => {
          const handleLoad = () => {
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleLoad);
            resolve();
          };
          img.addEventListener('load', handleLoad);
          img.addEventListener('error', handleLoad);
          
          // Si la imagen ya tiene error o está cargada, resolver inmediatamente
          if (img.complete || img.naturalWidth > 0) {
            handleLoad();
          }
        });
        loadPromises.push(loadPromise);
      }
    });
    
    if (loadPromises.length > 0) {
      console.log(`Esperando que carguen ${loadPromises.length} imágenes adicionales...`);
      await Promise.allSettled(loadPromises);
    }
  }, []);

  // Función para verificar que una imagen esté completamente cargada
  const isImageFullyLoaded = useCallback((img: HTMLImageElement): boolean => {
    return img.complete && 
           img.naturalWidth > 0 && 
           img.naturalHeight > 0 && 
           !img.src.includes('data:,'); // Evitar imágenes vacías
  }, []);

  // Función para forzar la recarga de una imagen
  const forceImageReload = useCallback(async (img: HTMLImageElement): Promise<void> => {
    return new Promise((resolve) => {
      const originalSrc = img.src;
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolver incluso si hay error
      
      // Forzar recarga cambiando src temporalmente
      img.src = 'data:,';
      setTimeout(() => {
        img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'reload=' + Date.now();
      }, 10);
      
      // Timeout de seguridad
      setTimeout(() => resolve(), 3000);
    });
  }, []);

  // Función mejorada para asegurar que todas las imágenes estén listas para PDF
  const prepareImagesForPDF = useCallback(async (element: HTMLElement): Promise<boolean> => {
    const allSignatureImages = element.querySelectorAll('img[alt*="Firma de"]') as NodeListOf<HTMLImageElement>;
    
    if (allSignatureImages.length === 0) {
      console.log('No se encontraron firmas para el PDF');
      return true;
    }

    console.log(`Preparando ${allSignatureImages.length} firmas para el PDF...`);
    
    let allReady = true;
    const reloadPromises: Promise<void>[] = [];

    // Verificar cada imagen y recargar si es necesario
    allSignatureImages.forEach((img, index) => {
      if (!isImageFullyLoaded(img)) {
        console.log(`Firma ${index + 1} no está completamente cargada, forzando recarga...`);
        allReady = false;
        reloadPromises.push(forceImageReload(img));
      } else {
        console.log(`Firma ${index + 1} está lista: ${img.naturalWidth}x${img.naturalHeight}`);
      }
    });

    // Esperar todas las recargas
    if (reloadPromises.length > 0) {
      await Promise.allSettled(reloadPromises);
      
      // Verificar nuevamente después de recargar
      let finalCheck = true;
      allSignatureImages.forEach((img, index) => {
        if (!isImageFullyLoaded(img)) {
          console.warn(`Firma ${index + 1} sigue sin cargar correctamente`);
          finalCheck = false;
        }
      });
      
      return finalCheck;
    }

    return allReady;
  }, [isImageFullyLoaded, forceImageReload]);

  // Función para agregar firmas manualmente al PDF si html2canvas falla
  const addSignaturesToPDF = useCallback(async (pdf: jsPDF, element: HTMLElement, pageWidth: number, pageHeight: number) => {
    const signatureImages = element.querySelectorAll('img[alt*="Firma de"]') as NodeListOf<HTMLImageElement>;
    
    if (signatureImages.length === 0) return;

    console.log(`Agregando ${signatureImages.length} firmas manualmente al PDF...`);

    for (let i = 0; i < signatureImages.length; i++) {
      const img = signatureImages[i];
      
      if (isImageFullyLoaded(img)) {
        try {
          // Obtener posición relativa de la imagen
          const elementRect = element.getBoundingClientRect();
          const imgRect = img.getBoundingClientRect();
          
          // Calcular posición en el PDF (convertir px a mm)
          const x = ((imgRect.left - elementRect.left) / elementRect.width) * (pageWidth - 20) + 10;
          const y = ((imgRect.top - elementRect.top) / elementRect.height) * (pageHeight - 20) + 10;
          
          // Dimensiones de la firma en el PDF
          const maxWidth = 70; // mm
          const maxHeight = 20; // mm
          
          // Crear canvas temporal para la firma
          const tempCanvas = document.createElement('canvas');
          const ctx = tempCanvas.getContext('2d');
          
          if (ctx) {
            tempCanvas.width = img.naturalWidth;
            tempCanvas.height = img.naturalHeight;
            
            ctx.drawImage(img, 0, 0);
            const signatureData = tempCanvas.toDataURL('image/png');
            
            // Agregar la firma al PDF
            pdf.addImage(signatureData, 'PNG', x, y, maxWidth, maxHeight, undefined, 'FAST');
            console.log(`Firma ${i + 1} agregada manualmente al PDF en posición (${x}, ${y})`);
          }
        } catch (error) {
          console.error(`Error agregando firma ${i + 1} al PDF:`, error);
        }
      }
    }
  }, [isImageFullyLoaded]);

  // Función para verificar si las firmas se capturaron correctamente en el canvas
  const verifySignaturesInCanvas = useCallback((canvas: HTMLCanvasElement, element: HTMLElement): boolean => {
    const signatureImages = element.querySelectorAll('img[alt*="Firma de"]');
    if (signatureImages.length === 0) return true; // No hay firmas que verificar

    // Crear un canvas temporal para análisis
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Obtener los datos del canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Buscar píxeles que no sean blancos (indicativo de contenido de firma)
    let hasContent = false;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Si encontramos píxeles que no son completamente blancos y tienen opacidad
      if (a > 0 && (r < 250 || g < 250 || b < 250)) {
        hasContent = true;
        break;
      }
    }

    console.log(`Verificación de canvas: ${hasContent ? 'Contenido detectado' : 'Posiblemente vacío'}`);
    return hasContent;
  }, []);

  // Función completamente nueva para generar PDF con firmas garantizadas
  const generatePDFWithGuaranteedSignatures = useCallback(async (element: HTMLElement, documentType: string): Promise<void> => {
    console.log('Iniciando generación de PDF con firmas garantizadas...');

    // Paso 1: Extraer y almacenar información de firmas ANTES de ocultar
    const signatureElements = element.querySelectorAll('img[alt*="Firma de"]') as NodeListOf<HTMLImageElement>;
    const signaturesInfo: Array<{
      img: HTMLImageElement;
      rect: DOMRect;
      parentRect: DOMRect;
      name: string;
      dataUrl: string;
    }> = [];

    // Recolectar información de cada firma
    for (let i = 0; i < signatureElements.length; i++) {
      const img = signatureElements[i];
      
      if (isImageFullyLoaded(img)) {
        console.log(`Procesando firma ${i + 1}: ${img.alt}`);
        
        // Obtener posiciones antes de cualquier modificación
        const imgRect = img.getBoundingClientRect();
        const parentRect = element.getBoundingClientRect();
        
        // Crear canvas para extraer la imagen limpia
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx && img.naturalWidth > 0) {
          tempCanvas.width = img.naturalWidth;
          tempCanvas.height = img.naturalHeight;
          
          try {
            // Dibujar la imagen en el canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.drawImage(img, 0, 0);
            
            const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
            
            signaturesInfo.push({
              img,
              rect: imgRect,
              parentRect,
              name: img.alt.replace('Firma de ', ''),
              dataUrl
            });
            
            console.log(`Firma ${i + 1} procesada exitosamente: ${img.naturalWidth}x${img.naturalHeight}`);
          } catch (error) {
            console.error(`Error procesando firma ${i + 1}:`, error);
          }
        } else {
          console.warn(`Firma ${i + 1} no está lista o es inválida`);
        }
      }
    }

    console.log(`${signaturesInfo.length} firmas procesadas para el PDF`);

    // Paso 2: Ocultar temporalmente SOLO las firmas para capturar el documento base
    const elementsToHide = Array.from(element.querySelectorAll('.no-print')) as HTMLElement[];
    const originalDisplays = elementsToHide.map(el => el.style.display);
    elementsToHide.forEach(el => el.style.display = 'none');

    // También ocultar temporalmente las firmas para capturar solo el documento base
    signatureElements.forEach(img => img.style.opacity = '0');

    await new Promise(resolve => setTimeout(resolve, 100));

    // Paso 3: Capturar documento base SIN firmas
    console.log('Capturando documento base...');
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      allowTaint: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      imageTimeout: 5000
    });

    // Restaurar visibilidad inmediatamente
    elementsToHide.forEach((el, index) => {
      el.style.display = originalDisplays[index] || '';
    });
    signatureElements.forEach(img => img.style.opacity = '1');

    // Paso 4: Crear PDF y agregar documento base
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);

    // Convertir y agregar imagen base
    const imgData = canvas.toDataURL('image/png', 0.9);
    let imgWidth = availableWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > availableHeight) {
      imgHeight = availableHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const xOffset = margin + (availableWidth - imgWidth) / 2;
    const yOffset = margin + (availableHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    // Paso 5: Superponer cada firma en su posición exacta
    console.log('Agregando firmas al PDF...');
    
    for (const signatureInfo of signaturesInfo) {
      try {
        // Calcular posición relativa de la firma en el PDF
        const relativeX = (signatureInfo.rect.left - signatureInfo.parentRect.left) / signatureInfo.parentRect.width;
        const relativeY = (signatureInfo.rect.top - signatureInfo.parentRect.top) / signatureInfo.parentRect.height;
        
        // Convertir a coordenadas del PDF
        const pdfX = xOffset + (relativeX * imgWidth);
        const pdfY = yOffset + (relativeY * imgHeight);
        
        // Dimensiones de la firma en el PDF (proporcional)
        const signatureWidthMM = (signatureInfo.rect.width / signatureInfo.parentRect.width) * imgWidth;
        const signatureHeightMM = (signatureInfo.rect.height / signatureInfo.parentRect.height) * imgHeight;
        
        // Agregar firma al PDF
        pdf.addImage(
          signatureInfo.dataUrl,
          'PNG',
          pdfX,
          pdfY,
          signatureWidthMM,
          signatureHeightMM,
          undefined,
          'FAST'
        );
        
        console.log(`Firma "${signatureInfo.name}" agregada en posición (${pdfX.toFixed(1)}, ${pdfY.toFixed(1)}) con dimensiones ${signatureWidthMM.toFixed(1)}x${signatureHeightMM.toFixed(1)}mm`);
        
      } catch (error) {
        console.error(`Error agregando firma "${signatureInfo.name}":`, error);
      }
    }

    // Paso 6: Guardar PDF
    const pdfFileName = `${documentType}_${lotId}.pdf`;
    pdf.save(pdfFileName);

    const message = `PDF generado exitosamente con ${signaturesInfo.length} firma(s) garantizada(s): ${pdfFileName}`;
    console.log(message);
    
    return Promise.resolve();
  }, [isImageFullyLoaded]);

  // useEffect dedicado para cargar las firmas cuando los reportes cambian (solo cuando cambian los reportes)
  useEffect(() => {
    if (!fumigationReport && !cleanupReport) return; // No hacer nada si no hay reportes
    
    // Pequeño delay para evitar llamadas múltiples
    const timeoutId = setTimeout(() => {
      const signatures: Signature[] = [];
      
      // Obtener firmas de los reportes actuales
      if (fumigationReport?.signatures) {
        signatures.push(...fumigationReport.signatures);
      }
      
      if (cleanupReport?.signatures) {
        signatures.push(...cleanupReport.signatures);
      }
      
      if (signatures.length > 0) {
        console.log(`Encontradas ${signatures.length} firmas, iniciando carga de imágenes`);
        
        // Cargar todas las firmas en paralelo
        signatures.forEach(signature => {
          const signatureId = signature.id.toString();
          
          // Verificar estado actual antes de cargar
          setLoadingImages(prevLoading => {
            setSignatureUrls(prevUrls => {
              setImageErrors(prevErrors => {
                // Solo cargar si no está ya cargada y no se está cargando y no tiene error
                if (!prevUrls[signatureId] && !prevLoading[signatureId] && !prevErrors[signatureId]) {
                  console.log(`Iniciando carga para firma ID: ${signatureId}`);
                  loadSignatureImage(signature);
                }
                return prevErrors;
              });
              return prevUrls;
            });
            return prevLoading;
          });
        });
      } else {
        console.log('No se encontraron firmas en los reportes');
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timeoutId);
  }, [fumigationReport, cleanupReport, loadSignatureImage]); // Solo cuando cambien los reportes  // Cleanup de URLs de blob cuando el componente se desmonta
  useEffect(() => {
    return () => {
      Object.values(signatureUrls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [signatureUrls]);

  // Cargar datos de la API cuando hay un lotId
  useEffect(() => {
    const loadReports = async () => {
      if (!lotId) return;

      try {
        console.log('Iniciando carga de reportes para lote:', lotId);
        setLoading(true);
        setError(null);
        setNoDataFound(false);
        
        // Cargar reportes y solicitud de fumigación en paralelo
        const [fumigationReportResult, cleanupReportResult, fumigationRequestResult] = await Promise.allSettled([
          fumigationReportsService.getFumigationReport(parseInt(lotId)),
          fumigationReportsService.getCleanupReportByFumigationId(parseInt(lotId)),
          apiClient.get(`/fumigations/${lotId}`)
        ]);

        // Procesar resultado del reporte de fumigación
        if (fumigationReportResult.status === 'fulfilled') {
          console.log('Reporte de fumigación cargado exitosamente:', fumigationReportResult.value);
          setFumigationReport(fumigationReportResult.value);
        } else {
          console.log('Error al cargar reporte de fumigación:', fumigationReportResult.reason);
        }

        // Procesar resultado del reporte de cleanup
        if (cleanupReportResult.status === 'fulfilled') {
          console.log('Reporte de cleanup cargado exitosamente:', cleanupReportResult.value);
          setCleanupReport(cleanupReportResult.value);
        } else {
          console.log('Error al cargar reporte de cleanup:', cleanupReportResult.reason);
        }

        // Procesar resultado de la solicitud de fumigación
        if (fumigationRequestResult.status === 'fulfilled') {
          console.log('Solicitud de fumigación cargada exitosamente:', fumigationRequestResult.value.data);
          setFumigationRequest(fumigationRequestResult.value.data);
        } else {
          console.log('Error al cargar solicitud de fumigación:', fumigationRequestResult.reason);
        }

        // Verificar si al menos uno de los reportes/solicitud se cargó exitosamente
        const hasAnyReport = fumigationReportResult.status === 'fulfilled' || 
                             cleanupReportResult.status === 'fulfilled' ||
                             fumigationRequestResult.status === 'fulfilled';
        
        if (!hasAnyReport) {
          // Si ninguno de los reportes se pudo cargar, mostrar mensaje de "no encontrado"
          setNoDataFound(true);
          setError(null);
          console.info('No hay reportes disponibles para este lote');
        }

      } catch (err: any) {
        console.error('Error general al cargar reportes:', err);
        const errorMessage = err.message || 'Error al cargar los reportes';
        setError(errorMessage);
        setNoDataFound(false);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [lotId]);

  // Función para crear documentos basados en datos de la API
  const createDocumentsFromReport = (report: FumigationReport): Document[] => {
    console.log('Creando documentos desde reporte:', report);
    console.log('Profile data disponible:', profileData);
    
    const companyName = profileData?.company?.businessName || "[Nombre de la Empresa]";
    
    try {
      return [
        {
          type: "registro-fumigacion",
          title: "Registro de Fumigación",
          fileName: "Registro_Fumigacion",
          content: {
            mainTitle: "REGISTRO DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${report.id || 'N/A'}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: companyName },
                  { label: "Ubicación", value: report.location || 'N/A' },
                  { label: "Fecha", value: report.date || 'N/A' },
                  { label: "Hora/Inicio", value: report.startTime || 'N/A' },
                  { label: "Hora/Fin", value: report.endTime || 'N/A' },
                  { label: "Supervisor", value: report.supervisor || 'N/A' }
                ]
              },
              {
                type: "personal-info",
                data: (report.technicians || []).map(tech => ({
                  name: `${tech.firstName || ''} ${tech.lastName || ''}`,
                  position: "Técnico"
                }))
              },
              {
                type: "request-details",
                data: [
                  {
                    lot: report.fumigationInfo?.lotNumber || 'N/A',
                    dimension: `${report.dimensions?.height || 0}m x ${report.dimensions?.width || 0}m x ${report.dimensions?.length || 0}m`,
                    tons: (report.fumigationInfo?.ton || 0).toString(),
                    quality: report.fumigationInfo?.quality || 'N/A',
                    sacks: (report.fumigationInfo?.sacks || 0).toString(),
                    destination: report.fumigationInfo?.portDestination || 'N/A'
                  }
                ]
              },
              {
                type: "fumigation-conditions",
                data: [
                  { label: "Temperatura", value: `${report.environmentalConditions?.temperature || 0}°C` },
                  { label: "Humedad", value: `${report.environmentalConditions?.humidity || 0}%` },
                  { label: "Peligro eléctrico", value: report.industrialSafetyConditions?.electricDanger ? "Sí" : "No" },
                  { label: "Peligro de caídas", value: report.industrialSafetyConditions?.fallingDanger ? "Sí" : "No" },
                  { label: "Peligro de atropellos", value: report.industrialSafetyConditions?.hitDanger ? "Sí" : "No" },
                  { label: "Observaciones", value: report.observations || 'N/A' }
                ]
              },
              {
                type: "supplies-details",
                data: (report.supplies || []).map(supply => ({
                  product: supply.name || 'N/A',
                  quantity: (supply.quantity || 0).toString(),
                  dose: supply.dosage || 'N/A',
                  fumigationMethod: supply.kindOfSupply || 'N/A',
                  ribbonsNumber: supply.numberOfStrips || 0
                }))
              },
              {
                type: "signatures",
                signatures: processSignatures(report.signatures || [])
              }
            ]
          }
        }
      ];
    } catch (error) {
      console.error('Error creando documentos desde reporte:', error);
      return [];
    }
  };

  // Función para crear documentos desde reporte de cleanup
  const createDocumentsFromCleanupReport = (cleanupData: CleanupReport): Document[] => {
    const companyName = profileData?.company?.businessName || "[Nombre de la Empresa]";
    try {
      return [
        {
          type: "registro-descarpe",
          title: "Registro de Descarpe",
          fileName: "Registro_Descarpe",
          content: {
            mainTitle: "REGISTRO DE DESCARPE",
            subtitle: `Código de Reserva: ${cleanupData.id || 'N/A'}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: companyName },
                  { label: "Ubicación", value: cleanupData.location || "[Ubicación]" },
                  { label: "Fecha", value: cleanupData.date || new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: cleanupData.startTime || "[Hora Inicio]" },
                  { label: "Hora/Fin", value: cleanupData.endTime || "[Hora Fin]" },
                  { label: "Supervisor", value: cleanupData.supervisor || "[Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: cleanupData.technicians?.map(tech => ({
                  name: tech.firstName && tech.lastName ? `${tech.firstName} ${tech.lastName}` : "[Nombre]",
                  position: "Técnico"
                }))
              },
              {
                type: "lot-details",
                data: cleanupData.fumigationInfo ? [
                  {
                    lot: cleanupData.fumigationInfo.lotNumber || "[Número de Lote]",
                    tons: cleanupData.fumigationInfo.ton?.toString() || "[Toneladas]",
                    quality: cleanupData.fumigationInfo.quality || "[Calidad]",
                    sacks: cleanupData.fumigationInfo.sacks?.toString() || "[Número de sacos]",
                    destination: cleanupData.fumigationInfo.portDestination || "[Destino]",
                    ribbonsStatus: cleanupData.lotDescription?.stripsState || "[Estado de cintas]",
                    fumigationTime: cleanupData.lotDescription?.fumigationTime?.toString() || "[Tiempo de Fumigación]",
                    ppmFosfine: cleanupData.lotDescription?.ppmFosfina?.toString() || "[PPM Fosfina]"
                  }
                ] : []
              },
              {
                type: "cleanup-conditions",
                data: [
                  { label: "Temperatura", value: "[Temperatura]" },
                  { label: "Humedad", value: "[Humedad]" },
                  { label: "Peligro eléctrico", value: cleanupData.industrialSafetyConditions?.electricDanger ? "Sí" : "No" },
                  { label: "Peligro de caídas", value: cleanupData.industrialSafetyConditions?.fallingDanger ? "Sí" : "No" },
                  { label: "Peligro de atropellos", value: cleanupData.industrialSafetyConditions?.hitDanger ? "Sí" : "No" },
                  { label: "Otro peligro", value: cleanupData.industrialSafetyConditions?.otherDanger ? "Sí" : "No" }
                ]
              },
              {
                type: "signatures",
                signatures: processSignatures(cleanupData.signatures || [])
              }
            ]
          }
        }
      ];
    } catch (error) {
      console.error('Error creando documentos desde reporte de cleanup:', error);
      return [];
    }
  };

  // Función para crear documentos desde solicitud de fumigación
  const createDocumentsFromFumigationRequest = (requestData: FumigationRequest): Document[] => {
    const companyName = profileData?.company?.businessName || "[Nombre de la Empresa]";
    
    // Función para obtener la etiqueta del estado en español (similar a TableReservations)
    const getStatusLabel = (status: string): string => {
      const statusLabels: { [key: string]: string } = {
        'PENDING': 'Pendiente',
        'APPROVED': 'Aprobado',
        'REJECTED': 'Rechazado',
        'FAILED': 'Falló',
        'FINISHED': 'Finalizado',
        'IN_PROGRESS': 'En Progreso',
        'COMPLETED': 'Completado',
        'CANCELLED': 'Cancelado',
        'SCHEDULED': 'Programado'
      };
      return statusLabels[status] || status;
    };
    
    // Función para generar mensaje por defecto basado en el estado
    const getDefaultMessage = (status: string): string => {
      const statusMessages: { [key: string]: string } = {
        'PENDING': 'Solicitud en espera de revisión por parte del equipo técnico.',
        'APPROVED': 'Solicitud aprobada. Se procederá con la programación del servicio.',
        'FAILED': 'Solicitud fallida. Por favor, revise los detalles.',
        'REJECTED': 'Solicitud rechazada. Por favor, revise los campos requeridos.',
        'FINISHED': 'Solicitud completada exitosamente. Gracias por confiar en nosotros.',
      };
      
      return statusMessages[status] || 'Solicitud recibida y en proceso de evaluación.';
    };
    
    try {
      return [
        {
          type: "solicitud-fumigacion",
          title: "Solicitud de Fumigación",
          fileName: "Solicitud_Fumigacion",
          content: {
            mainTitle: "SOLICITUD DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${requestData.id}`,
            sections: [
              {
                type: "company-info",
                data: [
                  { label: "Empresa", value: companyName },
                  { label: "Razón Social", value: profileData?.company?.name || "[Razón Social]" },
                  { label: "RUC", value: profileData?.company?.ruc || "[RUC]" },
                  { label: "Dirección", value: profileData?.company?.address || "[Dirección]" },
                  { label: "Teléfono", value: profileData?.company?.phoneNumber || "[Teléfono]" },
                  { label: "Representante Legal", value: `${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim() || "[Representante Legal]" }
                ]
              },
              {
                type: "lot-request-details",
                data: [
                  {
                    date: new Date(requestData.dateTime).toLocaleString() || "[Fecha]",
                    destination: requestData.portDestination || "[Destino]",
                    tons: requestData.ton?.toString() || "[Toneladas]",
                    quality: requestData.quality || "[Calidad]",
                    sacks: requestData.sacks?.toString() || "[Sacos]",
                    lot: requestData.lotNumber || "[Número de Lote]"
                  }
                ]
              },
              {
                type: "info",
                data: [
                  { label: "Estado", value: getStatusLabel(requestData.status || '') || "[Estado]" },
                  { label: "Mensaje", value: requestData.message || getDefaultMessage(requestData.status || '') }
                ]
              },
            ]
          }
        }
      ];
    } catch (error) {
      console.error('Error creando documentos desde solicitud de fumigación:', error);
      return [];
    }
  };

  // Simulación de datos de documentos por reserva - esto vendría de una API
  const getDocumentsByReservation = (codigoReserva: string | undefined): Document[] => {
    if (!codigoReserva) return [];
    
    const allDocuments: DocumentsData = {
      "1": [
        {
          type: "solicitud-fumigacion",
          title: "Solicitud de Fumigación",
          fileName: "Solicitud_Fumigacion",
          content: {
            mainTitle: "SOLICITUD DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "company-info",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Razón Social", value: "[Razón Social de la Empresa]" },
                  { label: "RUC", value: "[RUC de la Empresa]" },
                  { label: "Dirección", value: "[Dirección de la Empresa]" },
                  { label: "Teléfono", value: "[Teléfono de la Empresa]" },
                  { label: "Nombre Representante Legal", value: "[Nombre del Representante Legal]" }
                ]
              },
              {
                type: "lot-request-details",
                data: [
                  {
                    fecha: "[Fecha de Fumigación Lote 1]",
                    destination: "[Destino de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    lot: "[Número de Lote 1]"
                  },
                  {
                    fecha: "[Fecha de Fumigación Lote 2]",
                    destination: "[Destino de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    lot: "[Número de Lote 2]"
                  },
                  {
                    fecha: "[Fecha de Fumigación Lote 3]",
                    destination: "[Destino de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    lot: "[Número de Lote 3]"
                  },
                  {
                    fecha: "[Fecha de Fumigación Lote 4]",
                    destination: "[Destino de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    lot: "[Número de Lote 4]",
                  },
                  {
                    fecha: "[Fecha de Fumigación Lote 5]",
                    destination: "[Destino de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    lot: "[Número de Lote 5]"
                  }
                ]
              },
              {
                type: "info",
                data: [
                  {
                    status: "[Estado de Lote 1]",
                    message: "[Mensaje de Lote 1]"
                  },
                  {
                    status: "[Estado de Lote 2]",
                    message: "[Mensaje de Lote 2]"
                  },
                  {
                    status: "[Estado de Lote 3]",
                    message: "[Mensaje de Lote 3]"
                  },
                  {
                    status: "[Estado de Lote 4]",
                    message: "[Mensaje de Lote 4]"
                  },
                  {
                    status: "[Estado de Lote 5]",
                    message: "[Mensaje de Lote 5]"
                  }
                ]
              }
            ]
          }
        },
        {
          type: "registro-fumigacion",
          title: "Registro de Fumigación",
          fileName: "Registro_Fumigacion",
          content: {
            mainTitle: "REGISTRO DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "request-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    dimension: "[Dimensiones de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    dimension: "[Dimensiones de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    dimension: "[Dimensiones de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    dimension: "[Dimensiones de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    dimension: "[Dimensiones de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]"
                  }
                ]
              },
              {
                type: "fumigation-conditions",
                data: [
                  { label: "Temperatura", value: "[Temperatura]" },
                  { label: "Humedad", value: "[Humedad]" },
                  { label: "Peligro eléctrico", value: "[Peligro eléctrico]" },
                  { label: "Peligro de caídas", value: "[Peligro de caídas]" },
                  { label: "Peligro de atropellos", value: "[Peligro de atropellos]" },
                  { label: "Observaciones", value: "[Observaciones]" }
                ]
              },
              {
                type: "supplies-details",
                data: [
                  {
                    product: "Fosfina",
                    quantity: "50 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "5",
                  },
                  {
                    product: "Diatomita",
                    quantity: "20 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "3",
                  },
                  {
                    product: "Aerosol Insecticida",
                    quantity: "10 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "2",
                  },
                  {
                    product: "Trampa de Feromonas",
                    quantity: "5 unidades",
                    dose: "Instalación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "1",
                  },
                  {
                    product: "Equipo de Protección Personal (EPP)",
                    quantity: "5 juegos",
                    dose: "Uso obligatorio durante la fumigación",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "0",
                  }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        },
        {
          type: "registro-descarpe",
          title: "Registro de Descarpe",
          fileName: "Registro_Descarpe",
          content: {
            mainTitle: "REGISTRO DE DESCARPE",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "lot-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]",
                    ribbonsStatus: "[Estado de cintas de Lote 1]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 1]",
                    ppmFosfine: "[PPM Fosfina de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]",
                    ribbonsStatus: "[Estado de cintas de Lote 2]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 2]",
                    ppmFosfine: "[PPM Fosfina de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]",
                    ribbonsStatus: "[Estado de cintas de Lote 3]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 3]",
                    ppmFosfine: "[PPM Fosfina de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]",
                    ribbonsStatus: "[Estado de cintas de Lote 4]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 4]",
                    ppmFosfine: "[PPM Fosfina de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]",
                    ribbonsStatus: "[Estado de cintas de Lote 5]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 5]",
                    ppmFosfine: "[PPM Fosfina de Lote 5]"
                  }
                ]
              },
              {
                type: "cleanup-conditions",
                data: [
                  { label: "Temperatura", value: "[Temperatura]" },
                  { label: "Humedad", value: "[Humedad]" },
                  { label: "Peligro eléctrico", value: "[Peligro eléctrico]" },
                  { label: "Peligro de caídas", value: "[Peligro de caídas]" },
                  { label: "Peligro de atropellos", value: "[Peligro de atropellos]" },
                  { label: "Otro peligro", value: "[Otro peligro]" }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        }
      ],
      "2": [
        {
          type: "registro-fumigacion",
          title: "Registro de Fumigación",
          fileName: "Registro_Fumigacion",
          content: {
            mainTitle: "REGISTRO DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "request-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    dimension: "[Dimensiones de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    dimension: "[Dimensiones de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    dimension: "[Dimensiones de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    dimension: "[Dimensiones de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    dimension: "[Dimensiones de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]"
                  }
                ]
              },
              {
                type: "fumigation-conditions",
                data: [
                  { label: "Temperatura", value: "[Temperatura]" },
                  { label: "Humedad", value: "[Humedad]" },
                  { label: "Peligro eléctrico", value: "[Peligro eléctrico]" },
                  { label: "Peligro de caídas", value: "[Peligro de caídas]" },
                  { label: "Peligro de atropellos", value: "[Peligro de atropellos]" },
                  { label: "Observaciones", value: "[Observaciones]" }
                ]
              },
              {
                type: "supplies-details",
                data: [
                  {
                    product: "Fosfina",
                    quantity: "50 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "5",
                  },
                  {
                    product: "Diatomita",
                    quantity: "20 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "3",
                  },
                  {
                    product: "Aerosol Insecticida",
                    quantity: "10 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "2",
                  },
                  {
                    product: "Trampa de Feromonas",
                    quantity: "5 unidades",
                    dose: "Instalación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "1",
                  },
                  {
                    product: "Equipo de Protección Personal (EPP)",
                    quantity: "5 juegos",
                    dose: "Uso obligatorio durante la fumigación",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "0",
                  }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        },
      ],
      "3": [
        {
          type: "registro-fumigacion",
          title: "Registro de Fumigación",
          fileName: "Registro_Fumigacion",
          content: {
            mainTitle: "REGISTRO DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "request-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    dimension: "[Dimensiones de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    dimension: "[Dimensiones de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    dimension: "[Dimensiones de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    dimension: "[Dimensiones de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    dimension: "[Dimensiones de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]"
                  }
                ]
              },
              {
                type: "fumigation-conditions",
                data: [
                  { label: "Temperatura", value: "[Temperatura]" },
                  { label: "Humedad", value: "[Humedad]" },
                  { label: "Peligro eléctrico", value: "[Peligro eléctrico]" },
                  { label: "Peligro de caídas", value: "[Peligro de caídas]" },
                  { label: "Peligro de atropellos", value: "[Peligro de atropellos]" },
                  { label: "Observaciones", value: "[Observaciones]" }
                ]
              },
              {
                type: "supplies-details",
                data: [
                  {
                    product: "Fosfina",
                    quantity: "50 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "5",
                  },
                  {
                    product: "Diatomita",
                    quantity: "20 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "3",
                  },
                  {
                    product: "Aerosol Insecticida",
                    quantity: "10 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "2",
                  },
                  {
                    product: "Trampa de Feromonas",
                    quantity: "5 unidades",
                    dose: "Instalación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "1",
                  },
                  {
                    product: "Equipo de Protección Personal (EPP)",
                    quantity: "5 juegos",
                    dose: "Uso obligatorio durante la fumigación",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "0",
                  }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        },
        {
          type: "registro-descarpe",
          title: "Registro de Descarpe",
          fileName: "Registro_Descarpe",
          content: {
            mainTitle: "REGISTRO DE DESCARPE",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "lot-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]",
                    ribbonsStatus: "[Estado de cintas de Lote 1]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 1]",
                    ppmFosfine: "[PPM Fosfina de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]",
                    ribbonsStatus: "[Estado de cintas de Lote 2]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 2]",
                    ppmFosfine: "[PPM Fosfina de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]",
                    ribbonsStatus: "[Estado de cintas de Lote 3]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 3]",
                    ppmFosfine: "[PPM Fosfina de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]",
                    ribbonsStatus: "[Estado de cintas de Lote 4]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 4]",
                    ppmFosfine: "[PPM Fosfina de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]",
                    ribbonsStatus: "[Estado de cintas de Lote 5]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 5]",
                    ppmFosfine: "[PPM Fosfina de Lote 5]"
                  }
                ]
              },
              {
                type: "cleanup-conditions",
                data: [
                  { label: "Temperatura", value: "[Temperatura]" },
                  { label: "Humedad", value: "[Humedad]" },
                  { label: "Peligro eléctrico", value: "[Peligro eléctrico]" },
                  { label: "Peligro de caídas", value: "[Peligro de caídas]" },
                  { label: "Peligro de atropellos", value: "[Peligro de atropellos]" },
                  { label: "Otro peligro", value: "[Otro peligro]" }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        },
        {
          type: "certificado-fumigacion",
          title: "Certificado de Fumigación",
          fileName: "Certificado_Fumigacion",
          content: {
            mainTitle: "CERTIFICATE OF FUMIGATION",
            subtitle: `Certificado No. CERT-${codigoReserva}`,
            sections: [
              {
                type: "text",
                content1: "ANECACAO as an approved entity to provide cocoa-beans fumigation services with the certificate",
                content2: "No. 467-E.S.V., has provide the fumigation service under Agrocalidad's fumigation rulers and",
                content3: "regulations in its resolution 024-A."
              },
              {
                type: "grid",
                data: [
                  { label: "Export Company Address", value: "BABAHOYO EXPORT S.A." },
                  { label: "DATE OF THE FUMIGATION", value: new Date().toLocaleDateString() },
                  { label: "FUMIGATED PRODUCT", value: "Cocoa Beans" },
                  { label: "TYPE/CLASS OF BEANS", value: "Fine Flavour" },
                  { label: "LOT No.", value: "LOT-12345" },
                  { label: "NUMBER OF FUMIGATED BAGS", value: "100" },
                  { label: "COUNTRY/DESTINATION CITY", value: "PASIR GUDANG, MALAYSIA" },
                  { label: "CONSIGNEE", value: "Guang Chong Cocoa Manufacturer Sdn. Bhd. Plo 273, Jalan Timal 2, 81700 Pasir Gudang, Johor, Malaysia" },
                  { label: "COMPANY NAME", value: "ANECACAO" },
                  { label: "PERMIT/REGISTRATION", value: "467-E.S.V." },
                  { label: "NAME OF THE TECHNICAL FUMIGATOR", value: "Ing. Cristian Noboa" },
                  { label: "NAME OF THE PRODUCT USED", value: "GASTOXIN" },
                  { label: "FUMIGATION SYSTEM", value: "Piked/Pills" },
                  { label: "TIME FOR ACTION", value: "120 hours" },
                  { label: "APPLIED DOSE", value: "5 grams of Phosphine/Cubic Meter" },
                  { label: "ACTIVE COMPONENT", value: "Aluminum Phosphide - Phosphine" },
                  { label: "ROOM TEMPERATURE", value: "25°C" },
                  { label: "WASTES REMOVED BY", value: "Equaquímica" },
                  { label: "FUMIGATION END DATE", value: new Date().toLocaleDateString() }
                ]
              },
              {
                type: "single-signature",
                signature: "AUTHORIZED SIGNATURE",
              },
              {
                type: "footer"
              }
            ]
          }
        }
      ]
    };
    
    return allDocuments[codigoReserva] || [];
  };

  // Función para obtener documentos basados en datos del reporte
  const getDocumentsFromReport = useMemo(() => {
    const allDocs: Document[] = [];

    // Documentos de solicitud de fumigación
    if (fumigationRequest) {
      console.log('Usando datos de la solicitud de fumigación API para crear documentos');
      try {
        const fumigationRequestDocs = createDocumentsFromFumigationRequest(fumigationRequest);
        allDocs.push(...fumigationRequestDocs);
      } catch (error) {
        console.error('Error procesando solicitud de fumigación:', error);
        setError('Error al procesar los datos de la solicitud de fumigación');
      }
    }
    
    // Documentos de fumigación
    if (fumigationReport) {
      console.log('Usando datos del reporte de fumigación API para crear documentos');
      try {
        const fumigationDocs = createDocumentsFromReport(fumigationReport);
        allDocs.push(...fumigationDocs);
      } catch (error) {
        console.error('Error procesando reporte de fumigación:', error);
        setError('Error al procesar los datos del reporte de fumigación');
      }
    }

    // Documentos de cleanup
    if (cleanupReport) {
      console.log('Usando datos del reporte de cleanup API para crear documentos');
      try {
        const cleanupDocs = createDocumentsFromCleanupReport(cleanupReport);
        allDocs.push(...cleanupDocs);
      } catch (error) {
        console.error('Error procesando reporte de cleanup:', error);
        setError('Error al procesar los datos del reporte de cleanup');
      }
    }

    return allDocs;
  }, [fumigationRequest, fumigationReport, cleanupReport, signatureUrls, signaturesLoadedCount]); // Agregar dependencias de firmas

  const documents = (() => {
    if (fumigationReport || cleanupReport || fumigationRequest) {
      return getDocumentsFromReport;
    }
    if (noDataFound || error) {
      console.log('No hay datos o hay error, retornando array vacío');
      return [];
    }
    console.log('Usando datos simulados para código:', lotId);
    return getDocumentsByReservation(lotId);
  })();

  // Función para renderizar diferentes tipos de secciones
  const renderSection = (section: DocumentSection, index: number) => {
    switch (section.type) {
      case 'company-info':
        return (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {section.data?.map((item: any, i: number) => (
                <p key={`header-item-${i}-${item.label || i}`}><strong>{item.label}:</strong> {item.value}</p>
              ))}
            </div>
          </div>
        );

      case 'header':
        return (
          <div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {section.data?.[0]?.label && (
                <p>
                  <strong>{section.data[0].label}:</strong> {section.data[0].value}
                </p>
              )}
              {section.data?.[1]?.label && (
                <p>
                  <strong>{section.data[1].label}:</strong> {section.data[1].value}
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {section.data?.slice(2).map((item: any, i: number) => (
                <p key={`header-item-${i}-${item.label || i}`}><strong>{item.label}:</strong> {item.value}</p>
              ))}
            </div>
          </div>
        );
      
      case 'lot-request-details':
        return (
          <div>
            <table className="w-full mb-4 border">
              <thead>
                <tr>
                  <th className="p-2" colSpan={6}>Datos de fumigación</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className='p-2'>Fecha</th>
                  <th className='p-2'>Destino</th>
                  <th className='p-2'>Toneladas</th>
                  <th className='p-2'>Calidad</th>
                  <th className='p-2'># de sacos</th>
                  <th className='p-2'># Lote</th>
                </tr>
              </thead>
              <tbody>
                {section.data?.map((value: any, i: number) =>
                  <tr key={`request-${i}-${value.lot || i}`} className="border-b">
                    <td className="p-2 text-center">{value.date}</td>
                    <td className="p-2 text-center">{value.destination}</td>
                    <td className="p-2 text-center">{value.tons}</td>
                    <td className="p-2 text-center">{value.quality}</td>
                    <td className="p-2 text-center">{value.sacks}</td>
                    <td className="p-2 text-center">{value.lot}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'info':
        return (
          <div>
            <h3 className="font-bold mb-2">Información Adicional</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <p className="col-span-1"><strong>{section.data?.[0]?.label}:</strong> {section.data?.[0]?.value}</p>
                <p className="col-span-2 "><strong>{section.data?.[1]?.label}:</strong> {section.data?.[1]?.value}</p>
            </div>
          </div>
        );

      case 'personal-info':
        return (
          <table className="w-full mb-4 border">
            <thead>
              <tr>
                <th className="p-2" colSpan={3}>Personal que interviene</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="p-2">Nombre</th>
                <th className="p-2">Cargo</th>
                <th className="p-2">Firma</th>
              </tr>
            </thead>
            <tbody>
              {section.data?.map((value: any, i: number) => (
                <tr key={`personal-${i}-${value.name || i}`} className="border-b">
                  <td className="p-2 text-center">{value.name}</td>
                  <td className="p-2 text-center">{value.position}</td>
                  <td className="p-2 text-center">{"Firma de " + value.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'request-details':
        return (
          <div>
            <table className="w-full mb-4 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className='p-2' colSpan={2}># de lote</th>
                  <th className='p-2' colSpan={2}>Dimensiones del lote</th>
                  <th className='p-2' colSpan={2}>Toneladas</th>
                  <th className='p-2' colSpan={2}>Calidad</th>
                  <th className='p-2' colSpan={2}># de sacos</th>
                  <th className='p-2' colSpan={2}>Destino</th>
                </tr>
              </thead>
              <tbody>
                {section.data?.map((value: any, i: number) =>
                  <tr key={`request-${i}-${value.lot || i}`} className="border-b">
                    <td className="p-2 text-center" colSpan={2}>{value.lot}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.dimension}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.tons}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.quality}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.sacks}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.destination}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      
      case 'fumigation-conditions':
        return (
          <div>
            <table className="w-full mb-4 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2" colSpan={2}>Condiciones Ambientales</th>
                  <th className="p-2" colSpan={6}>Condiciones de seguridad industrial</th>
                  <th className="p-2" colSpan={4}>Observaciones:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="p-2">Temperatura:</th>
                  <td className="p-2">{section.data?.find((item: any) => item.label === "Temperatura")?.value}</td>
                  <th className="p-2" colSpan={2}>Peligro eléctrico</th>
                  <th className='p-2' colSpan={2}>Peligro de caídas</th>
                  <th className="p-2" colSpan={2}>Peligro de atropellos</th>
                  <td className="p-2 text-center" colSpan={4} rowSpan={2}>{section.data?.find((item: any) => item.label === "Observaciones")?.value}</td>
                </tr>
                <tr>
                  <th className="p-2">Humedad:</th>
                  <td className="p-2">{section.data?.find((item: any) => item.label === "Humedad")?.value}</td>
                  <td className="p-2 text-center" colSpan={2}>{section.data?.find((item: any) => item.label === "Peligro eléctrico")?.value}</td>
                  <td className="p-2 text-center" colSpan={2}>{section.data?.find((item: any) => item.label === "Peligro de caídas")?.value}</td>
                  <td className="p-2 text-center" colSpan={2}>{section.data?.find((item: any) => item.label === "Peligro de atropellos")?.value}</td>
                </tr>
              </tbody>
            </table>
            <caption className="w-full flex justify-end mt-2 text-xs text-gray-600 mb-2">
              Nota: Si las condiciones no son adecuadas, no iniciar la actividad.
            </caption>
          </div>
        );
      
      case 'cleanup-conditions':
        return (
          <div>
            <table className="w-full mb-4 border">
              <thead>
                <tr>
                  <th className="p-2" colSpan={8}>Condiciones de seguridad industrial</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100">
                  <th className="p-2" colSpan={2}>Peligro eléctrico</th>
                  <th className='p-2' colSpan={2}>Peligro de caídas</th>
                  <th className="p-2" colSpan={2}>Peligro de atropellos</th>
                  <th className="p-2" colSpan={2}>Otro peligro</th>
                </tr>
                <tr>
                  <td className="p-2 text-center" colSpan={2}>{section.data?.find((item: any) => item.label === "Peligro eléctrico")?.value}</td>
                  <td className="p-2 text-center" colSpan={2}>{section.data?.find((item: any) => item.label === "Peligro de caídas")?.value}</td>
                  <td className="p-2 text-center" colSpan={2}>{section.data?.find((item: any) => item.label === "Peligro de atropellos")?.value}</td>
                  <td className="p-2 text-center" colSpan={2}>{section.data?.find((item: any) => item.label === "Otro peligro")?.value}</td>
                </tr>
              </tbody>
            </table>
            <caption className="w-full flex justify-end mt-2 text-xs text-gray-600 mb-2">
              Nota: Si las condiciones no son adecuadas, no iniciar la actividad.
            </caption>
          </div>
        );

      case 'supplies-details':
        return (
          <div className="mt-6">
            <table className="w-full mb-4 border">
              <thead>
                <tr>
                  <th className="p-2" colSpan={5}>Insumos utilizados</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="p-2">Producto</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Dosis</th>
                  <th className="p-2">Método de Fumigación</th>
                  <th className="p-2"># Cintas</th>
                </tr>
              </thead>
              <tbody>
                {section.data?.map((item: any, i: number) => (
                  <tr key={`supply-${i}-${item.product || i}`} className="border-b">
                    <td className="p-2 text-center">{item.product}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center">{item.dose}</td>
                    <td className="p-2 text-center">{item.fumigationMethod}</td>
                    <td className="p-2 text-center">{item.ribbonsNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'lot-details':
        return (
          <div>
            <table className="w-full mb-4 border">
              <thead>
                <tr>
                  <th className="p-2" colSpan={8}>Descripción del lote</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className='p-2'># de lote</th>
                  <th className='p-2'>Toneladas</th>
                  <th className='p-2'>Calidad</th>
                  <th className='p-2'># de sacos</th>
                  <th className='p-2'>Destino</th>
                  <th className='p-2'>Estado de cintas</th>
                  <th className='p-2'>Tiempo de Fumigación</th>
                  <th className='p-2'>PPM Fosfina</th>
                </tr>
              </thead>
              <tbody>
                {section.data?.map((value: any, i: number) =>
                  <tr key={`lot-${i}-${value.lot || i}`} className="border-b">
                    <td className="p-2 text-center">{value.lot}</td>
                    <td className="p-2 text-center">{value.tons}</td>
                    <td className="p-2 text-center">{value.quality}</td>
                    <td className="p-2 text-center">{value.sacks}</td>
                    <td className="p-2 text-center">{value.destination}</td>
                    <td className="p-2 text-center">{value.ribbonsStatus}</td>
                    <td className="p-2 text-center">{value.fumigationTime}</td>
                    <td className="p-2 text-center">{value.ppmFosfine}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'grid':
        return (
          <div className='py-25 px-30'>
            {section.data?.map((item: any, i: number) => (
              <div key={`grid-${i}-${item.label || i}`} className="grid grid-cols-2 gap-30">
                <div className="p-2 text-left">
                  <p><strong>{item.label}:</strong></p>
                </div>
                <div className="p-2 text-right">
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <div key={index} className="mt-6">
            <p className="text-center">{section.content1}</p>
            <p className="text-center">{section.content2}</p>
            <p className="text-center">{section.content3}</p>
          </div>
        );
      
      case 'signatures':
        return (
          <div key={index} className="mt-6 grid grid-cols-2 gap-8 signature-section">
            {section.signatures?.map((signature: string | { name: string; imageUrl?: string; signature?: Signature }, i: number) => {
              const signatureName = typeof signature === 'string' ? signature : signature.name;
              const signatureImage = typeof signature === 'string' ? null : signature.imageUrl;
              const signatureObj = typeof signature === 'string' ? null : signature.signature;
              
              // Estados de carga y error para esta firma específica
              const isLoading = signatureObj ? loadingImages[signatureObj.id.toString()] : false;
              const hasError = signatureObj ? imageErrors[signatureObj.id.toString()] : false;

              // Renderizar contenido de la firma
              const renderSignatureContent = () => {
                if (signatureImage) {
                  return (
                    <div className="mb-2">
                      <img 
                        src={signatureImage} 
                        alt={`Firma de ${signatureName}`}
                        className="max-w-full h-20 object-contain mx-auto border-b border-gray-400"
                        onError={(e) => {
                          // Si la imagen falla al cargar, mostrar línea tradicional
                          e.currentTarget.style.display = 'none';
                          const lineDiv = e.currentTarget.nextElementSibling as HTMLElement;
                          if (lineDiv) lineDiv.style.display = 'block';
                        }}
                      />
                      <div className="border-t border-gray-400 pt-2 mt-2 signature-line" style={{ display: 'none' }}>
                        <p className="font-semibold">{signatureName}</p>
                      </div>
                    </div>
                  );
                }
                
                if (isLoading) {
                  return (
                    <div className="mb-2">
                      <div className="border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center justify-center h-20">
                        <div className="text-gray-500 text-sm">Cargando firma...</div>
                      </div>
                    </div>
                  );
                }
                
                if (hasError && signatureObj) {
                  return (
                    <div className="mb-2">
                      <div className="border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center justify-center h-20">
                        <div className="text-red-500 text-sm text-center">
                          Error al cargar la firma
                          <br />
                          <button 
                            onClick={() => signatureObj && loadSignatureImage(signatureObj)}
                            className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                          >
                            Reintentar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Línea de firma tradicional
                return (
                  <div className="border-t border-gray-400 pt-2 mt-16 signature-line">
                    <p className="font-semibold">{signatureName}</p>
                  </div>
                );
              };
              
              return (
                <div key={`signature-${i}-${signatureName.replace(/\s+/g, '-').toLowerCase()}`} className="text-center">
                  {renderSignatureContent()}
                  {signatureImage && (
                    <p className="font-semibold text-sm mt-1">{signatureName}</p>
                  )}
                </div>
              );
            })}
          </div>
        );
      
      case 'single-signature':
        return (
          <div key={index} className="mt-6 grid grid-cols-8 gap-2 text-center signature-section">
            <div className="text-center col-span-3">
              <div className="pt-2 mt-16">
                <p className="font-semibold">DRY SEAL</p>
                <p className="text-xs">ANECACAO</p>
              </div>
            </div>
            <div className='col-span-2'></div>
            <div className="border-t border-gray-400 pt-2 mt-16 signature-line inline-block text-center col-span-2">
              <p className="font-semibold">{section.signature}</p>
            </div>
            <div></div>
          </div>
        );
      
      case 'footer':
        return (
          <div key={index} className="pt-5">
            <p className="text-center">E-mail: <a href={`mailto: administrativo@anecacao.com`}>administrativo@anecacao.com</a></p>
            <p className="text-center">ECUADOR EXPORTS QUALITY</p>
            <p className="text-center">WORLD'S FIRST GROWE OF FINE FLAVOUR COCOA</p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleConvertToPDF = async (documentType: string, elementId: string) => {
    let elementsToHide: HTMLElement[] = [];
    
    try {
      // Obtener el elemento específico del documento
      const element = document.getElementById(elementId);
      if (!element) {
        console.error('Elemento no encontrado:', elementId);
        alert('No se pudo encontrar el documento. Por favor, recarga la página e intenta nuevamente.');
        return;
      }

      console.log('Generando PDF - Verificando firmas cargadas...');
      
      // Verificar que todas las firmas estén cargadas antes de continuar
      const allSignatureImages = element.querySelectorAll('img[alt*="Firma de"]');
      let allSignaturesReady = true;
      let loadingSignaturesCount = 0;
      
      allSignatureImages.forEach((img, index) => {
        const imgElement = img as HTMLImageElement;
        console.log(`Firma ${index + 1}: src=${imgElement.src.substring(0, 50)}..., loaded=${imgElement.complete}, naturalWidth=${imgElement.naturalWidth}`);
        
        if (!imgElement.complete || imgElement.naturalWidth === 0) {
          allSignaturesReady = false;
          loadingSignaturesCount++;
        }
      });

      if (!allSignaturesReady) {
        console.log(`Esperando ${loadingSignaturesCount} firmas por cargar...`);
        // Esperar hasta 5 segundos para que las firmas terminen de cargar
        let attempts = 0;
        const maxAttempts = 50; // 50 x 100ms = 5 segundos
        
        while (!allSignaturesReady && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          allSignaturesReady = true;
          
          allSignatureImages.forEach((img) => {
            const imgElement = img as HTMLImageElement;
            if (!imgElement.complete || imgElement.naturalWidth === 0) {
              allSignaturesReady = false;
            }
          });
          
          attempts++;
        }
        
        if (!allSignaturesReady) {
          console.warn('Algunas firmas no terminaron de cargar, continuando con la generación del PDF...');
        } else {
          console.log('Todas las firmas han cargado correctamente');
        }
      } else {
        console.log('Todas las firmas ya estaban cargadas');
      }

      // USAR LA NUEVA FUNCIÓN DE GENERACIÓN GARANTIZADA
      await generatePDFWithGuaranteedSignatures(element, documentType);
      
    } catch (error: unknown) {
      console.error('Error detallado al generar PDF:', error);
      
      // Asegurar que los elementos se restauren incluso si hay error
      elementsToHide.forEach(el => {
        el.style.display = '';
      });
      
      // Mensaje de error más específico
      let errorMessage = 'Error al generar el PDF. ';
      if (error instanceof Error && error.message.includes('canvas')) {
        errorMessage += 'Problema al capturar el contenido. ';
      }
      errorMessage += 'Por favor, intenta nuevamente o recarga la página.';
      
      alert(errorMessage);
    }
  };

  console.log('Estado actual:', { loading, error, noDataFound, fumigationReport: !!fumigationReport, documents: documents.length });

  return (
    <Layout>
      <main className="flex-1 bg-white overflow-y-scroll scrollbar-hide">
        <div className="px-6 py-4 pb-12">
          <div className="mb-6 no-print">
            <h1 className="text-2xl font-bold text-[#003595] mb-2">
              Documentos de Reserva - {lotId}
            </h1>
            <p className="text-gray-600">
              Gestiona y descarga los documentos relacionados con tu reserva
            </p>
            
            {/* Estados de carga y error */}
            {loading && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">Cargando datos del reporte...</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Error: {error}</p>
              </div>
            )}
            
            {noDataFound && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-yellow-800 font-medium mb-2">No hay reportes disponibles</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  No se encontraron reportes para este lote de fumigación.
                </p>
                <div className="text-sm text-yellow-600">
                  <p><strong>Posibles razones:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>El proceso de fumigación aún no ha sido completado</li>
                    <li>El reporte aún no ha sido generado por los técnicos</li>
                    <li>El lote especificado no existe o fue ingresado incorrectamente</li>
                  </ul>
                  <p className="mt-3 text-yellow-700">
                    <strong>Sugerencia:</strong> Contacta con el equipo técnico para verificar el estado de la fumigación de este lote.
                  </p>
                </div>
              </div>
            )}
            
            {documents.length === 0 && !loading && !error && !noDataFound && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">No hay documentos disponibles para esta reserva.</p>
              </div>
            )}
          </div>

          {/* Renderizado dinámico de documentos */}
          {documents.map((document, docIndex) => (
            <div 
              key={document.type}
              className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 p-6 document-section"
              style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #e5e7eb' }}
            >
              <div className="flex justify-between items-center mb-4 no-print">
                <h2 className="text-xl font-semibold text-[#003595]">
                  {document.title}
                </h2>
                <button
                  onClick={() => handleConvertToPDF(document.fileName, document.type)}
                  className="bg-[#003595] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Convertir a PDF
                </button>
              </div>
              
              <div
                id={document.type}
                className="rounded-lg p-6 bg-gray-50 document-content"
                style={{ backgroundColor: 'white', padding: '24px'}}
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800 document-title">
                    {document.content.mainTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {document.content.subtitle}
                  </p>
                </div>
                
                <div className="space-y-4 text-sm">
                  {document.content.sections.map((section, sectionIndex) => 
                    renderSection(section, sectionIndex)
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Botón para regresar */}
          <div className="text-center mt-8 mb-8 no-print">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Regresar a Reservas
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ReservationDocuments;
