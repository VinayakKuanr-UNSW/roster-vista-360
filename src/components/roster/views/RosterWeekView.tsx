import React from 'react';
import { Roster } from '@/api/models/types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Clock } from 'lucide-react';

interface RosterWeekViewProps {
  roster: Roster | null;
  selectedDate: Date;
  readOnly?: boolean;
}

export const RosterWeekView: React.FC<RosterWeekViewProps> = ({ 
  roster, 
  selectedDate,
  readOnly
}) => {
  // Get the days of the current week
  const startDay = startOfWeek(selectedDate);
  const endDay = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: startDay, end: endDay });
  
  const countShiftsForDay = (roster: Roster | null, date: Date) => {
    if (!roster) return 0;
    
    // In a real app, we would check the date from the roster
    // For demonstration, we'll count all shifts in the roster for the selected date
    // and none for other dates
    if (isSameDay(date, selectedDate)) {
      let count = 0;
      roster.groups.forEach(group => {
        group.subGroups.forEach(subGroup => {
          count += subGroup.shifts.length;
        });
      });
      return count;
    }
    
    return 0;
  };
  
  const getGroupsCountForDay = (roster: Roster | null, date: Date) => {
    if (!roster || !isSameDay(date, selectedDate)) return 0;
    return roster.groups.length;
  };
  
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-4 min-w-[900px]">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg ${
              isSameDay(day, selectedDate) 
                ? 'bg-purple-900/20 border border-purple-500/30' 
                : 'bg-black/20 border border-white/10'
            }`}
          >
            <div className="text-center mb-3">
              <div className={`font-bold ${isSameDay(day, selectedDate) ? 'text-purple-300' : 'text-white'}`}>
                {format(day, 'EEE')}
              </div>
              <div className="text-sm text-white/70">{format(day, 'MMM d')}</div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${
              isSameDay(day, selectedDate) ? 'bg-black/30' : 'bg-black/20'
            }`}>
              <div className="text-3xl font-bold mb-1">
                {countShiftsForDay(roster, day)}
              </div>
              <div className="text-xs text-white/60">shifts</div>
            </div>
            
            <div className="mt-3 space-y-2">
              {isSameDay(day, selectedDate) && roster?.groups.map((group, gIndex) => (
                <div 
                  key={gIndex} 
                  className="text-xs p-2 rounded bg-black/20 border border-white/10"
                >
                  <div className="font-medium">{group.name}</div>
                  <div className="text-white/60 text-xs">
                    {group.subGroups.reduce((total, subGroup) => 
                      total + subGroup.shifts.length, 0
                    )} shifts
                  </div>
                </div>
              ))}
              
              {!isSameDay(day, selectedDate) && (
                <div className="text-center text-white/40 text-xs p-2">
                  No data available
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RosterWeekView;