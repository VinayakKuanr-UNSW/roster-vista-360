
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useAuth } from './useAuth';
import { rosterService } from '@/api/services/rosterService';
import { CalendarView } from './useRosterView';
import { Shift } from '@/api/models/types';
import { getDepartmentColor } from '@/lib/utils';

interface ShiftWithDetails {
  shift: Shift;
  groupName: string;
  groupColor: string;
  subGroupName: string;
}

export const useMyRoster = (view: CalendarView, selectedDate: Date) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<Date[]>([]);
  
  // Calculate date range based on the view
  const calculateDateRange = () => {
    if (view === 'day') {
      return [selectedDate];
    } else if (view === '3day') {
      return [
        selectedDate,
        addDays(selectedDate, 1),
        addDays(selectedDate, 2)
      ];
    } else if (view === 'week') {
      const start = startOfWeek(selectedDate);
      return eachDayOfInterval({ start, end: endOfWeek(selectedDate) });
    } else if (view === 'month') {
      const start = startOfMonth(selectedDate);
      return eachDayOfInterval({ start, end: endOfMonth(selectedDate) });
    }
    return [selectedDate];
  };
  
  // Update date range when view or selectedDate changes
  const resolvedDateRange = calculateDateRange();
  
  // Fetch rosters for the date range
  const { data: rosters, isLoading, error } = useQuery({
    queryKey: ['myRosters', resolvedDateRange.map(d => format(d, 'yyyy-MM-dd')), user?.id],
    queryFn: async () => {
      if (!user || resolvedDateRange.length === 0) return [];
      
      const startDate = format(resolvedDateRange[0], 'yyyy-MM-dd');
      const endDate = format(resolvedDateRange[resolvedDateRange.length - 1], 'yyyy-MM-dd');
      
      const rostersData = await rosterService.getRostersByDateRange(startDate, endDate);
      return rostersData;
    },
    enabled: !!user && resolvedDateRange.length > 0
  });
  
  // Get shifts for a specific date
  const getShiftsForDate = (date: Date): ShiftWithDetails[] => {
    if (!rosters || !user) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const roster = rosters.find(r => r.date.split('T')[0] === dateStr);
    
    if (!roster) return [];
    
    const myShifts: ShiftWithDetails[] = [];
    
    roster.groups.forEach(group => {
      group.subGroups.forEach(subGroup => {
        subGroup.shifts.forEach(shift => {
          if (shift.employeeId === user.id) {
            myShifts.push({
              shift,
              groupName: group.name,
              // Use department-based coloring
              groupColor: group.color || getDepartmentColor(group.name),
              subGroupName: subGroup.name
            });
          }
        });
      });
    });
    
    return myShifts;
  };
  
  // Navigation functions
  const goToPrevious = () => {
    if (view === 'day') {
      return subDays(selectedDate, 1);
    } else if (view === '3day') {
      return subDays(selectedDate, 3);
    } else if (view === 'week') {
      return subDays(selectedDate, 7);
    } else if (view === 'month') {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    }
    return selectedDate;
  };
  
  const goToNext = () => {
    if (view === 'day') {
      return addDays(selectedDate, 1);
    } else if (view === '3day') {
      return addDays(selectedDate, 3);
    } else if (view === 'week') {
      return addDays(selectedDate, 7);
    } else if (view === 'month') {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    }
    return selectedDate;
  };
  
  return {
    dateRange: resolvedDateRange,
    rosters,
    isLoading,
    error,
    getShiftsForDate,
    goToPrevious,
    goToNext
  };
};
