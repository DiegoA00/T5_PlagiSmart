import { FC } from "react";

interface Column {
  header: string;
  key: string;
  render?: (value: any) => React.ReactNode;
}

interface Action {
  label: string;
  onClick: (item: any) => void;
  variant?: "primary" | "secondary" | "outline";
}

interface BaseTableProps {
  data: any[];
  columns: Column[];
  actions: Action[];
}

export const BaseTable: FC<BaseTableProps> = ({ data, columns, actions }) => {
  // Mapea las variantes a clases de tailwind
  const getButtonClass = (variant?: string) => {
    switch (variant) {
      case "primary":
        return "bg-[#003595] text-white hover:bg-[#00295e]";
      case "secondary":
        return "bg-gray-100 text-[#003595] hover:bg-gray-200";
      case "outline":
      default:
        return "border border-[#003595] text-[#003595] hover:bg-blue-50";
    }
  };

  const getShortLabel = (label: string) => {
    if (label.toLowerCase().includes("ver más") || label.toLowerCase().includes("información")) 
      return "Detalles";
    if (label.toLowerCase().includes("evidencia") || label.toLowerCase().includes("fotos")) 
      return "Evidencias";
    if (label.toLowerCase().includes("certificado")) 
      return "Certificado";
    return label;
  };

  return (
    <div className="overflow-auto rounded-lg border border-[#003595]">
      <table className="min-w-full bg-white text-sm" role="table">
        <thead className="bg-[#003595] text-left text-white">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3">
                {column.header}
              </th>
            ))}
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-[#003595] hover:bg-[#E6ECF7]">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-2">
                  {column.render ? column.render(item[column.key]) : item[column.key]}
                </td>
              ))}
              <td className="px-4 py-2">
                <div className="flex justify-center gap-2">
                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => action.onClick(item)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${getButtonClass(action.variant)}`}
                      title={action.label}
                    >
                      {getShortLabel(action.label)}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};