import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Lock,
  Unlock,
  RefreshCw,
  Zap,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { AvailabilityStatus, DayAvailability } from '@/api/models/types';

import { ImprovedAvailabilityCalendar } from '@/components/availability/ImprovedAvailabilityCalendar';
import { MonthListView } from '@/components/availability/MonthListView';
import { DayInteractionModal } from '@/components/availability/DayInteractionModal';
import { BatchApplyModal } from '@/components/availability/BatchApplyModal';

const AvailabilitiesPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isCalendarLocked, setIsCalendarLocked] = useState(false);

  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const isManager = hasPermission?.('manage_availability') || false;

  const {
    monthlyAvailabilities,
    isLoading,
    setAvailability,
    deleteAvailability,
    goToPreviousMonth,
    goToNextMonth,
    setSelectedMonth: updateSelectedMonth,
    getDayAvailability,
    availabilityPresets,
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
    const newLockState = !isCalendarLocked;
    setIsCalendarLocked(newLockState);
    toast({
      title: newLockState ? 'Calendar Locked' : 'Calendar Unlocked',
      description: newLockState 
        ? 'All changes are now disabled.' 
        : 'Changes are now allowed.',
    });
  };

  // Force refresh data
  const handleRefresh = () => {
    updateSelectedMonth(new Date(selectedMonth));
    toast({
      title: 'Refreshed',
      description: 'Availability data has been refreshed.',
    });
  };

  // Day interaction modal handlers
  const handleDateClick = (date: Date) => {
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  const handleDayModalSave = async (data: {
    timeSlots: Array<{ startTime: string; endTime: string; status: AvailabilityStatus }>;
    notes?: string;
  }) => {
    if (!selectedDate) return;

    const success = await setAvailability({
      startDate: selectedDate,
      endDate: selectedDate,
      timeSlots: data.timeSlots,
      notes: data.notes,
    });

    if (success) {
      toast({
        title: 'Availability Saved',
        description: `Your availability for ${format(selectedDate, 'dd MMM yyyy')} has been saved successfully.`,
      });
      setIsDayModalOpen(false);
      setSelectedDate(null);
    }
  };

  const handleDayModalDelete = async () => {
    if (!selectedDate) return;

    const success = await deleteAvailability(selectedDate);
    if (success) {
      toast({
        title: 'Availability Deleted',
        description: `Availability for ${format(selectedDate, 'dd MMM yyyy')} has been deleted.`,
      });
      setIsDayModalOpen(false);
      setSelectedDate(null);
    }
  };

  // Batch apply modal handlers
  const handleBatchApply = async (data: {
    startDate: Date;
    endDate: Date;
    timeSlots: Array<{ startTime: string; endTime: string; status: AvailabilityStatus }>;
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

    const success = await setAvailability({
      startDate: data.startDate,
      endDate: data.endDate,
      timeSlots: data.timeSlots,
      notes: data.notes,
    });

    if (success) {
      toast({
        title: 'Batch Availability Applied',
        description: `Availability set for ${format(data.startDate, 'dd MMM')} to ${format(data.endDate, 'dd MMM yyyy')}`,
      });
      setIsBatchModalOpen(false);
    }
  };

  const openBatchModal = () => {
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive',
      });
      return;
    }
    setIsBatchModalOpen(true);
  };

  // Get existing availability for the modal - fix type conversion
  const existingAvailability: DayAvailability | undefined = selectedDate ? (() => {
    const dayAvail = getDayAvailability(selectedDate);
    if (!dayAvail) return undefined;
    
    // Ensure timeSlots have required id property
    return {
      ...dayAvail,
      timeSlots: dayAvail.timeSlots.map(slot => ({
        ...slot,
        id: slot.id || Math.random().toString(36).substring(2, 11),
        status: slot.status || dayAvail.status || 'Available'
      }))
    } as unknown as DayAvailability;
  })() : undefined;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* PAGE HEADER */}
      <div className="flex-shrink-0 p-4 md:p-6 space-y-4 border-b bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Availability Management
          </h1>

          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="hidden sm:flex"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                size="sm"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>

            {/* Batch Apply Button */}
            <Button
              variant="default"
              onClick={openBatchModal}
              disabled={isCalendarLocked}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Batch Apply
            </Button>
          </div>
        </div>

        {/* MONTH NAVIGATION + LOCK BUTTON */}
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

          {isManager && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleToggleLock}
              size="sm"
            >
              {isCalendarLocked ? (
                <>
                  <Unlock className="h-4 w-4" />
                  Unlock Calendar
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Lock Calendar
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT: CALENDAR or LIST */}
      {isLoading ? (
        <div className="flex-grow p-4 grid place-items-center">
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : (
        <div className="flex-grow overflow-auto h-[calc(100vh-200px)] bg-background">
          {viewMode === 'calendar' ? (
            <ImprovedAvailabilityCalendar
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

      {/* DAY INTERACTION MODAL */}
      <DayInteractionModal
        open={isDayModalOpen}
        onClose={() => {
          setIsDayModalOpen(false);
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
        existingAvailability={existingAvailability}
        onSave={handleDayModalSave}
        onDelete={handleDayModalDelete}
        isLocked={isCalendarLocked}
      />

      {/* BATCH APPLY MODAL */}
      <BatchApplyModal
        open={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onApply={handleBatchApply}
        availabilityPresets={availabilityPresets}
        isLocked={isCalendarLocked}
      />
    </div>
  );
};

export default AvailabilitiesPage;
