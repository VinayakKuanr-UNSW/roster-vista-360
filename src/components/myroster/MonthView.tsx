
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
import CalendarLegend from './CalendarLegend';
import DayQuickActions from './DayQuickActions';
import { Badge } from '@/components/ui/badge';

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

  // Group shifts by role to reduce visual noise
  const groupShiftsByRole = (shifts: Array<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  }>) => {
    const grouped = shifts.reduce((acc, shiftData) => {
      const key = `${shiftData.shift.role}-${shiftData.groupColor}`;
      if (!acc[key]) {
        acc[key] = {
          role: shiftData.shift.role,
          color: shiftData.groupColor,
          shifts: [],
          groupName: shiftData.groupName,
          subGroupName: shiftData.subGroupName
        };
      }
      acc[key].shifts.push(shiftData);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  };

  const handleQuickAction = (action: string, day: Date) => {
    console.log(`${action} action for`, format(day, 'yyyy-MM-dd'));
    // These would integrate with actual shift management functionality
  };
  
  const getDayContent = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, date);
    const isSelectedDay = isSameDay(day, date);
    const shifts = getShiftsForDate(day);
    const groupedShifts = groupShiftsByRole(shifts);
    const today = isToday(day);
    
    return (
      <div className={`
        h-full border transition-colors duration-200 flex flex-col group relative ${
          today
            ? 'border-blue-500/70 bg-blue-500/15 ring-2 ring-blue-500/30' 
            : isCurrentMonth 
              ? 'border-white/20 bg-black/30 hover:bg-black/40' 
              : 'border-white/10 bg-black/10'
        } ${
          isSelectedDay 
            ? 'ring-2 ring-purple-500/50' 
            : ''
        }
      `}>
        {/* Quick actions overlay */}
        <DayQuickActions
          onAddShift={() => handleQuickAction('add', day)}
          onEditShift={() => handleQuickAction('edit', day)}
          onViewDetails={() => handleQuickAction('details', day)}
          hasShifts={shifts.length > 0}
        />

        {/* Date header */}
        <div className="flex justify-between items-center p-2 border-b border-white/10 flex-shrink-0">
          <span className={`
            text-sm font-medium px-2 py-1 rounded-full transition-colors ${
              today
                ? 'bg-blue-500 text-white ring-2 ring-blue-300/50' 
                : isCurrentMonth 
                  ? 'text-white/90 hover:bg-white/10' 
                  : 'text-white/40'
            }
          `}>
            {format(day, 'd')}
            {today && <span className="ml-1 text-xs">Today</span>}
          </span>
          
          {shifts.length > 0 && (
            <Badge variant="secondary" className="text-xs bg-purple-500/80 text-white border-purple-400/30">
              {shifts.length}
            </Badge>
          )}
        </div>
        
        {/* Shifts container */}
        <div className="flex-1 p-1 overflow-hidden flex flex-col">
          {shifts.length > 0 ? (
            <div className="flex-1 flex flex-col gap-1">
              {groupedShifts.slice(0, 2).map((group, index) => (
                <div key={index} className="flex-1 min-h-0">
                  {group.shifts.length === 1 ? (
                    <MyRosterShift
                      shift={group.shifts[0].shift}
                      groupName={group.shifts[0].groupName}
                      groupColor={group.shifts[0].groupColor}
                      subGroupName={group.shifts[0].subGroupName}
                      onClick={() => setSelectedShift(group.shifts[0])}
                      compact={true}
                      style={{ 
                        height: '100%',
                        width: '100%'
                      }}
                    />
                  ) : (
                    <div 
                      className={`rounded border text-white text-xs cursor-pointer transition-all duration-200 flex flex-col justify-center px-2 py-1 h-full bg-${group.color}-500/90 hover:bg-${group.color}-500 border-${group.color}-400/30`}
                      onClick={() => setSelectedShift(group.shifts[0])}
                    >
                      <div className="font-medium truncate text-center leading-tight">
                        {group.role}
                      </div>
                      <div className="opacity-90 text-[10px] truncate text-center leading-tight mt-0.5">
                        {group.shifts.length} shifts
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {shifts.length > 2 && (
                <div className="h-5 flex items-center justify-center">
                  <div className="text-xs text-white/70 bg-gray-700/50 px-2 py-1 rounded-full border border-white/20">
                    +{shifts.length - 2} more
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-sm text-white/60 bg-gray-800/30 px-3 py-2 rounded-lg border border-white/10 hover:bg-gray-700/40 transition-colors cursor-pointer"
                    onClick={() => handleQuickAction('add', day)}>
                No shifts - Click to add
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden flex flex-col">
      {/* Legend */}
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <CalendarLegend />
      </div>

      {/* Month header */}
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <h3 className="text-lg font-semibold text-center">
          {format(date, 'MMMM yyyy')}
        </h3>
      </div>
      
      {/* Calendar grid */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-800 bg-gray-800/50 flex-shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-white/80 border-r border-gray-700 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar weeks - now expand to fill available space */}
        <div className="flex-1 flex flex-col">
          {weeks.map((weekIndex, index) => (
            <div key={index} className="flex-1 grid grid-cols-7 border-b border-gray-800 last:border-b-0">
              {weekIndex.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-gray-800 last:border-r-0 flex">
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
