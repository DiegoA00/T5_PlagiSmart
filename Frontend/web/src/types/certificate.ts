export interface CertificateResponse {
  companyName: string;
  fumigationDate: string;
  quality: string;
  lotNumber: string;
  portDestination: string;
  productName: string;
  fumigationSystem: string;
  actionTime: number;
  appliedDosage: string;
  ambientTemperature: number;
  phosphineMeasurement: number;
  cleanUpDate: string;
}

export interface CertificateField {
  key: string;
  label: string;
  value: string;
  editable?: boolean;
}

export interface CertificateTemplate {
  spanish: CertificateField[];
  english: CertificateField[];
}

export interface CertificateData {
  companyName: string;
  fumigationDate: string;
  quality: string;
  lotNumber: string;
  portDestination: string;
  productName: string;
  fumigationSystem: string;
  actionTime: string;
  appliedDosage: string;
  ambientTemperature: string;
  phosphineMeasurement: string;
  cleanUpDate: string;
  consignee: string;
  fumigatorName: string;
  productUsed: string;
  activeComponent: string;
  wastesRemovedBy: string;
}