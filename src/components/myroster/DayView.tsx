
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
      {/* Day header */}
      <div className="p-4 border-b border-gray-800 bg-gray-800/50">
        <h3 className="text-lg font-medium flex items-center justify-center">
          {format(date, 'EEEE, MMMM d')}
          {isToday(date) && (
            <span className="ml-3 text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full">Today</span>
          )}
        </h3>
        {shifts.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-1">
            {shifts.length} shift{shifts.length !== 1 ? 's' : ''} scheduled
          </p>
        )}
      </div>
      
      {/* Time grid and shifts */}
      <div className="relative h-[calc(100%-5rem)] overflow-y-auto">
        {/* Time indicators background */}
        <div className="grid grid-cols-[80px_1fr]">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-xs text-gray-500 h-16 border-b border-gray-800 flex items-center justify-center bg-gray-800/30">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
              </div>
              <div className="h-16 border-b border-gray-800 border-l border-gray-700"></div>
            </React.Fragment>
          ))}
        </div>
        
        {/* Shifts overlay */}
        <div className="absolute top-0 left-20 right-0 bottom-0">
          {shifts.map((shiftData, index) => {
            const startPos = timeToPosition(shiftData.shift.startTime, 0, 24);
            const endPos = timeToPosition(shiftData.shift.endTime, 0, 24);
            const height = endPos - startPos;
            
            return (
              <div
                key={index}
                className="absolute left-2 right-2"
                style={{
                  top: `${startPos}%`,
                  height: `${Math.max(height, 4)}%`,
                  minHeight: '48px'
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
              <div className="text-center">
                <div className="text-gray-500 text-lg mb-2">No shifts scheduled</div>
                <div className="text-gray-600 text-sm">Enjoy your day off!</div>
              </div>
            </div>
          )}
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
