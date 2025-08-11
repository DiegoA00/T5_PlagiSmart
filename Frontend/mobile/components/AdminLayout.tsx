import React from 'react';
import AppLayout from './AppLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

// AdminLayout ahora es solo un wrapper del AppLayout genérico
// Mantiene la compatibilidad con el código existente
export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <AppLayout title={title}>
      {children}
    </AppLayout>
  );
}