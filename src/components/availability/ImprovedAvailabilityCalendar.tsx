
import React from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isSameMonth } from 'date-fns';
import { Lock } from 'lucide-react';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ImprovedAvailabilityCalendarProps {
  onSelectDate: (date: Date) => void;
  selectedMonth: Date;
  isLocked?: boolean;
}

export function ImprovedAvailabilityCalendar({ 
  onSelectDate, 
  selectedMonth, 
  isLocked = false 
}: ImprovedAvailabilityCalendarProps) {
  const { getDayAvailability, isDateLocked } = useAvailabilities();

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayColor = (date: Date) => {
    const availability = getDayAvailability(date);
    if (!availability || !availability.timeSlots.length) return 'bg-gray-100';
    
    const hasAvailable = availability.timeSlots.some(slot => slot.status === 'Available');
    const hasUnavailable = availability.timeSlots.some(slot => slot.status === 'Unavailable');
    
    if (hasAvailable && hasUnavailable) return 'bg-yellow-200';
    if (hasAvailable) return 'bg-green-200';
    return 'bg-red-200';
  };

  const getDayStatus = (date: Date) => {
    const availability = getDayAvailability(date);
    if (!availability || !availability.timeSlots.length) return null;
    
    const hasAvailable = availability.timeSlots.some(slot => slot.status === 'Available');
    const hasUnavailable = availability.timeSlots.some(slot => slot.status === 'Unavailable');
    
    if (hasAvailable && hasUnavailable) return 'Partial';
    if (hasAvailable) return 'Available';
    return 'Unavailable';
  };

  const handleDayClick = (date: Date) => {
    if (isLocked || isDateLocked(date)) return;
    onSelectDate(date);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
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
                "relative h-20 border border-gray-200 rounded-lg p-2 cursor-pointer transition-all duration-200",
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
                <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-1">
                  <Lock className="h-3 w-3 text-white" />
                </div>
              )}
              
              {/* Date Number */}
              <div className={cn(
                "text-sm font-medium",
                isToday(date) ? "text-blue-700" : "text-gray-900"
              )}>
                {format(date, 'd')}
              </div>
              
              {/* Status Badge */}
              {dayStatus && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "absolute bottom-1 left-1 right-1 text-xs text-center",
                    dayStatus === 'Available' && "bg-green-100 text-green-800",
                    dayStatus === 'Unavailable' && "bg-red-100 text-red-800",
                    dayStatus === 'Partial' && "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {dayStatus === 'Available' ? '🟩' : dayStatus === 'Unavailable' ? '🟥' : '🟨'}
                </Badge>
              )}
              
              {/* Time Slots Preview */}
              {availability?.timeSlots.length && (
                <div className="absolute top-6 left-1 right-1">
                  <div className="text-xs text-gray-600 truncate">
                    {availability.timeSlots.slice(0, 2).map((slot, i) => (
                      <div key={i} className="truncate">
                        {slot.startTime}-{slot.endTime}
                      </div>
                    ))}
                    {availability.timeSlots.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{availability.timeSlots.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span>🟩 Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 rounded"></div>
          <span>🟥 Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
          <span>🟨 Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span>⬜ No availability</span>
        </div>
      </div>
    </div>
  );
}
