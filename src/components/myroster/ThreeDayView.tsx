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
      <div className="grid grid-cols-[60px_1fr_1fr_1fr] md:grid-cols-[80px_1fr_1fr_1fr] border-b border-gray-800">
        <div className="p-2"></div>
        {days.map((day, i) => (
          <div key={i} className="p-2 text-center">
            <div className="text-sm md:text-base font-medium">{format(day, 'EEE')}</div>
            <div className="text-xs text-gray-400">{format(day, 'd MMM')}</div>
            {isToday(day) && (
              <div className="mt-1 inline-block bg-blue-500/30 text-blue-200 text-xs px-1.5 py-0.5 rounded">
                Today
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="relative h-[calc(100%-3.5rem)] overflow-y-auto">
        <div className="grid grid-cols-[60px_1fr_1fr_1fr] md:grid-cols-[80px_1fr_1fr_1fr]">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-xs text-gray-500 h-14 md:h-16 border-b border-gray-800 flex items-center justify-center">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
              </div>
              <div className="h-14 md:h-16 border-b border-gray-800"></div>
              <div className="h-14 md:h-16 border-b border-gray-800 border-l border-gray-800"></div>
              <div className="h-14 md:h-16 border-b border-gray-800 border-l border-gray-800"></div>
            </React.Fragment>
          ))}
        </div>
        
        {/* Shifts for each day */}
        {days.map((day, dayIndex) => {
          const shifts = getShiftsForDate(day);
          
          return (
            <div 
              key={dayIndex}
              className="absolute top-0 bottom-0"
              style={{ 
                left: `${60 + (dayIndex * ((100 - 60) / 3))}px`, 
                width: `${(100 - 60) / 3}%` 
              }}
            >
              {shifts.map((shiftData, shiftIndex) => {
                const startPos = timeToPosition(shiftData.shift.startTime, 0, 24);
                const endPos = timeToPosition(shiftData.shift.endTime, 0, 24);
                const height = endPos - startPos;
                
                return (
                  <div
                    key={shiftIndex}
                    style={{
                      position: 'absolute',
                      top: `${startPos}%`,
                      left: '3%',
                      right: '3%',
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
          );
        })}
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