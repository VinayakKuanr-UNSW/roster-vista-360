
import React from 'react';

interface BidStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

export const BidStatusBadge: React.FC<BidStatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-gray-500/20';
  let textColor = 'text-gray-300';
  let borderColor = 'border-gray-500/30';
  
  switch (status) {
    case 'approved':
      bgColor = 'bg-green-500/20';
      textColor = 'text-green-300';
      borderColor = 'border-green-500/30';
      break;
    case 'rejected':
      bgColor = 'bg-red-500/20';
      textColor = 'text-red-300';
      borderColor = 'border-red-500/30';
      break;
    case 'pending':
      bgColor = 'bg-yellow-500/20';
      textColor = 'text-yellow-300';
      borderColor = 'border-yellow-500/30';
      break;
  }
  
  const getStatusText = () => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        // TypeScript should know that status can only be one of the three options,
        // but we'll provide a fallback just in case
        return status;
    }
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bgColor} ${textColor} border ${borderColor} mt-1`}>
      {getStatusText()}
    </span>
  );
};
