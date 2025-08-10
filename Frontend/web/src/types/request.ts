export interface Company {
  id: number;
  name: string;
  businessName: string;
  phoneNumber: string;
  ruc: string;
  address: string;
  legalRepresentative?: LegalRepresentative;
  cosigner?: string;
}

export interface LegalRepresentative {
  id: number;
  firstName: string;
  lastName: string;
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
  ton: number;
  portDestination: string;
  sacks: number;
  quality: string;
  status: string;
  message: string;
  dateTime: string;
  fumigationApplication?: FumigationApplication;
}

export interface FumigationApplication {
  id: number;
  company: Company;
  fumigations: Fumigation[];
  createdAt?: string;
}

export interface PageableRequest {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageableSort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface PageableInfo {
  offset: number;
  sort: PageableSort;
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: PageableSort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableInfo;
  empty: boolean;
}

export interface ApiFumigationApplication {
  id: number;
  companyName: string;
  representative: string;
  location: string;
  localDate: string;
  status: string;
}

export interface FumigationListItem {
  id: number;
  lotNumber: string;
  companyName: string;
  representative: string;
  phoneNumber: string;
  location: string;
  plannedDate: string;
}

export interface FumigationDetailResponse {
  company: {
    id: number;
    name: string;
    businessName: string;
    phoneNumber: string;
    ruc: string;
    address: string;
  };
  lot: {
    id: number;
    lotNumber: string;
    tons: number;
    quality: string;
    sacks: number;
    portDestination: string;
  };
  representative: string;
  plannedDate: string;
}

export interface ApiUser {
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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