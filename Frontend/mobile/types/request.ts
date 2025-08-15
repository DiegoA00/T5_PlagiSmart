export interface ApiFumigationApplication {
  id: number;
  companyName: string;
  representative: string;
  location: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactInfo?: string;
  estimatedVolume?: string;
  preferredDate?: string;
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

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface ApiLot {
  id: number;
  name: string;
  location: string;
  status: 'IN_SERVICE' | 'FINISHED' | 'PENDING';
  assignedTechnician?: string;
  startDate?: string;
  estimatedEndDate?: string;
  companyName: string;
}

export interface ApiService {
  id: number;
  lotName: string;
  companyName: string;
  technician: string;
  completionDate: string;
  status: 'FINISHED';
  notes?: string;
}

export interface PageableRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ApiCompany {
  id: number;
  businessName: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface ApiLotDetail {
  id: number;
  lotNumber: string;
  tons: number;
  quality: string;
  sacks: number;
  portDestination: string;
}

export interface FumigationDetailResponse {
  lot: ApiLotDetail;
  company: ApiCompany;
  plannedDate: string;
  status: string;
}

export interface FumigationReportResponse {
  id: number;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  supervisor: string;
  technicians: Array<{ id: number; name: string }>;
  supplies: Array<{
    name: string;
    quantity: number;
    dosage: string;
    kindOfSupply: string;
    numberOfStrips: string;
  }>;
  dimensions: {
    height: number;
    width: number;
    length: number;
  };
  environmentalConditions: {
    temperature: number;
    humidity: number;
  };
  industrialSafetyConditions: {
    electricDanger: boolean;
    fallingDanger: boolean;
    hitDanger: boolean;
  };
  observations: string;
  signatures: {
    technician: string;
    client: string;
  };
}

export interface CleanupReportResponse {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  supervisor: string;
  technicians: Array<{ id: number; name: string }>;
  lotDescription: {
    stripsState: string;
    fumigationTime: number;
    ppmFosfina: number;
  };
  industrialSafetyConditions: {
    electricDanger: boolean;
    fallingDanger: boolean;
    hitDanger: boolean;
    otherDanger: boolean;
  };
  signatures: {
    technician: string;
    client: string;
  };
}