import React, { useState } from 'react';
import { format, isToday } from 'date-fns';
import { Shift } from '@/api/models/types';
import MyRosterShift from './MyRosterShift';
import ShiftDetailsDialog from './ShiftDetailsDialog';
import { timeToPosition } from '@/lib/utils';

interface DayViewProps {
  date: Date;
  shifts: Array<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  }>;
}

const DayView: React.FC<DayViewProps> = ({ date, shifts }) => {
  const [selectedShift, setSelectedShift] = useState<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  } | null>(null);
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-base md:text-lg font-medium flex items-center">
          {format(date, 'EEEE, MMMM d')}
          {isToday(date) && <span className="ml-2 text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded">Today</span>}
        </h3>
      </div>
      
      <div className="relative h-[calc(100%-3rem)] overflow-y-auto">
        {/* Time indicators */}
        <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr]">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-xs text-gray-500 h-14 md:h-16 border-b border-gray-800 flex items-center justify-center">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
              </div>
              <div className="h-14 md:h-16 border-b border-gray-800"></div>
            </React.Fragment>
          ))}
        </div>
        
        {/* Shifts */}
        <div className="absolute top-0 left-[60px] md:left-[80px] right-0 bottom-0">
          {shifts.map((shiftData, index) => {
            const startPos = timeToPosition(shiftData.shift.startTime, 0, 24);
            const endPos = timeToPosition(shiftData.shift.endTime, 0, 24);
            const height = endPos - startPos;
            
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: `${startPos}%`,
                  left: '1%',
                  right: '1%',
                  height: `${height}%`,
                  minHeight: '40px'
                }}
              >
                <MyRosterShift
                  shift={shiftData.shift}
                  groupName={shiftData.groupName}
                  groupColor={shiftData.groupColor}
                  subGroupName={shiftData.subGroupName}
                  onClick={() => setSelectedShift(shiftData)}
                  style={{ height: '100%' }}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <ShiftDetailsDialog
        isOpen={!!selectedShift}
        onClose={() => setSelectedShift(null)}
        shift={selectedShift || undefined}
      />
    </div>
  );
};

export default DayView;