import { FC } from "react";
import { ValidationErrors } from "../hooks/useFumigationData";

interface ValidationErrorListProps {
  errors: ValidationErrors;
}

export const ValidationErrorList: FC<ValidationErrorListProps> = ({ errors }) => {
  const errorMessages = Object.values(errors).filter(Boolean);
  
  if (errorMessages.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-2">
        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <h3 className="text-red-800 font-medium">Por favor, corrija los siguientes errores:</h3>
      </div>
      <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
        {errorMessages.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};