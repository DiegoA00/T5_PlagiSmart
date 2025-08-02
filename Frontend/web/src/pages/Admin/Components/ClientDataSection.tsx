import { FC } from "react";
import { Request } from "@/types/request";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientDataSectionProps {
  request: Request;
  isLoading: boolean;
}

export const ClientDataSection: FC<ClientDataSectionProps> = ({ request, isLoading }) => {
  return (
    <div>
      <div className="text-base font-semibold mb-2 border-b pb-2 border-[#003595]">
        Datos Generales del Cliente
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
        <div>
          <span className="font-medium">Nombre de la Empresa:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-32 inline-block ml-2" />
          ) : (
            <span className="ml-2">{request.applicationData?.company?.name || "-"}</span>
          )}
        </div>
        
        <div>
          <span className="font-medium">Razón Social:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-32 inline-block ml-2" />
          ) : (
            <span className="ml-2">{request.applicationData?.company?.businessName || "-"}</span>
          )}
        </div>
        
        <div>
          <span className="font-medium">RUC:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-32 inline-block ml-2" />
          ) : (
            <span className="ml-2">{request.applicationData?.company?.ruc || "-"}</span>
          )}
        </div>
        
        <div>
          <span className="font-medium">Dirección:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-32 inline-block ml-2" />
          ) : (
            <span className="ml-2">{request.applicationData?.company?.address || "-"}</span>
          )}
        </div>
        
        <div>
          <span className="font-medium">Teléfono:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-32 inline-block ml-2" />
          ) : (
            <span className="ml-2">{request.applicationData?.company?.phoneNumber || "-"}</span>
          )}
        </div>

        <div>
          <span className="font-medium">Nombre Representante Legal:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-32 inline-block ml-2" />
          ) : (
            <span className="ml-2">
              {request.applicationData?.company?.legalRepresentative ? 
                `${request.applicationData.company.legalRepresentative.firstName || ''} ${request.applicationData.company.legalRepresentative.lastName || ''}`.trim() || "-" : 
                "-"}
            </span>
          )}
        </div>

        {request.applicationData?.company?.cosigner && (
          <div>
            <span className="font-medium">Nombre Cosignatario:</span>
            {isLoading ? (
              <Skeleton className="h-4 w-32 inline-block ml-2" />
            ) : (
              <span className="ml-2">{request.applicationData?.company?.cosigner || "-"}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};