import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import OpenBidsPage from '@/components/management/OpenBidsPage';
import { SwapRequestsContent } from '@/components/management/SwapRequestsContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ManagementPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  // If no type is specified, redirect to the default "bids" page.
  if (!type) {
    return <Navigate to="/management/bids" replace />;
  }

  // Handler that updates the URL when the tab is changed.
  const handleTabChange = (value: string) => {
    navigate(`/management/${value}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        <Tabs
          defaultValue={type}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-6 bg-white/5 border border-white/10">
            <TabsTrigger
              value="bids"
              className="data-[state=active]:bg-white/10"
            >
              Open Bids
            </TabsTrigger>
            <TabsTrigger
              value="swaps"
              className="data-[state=active]:bg-white/10"
            >
              Swap Requests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bids">
            <OpenBidsPage />
          </TabsContent>
          
          <TabsContent value="swaps">
            <SwapRequestsContent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManagementPage;
