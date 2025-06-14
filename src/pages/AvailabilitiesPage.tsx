import React, { useState } from 'react';
import { format, addMonths, subMonths, eachDayOfInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List,
  Lock,
  Unlock,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAvailabilities } from '@/hooks/useAvailabilities';

import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { PresetSelector } from '@/components/availability/PresetSelector';
import { MonthListView } from '@/components/availability/MonthListView';
// If you have these forms in your components folder:
import { AvailabilityForm } from '@/components/availability/AvailabilityForm';
import { BatchAvailabilityForm } from '@/components/availability/BatchAvailabilityForm';

const AvailabilitiesPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Lock/unlock state
  const [isCalendarLocked, setIsCalendarLocked] = useState(false);

  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const isManager = hasPermission?.('manage_availability') || false;

  const {
    monthlyAvailabilities,
    isLoading,
    setAvailability,
    applyPreset,
    goToPreviousMonth,
    goToNextMonth,
    setSelectedMonth: updateSelectedMonth,
  } = useAvailabilities();

  // Switch forward/back one month
  const handleNextMonth = () => {
    const nextMonth = addMonths(selectedMonth, 1);
    setSelectedMonth(nextMonth);
    updateSelectedMonth(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(selectedMonth, 1);
    setSelectedMonth(prevMonth);
    updateSelectedMonth(prevMonth);
  };

  // Toggle the locked state
  const handleToggleLock = () => {
    setIsCalendarLocked((prev) => !prev);
  };

  // Single-day form submission
  const handleSaveAvailability = async (data: any) => {
    // If locked, block
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedDate) return;

    await setAvailability({
      startDate: selectedDate,
      endDate: selectedDate,
      timeSlots: data.timeSlots,
      notes: data.notes,
    });

    toast({
      title: 'Availability Saved',
      description: `Your availability for ${format(
        selectedDate,
        'dd MMM yyyy'
      )} has been saved successfully.`,
    });

    setIsFormOpen(false);
    setSelectedDate(null);
  };

  // Batch form submission
  const handleSaveBatchAvailability = async (data: {
    startDate: Date;
    endDate: Date;
    timeSlots: Array<{ startTime: string; endTime: string; status?: string }>;
    notes?: string;
  }) => {
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive',
      });
      return;
    }

    if (!data.startDate || !data.endDate) {
      toast({
        title: 'Missing Dates',
        description: 'Please select both start and end dates',
        variant: 'destructive',
      });
      return;
    }

    if (data.endDate < data.startDate) {
      toast({
        title: 'Invalid Date Range',
        description: 'End date cannot be before start date',
        variant: 'destructive',
      });
      return;
    }

    // Check if any dates in the range already have availability
    const daysInRange = eachDayOfInterval({
      start: data.startDate,
      end: data.endDate,
    });
    const existingDays = daysInRange.filter((date) =>
      monthlyAvailabilities.some((a) => a.date === format(date, 'yyyy-MM-dd'))
    );

    if (existingDays.length > 0) {
      toast({
        title: 'Existing Availabilities',
        description: `${existingDays.length} dates in your selection already have availability set. Please edit those individually.`,
        variant: 'destructive',
      });
      return;
    }

    await setAvailability({
      startDate: data.startDate,
      endDate: data.endDate,
      timeSlots: data.timeSlots,
      notes: data.notes,
    });

    toast({
      title: 'Batch Availability Saved',
      description: `Availability set for ${format(
        data.startDate,
        'dd MMM'
      )} to ${format(data.endDate, 'dd MMM yyyy')}`,
    });

    setIsBatchFormOpen(false);
  };

  // Apply a preset
  const handleApplyPreset = async (
    presetId: string,
    startDate: Date,
    endDate: Date
  ) => {
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No bulk changes allowed while locked.',
        variant: 'destructive',
      });
      return;
    }

    // Check if any dates in the range already have availability
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    const existingDays = daysInRange.filter((date) =>
      monthlyAvailabilities.some((a) => a.date === format(date, 'yyyy-MM-dd'))
    );

    if (existingDays.length > 0) {
      toast({
        title: 'Warning',
        description: `${existingDays.length} dates already have availability set and will be overwritten.`,
        variant: 'warning',
      });
    }

    await applyPreset({
      presetId,
      startDate,
      endDate,
    });
  };

  // Clicking a day in the calendar
  const handleDateClick = (date: Date) => {
    // If locked, block
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedDate(date);
    setIsFormOpen(true);
  };

  const openBatchForm = () => {
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive',
      });
      return;
    }
    setIsBatchFormOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* PAGE HEADER */}
      <div className="flex-shrink-0 p-4 md:p-6 space-y-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Availability Management
          </h1>

          <div className="flex items-center gap-2">
            {/* Switch between Calendar or List */}
            <div className="hidden sm:flex gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>

            {/* Single Day */}
            <Button
              variant="outline"
              onClick={() => {
                if (isCalendarLocked) {
                  toast({
                    title: 'Calendar Locked',
                    description: 'No changes allowed while locked.',
                    variant: 'destructive',
                  });
                  return;
                }
                setSelectedDate(new Date());
                setIsFormOpen(true);
              }}
              disabled={isCalendarLocked}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Single Day
            </Button>

            {/* Multiple Days */}
            <Button
              variant="default"
              onClick={openBatchForm}
              disabled={isCalendarLocked}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Multiple Days
            </Button>
          </div>
        </div>

        {/* MONTH SWITCH + LOCK BUTTON + PRESET SELECTOR */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-36 text-center font-medium">
              {format(selectedMonth, 'MMMM yyyy')}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isManager && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleToggleLock}
              >
                {isCalendarLocked ? (
                  <>
                    <Unlock className="h-4 w-4" />
                    Unlock
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Lock
                  </>
                )}
              </Button>
            )}

            <PresetSelector
              onApplyPreset={handleApplyPreset}
              disabled={isCalendarLocked}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: CALENDAR or LIST */}
      {isLoading ? (
        <div className="flex-grow p-4 grid place-items-center">
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : (
        <div className="flex-grow overflow-auto h-[calc(100vh-180px)]">
          {viewMode === 'calendar' ? (
            <AvailabilityCalendar
              onSelectDate={handleDateClick}
              selectedMonth={selectedMonth}
              isLocked={isCalendarLocked}
            />
          ) : (
            <div className="p-4 md:p-6">
              <MonthListView
                onSelectDate={handleDateClick}
                isLocked={isCalendarLocked}
              />
            </div>
          )}
        </div>
      )}

      {/* SINGLE-DAY FORM MODAL */}
      {isFormOpen && selectedDate && (
        <AvailabilityForm
          selectedDate={selectedDate}
          onSubmit={handleSaveAvailability}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedDate(null);
          }}
        />
      )}

      {/* BATCH FORM MODAL */}
      {isBatchFormOpen && (
        <BatchAvailabilityForm
          onSubmit={handleSaveBatchAvailability}
          onCancel={() => setIsBatchFormOpen(false)}
        />
      )}
    </div>
  );
};

export default AvailabilitiesPage;
