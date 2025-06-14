
import React, { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isEqual, isToday, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DayPicker } from 'react-day-picker';
import { BidWithEmployee } from './types/bid-types';
import { Badge } from "@/components/ui/badge";

interface BidCalendarViewProps {
  bids: BidWithEmployee[];
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const BidCalendarView: React.FC<BidCalendarViewProps> = ({ 
  bids,
  onDateSelect,
  selectedDate
}) => {
  // State for current month
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Get the current month's range
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Count bids for each day
  const bidsByDate = useMemo(() => {
    const counts: Record<string, BidWithEmployee[]> = {};
    
    bids.forEach(bid => {
      if (bid.shiftDetails?.date) {
        const dateKey = bid.shiftDetails.date;
        if (!counts[dateKey]) {
          counts[dateKey] = [];
        }
        counts[dateKey].push(bid);
      }
    });
    
    return counts;
  }, [bids]);
  
  // Find the date range for all bids
  const dateRange = useMemo(() => {
    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    
    bids.forEach(bid => {
      if (bid.shiftDetails?.date) {
        const currentDate = parseISO(bid.shiftDetails.date);
        
        if (!minDate || currentDate < minDate) {
          minDate = currentDate;
        }
        
        if (!maxDate || currentDate > maxDate) {
          maxDate = currentDate;
        }
      }
    });
    
    return {
      fromDate: minDate || new Date(),
      toDate: maxDate || new Date()
    };
  }, [bids]);
  
  // Handle next month
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // Handle previous month
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  // Custom day cell renderer as a component
  const customDayContent = (day: Date) => {
    // Format date to match the API date format
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayBids = bidsByDate[dateKey] || [];
    const bidCount = dayBids.length;
    
    // Determine if the day has any filled shifts
    const hasFilledShifts = dayBids.some(
      bid => bid.shiftDetails?.status === 'Filled' || 
             bid.shiftDetails?.status === 'Assigned' ||
             !!bid.shiftDetails?.assignedEmployee
    );
    
    // Determine if the day has any draft shifts
    const hasDraftShifts = dayBids.some(
      bid => bid.shiftDetails?.isDraft === true
    );
    
    return (
      <div className="relative h-full flex flex-col">
        <div className={`
          w-8 h-8 mx-auto flex items-center justify-center rounded-full
          ${isEqual(day, selectedDate || new Date(-1)) ? 'bg-primary text-primary-foreground' : ''}
          ${isToday(day) ? 'border border-primary' : ''}
        `}>
          {format(day, 'd')}
        </div>
        
        {bidCount > 0 && (
          <div className="mt-1 flex justify-center">
            <div className={`
              text-xs px-2 py-0.5 rounded-full text-center
              ${hasFilledShifts ? 'bg-green-700/30 border border-green-600/30' : 'bg-blue-700/30 border border-blue-600/30'}
              ${hasDraftShifts ? 'italic' : ''}
            `}>
              {bidCount}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Get bids for selected date
  const selectedDateBids = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return bidsByDate[dateKey] || [];
  }, [selectedDate, bidsByDate]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="mx-auto"
          components={{
            Day: ({ date, displayMonth }) => {
              if (displayMonth.getMonth() !== date.getMonth()) {
                return <div className="rdp-day_outside">{format(date, 'd')}</div>;
              }
              return <>{customDayContent(date)}</>;
            }
          }}
          fromMonth={dateRange.fromDate}
          toMonth={dateRange.toDate}
          modifiersStyles={{
            selected: {
              backgroundColor: 'var(--primary)',
              color: 'white',
              fontWeight: 'bold'
            },
            today: {
              border: '1px solid var(--primary)'
            }
          }}
        />
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-blue-700/30 border border-blue-600/30 mr-2"></span>
            <span>Shifts with open bids</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-green-700/30 border border-green-600/30 mr-2"></span>
            <span>Shifts with filled/assigned bids</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="italic mr-2">Italic</span>
            <span>Indicates draft shifts</span>
          </div>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-2">
        {selectedDate ? (
          <>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              <Badge className="ml-2" variant="outline">
                {selectedDateBids.length} shifts
              </Badge>
            </h3>
            
            {selectedDateBids.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center text-gray-400">
                  <p>No shifts found for this date.</p>
                  <p className="text-sm mt-1">Select another date or adjust your filters.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {selectedDateBids.map(bid => (
                  <Card key={bid.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{bid.shiftDetails?.department} - {bid.shiftDetails?.role}</h4>
                          <p className="text-sm text-gray-400">{bid.shiftDetails?.startTime} - {bid.shiftDetails?.endTime}</p>
                          <p className="text-sm text-gray-400 mt-1">{bid.employee?.name || 'No employee assigned'}</p>
                        </div>
                        <Badge 
                          className={
                            bid.shiftDetails?.status === 'Filled' || bid.shiftDetails?.status === 'Assigned' ?
                            "bg-green-700" : "bg-blue-700"
                          }
                        >
                          {bid.shiftDetails?.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <Card className="bg-gray-800/50 border-gray-700 h-64 flex items-center justify-center">
            <CardContent className="text-center text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No date selected</h3>
              <p>Select a date from the calendar to see shifts.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BidCalendarView;
