
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Shift } from '@/api/models/types';
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

const MonthView: React.FC<MonthViewProps> = ({
  date,
  getShiftsForDate
}) => {
  const [selectedShift, setSelectedShift] = useState<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  } | null>(null);

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const allDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // Group the days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  allDays.forEach(day => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const formatShiftTime = (timeString: string) => {
    try {
      const time = timeString.includes('T') ? timeString.split('T')[1].substring(0, 5) : timeString;
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
    } catch {
      return timeString;
    }
  };

  const getShiftCardColor = (groupColor: string) => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-600',
      'green': 'bg-green-600',
      'red': 'bg-red-600',
      'purple': 'bg-purple-600',
      'yellow': 'bg-yellow-600',
      'orange': 'bg-orange-600',
      'pink': 'bg-pink-600',
      'indigo': 'bg-indigo-600',
      'teal': 'bg-teal-600',
      'cyan': 'bg-cyan-600'
    };
    return colorMap[groupColor.toLowerCase()] || 'bg-gray-600';
  };

  const getDayContent = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, date);
    const isSelectedDay = isSameDay(day, date);
    const shifts = getShiftsForDate(day);
    const isCurrentDay = isToday(day);
    
    return (
      <div className={`
        h-32 border border-gray-700/50 bg-gray-900/50 hover:bg-gray-800/50 transition-colors
        ${isCurrentDay ? 'border-blue-400' : ''}
        ${!isCurrentMonth ? 'opacity-50' : ''}
        flex flex-col relative overflow-hidden
      `}>
        {/* Date number */}
        <div className="p-1 flex-shrink-0">
          <span className={`
            text-sm font-medium inline-flex items-center justify-center w-6 h-6 rounded-full
            ${isCurrentDay 
              ? 'bg-blue-500 text-white' 
              : isCurrentMonth 
                ? 'text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500'
            }
          `}>
            {format(day, 'd')}
          </span>
        </div>
        
        {/* Shifts container */}
        <div className="flex-1 px-1 pb-1 space-y-0.5 overflow-hidden">
          {shifts.slice(0, 4).map((shiftData, index) => (
            <div
              key={index}
              className={`
                text-xs text-white px-1.5 py-0.5 rounded cursor-pointer
                hover:opacity-80 transition-opacity truncate
                ${getShiftCardColor(shiftData.groupColor)}
              `}
              onClick={() => setSelectedShift(shiftData)}
              title={`${shiftData.shift.role} - ${formatShiftTime(shiftData.shift.startTime)}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate flex-1">
                  {formatShiftTime(shiftData.shift.startTime)} {shiftData.shift.role}
                </span>
              </div>
            </div>
          ))}
          
          {shifts.length > 4 && (
            <div className="text-xs text-gray-400 px-1.5 py-0.5 cursor-pointer hover:text-gray-300">
              +{shifts.length - 4} more
            </div>
          )}
          
          {shifts.length === 0 && isCurrentMonth && (
            <div className="h-full flex items-center justify-center opacity-0 hover:opacity-30 transition-opacity">
              <span className="text-xs text-gray-500">No shifts</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        {/* Month title */}
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-white">
            {format(date, 'MMMM yyyy')}
          </h3>
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 border-t border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-300 border-r border-gray-700 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7" style={{ minHeight: 'calc(6 * 8rem)' }}>
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-gray-700 last:border-r-0 border-b border-gray-700">
                  {getDayContent(day)}
                </div>
              ))}
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
