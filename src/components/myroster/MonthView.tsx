import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Shift } from '@/api/models/types';
import MyRosterShift from './MyRosterShift';
import ShiftDetailsDialog from './ShiftDetailsDialog';
import { Sun, Moon, Clock, Plus } from 'lucide-react';
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
  const isAMShift = (shift: Shift) => {
    const hour = parseInt(shift.startTime.split(':')[0]);
    return hour < 12;
  };
  const groupShiftsByRole = (shifts: Array<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  }>) => {
    const grouped = shifts.reduce((acc, shiftData) => {
      const role = shiftData.shift.role;
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(shiftData);
      return acc;
    }, {} as Record<string, typeof shifts>);
    return Object.entries(grouped);
  };
  const getDayContent = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, date);
    const isSelectedDay = isSameDay(day, date);
    const shifts = getShiftsForDate(day);
    const groupedShifts = groupShiftsByRole(shifts);
    const isCurrentDay = isToday(day);
    return <div className={`
        h-full border transition-all duration-300 flex flex-col relative overflow-hidden
        ${isCurrentDay ? 'border-blue-400 bg-blue-500/10 shadow-lg ring-1 ring-blue-400/30' : isCurrentMonth ? 'border-white/20 bg-black/30 hover:bg-black/40 hover:border-white/30' : 'border-white/10 bg-black/10 hover:bg-black/20'}
        ${isSelectedDay ? 'ring-2 ring-purple-500/50' : ''}
      `}>
        {/* Date header with enhanced styling */}
        <div className={`
          flex justify-between items-center p-2 border-b flex-shrink-0 
          ${isCurrentDay ? 'bg-blue-500/20 border-blue-400/30' : 'bg-gradient-to-r from-fuchsia-700/80 to-purple-700/80 border-white/10'}
        `}>
          <div className="flex items-center space-x-2">
            <span className={`
              text-sm font-bold px-2 py-1 rounded-full transition-all duration-200
              ${isCurrentDay ? 'bg-blue-500 text-white shadow-md' : isCurrentMonth ? 'text-white/90 hover:bg-white/10' : 'text-white/40'}
            `}>
              {format(day, 'd')}
            </span>
            {isCurrentDay && <div className="text-xs bg-blue-500/80 text-white px-2 py-0.5 rounded-full font-medium animate-pulse">
                Today
              </div>}
          </div>
          
          {shifts.length > 0 && <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-white/60" />
              <span className="text-xs bg-purple-500/80 text-white px-2 py-1 rounded-full font-medium shadow-sm">
                {shifts.length}
              </span>
            </div>}
        </div>
        
        {/* Shifts container */}
        <div className="flex-1 p-1 overflow-hidden flex flex-col">
          {shifts.length > 0 ? <div className="flex-1 flex flex-col gap-1">
              {groupedShifts.slice(0, 2).map(([role, roleShifts], index) => <div key={index} className="flex-1 min-h-0">
                  <div className={`
                    h-full rounded border text-white text-xs cursor-pointer 
                    transition-all duration-200 flex flex-col justify-center px-2 py-1
                    bg-gradient-to-r shadow-sm hover:shadow-md hover:scale-105
                    ${roleShifts[0].groupColor === 'blue' ? 'from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 border-blue-400/30' : roleShifts[0].groupColor === 'green' ? 'from-green-500/90 to-green-600/90 hover:from-green-500 hover:to-green-600 border-green-400/30' : roleShifts[0].groupColor === 'red' ? 'from-red-500/90 to-red-600/90 hover:from-red-500 hover:to-red-600 border-red-400/30' : 'from-purple-500/90 to-purple-600/90 hover:from-purple-500 hover:to-purple-600 border-purple-400/30'}
                  `} onClick={() => setSelectedShift(roleShifts[0])}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium truncate leading-tight">{role}</div>
                      {isAMShift(roleShifts[0].shift) ? <Sun className="w-3 h-3 text-yellow-300 flex-shrink-0" /> : <Moon className="w-3 h-3 text-blue-300 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="opacity-90 text-[10px] truncate leading-tight">
                        {format(new Date(`2000-01-01T${roleShifts[0].shift.startTime}`), 'h:mm a')}
                      </div>
                      {roleShifts.length > 1 && <div className="text-[10px] opacity-75 bg-white/20 px-1 rounded">
                          +{roleShifts.length - 1}
                        </div>}
                    </div>
                  </div>
                </div>)}
              
              {groupedShifts.length > 2 && <div className="h-5 flex items-center justify-center">
                  <div className="text-xs text-white/70 bg-gray-700/50 px-2 py-1 rounded-full border border-white/20 hover:bg-gray-600/50 transition-colors cursor-pointer">
                    +{groupedShifts.length - 2} more roles
                  </div>
                </div>}
            </div> : <div className="flex-1 flex items-center justify-center group mx-[100px] px-0 py-0">
              <div className="text-center">
                <div className="text-xs text-white/40 mb-1">No shifts</div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-white/30 mx-auto hover:text-white/50 cursor-pointer" />
                </div>
              </div>
            </div>}
        </div>

        {/* Hover overlay for interactivity */}
        {isCurrentMonth && <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute top-1 right-1 bg-black/50 rounded p-1">
              <div className="text-xs text-white/80">Click to view</div>
            </div>
          </div>}
      </div>;
  };
  return <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col shadow-xl">
      {/* Month header with enhanced styling */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0 bg-gradient-to-r from-gray-800 to-gray-700">
        <h3 className="text-lg font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {format(date, 'MMMM yyyy')}
        </h3>
      </div>
      
      {/* Legend */}
      <div className="px-4 py-2 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <Sun className="w-3 h-3 text-yellow-400" />
            <span className="text-white/70">AM Shift</span>
          </div>
          <div className="flex items-center space-x-1">
            <Moon className="w-3 h-3 text-blue-400" />
            <span className="text-white/70">PM Shift</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-white/70">Today</span>
          </div>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Day headers with improved styling */}
        <div className="grid grid-cols-7 border-b border-gray-700 bg-gray-800/80 flex-shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="p-3 text-center text-sm font-semibold text-white/90 border-r border-gray-700 last:border-r-0 bg-gradient-to-b from-gray-700 to-gray-800">
              {day}
            </div>)}
        </div>
        
        {/* Calendar weeks */}
        <div className="flex-1 flex flex-col">
          {weeks.map((week, weekIndex) => <div key={weekIndex} className="flex-1 grid grid-cols-7 border-b border-gray-700 last:border-b-0">
              {week.map((day, dayIndex) => <div key={dayIndex} className="border-r border-gray-700 last:border-r-0 flex">
                  {getDayContent(day)}
                </div>)}
            </div>)}
        </div>
      </div>
      
      <ShiftDetailsDialog isOpen={!!selectedShift} onClose={() => setSelectedShift(null)} shift={selectedShift || undefined} />
    </div>;
};
export default MonthView;