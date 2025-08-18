import { CertificateResponse, CertificateData, CertificateTemplate, CertificateField } from '@/types/certificate';
import apiClient from './api/apiService';

class CertificateService {
  private spanishTemplate: CertificateField[] = [
    { key: 'companyName', label: 'RAZÓN SOCIAL EMPRESA EXPORTADORA', value: '' },
    { key: 'fumigationDate', label: 'FECHA DE FUMIGACIÓN', value: '' },
    { key: 'productName', label: 'PRODUCTO FUMIGADO', value: '' },
    { key: 'quality', label: 'TIPO/CLASE DE CACAO', value: '' },
    { key: 'lotNumber', label: 'No. LOTE', value: '' },
    { key: 'numberOfBags', label: 'NUMERO DE SACOS FUMIGADOS', value: '' },
    { key: 'portDestination', label: 'PAÍS/CIUDAD DE DESTINO', value: '' },
    { key: 'consignee', label: 'NOMBRE DE LA EMPRESA FUMIGADORA', value: 'ANECACAO' },
    { key: 'permit', label: 'PERMISO/MATRÍCULA', value: '467-E.S.V.' },
    { key: 'fumigatorName', label: 'NOMBRE DEL TÉCNICO FUMIGADOR', value: 'Ing. Cristian Noboa' },
    { key: 'productUsed', label: 'NOMBRE DEL PRODUCTO UTILIZADO', value: '' },
    { key: 'fumigationSystem', label: 'SISTEMA DE FUMIGACIÓN', value: '' },
    { key: 'actionTime', label: 'TIEMPO DE ACCIÓN', value: '' },
    { key: 'appliedDosage', label: 'DOSIS APLICADA', value: '' },
    { key: 'activeComponent', label: 'COMPONENTE ACTIVO', value: 'Fosfuro de Aluminio - Fosfina' },
    { key: 'ambientTemperature', label: 'TEMPERATURA AMBIENTE', value: '' },
    { key: 'phosphineMeasurement', label: 'MEDICIÓN DE FOSFINA', value: '' },
    { key: 'wastesRemovedBy', label: 'RESIDUOS RETIRADOS POR', value: 'Ecuaquímica' },
    { key: 'cleanUpDate', label: 'FECHA FINALIZACION FUMIGACION', value: '' }
  ];

  private englishTemplate: CertificateField[] = [
    { key: 'companyName', label: 'EXPORT COMPANY ADDRESS', value: '' },
    { key: 'fumigationDate', label: 'DATE OF THE FUMIGATION', value: '' },
    { key: 'productName', label: 'FUMIGATED PRODUCT', value: '' },
    { key: 'quality', label: 'TYPE/CLASS OF BEANS', value: '' },
    { key: 'lotNumber', label: 'LOT NO', value: '' },
    { key: 'numberOfBags', label: 'NUMBER OF FUMIGATED BAGS', value: '' },
    { key: 'portDestination', label: 'COUNTRY/DESTINATION CITY', value: '' },
    { key: 'companyName2', label: 'ANECACAO', value: 'ANECACAO' },
    { key: 'permit', label: 'PERMIT/REGISTRATION', value: '467-E.S.V.' },
    { key: 'fumigatorName', label: 'NAME OF THE TECHNICAL FUMIGATOR', value: 'Ing. Cristian Noboa' },
    { key: 'productUsed', label: 'NAME OF THE PRODUCT USED', value: '' },
    { key: 'fumigationSystem', label: 'FUMIGATING SYSTEM', value: '' },
    { key: 'actionTime', label: 'TIME FOR ACTION', value: '' },
    { key: 'appliedDosage', label: 'APPLIED DOSE', value: '' },
    { key: 'activeComponent', label: 'ACTIVE COMPONENT', value: 'Aluminum Phosphide - Phosphine' },
    { key: 'ambientTemperature', label: 'ROOM TEMPERATURE', value: '' },
    { key: 'phosphineMeasurement', label: 'PHOSPHINE MEASUREMENT', value: '' },
    { key: 'wastesRemovedBy', label: 'WASTES REMOVED BY', value: 'Ecuaquímica' },
    { key: 'cleanUpDate', label: 'FUMIGATION END DATE', value: '' }
  ];

  async getCertificateData(fumigationId: number): Promise<CertificateResponse> {
    try {
      const response = await apiClient.get(`/reports/certificate/by-fumigation/${fumigationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certificate data:', error);
      throw error;
    }
  }

  generateTemplate(data: CertificateResponse, language: 'es' | 'en' = 'es'): CertificateField[] {
    const template = language === 'es' ? this.spanishTemplate : this.englishTemplate;
    
    return template.map(field => ({
      ...field,
      value: this.getFieldValue(field.key, data, language)
    }));
  }

  private getFieldValue(key: string, data: CertificateResponse, language: 'es' | 'en'): string {
    const fixedValues: Record<string, Record<string, string>> = {
      es: {
        consignee: 'ANECACAO',
        permit: '467-E.S.V.',
        fumigatorName: 'Ing. Cristian Noboa',
        activeComponent: 'Fosfuro de Aluminio - Fosfina',
        wastesRemovedBy: 'Ecuaquímica'
      },
      en: {
        companyName2: 'ANECACAO',
        permit: '467-E.S.V.',
        fumigatorName: 'Ing. Cristian Noboa',
        activeComponent: 'Aluminum Phosphide - Phosphine',
        wastesRemovedBy: 'Ecuaquímica'
      }
    };

    if (fixedValues[language]?.[key]) {
      return fixedValues[language][key];
    }

    switch (key) {
      case 'companyName':
        return data.companyName || '';
      case 'fumigationDate':
        return this.formatDate(data.fumigationDate, language);
      case 'productName':
        return language === 'es' ? 'Cacao en grano' : 'Cocoa Beans';
      case 'quality':
        return data.quality || '';
      case 'lotNumber':
        return data.lotNumber ? `#${data.lotNumber}` : '';
      case 'numberOfBags':
        const bagsText = language === 'es' ? 'sacos' : 'bags';
        return `1450 ${bagsText}`;
      case 'portDestination':
        return data.portDestination || '';
      case 'productUsed':
        return data.productName || '';
      case 'fumigationSystem':
        if (data.fumigationSystem) {
          return language === 'es' ? 'Carpado/Pastillas' : 'Piked / Pills';
        }
        return '';
      case 'actionTime':
        return data.actionTime ? `${data.actionTime} ${language === 'es' ? 'horas' : 'hours'}` : '';
      case 'appliedDosage':
        const dosageText = language === 'es' 
          ? 'gramos de Fosfina / Metro Cúbico'
          : 'grams of Phosphine / Cubic Meter';
        return data.appliedDosage ? `${data.appliedDosage} ${dosageText}` : '';
      case 'ambientTemperature':
        return data.ambientTemperature ? `${data.ambientTemperature} °C` : '';
      case 'phosphineMeasurement':
        return data.phosphineMeasurement ? `${data.phosphineMeasurement} PPM` : '';
      case 'cleanUpDate':
        return this.formatEndDate(data.cleanUpDate, language);
      default:
        return '';
    }
  }

  private formatDate(dateString: string, language: 'es' | 'en'): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString);
        return dateString;
      }
      
      if (language === 'es') {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${dayName} ${day} de ${month} del ${year}`;
      } else {
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  private formatEndDate(dateString: string, language: 'es' | 'en'): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString);
        return dateString;
      }
      
      if (language === 'es') {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${dayName} ${day} de ${month} del ${year}`;
      } else {
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return `${formattedDate}`;
      }
    } catch (error) {
      console.error('Error formatting end date:', error);
      return dateString;
    }
  }

  formatTemplateForCopy(template: CertificateField[]): string {
    return template
      .map(field => `${field.label}: ${field.value}`)
      .join('\n');
  }
}

export const certificateService = new CertificateService();