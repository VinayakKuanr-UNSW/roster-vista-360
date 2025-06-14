import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { CalendarView } from '@/hooks/useRosterView';
import { useMyRoster } from '@/hooks/useMyRoster';
import DayView from './DayView';
import ThreeDayView from './ThreeDayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

interface MyRosterCalendarProps {
  view: CalendarView;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const MyRosterCalendar: React.FC<MyRosterCalendarProps> = ({ 
  view, 
  selectedDate, 
  onDateChange 
}) => {
  const { dateRange, isLoading, getShiftsForDate } = useMyRoster(view, selectedDate);
  
  const handlePrevious = () => {
    if (view === 'day') {
      onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
    } else if (view === '3day') {
      onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 3)));
    } else if (view === 'week') {
      onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 7)));
    } else if (view === 'month') {
      onDateChange(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
    }
  };
  
  const handleNext = () => {
    if (view === 'day') {
      onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
    } else if (view === '3day') {
      onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 3)));
    } else if (view === 'week') {
      onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 7)));
    } else if (view === 'month') {
      onDateChange(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
    }
  };
  
  const getDateRangeText = () => {
    if (view === 'day') {
      return format(selectedDate, 'MMMM d, yyyy');
    } else if (view === '3day') {
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 2);
      return `${format(selectedDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    } else if (view === 'week') {
      return format(selectedDate, 'MMMM yyyy');
    } else if (view === 'month') {
      return format(selectedDate, 'MMMM yyyy');
    }
    return '';
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/5 border-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="min-w-[240px] justify-start text-left font-normal bg-white/5 border-white/10"
          >
            Loading...
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white/5 border-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-grow">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="icon"
          className="bg-white/5 border-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[180px] md:min-w-[240px] justify-start text-left font-normal bg-white/5 border-white/10 truncate"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">{getDateRangeText()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-900/95 backdrop-blur-xl border-gray-800">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button
          onClick={handleNext}
          variant="outline"
          size="icon"
          className="bg-white/5 border-white/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-grow overflow-hidden">
        {view === 'day' && (
          <DayView 
            date={selectedDate} 
            shifts={getShiftsForDate(selectedDate)}
          />
        )}
        
        {view === '3day' && (
          <ThreeDayView 
            startDate={selectedDate}
            getShiftsForDate={getShiftsForDate}
          />
        )}
        
        {view === 'week' && (
          <WeekView 
            date={selectedDate}
            getShiftsForDate={getShiftsForDate}
          />
        )}
        
        {view === 'month' && (
          <MonthView 
            date={selectedDate}
            getShiftsForDate={getShiftsForDate}
          />
        )}
      </div>
    </div>
  );
};

export default MyRosterCalendar;