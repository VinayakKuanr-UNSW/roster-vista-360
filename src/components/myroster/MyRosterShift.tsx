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
        return 'bg-blue-500/90 hover:bg-blue-500/100';
      case 'green':
        return 'bg-green-500/90 hover:bg-green-500/100';
      case 'red':
        return 'bg-red-500/90 hover:bg-red-500/100';
      default:
        return 'bg-purple-500/90 hover:bg-purple-500/100';
    }
  };
  
  // For month view
  if (compact) {
    return (
      <div 
        className={`rounded p-1 text-white text-xs cursor-pointer ${getColorClass()}`}
        onClick={(e) => onClick && onClick(e)}
        style={style}
      >
        <div className="font-medium truncate">{shift.role}</div>
        <div className="opacity-80 text-[10px] truncate">{formatTime(shift.startTime)}</div>
      </div>
    );
  }
  
  // For day/3-day/week view
  return (
    <div 
      className={`rounded p-2 text-white cursor-pointer transition-all ${getColorClass()}`}
      onClick={() => onClick && onClick()}
      style={style}
    >
      <div className="font-medium text-sm">{shift.role}</div>
      <div className="text-xs mt-1">{subGroupName}</div>
      <div className="text-xs mt-1 opacity-90">
        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
      </div>
    </div>
  );
};

export default MyRosterShift;