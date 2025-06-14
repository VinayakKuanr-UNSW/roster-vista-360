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
  
  const colWidth = (100 - 60) / 7; // 60px for time column, rest divided by 7 days
  
  return (
    <div className="h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-800">
        <div className="p-2"></div>
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`p-2 text-center ${isToday(day) ? 'bg-blue-900/20' : ''}`}
          >
            <div className="text-xs md:text-sm font-medium">{format(day, 'EEE')}</div>
            <div className="text-xs text-gray-400">{format(day, 'd')}</div>
          </div>
        ))}
      </div>
      
      <div className="relative h-[calc(100%-2.5rem)] overflow-y-auto">
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-xs text-gray-500 h-12 md:h-14 border-b border-gray-800 flex items-center justify-center">
                {hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour-12}p`}
              </div>
              {days.map((_, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`h-12 md:h-14 border-b border-gray-800 ${dayIndex > 0 ? 'border-l border-gray-800' : ''}`}
                ></div>
              ))}
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
                left: `${60 + (dayIndex * colWidth)}px`, 
                width: `${colWidth}%` 
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
                      minHeight: '30px'
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
      
      <ShiftDetailsDialog
        isOpen={!!selectedShift}
        onClose={() => setSelectedShift(null)}
        shift={selectedShift || undefined}
      />
    </div>
  );
};

export default WeekView;