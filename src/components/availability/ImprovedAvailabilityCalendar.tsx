
import React from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { Lock } from 'lucide-react';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ImprovedAvailabilityCalendarProps {
  onSelectDate: (date: Date) => void;
  selectedMonth: Date;
  isLocked?: boolean;
}

// Helper function to parse time string to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to segment a full day based on time slots
const segmentDay = (timeSlots: Array<{ startTime: string; endTime: string; status: string }>) => {
  const segments: Array<{ start: number; end: number; status: 'Available' | 'Unavailable' | 'Unset' }> = [];
  const dayStart = 0; // 00:00
  const dayEnd = 1439; // 23:59 (1439 minutes)
  
  // Sort time slots by start time
  const sortedSlots = [...timeSlots].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  
  let currentTime = dayStart;
  
  for (const slot of sortedSlots) {
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    
    // Add unset segment before this slot if there's a gap
    if (currentTime < slotStart) {
      segments.push({
        start: currentTime,
        end: slotStart - 1,
        status: 'Unset'
      });
    }
    
    // Add the actual slot segment
    segments.push({
      start: slotStart,
      end: slotEnd,
      status: slot.status === 'Available' ? 'Available' : 'Unavailable'
    });
    
    currentTime = Math.max(currentTime, slotEnd + 1);
  }
  
  // Add remaining unset time at the end of day
  if (currentTime <= dayEnd) {
    segments.push({
      start: currentTime,
      end: dayEnd,
      status: 'Unset'
    });
  }
  
  return segments;
};

export function ImprovedAvailabilityCalendar({ 
  onSelectDate, 
  selectedMonth, 
  isLocked = false 
}: ImprovedAvailabilityCalendarProps) {
  const { getDayAvailability, isDateLocked } = useAvailabilities();

  // Get the proper calendar grid that aligns with real-world calendar
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  
  // Get the calendar grid - start from the first day of the week containing the first day of month
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday = 0
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  // Get all days in the calendar grid (including days from previous/next month)
  const allCalendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDayColor = (date: Date) => {
    const availability = getDayAvailability(date);
    
    // No availability set - transparent background
    if (!availability || !availability.timeSlots || availability.timeSlots.length === 0) {
      return 'bg-transparent border-gray-200 dark:border-gray-700';
    }
    
    // Segment the day based on time slots
    const segments = segmentDay(availability.timeSlots);
    
    const hasAvailable = segments.some(seg => seg.status === 'Available');
    const hasUnavailable = segments.some(seg => seg.status === 'Unavailable');
    
    // Apply the new logic:
    // Green: Contains available segments (may also have unset)
    // Red: Contains unavailable segments but no available segments (may also have unset)
    // Yellow: Contains both available and unavailable segments
    
    if (hasAvailable && hasUnavailable) {
      // Mixed - yellow
      return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700';
    }
    
    if (hasAvailable) {
      // Contains available segments - green
      return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700';
    }
    
    if (hasUnavailable) {
      // Contains unavailable segments but no available - red
      return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700';
    }
    
    // Fallback (shouldn't happen with proper segmentation)
    return 'bg-transparent border-gray-200 dark:border-gray-700';
  };

  const getDayStatus = (date: Date) => {
    const availability = getDayAvailability(date);
    if (!availability || !availability.timeSlots || availability.timeSlots.length === 0) return 'Not set';
    
    const segments = segmentDay(availability.timeSlots);
    const hasAvailable = segments.some(seg => seg.status === 'Available');
    const hasUnavailable = segments.some(seg => seg.status === 'Unavailable');
    
    if (hasAvailable && hasUnavailable) return 'Mixed';
    if (hasAvailable) return 'Available';
    if (hasUnavailable) return 'Unavailable';
    return 'Not set';
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Unavailable':
        return 'bg-red-500';
      case 'Partial':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleDayClick = (date: Date) => {
    if (isLocked || isDateLocked(date)) return;
    onSelectDate(date);
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="grid grid-cols-7 gap-1 mb-4 flex-shrink-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 flex-grow">
        {allCalendarDays.map((date) => {
          const availability = getDayAvailability(date);
          const dayColor = getDayColor(date);
          const dayStatus = getDayStatus(date);
          const isCurrentMonth = isSameMonth(date, selectedMonth);
          const isDateLockedDay = isDateLocked(date);
          const isClickDisabled = isLocked || isDateLockedDay;
          
          return (
            <div
              key={date.toISOString()}
              className={cn(
                "relative border rounded-lg p-2 cursor-pointer transition-all duration-200 flex flex-col min-h-[100px]",
                dayColor,
                isCurrentMonth ? "opacity-100" : "opacity-30",
                isToday(date) && "ring-2 ring-blue-500",
                !isClickDisabled && "hover:shadow-md hover:scale-105",
                isClickDisabled && "cursor-not-allowed opacity-60"
              )}
              onClick={() => handleDayClick(date)}
            >
              {/* Lock Overlay */}
              {isDateLockedDay && (
                <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-1 z-10">
                  <Lock className="h-3 w-3 text-white" />
                </div>
              )}
              
              {/* Date Number */}
              <div className={cn(
                "text-sm font-medium mb-1",
                isToday(date) ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"
              )}>
                {format(date, 'd')}
              </div>
              
              {/* Time Slots Preview with Colored Dots */}
              {availability?.timeSlots && availability.timeSlots.length > 0 ? (
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate flex-grow overflow-y-auto pr-1">
                  {availability.timeSlots.slice(0, 2).map((slot, i) => (
                    <div key={i} className="flex items-center gap-1 truncate mb-1">
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        getStatusDotColor(slot.status || 'Available')
                      )} />
                      <span className="truncate">
                        {slot.startTime}-{slot.endTime}
                      </span>
                    </div>
                  ))}
                  {availability.timeSlots.length > 2 && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                      <span>+{availability.timeSlots.length - 2} more</span>
                    </div>
                  )}
                </div>
              ) : null}
              
              {/* Status Badge */}
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs text-center mt-auto w-full justify-center",
                  dayStatus === 'Available' && "bg-green-200 text-green-900 dark:bg-green-800/50 dark:text-green-200",
                  dayStatus === 'Unavailable' && "bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-200",
                  dayStatus === 'Mixed' && "bg-yellow-200 text-yellow-900 dark:bg-yellow-800/50 dark:text-yellow-200",
                  dayStatus === 'Not set' && "bg-gray-200 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
                )}
              >
                {dayStatus}
              </Badge>
            </div>
          );
        })}
      </div>
      
      {/* Updated Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Has Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span>Has Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Mixed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-transparent border border-gray-300 rounded"></div>
          <span>Not set</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Available slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Unavailable slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span>Unset segment</span>
        </div>
      </div>
    </div>
  );
}
