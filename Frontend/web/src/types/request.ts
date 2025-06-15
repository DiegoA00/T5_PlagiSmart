export type Lot = {
  id: string;
  fumigationDate: string;
  destinationPort: string;
  tons: number;
  grade: string;
  sacks: number;
};

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
  lots: Lot[];
};