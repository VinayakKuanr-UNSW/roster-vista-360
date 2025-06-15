
import React from 'react';
import AppSidebar from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full w-full bg-gradient-to-br from-background via-background/95 to-muted/10">
      <AppSidebar />
      <main className="flex-1 ml-[280px] transition-all duration-300 ease-in-out">
        <div className="p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
