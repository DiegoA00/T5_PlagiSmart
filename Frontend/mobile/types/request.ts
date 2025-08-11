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
  status: 'IN_SERVICE' | 'COMPLETED' | 'PENDING';
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
  status: 'COMPLETED';
  notes?: string;
}