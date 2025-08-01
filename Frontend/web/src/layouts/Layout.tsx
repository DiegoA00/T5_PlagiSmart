import { FC, ReactNode } from 'react';
import { TopBar } from '@/layouts/TopBar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  userImage?: string;
}

export const Layout: FC<LayoutProps> = ({ children, userImage }) => {
  return (
    <div className="h-screen flex flex-col">
      <TopBar userImage={userImage} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};