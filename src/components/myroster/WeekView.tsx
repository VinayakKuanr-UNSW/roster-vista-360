
import React, { useState } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { Shift } from '@/api/models/types';
import MyRosterShift from './MyRosterShift';
import ShiftDetailsDialog from './ShiftDetailsDialog';
import { timeToPosition } from '@/lib/utils';

interface WeekViewProps {
  date: Date;
  getShiftsForDate: (date: Date) => Array<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  }>;
}

const WeekView: React.FC<WeekViewProps> = ({ date, getShiftsForDate }) => {
  const [selectedShift, setSelectedShift] = useState<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  } | null>(null);
  
  const startDay = startOfWeek(date);
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-800 bg-gray-800/50">
        <div className="p-3"></div>
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`p-3 text-center border-l border-gray-700 ${isToday(day) ? 'bg-blue-900/20' : ''}`}
          >
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className="text-xs text-gray-400">{format(day, 'd')}</div>
            {isToday(day) && (
              <div className="mt-1 inline-block bg-blue-500/30 text-blue-200 text-xs px-1.5 py-0.5 rounded">
                Today
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Time grid and shifts */}
      <div className="relative h-[calc(100%-4rem)] overflow-y-auto">
        {/* Time grid background */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-xs text-gray-500 h-16 border-b border-gray-800 flex items-center justify-center bg-gray-800/30">
                {hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour-12}p`}
              </div>
              {days.map((_, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className="h-16 border-b border-gray-800 border-l border-gray-700"
                ></div>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        {/* Shifts overlay */}
        <div className="absolute top-0 left-20 right-0 bottom-0 grid grid-cols-7 gap-px">
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
                        minHeight: '32px'
                      }}
                    >
                      <MyRosterShift
                        shift={shiftData.shift}
                        groupName={shiftData.groupName}
                        groupColor={shiftData.groupColor}
                        subGroupName={shiftData.subGroupName}
                        onClick={() => setSelectedShift(shiftData)}
                        style={{ height: '100%' }}
                        compact={true}
                      />
                    </div>
                  );
                })}
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

export default WeekView;
