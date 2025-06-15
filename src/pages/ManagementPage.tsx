
import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import OpenBidsPage from '@/components/management/OpenBidsPage';
import { SwapRequestsContent } from '@/components/management/SwapRequestsContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock swap requests data
const mockSwapRequests = [
  {
    id: '1',
    requestor: {
      id: '1',
      name: 'John Smith',
      avatar: 'JS',
      department: 'Operations',
      role: 'Supervisor'
    },
    recipient: {
      id: '2',
      name: 'Jane Doe',
      avatar: 'JD',
      department: 'Operations',
      role: 'Associate'
    },
    department: 'Operations',
    fromDate: '2024-01-15',
    toDate: '2024-01-16',
    status: 'pending' as const,
    submittedOn: '2024-01-10',
    reason: 'Family emergency',
    priority: 'high' as const
  },
  {
    id: '2',
    requestor: {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'MJ',
      department: 'Customer Service',
      role: 'Representative'
    },
    recipient: {
      id: '4',
      name: 'Sarah Wilson',
      avatar: 'SW',
      department: 'Customer Service',
      role: 'Representative'
    },
    department: 'Customer Service',
    fromDate: '2024-01-20',
    toDate: '2024-01-21',
    status: 'approved' as const,
    submittedOn: '2024-01-12',
    reason: 'Vacation request',
    priority: 'medium' as const
  }
];

const ManagementPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [swapRequests, setSwapRequests] = useState(mockSwapRequests);

  // If no type is specified, redirect to the default "bids" page.
  if (!type) {
    return <Navigate to="/management/bids" replace />;
  }

  // Handler that updates the URL when the tab is changed.
  const handleTabChange = (value: string) => {
    navigate(`/management/${value}`, { replace: true });
  };

  const handleUpdateSwapStatus = (id: string, status: "approved" | "rejected") => {
    setSwapRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status }
          : request
      )
    );
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
            <SwapRequestsContent 
              swapRequests={swapRequests}
              onUpdateStatus={handleUpdateSwapStatus}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManagementPage;
