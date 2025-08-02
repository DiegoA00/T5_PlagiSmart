import { FC, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  required?: boolean;
  children: React.ReactNode;
}

export const CollapsibleSection: FC<CollapsibleSectionProps> = ({ 
  title, 
  defaultOpen = false,
  required = false,
  children 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border rounded-md mb-4">
      <div 
        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
};