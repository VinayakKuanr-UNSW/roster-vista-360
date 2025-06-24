
import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  addMonths, 
  subMonths,
  format,
  isBefore
} from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { availabilityService } from '@/api/services/availabilityService';
import { AvailabilityStatus, DayAvailability } from '@/api/models/types';

// Define the local Availability interface to ensure status is always required
interface Availability {
  date: string;
  status: AvailabilityStatus;
  timeSlots: Array<{
    id?: string;
    startTime: string;
    endTime: string;
    status?: AvailabilityStatus;
  }>;
  notes?: string;
  id?: string;
}

interface AvailabilityPreset {
  id: string;
  name: string;
  timeSlots: Array<{
    startTime: string;
    endTime: string;
  }>;
}

// Properly defining status colors based on availability status
const getStatusColor = (status: AvailabilityStatus): string => {
  switch (status) {
    case 'Available':
    case 'available':
      return 'bg-green-500';
    case 'Unavailable':
    case 'unavailable':
      return 'bg-red-500';
    case 'Partial':
    case 'partial':
    case 'Limited':
    case 'limited':
      return 'bg-yellow-500';
    case 'Tentative':
    case 'tentative':
      return 'bg-blue-500';
    case 'On Leave':
    case 'on leave':
    case 'On-Leave':
    case 'on-leave':
      return 'bg-purple-500';
    case 'Not Specified':
    case 'preferred':
    default:
      return 'bg-gray-400';
  }
};

export function useAvailabilities() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthlyAvailabilities, setMonthlyAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cutoffDate, setCutoffDate] = useState<Date | null>(null);
  const [availabilityPresets, setAvailabilityPresets] = useState<AvailabilityPreset[]>([]);
  const { toast } = useToast();

  // Derived values from selectedMonth
  const startOfSelectedMonth = useMemo(() => startOfMonth(selectedMonth), [selectedMonth]);
  const endOfSelectedMonth = useMemo(() => endOfMonth(selectedMonth), [selectedMonth]);
  
  // Fetch cutoff date
  const fetchCutoffDate = useCallback(async () => {
    try {
      const cutoff = await availabilityService.getCutoffDate();
      setCutoffDate(cutoff);
    } catch (error) {
      console.error('Error fetching cutoff date:', error);
    }
  }, []);

  // Fetch presets
  const fetchPresets = useCallback(async () => {
    try {
      const presets = await availabilityService.getPresets();
      // Transform to match the expected interface
      const transformedPresets: AvailabilityPreset[] = presets.map(preset => ({
        id: preset.id,
        name: preset.name,
        timeSlots: preset.timeSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
      }));
      setAvailabilityPresets(transformedPresets);
    } catch (error) {
      console.error('Error fetching presets:', error);
    }
  }, []);
  
  // Fetch availabilities for the selected month with proper error handling
  const fetchAvailabilities = useCallback(async () => {
    try {
      setIsLoading(true);
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      
      console.log(`Fetching availabilities for ${year}-${month.toString().padStart(2, '0')}`);
      
      // Use the availabilityService to get the month's data
      const data = await availabilityService.getMonthlyAvailabilities('current-user', year, month);
      
      // Convert DayAvailability[] to Availability[] by ensuring 'status' is always set
      const typeSafeData: Availability[] = data.map(item => ({
        id: item.id,
        date: item.date,
        status: item.status || 'Not Specified',
        notes: item.notes,
        timeSlots: item.timeSlots.map(slot => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: slot.status || item.status || 'Not Specified'
        }))
      }));
      
      console.log(`Successfully loaded ${typeSafeData.length} availabilities for ${year}-${month.toString().padStart(2, '0')}`);
      setMonthlyAvailabilities(typeSafeData);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      // Reset to empty array on error to prevent stale data
      setMonthlyAvailabilities([]);
      toast({
        title: 'Error',
        description: 'Failed to load availability data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, toast]);

  // Fetch initial data
  useEffect(() => {
    fetchAvailabilities();
    fetchCutoffDate();
    fetchPresets();
  }, [fetchAvailabilities, fetchCutoffDate, fetchPresets]);
  
  // Navigation functions that properly update the selected month
  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth(prev => {
      const prevMonth = subMonths(prev, 1);
      console.log(`Navigating to previous month: ${format(prevMonth, 'yyyy-MM')}`);
      return prevMonth;
    });
  }, []);
  
  const goToNextMonth = useCallback(() => {
    setSelectedMonth(prev => {
      const nextMonth = addMonths(prev, 1);
      console.log(`Navigating to next month: ${format(nextMonth, 'yyyy-MM')}`);
      return nextMonth;
    });
  }, []);
  
  // Get availability for a specific date
  const getDayAvailability = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const availability = monthlyAvailabilities.find(a => a.date === dateStr);
    console.log(`Getting availability for ${dateStr}:`, availability ? 'found' : 'not found');
    return availability;
  }, [monthlyAvailabilities]);
  
  // Get color based on availability status
  const getDayStatusColor = useCallback((status: AvailabilityStatus) => {
    return getStatusColor(status);
  }, []);

  // Check if date is past the cutoff
  const isDateLocked = useCallback((date: Date) => {
    return cutoffDate ? isBefore(date, cutoffDate) : false;
  }, [cutoffDate]);

  // Helper functions to quickly set entire day's availability
  const setFullDayAvailable = useCallback((date: Date) => {
    return setAvailability({
      startDate: date,
      endDate: date,
      timeSlots: [
        { startTime: '09:00', endTime: '17:00', status: 'Available' }
      ],
      status: 'Available'
    });
  }, []);

  const setFullDayUnavailable = useCallback((date: Date) => {
    return setAvailability({
      startDate: date,
      endDate: date,
      timeSlots: [
        { startTime: '00:00', endTime: '23:59', status: 'Unavailable' }
      ],
      status: 'Unavailable'
    });
  }, []);

  // Set or update availability with immediate local state updates
  const setAvailability = useCallback(async (data: {
    startDate: Date;
    endDate: Date;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      status?: AvailabilityStatus;
    }>;
    notes?: string;
    status?: AvailabilityStatus;
  }) => {
    try {
      setIsLoading(true);
      
      // Check if date is locked
      if (isDateLocked(data.startDate)) {
        toast({
          title: "Cannot Modify",
          description: "This date is past the cutoff and cannot be modified.",
          variant: "destructive"
        });
        return false;
      }
      
      // Default to Available status if not provided
      const status = data.status || 'Available';
      
      console.log('Setting availability:', {
        startDate: format(data.startDate, 'yyyy-MM-dd'),
        endDate: format(data.endDate, 'yyyy-MM-dd'),
        timeSlots: data.timeSlots,
        status
      });
      
      // Make API call to set availability
      const response = await availabilityService.setAvailabilityRange(
        'current-user',
        data.startDate,
        data.endDate,
        data.timeSlots.map(slot => ({ 
          startTime: slot.startTime, 
          endTime: slot.endTime, 
          status: slot.status || status 
        })),
        data.notes
      );
      
      // Convert the response to ensure it matches our Availability type
      const convertedResponse: Availability[] = response.map(item => ({
        id: item.id,
        date: item.date,
        status: item.status || 'Not Specified',
        notes: item.notes,
        timeSlots: item.timeSlots.map(slot => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: slot.status || item.status || 'Not Specified'
        }))
      }));
      
      // Update local state immediately for real-time updates
      setMonthlyAvailabilities(prev => {
        // Create a new array without the dates that were just updated
        const updatedDates = convertedResponse.map(item => item.date);
        const filtered = prev.filter(item => !updatedDates.includes(item.date));
        
        // Add the newly created/updated availabilities
        const newState = [...filtered, ...convertedResponse];
        console.log('Updated local state with new availabilities:', newState.length);
        return newState;
      });
      
      toast({
        title: "Availability Updated",
        description: "Your availability has been saved successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error setting availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to set availability',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isDateLocked, toast]);

  // Delete availability with immediate local state updates
  const deleteAvailability = useCallback(async (date: Date) => {
    try {
      // Check if date is locked
      if (isDateLocked(date)) {
        toast({
          title: "Cannot Delete",
          description: "This date is past the cutoff and cannot be modified.",
          variant: "destructive"
        });
        return false;
      }

      const dateStr = format(date, 'yyyy-MM-dd');
      
      console.log('Deleting availability for:', dateStr);
      
      // Find availability to delete
      const availabilityToDelete = monthlyAvailabilities.find(a => a.date === dateStr);
      
      if (!availabilityToDelete) {
        console.log('No availability found to delete for:', dateStr);
        toast({
          title: "Nothing to Delete",
          description: "No availability found for this date.",
          variant: "default"
        });
        return false;
      }
      
      // Call the service to delete the availability
      const success = await availabilityService.deleteAvailability('current-user', date);
      
      if (success) {
        // Update local state immediately for real-time updates
        setMonthlyAvailabilities(prev => {
          const newState = prev.filter(item => item.date !== dateStr);
          console.log('Removed availability from local state. New count:', newState.length);
          return newState;
        });
        
        toast({
          title: "Availability Deleted",
          description: `Availability for ${format(date, 'MMMM dd, yyyy')} has been removed.`,
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete availability',
        variant: 'destructive'
      });
      return false;
    }
  }, [isDateLocked, monthlyAvailabilities, toast]);
  
  // Set cutoff date (manager functionality)
  const setCutoff = useCallback(async (date: Date | null) => {
    try {
      await availabilityService.setCutoffDate(date);
      setCutoffDate(date);
      
      if (date) {
        toast({
          title: "Cutoff Date Set",
          description: `Availabilities before ${format(date, 'MMMM dd, yyyy')} are now locked.`,
        });
      } else {
        toast({
          title: "Cutoff Date Removed",
          description: "All dates can now be modified.",
        });
      }
    } catch (error) {
      console.error('Error setting cutoff date:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cutoff date',
        variant: 'destructive'
      });
    }
  }, [toast]);
  
  // Apply a preset availability pattern
  const applyPreset = useCallback(async (data: {
    presetId: string;
    startDate: Date;
    endDate: Date;
  }) => {
    try {
      setIsLoading(true);
      
      // Check if any date in range is locked
      if (isDateLocked(data.startDate)) {
        toast({
          title: "Cannot Apply Preset",
          description: "One or more dates in range are past the cutoff.",
          variant: "destructive"
        });
        return false;
      }
      
      const preset = availabilityPresets.find(p => p.id === data.presetId);
      if (!preset) {
        throw new Error('Preset not found');
      }
      
      console.log('Applying preset:', preset.name, 'from', format(data.startDate, 'yyyy-MM-dd'), 'to', format(data.endDate, 'yyyy-MM-dd'));
      
      // Apply the preset using the availabilityService
      const response = await availabilityService.applyPreset(
        'current-user',
        data.presetId,
        data.startDate,
        data.endDate
      );
      
      // Convert the response to ensure it matches our Availability type
      const convertedResponse: Availability[] = response.map(item => ({
        id: item.id,
        date: item.date,
        status: item.status || 'Not Specified',
        notes: item.notes,
        timeSlots: item.timeSlots.map(slot => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: slot.status || item.status || 'Not Specified'
        }))
      }));
      
      // Update local state with the new availabilities
      setMonthlyAvailabilities(prev => {
        // Remove existing availabilities in the date range
        const updatedDates = convertedResponse.map(item => item.date);
        const filtered = prev.filter(item => !updatedDates.includes(item.date));
        
        // Add the new availabilities
        const newState = [...filtered, ...convertedResponse];
        console.log('Applied preset and updated local state. New count:', newState.length);
        return newState;
      });
      
      toast({
        title: "Preset Applied",
        description: `Applied "${preset.name}" from ${format(data.startDate, 'MMM dd')} to ${format(data.endDate, 'MMM dd')}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error applying preset:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply availability preset',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isDateLocked, availabilityPresets, toast]);

  return {
    selectedMonth,
    setSelectedMonth,
    startOfMonth: startOfSelectedMonth,
    endOfMonth: endOfSelectedMonth,
    monthlyAvailabilities,
    isLoading,
    goToPreviousMonth,
    goToNextMonth,
    getDayAvailability,
    getDayStatusColor,
    setAvailability,
    deleteAvailability,
    setFullDayAvailable,
    setFullDayUnavailable,
    applyPreset,
    availabilityPresets,
    cutoffDate,
    setCutoff,
    isDateLocked,
    // For compatibility with existing components
    presets: availabilityPresets,
    // Force refresh function for when user wants to reload data
    refreshData: fetchAvailabilities
  };
}
