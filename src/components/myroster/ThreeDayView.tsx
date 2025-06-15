
import React, { useState } from 'react';
import { format, addDays, isToday } from 'date-fns';
import { Shift } from '@/api/models/types';
import MyRosterShift from './MyRosterShift';
import ShiftDetailsDialog from './ShiftDetailsDialog';
import { timeToPosition } from '@/lib/utils';

interface ThreeDayViewProps {
  startDate: Date;
  getShiftsForDate: (date: Date) => Array<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  }>;
}

const ThreeDayView: React.FC<ThreeDayViewProps> = ({ 
  startDate, 
  getShiftsForDate 
}) => {
  const [selectedShift, setSelectedShift] = useState<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  } | null>(null);
  
  const days = [
    startDate,
    addDays(startDate, 1),
    addDays(startDate, 2)
  ];
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-[80px_repeat(3,1fr)] border-b border-gray-800 bg-gray-800/50">
        <div className="p-3"></div>
        {days.map((day, i) => (
          <div key={i} className="p-3 text-center border-l border-gray-700">
            <div className="text-base font-medium">{format(day, 'EEE')}</div>
            <div className="text-sm text-gray-400">{format(day, 'd MMM')}</div>
            {isToday(day) && (
              <div className="mt-1 inline-block bg-blue-500/30 text-blue-200 text-xs px-2 py-1 rounded-full">
                Today
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Time grid and shifts */}
      <div className="relative h-[calc(100%-4.5rem)] overflow-y-auto">
        {/* Time grid background */}
        <div className="grid grid-cols-[80px_repeat(3,1fr)]">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-xs text-gray-500 h-16 border-b border-gray-800 flex items-center justify-center bg-gray-800/30">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
              </div>
              <div className="h-16 border-b border-gray-800 border-l border-gray-700"></div>
              <div className="h-16 border-b border-gray-800 border-l border-gray-700"></div>
              <div className="h-16 border-b border-gray-800 border-l border-gray-700"></div>
            </React.Fragment>
          ))}
        </div>
        
        {/* Shifts overlay */}
        <div className="absolute top-0 left-20 right-0 bottom-0 grid grid-cols-3 gap-px">
          {days.map((day, dayIndex) => {
            const shifts = getShiftsForDate(day);
            
            return (
              <div key={dayIndex} className="relative">
                {shifts.map((shiftData, shiftIndex) => {
                  const startPos = timeToPosition(shiftData.shift.startTime, 0, 24);
                  const endPos = timeToPosition(shiftData.shift.endTime, 0, 24);
                  const height = endPos - startPos;
                  
                  return (
                    <div
                      key={shiftIndex}
                      className="absolute left-1 right-1"
                      style={{
                        top: `${startPos}%`,
                        height: `${Math.max(height, 3)}%`,
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
                
                {shifts.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs text-gray-500 text-center">
                      No shifts
                    </div>
                  </div>
                )}
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

export default ThreeDayView;
