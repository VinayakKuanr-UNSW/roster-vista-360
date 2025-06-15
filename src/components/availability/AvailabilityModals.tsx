
import React from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AvailabilityStatus, DayAvailability } from '@/api/models/types';
import { DayInteractionModal } from '@/components/availability/DayInteractionModal';
import { BatchApplyModal } from '@/components/availability/BatchApplyModal';

interface AvailabilityModalsProps {
  isDayModalOpen: boolean;
  setIsDayModalOpen: (open: boolean) => void;
  isBatchModalOpen: boolean;
  setIsBatchModalOpen: (open: boolean) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  existingAvailability?: DayAvailability;
  isCalendarLocked: boolean;
  availabilityPresets: Array<{
    id: string;
    name: string;
    timeSlots: Array<{ startTime: string; endTime: string }>;
  }>;
  setAvailability: (data: {
    startDate: Date;
    endDate: Date;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      status: AvailabilityStatus;
    }>;
    notes?: string;
  }) => Promise<boolean>;
  deleteAvailability: (date: Date) => Promise<boolean>;
}

export function AvailabilityModals({
  isDayModalOpen,
  setIsDayModalOpen,
  isBatchModalOpen,
  setIsBatchModalOpen,
  selectedDate,
  setSelectedDate,
  existingAvailability,
  isCalendarLocked,
  availabilityPresets,
  setAvailability,
  deleteAvailability
}: AvailabilityModalsProps) {
  const { toast } = useToast();

  const handleDayModalSave = async (data: {
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      status: AvailabilityStatus;
    }>;
    notes?: string;
  }) => {
    if (!selectedDate) return;
    const success = await setAvailability({
      startDate: selectedDate,
      endDate: selectedDate,
      timeSlots: data.timeSlots,
      notes: data.notes
    });
    if (success) {
      toast({
        title: 'Availability Saved',
        description: `Your availability for ${format(selectedDate, 'dd MMM yyyy')} has been saved successfully.`
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
        description: `Availability for ${format(selectedDate, 'dd MMM yyyy')} has been deleted.`
      });
      setIsDayModalOpen(false);
      setSelectedDate(null);
    }
  };

  const handleBatchApply = async (data: {
    startDate: Date;
    endDate: Date;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      status: AvailabilityStatus;
    }>;
    notes?: string;
  }) => {
    if (isCalendarLocked) {
      toast({
        title: 'Calendar Locked',
        description: 'No changes allowed while locked.',
        variant: 'destructive'
      });
      return;
    }
    const success = await setAvailability({
      startDate: data.startDate,
      endDate: data.endDate,
      timeSlots: data.timeSlots,
      notes: data.notes
    });
    if (success) {
      toast({
        title: 'Batch Availability Applied',
        description: `Availability set for ${format(data.startDate, 'dd MMM')} to ${format(data.endDate, 'dd MMM yyyy')}`
      });
      setIsBatchModalOpen(false);
    }
  };

  return (
    <>
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
    </>
  );
}
