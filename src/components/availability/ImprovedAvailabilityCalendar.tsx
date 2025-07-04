
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

// Helper function to determine overall day status based on time slots
const determineDayStatus = (timeSlots: Array<{ startTime: string; endTime: string; status?: string }>) => {
  // If no time slots or empty array, it's "Not set"
  if (!timeSlots || timeSlots.length === 0) {
    return 'Not set';
  }

  // Filter out slots without valid status
  const validSlots = timeSlots.filter(slot => slot.status);
  
  if (validSlots.length === 0) {
    return 'Not set';
  }

  const hasAvailable = validSlots.some(slot => slot.status === 'Available');
  const hasUnavailable = validSlots.some(slot => slot.status === 'Unavailable');
  
  // Mixed availability
  if (hasAvailable && hasUnavailable) {
    return 'Mixed';
  }
  
  // All available
  if (hasAvailable && !hasUnavailable) {
    return 'Available';
  }
  
  // All unavailable
  if (hasUnavailable && !hasAvailable) {
    return 'Unavailable';
  }
  
  return 'Not set';
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
    
    // Check if there are any time slots at all - if not, return grey (not set)
    if (!availability || !availability.timeSlots || availability.timeSlots.length === 0) {
      return 'bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700';
    }

    const status = determineDayStatus(availability.timeSlots);
    
    switch (status) {
      case 'Available':
        return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700';
      case 'Unavailable':
        return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700';
      case 'Mixed':
        return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700';
      case 'Not set':
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700';
    }
  };

  const getDayStatus = (date: Date) => {
    const availability = getDayAvailability(date);
    
    // If no availability record or no time slots, return "Not set"
    if (!availability || !availability.timeSlots || availability.timeSlots.length === 0) {
      return 'Not set';
    }

    return determineDayStatus(availability.timeSlots);
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Unavailable':
        return 'bg-red-500';
      case 'Mixed':
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
          
          // Only show time slots if they actually exist and have content
          const hasTimeSlots = availability?.timeSlots && availability.timeSlots.length > 0;
          
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
              
              {/* Time Slots Preview with Colored Dots - only show if slots exist */}
              {hasTimeSlots ? (
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
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Mixed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
          <span>Not set</span>
        </div>
      </div>
    </div>
  );
}
