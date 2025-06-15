
import React from 'react';
import UnifiedSidebar from './UnifiedSidebar';
import { useSidebar } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <div className="flex h-full w-full bg-gradient-to-br from-background via-background/95 to-muted/10">
      <UnifiedSidebar />
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-[70px]' : 'ml-[280px]'
        }`}
      >
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
