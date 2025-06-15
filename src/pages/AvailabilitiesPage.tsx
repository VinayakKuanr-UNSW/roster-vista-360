
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { DayAvailability } from '@/api/models/types';
import { ImprovedAvailabilityCalendar } from '@/components/availability/ImprovedAvailabilityCalendar';
import { MonthListView } from '@/components/availability/MonthListView';
import { AvailabilityPageHeader } from '@/components/availability/AvailabilityPageHeader';
import { AvailabilityNavigation } from '@/components/availability/AvailabilityNavigation';
import { AvailabilityModals } from '@/components/availability/AvailabilityModals';

const AvailabilitiesPage = () => {
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isCalendarLocked, setIsCalendarLocked] = useState(false);
  
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const isManager = hasPermission?.('manage_availability') || false;
  
  const {
    selectedMonth,
    setSelectedMonth,
    monthlyAvailabilities,
    isLoading,
    setAvailability,
    deleteAvailability,
    goToPreviousMonth,
    goToNextMonth,
    getDayAvailability,
    availabilityPresets
  } = useAvailabilities();

  // Switch forward/back one month - use the hook's navigation functions
  const handleNextMonth = () => {
    console.log('Next month clicked');
    goToNextMonth();
  };
  
  const handlePrevMonth = () => {
    console.log('Previous month clicked');
    goToPreviousMonth();
  };

  // Force refresh data
  const handleRefresh = () => {
    // Force a re-fetch by creating a new date instance
    setSelectedMonth(new Date(selectedMonth.getTime()));
    toast({
      title: 'Refreshed',
      description: 'Availability data has been refreshed.'
    });
  };

  // Toggle the locked state
  const handleToggleLock = () => {
    const newLockState = !isCalendarLocked;
    setIsCalendarLocked(newLockState);
    toast({
      title: newLockState ? 'Calendar Locked' : 'Calendar Unlocked',
      description: newLockState ? 'All changes are now disabled.' : 'Changes are now allowed.'
    });
  };

  // Day interaction modal handlers
  const handleDateClick = (date: Date) => {
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive'
      });
      return;
    }
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  const openBatchModal = () => {
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive'
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
      <div className="flex-shrink-0 p-4 md:p-6 space-y-4 border-b bg-transparent py-[24px] px-[24px] mx-0 my-0 rounded-none">
        <AvailabilityPageHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={handleRefresh}
          onBatchApply={openBatchModal}
          isCalendarLocked={isCalendarLocked}
        />

        {/* MONTH NAVIGATION + LOCK BUTTON */}
        <AvailabilityNavigation
          selectedMonth={selectedMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          isCalendarLocked={isCalendarLocked}
          onToggleLock={handleToggleLock}
          isManager={isManager}
        />
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

      {/* MODALS */}
      <AvailabilityModals
        isDayModalOpen={isDayModalOpen}
        setIsDayModalOpen={setIsDayModalOpen}
        isBatchModalOpen={isBatchModalOpen}
        setIsBatchModalOpen={setIsBatchModalOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        existingAvailability={existingAvailability}
        isCalendarLocked={isCalendarLocked}
        availabilityPresets={availabilityPresets}
        setAvailability={setAvailability}
        deleteAvailability={deleteAvailability}
      />
    </div>
  );
};

export default AvailabilitiesPage;
