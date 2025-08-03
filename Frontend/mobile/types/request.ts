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
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
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