import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  isSameDay
} from 'date-fns';
import { Shift } from '@/api/models/types';
import MyRosterShift from './MyRosterShift';
import ShiftDetailsDialog from './ShiftDetailsDialog';

interface MonthViewProps {
  date: Date;
  getShiftsForDate: (date: Date) => Array<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  }>;
}

const MonthView: React.FC<MonthViewProps> = ({ date, getShiftsForDate }) => {
  const [selectedShift, setSelectedShift] = useState<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  } | null>(null);
  
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach(day => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  // Get shifts for the selected day
  const handleDayClick = (day: Date) => {
    const shifts = getShiftsForDate(day);
    if (shifts.length > 0) {
      setSelectedShift(shifts[0]);
    }
  };
  
  return (
    <div className="h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 border-b border-gray-800 p-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="h-[calc(100%-2rem)] overflow-y-auto p-1">
        <div className="grid grid-cols-7 gap-1 h-full">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const isCurrentMonth = isSameMonth(day, date);
                const shifts = getShiftsForDate(day);
                
                return (
                  <div
                    key={dayIndex}
                    onClick={() => shifts.length > 0 && handleDayClick(day)}
                    className={`
                      p-1 min-h-[70px] rounded border
                      ${isCurrentMonth ? 'bg-black/20' : 'bg-black/40 opacity-40'} 
                      ${isToday(day) ? 'border-blue-500' : 'border-gray-800'}
                      ${shifts.length > 0 ? 'cursor-pointer' : ''}
                      transition-colors duration-200
                    `}
                  >
                    <div className="text-right mb-1">
                      <span 
                        className={`
                          inline-flex items-center justify-center rounded-full w-5 h-5 text-xs
                          ${isToday(day) ? 'bg-blue-500 text-white' : ''}
                          ${!isCurrentMonth && !isToday(day) ? 'text-gray-600' : ''}
                        `}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>
                    
                    <div className="space-y-1 overflow-y-auto max-h-[50px]">
                      {shifts.slice(0, 2).map((shiftData, idx) => (
                        <MyRosterShift
                          key={idx}
                          shift={shiftData.shift}
                          groupName={shiftData.groupName}
                          groupColor={shiftData.groupColor}
                          subGroupName={shiftData.subGroupName}
                          compact={true}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedShift(shiftData);
                          }}
                        />
                      ))}
                      
                      {shifts.length > 2 && (
                        <div className="text-xs text-center text-gray-400">
                          +{shifts.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
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

export default MonthView;