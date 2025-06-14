
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getShiftStatusColor } from './utils/displayUtils';

interface ShiftStatusBadgeProps {
  status: string;
  className?: string;
}

const ShiftStatusBadge: React.FC<ShiftStatusBadgeProps> = ({ status, className = '' }) => {
  return (
    <Badge 
      variant="outline" 
      className={`${getShiftStatusColor(status)} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </Badge>
  );
};

export default ShiftStatusBadge;
