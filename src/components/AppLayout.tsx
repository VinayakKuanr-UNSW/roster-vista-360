
import React from 'react';
import UnifiedSidebar from './UnifiedSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full w-full">
      <UnifiedSidebar />
      <main className="flex-1 overflow-auto ml-[70px] md:ml-[70px] lg:ml-[70px] transition-all">
        <div className="p-6 min-h-screen">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
