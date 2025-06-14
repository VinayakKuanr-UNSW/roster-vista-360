
import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  addMonths, 
  subMonths,
  format,
  parse,
  parseISO,
  isEqual,
  isBefore
} from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { availabilityService } from '@/api/services/availabilityService';
import { AvailabilityStatus, TimeSlot, DayAvailability } from '@/api/models/types';

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

// Make sure these presets match what's expected server-side
const availabilityPresets: AvailabilityPreset[] = [
  {
    id: '1',
    name: 'Standard (9-5)',
    timeSlots: [
      { startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: '2',
    name: 'Morning Shift',
    timeSlots: [
      { startTime: '07:00', endTime: '15:00' }
    ]
  },
  {
    id: '3',
    name: 'Evening Shift',
    timeSlots: [
      { startTime: '15:00', endTime: '23:00' }
    ]
  },
  {
    id: '4',
    name: 'Full Day',
    timeSlots: [
      { startTime: '08:00', endTime: '20:00' }
    ]
  },
  {
    id: '5',
    name: 'Weekdays Only',
    timeSlots: [
      { startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: '6',
    name: 'Weekends Only',
    timeSlots: [
      { startTime: '10:00', endTime: '18:00' }
    ]
  }
];

export function useAvailabilities() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthlyAvailabilities, setMonthlyAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cutoffDate, setCutoffDate] = useState<Date | null>(null);
  const { toast } = useToast();

  // Derived values from selectedMonth
  const startOfSelectedMonth = useMemo(() => startOfMonth(selectedMonth), [selectedMonth]);
  const endOfSelectedMonth = useMemo(() => endOfMonth(selectedMonth), [selectedMonth]);
  
  // Fetch availabilities for the selected month
  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setIsLoading(true);
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth() + 1;
        
        // Use the availabilityService to get the month's data
        const data = await availabilityService.getMonthlyAvailabilities('current-user', year, month);
        
        // Convert DayAvailability[] to Availability[] by ensuring 'status' is always set
        const typeSafeData: Availability[] = data.map(item => ({
          ...item,
          // Ensure status is set (use 'Not Specified' as a fallback)
          status: item.status || 'Not Specified',
          // Ensure each time slot has a status
          timeSlots: item.timeSlots.map(slot => ({
            ...slot,
            status: slot.status || item.status || 'Not Specified'
          }))
        }));
        
        setMonthlyAvailabilities(typeSafeData);
      } catch (error) {
        console.error('Error fetching availabilities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load availability data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailabilities();
  }, [selectedMonth, toast]);
  
  // Navigation functions
  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth(prev => subMonths(prev, 1));
  }, []);
  
  const goToNextMonth = useCallback(() => {
    setSelectedMonth(prev => addMonths(prev, 1));
  }, []);
  
  // Get availability for a specific date
  const getDayAvailability = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return monthlyAvailabilities.find(a => a.date === dateStr);
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

  // Set or update availability
  const setAvailability = async (data: {
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
        ...item,
        status: item.status || 'Not Specified',
        timeSlots: item.timeSlots.map(slot => ({
          ...slot,
          status: slot.status || item.status || 'Not Specified'
        }))
      }));
      
      // Update local state with new availability data
      setMonthlyAvailabilities(prev => {
        // Create a new array without the dates that were just updated
        const filtered = prev.filter(item => {
          const itemDate = parse(item.date, 'yyyy-MM-dd', new Date());
          // Keep items that aren't in the date range we just updated
          return !(
            itemDate >= data.startDate && 
            itemDate <= data.endDate
          );
        });
        
        // Add the newly created/updated availabilities
        return [...filtered, ...convertedResponse];
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
  };

  // Delete availability
  const deleteAvailability = async (date: Date) => {
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
      
      // Find availability to delete
      const availabilityToDelete = monthlyAvailabilities.find(a => a.date === dateStr);
      
      if (!availabilityToDelete) {
        toast({
          title: "Nothing to Delete",
          description: "No availability found for this date.",
          variant: "default" // Changed from "warning" to "default"
        });
        return false;
      }
      
      // Call the service to delete the availability
      const success = await availabilityService.deleteAvailability('current-user', date);
      
      if (success) {
        // Update local state by removing the deleted availability
        setMonthlyAvailabilities(prev => prev.filter(item => item.date !== dateStr));
        
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
  };
  
  // Set cutoff date (manager functionality)
  const setCutoff = (date: Date | null) => {
    setCutoffDate(date);
    if (date) {
      toast({
        title: "Cutoff Date Set",
        description: `Availabilities before ${format(date, 'MMMM dd, yyyy')} are now locked.`,
      });
      
      // In a real app, this would save the cutoff date to the database
      availabilityService.setCutoffDate(date);
    } else {
      toast({
        title: "Cutoff Date Removed",
        description: "All dates can now be modified.",
      });
    }
  };
  
  // Apply a preset availability pattern
  const applyPreset = async (data: {
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
      
      // Apply the preset using the availabilityService
      const response = await availabilityService.applyPreset(
        'current-user',
        data.presetId,
        data.startDate,
        data.endDate
      );
      
      // Convert the response to ensure it matches our Availability type
      const convertedResponse: Availability[] = response.map(item => ({
        ...item,
        status: item.status || 'Not Specified',
        timeSlots: item.timeSlots.map(slot => ({
          ...slot,
          status: slot.status || item.status || 'Not Specified'
        }))
      }));
      
      // Update local state with the new availabilities
      setMonthlyAvailabilities(prev => {
        // Remove existing availabilities in the date range
        const filtered = prev.filter(item => {
          const itemDate = parse(item.date, 'yyyy-MM-dd', new Date());
          return !(itemDate >= data.startDate && itemDate <= data.endDate);
        });
        
        // Add the new availabilities
        return [...filtered, ...convertedResponse];
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
  };

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
    presets: availabilityPresets
  };
}
