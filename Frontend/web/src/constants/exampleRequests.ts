import { Request } from "@/types/request";

export const REQUESTS: Request[] = [
  {
    id: "#12345",
    service: "Residential Fumigation",
    client: "Sophia Carter",
    date: "2024-03-15",
    tons: 2,
    companyName: "AgroExportadores S.A.",
    companyLegalName: "AgroExportadores S.A. de C.V.",
    ruc: "12345678901",
    address: "Av. Principal 123, Zona Industrial, Ciudad Capital",
    phone: "+51 987 654 321",
    legalRep: "Juan Pérez Rodríguez",
    plantContact: "Ana Gómez López (Planta)",
    consignee: "Importadora Global Ltd.",
    lots: [
      {
        id: "ABC001",
        fumigationDate: "2023-10-15 08:00",
        destinationPort: "Puerto de Rotterdam",
        tons: 25,
        grade: "Grado A Premium",
        sacks: 500,
      },
      {
        id: "XYZ789",
        fumigationDate: "2023-10-18 14:30",
        destinationPort: "Puerto de Hamburgo",
        tons: 30,
        grade: "Grado B Estándar",
        sacks: 600,
      },
    ],
  },
];