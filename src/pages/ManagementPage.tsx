
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import OpenBidsPage from '@/components/management/OpenBidsPage';
import { SwapRequestsContent } from '@/components/management/SwapRequestsContent';

// Define the swap request type
interface SwapRequest {
  id: string;
  requestor: {
    id: string;
    name: string;
    avatar: string;
    department: string;
    role: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar: string;
    department: string;
    role: string;
  };
  department: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedOn: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

// Mock swap requests data
const mockSwapRequests: SwapRequest[] = [
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
    status: 'pending',
    submittedOn: '2024-01-10',
    reason: 'Family emergency',
    priority: 'high'
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
    status: 'approved',
    submittedOn: '2024-01-12',
    reason: 'Vacation request',
    priority: 'medium'
  }
];

const ManagementPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(mockSwapRequests);

  // If no type is specified, redirect to the default "bids" page.
  if (!type) {
    return <Navigate to="/management/bids" replace />;
  }

  const handleUpdateSwapStatus = (id: string, status: "approved" | "rejected") => {
    setSwapRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status }
          : request
      )
    );
  };

  // Main route-based rendering
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        {type === 'bids' && <OpenBidsPage />}
        {type === 'swaps' && (
          <SwapRequestsContent 
            swapRequests={swapRequests}
            onUpdateStatus={handleUpdateSwapStatus}
          />
        )}
        {(type !== 'bids' && type !== 'swaps') && (
          <Navigate to="/management/bids" replace />
        )}
      </main>
    </div>
  );
};

export default ManagementPage;

