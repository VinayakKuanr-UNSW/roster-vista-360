
import React from 'react';
import { Shift } from '@/api/models/types';
import { formatTime } from '@/lib/utils';

interface MyRosterShiftProps {
  shift: Shift;
  groupName: string;
  groupColor: string;
  subGroupName: string;
  compact?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const MyRosterShift: React.FC<MyRosterShiftProps> = ({
  shift,
  groupName,
  groupColor,
  subGroupName,
  compact = false,
  onClick,
  style
}) => {
  const getColorClass = () => {
    switch (groupColor) {
      case 'blue':
        return 'bg-blue-500/90 hover:bg-blue-500 border-blue-400/30';
      case 'green':
        return 'bg-green-500/90 hover:bg-green-500 border-green-400/30';
      case 'red':
        return 'bg-red-500/90 hover:bg-red-500 border-red-400/30';
      case 'purple':
        return 'bg-purple-500/90 hover:bg-purple-500 border-purple-400/30';
      case 'orange':
        return 'bg-orange-500/90 hover:bg-orange-500 border-orange-400/30';
      case 'yellow':
        return 'bg-yellow-500/90 hover:bg-yellow-500 border-yellow-400/30';
      default:
        return 'bg-purple-500/90 hover:bg-purple-500 border-purple-400/30';
    }
  };
  
  // For month view - ultra compact
  if (compact) {
    return (
      <div 
        className={`rounded border text-white text-xs cursor-pointer transition-all duration-200 flex items-center justify-center px-1 py-0.5 ${getColorClass()}`}
        onClick={(e) => onClick && onClick(e)}
        style={style}
      >
        <div className="font-medium truncate text-center leading-tight">
          {shift.role}
        </div>
      </div>
    );
  }
  
  // For day/3-day/week view - full details
  return (
    <div 
      className={`rounded border text-white cursor-pointer transition-all duration-200 p-3 shadow-sm ${getColorClass()}`}
      onClick={() => onClick && onClick()}
      style={style}
    >
      <div className="font-medium text-sm mb-1 leading-tight">{shift.role}</div>
      <div className="text-xs mb-2 opacity-90 leading-tight">{subGroupName}</div>
      <div className="text-xs opacity-90 leading-tight">
        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
      </div>
    </div>
  );
};

export default MyRosterShift;
