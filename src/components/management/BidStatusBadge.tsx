
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BidStatusBadgeProps {
  status: string;
}

const BidStatusBadge: React.FC<BidStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Approved':
        return 'bg-green-500 hover:bg-green-600';
      case 'Confirmed':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Rejected':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Badge className={`${getStatusColor()} text-xs font-medium`}>
      {status}
    </Badge>
  );
};

export default BidStatusBadge;
