export interface LotStatus {
  id: string;
  client?: string;
  service?: string;
  fumigationDate: string;
  destinationPort: string;
  tons: number;
  grade: string;
  sacks: number;
  status: 'pending' | 'in_progress' | 'completed';
  evidence?: {
    fumigation?: {
      photos: string[];
      notes: string;
    };
    uncovering?: {
      photos: string[];
      notes: string;
    };
  };
}

export interface CompletedLot extends LotStatus {
  certificateId?: string;
  completionDate: string;
  uncoveringDate: string;
}