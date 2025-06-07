import { FC, ReactNode } from "react";

export const Overlay: FC<{ open: boolean; onClose: () => void; children: ReactNode }> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 p-0 flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-2xl text-white"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};