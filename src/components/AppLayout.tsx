
import React from 'react';
import AppSidebar from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto ml-[280px] transition-all">
        <div className="p-8 min-h-screen bg-gradient-to-br from-background to-muted/20">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
