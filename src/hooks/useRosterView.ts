import { useState } from 'react';
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export type CalendarView = 'day' | '3day' | 'week' | 'month';

export const useRosterView = () => {
  const [view, setView] = useState<CalendarView>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const viewOptions = [
    { label: 'Day', value: 'day' },
    { label: '3-Day', value: '3day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ] as const;

  // Get date range based on view and selected date
  const getDateRange = () => {
    switch (view) {
      case 'day':
        return { from: selectedDate, to: selectedDate };
      case '3day':
        return { from: selectedDate, to: addDays(selectedDate, 2) };
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // End on Sunday
        return { from: weekStart, to: weekEnd };
      case 'month':
        return { from: startOfMonth(selectedDate), to: endOfMonth(selectedDate) };
      default:
        return { from: selectedDate, to: selectedDate };
    }
  };

  // Navigate based on view
  const navigatePrevious = () => {
    switch (view) {
      case 'day':
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case '3day':
        setSelectedDate(subDays(selectedDate, 3));
        break;
      case 'week':
        setSelectedDate(subDays(selectedDate, 7));
        break;
      case 'month':
        const prevMonth = new Date(selectedDate);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setSelectedDate(prevMonth);
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'day':
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case '3day':
        setSelectedDate(addDays(selectedDate, 3));
        break;
      case 'week':
        setSelectedDate(addDays(selectedDate, 7));
        break;
      case 'month':
        const nextMonth = new Date(selectedDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setSelectedDate(nextMonth);
        break;
    }
  };

  // Get all days in the current range
  const getDaysInRange = () => {
    const { from, to } = getDateRange();
    return eachDayOfInterval({ start: from, end: to });
  };

  return {
    view,
    setView,
    selectedDate,
    setSelectedDate,
    viewOptions,
    getDateRange,
    navigatePrevious,
    navigateNext,
    getDaysInRange
  };
};