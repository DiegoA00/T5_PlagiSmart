import { FC, ReactNode } from "react";

export const Overlay: FC<{ open: boolean; onClose: () => void; children: ReactNode }> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl flex flex-col overflow-hidden"
        style={{
          maxHeight: "90vh",
          height: "fit-content",
          minHeight: "200px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-2xl text-[#003595] hover:text-[#002060] transition-colors z-10"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};