
import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
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
  
  const getDayContent = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, date);
    const isSelectedDay = isSameDay(day, date);
    const shifts = getShiftsForDate(day);
    
    return (
      <div className={`
        h-32 md:h-36 border transition-colors duration-200 ${
          isToday(day) 
            ? 'border-blue-500/70 bg-blue-500/10' 
            : isCurrentMonth 
              ? 'border-white/20 bg-black/30 hover:bg-black/40' 
              : 'border-white/10 bg-black/10'
        } ${
          isSelectedDay 
            ? 'ring-2 ring-purple-500/50' 
            : ''
        }
      `}>
        {/* Date header */}
        <div className="flex justify-between items-center p-2 border-b border-white/10">
          <span className={`
            text-sm font-medium px-2 py-1 rounded-full ${
              isToday(day) 
                ? 'bg-blue-500 text-white' 
                : isCurrentMonth 
                  ? 'text-white/90 hover:bg-white/10' 
                  : 'text-white/40'
            }
          `}>
            {format(day, 'd')}
          </span>
          
          {shifts.length > 0 && (
            <span className="text-xs bg-purple-500/80 text-white px-2 py-1 rounded-full font-medium">
              {shifts.length}
            </span>
          )}
        </div>
        
        {/* Shifts container - fills remaining space */}
        <div className="h-[calc(100%-2.5rem)] p-1 overflow-hidden">
          {shifts.length > 0 ? (
            <div className="space-y-1 h-full">
              {shifts.slice(0, 3).map((shiftData, index) => (
                <div key={index} className="h-[calc(33.33%-0.25rem)]">
                  <MyRosterShift
                    shift={shiftData.shift}
                    groupName={shiftData.groupName}
                    groupColor={shiftData.groupColor}
                    subGroupName={shiftData.subGroupName}
                    onClick={() => setSelectedShift(shiftData)}
                    compact={true}
                    style={{ 
                      height: '100%',
                      width: '100%'
                    }}
                  />
                </div>
              ))}
              
              {shifts.length > 3 && (
                <div className="h-[calc(33.33%-0.25rem)] flex items-center justify-center">
                  <div className="text-xs text-white/70 bg-gray-700/50 px-2 py-1 rounded-full border border-white/20">
                    +{shifts.length - 3} more
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs text-white/30">No shifts</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Month header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-center">
          {format(date, 'MMMM yyyy')}
        </h3>
      </div>
      
      {/* Calendar grid */}
      <div className="flex-1 overflow-auto">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-800 bg-gray-800/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-white/80 border-r border-gray-700 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar weeks */}
        <div className="min-h-[600px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-800 last:border-b-0">
              {week.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-gray-800 last:border-r-0">
                  {getDayContent(day)}
                </div>
              ))}
            </div>
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
