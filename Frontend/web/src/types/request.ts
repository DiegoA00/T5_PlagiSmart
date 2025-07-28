export interface Company {
  id: number;
  name: string;
  businessName: string;
  phoneNumber: string;
  ruc: string;
  address: string;
  legalRepresentative: User;
  cosigner?: string;
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Fumigation {
  id: number;
  lotNumber: string;
  fumigationDate: string;
  portDestination: string;
  tons: number;
  grade: string;
  sacks: number;
  status: string;
  message: string;
  dateTime: string;
  fumigationApplication: FumigationApplication;
}

export interface FumigationApplication {
  id: number;
  company: Company;
  fumigations: Fumigation[];
}

export type Request = {
  id: string;
  service: string;
  client: string;
  date: string;
  tons: number;
  companyName?: string;
  companyLegalName?: string;
  ruc?: string;
  address?: string;
  phone?: string;
  legalRep?: string;
  plantContact?: string;
  consignee?: string;
  lots: Fumigation[];
  applicationData?: FumigationApplication;
};