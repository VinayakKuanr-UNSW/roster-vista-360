
import { DayAvailability, TimeSlot, AvailabilityPreset } from '../models/types';
import { format, addDays, eachDayOfInterval, isWeekend, getDay } from 'date-fns';

// Mock data for availabilities
const MOCK_AVAILABILITIES: Record<string, DayAvailability[]> = {};

// Store a cutoff date
let MOCK_CUTOFF_DATE: Date | null = null;

// Mock data for presets
const PRESETS: AvailabilityPreset[] = [
  {
    id: '1',
    name: 'Weekdays Only',
    type: 'weekdays',
    pattern: {}, // Add the required pattern property
    timeSlots: [
      {
        startTime: '09:00',
        endTime: '17:00',
        status: 'Available',
        daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
      }
    ]
  },
  {
    id: '2',
    name: 'Weekends Only',
    type: 'weekends',
    pattern: {}, // Add the required pattern property
    timeSlots: [
      {
        startTime: '10:00',
        endTime: '18:00',
        status: 'Available',
        daysOfWeek: [0, 6] // Sunday, Saturday
      }
    ]
  },
  {
    id: '3',
    name: 'Mornings Only',
    type: 'custom',
    pattern: {}, // Add the required pattern property
    timeSlots: [
      {
        startTime: '07:00',
        endTime: '12:00',
        status: 'Available'
      }
    ]
  },
  {
    id: '4',
    name: 'Evenings Only',
    type: 'custom',
    pattern: {}, // Add the required pattern property
    timeSlots: [
      {
        startTime: '17:00',
        endTime: '23:00',
        status: 'Available'
      }
    ]
  },
  {
    id: '5',
    name: 'Full Day',
    type: 'custom',
    pattern: {}, // Add the required pattern property
    timeSlots: [
      {
        startTime: '00:00',
        endTime: '23:59',
        status: 'Available'
      }
    ]
  },
  {
    id: '6',
    name: 'Fully Unavailable',
    type: 'custom',
    pattern: {}, // Add the required pattern property
    timeSlots: [
      {
        startTime: '00:00',
        endTime: '23:59',
        status: 'Unavailable'
      }
    ]
  }
];

// Helper function to determine overall day status based on time slots
const determineDayStatus = (timeSlots: TimeSlot[]): 'Available' | 'Unavailable' | 'Partial' => {
  const hasAvailable = timeSlots.some(slot => slot.status === 'Available');
  const hasUnavailable = timeSlots.some(slot => slot.status === 'Unavailable');
  
  if (hasAvailable && hasUnavailable) return 'Partial';
  if (hasAvailable) return 'Available';
  return 'Unavailable';
};

export const availabilityService = {
  // Get all availabilities for an employee in a given month
  getMonthlyAvailabilities: async (
    employeeId: string,
    year: number,
    month: number
  ): Promise<DayAvailability[]> => {
    const key = `${employeeId}-${year}-${month}`;
    return Promise.resolve(MOCK_AVAILABILITIES[key] || []);
  },
  
  // Get availability for a specific day
  getDayAvailability: async (
    employeeId: string,
    date: Date
  ): Promise<DayAvailability | null> => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const monthKey = `${employeeId}-${date.getFullYear()}-${date.getMonth() + 1}`;
    
    const monthData = MOCK_AVAILABILITIES[monthKey] || [];
    const dayData = monthData.find(day => day.date === dateKey);
    
    return Promise.resolve(dayData || null);
  },
  
  // Set availability for a date range
  setAvailabilityRange: async (
    employeeId: string,
    startDate: Date,
    endDate: Date,
    timeSlots: Omit<TimeSlot, 'id'>[],
    notes?: string
  ): Promise<DayAvailability[]> => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const createdAvailabilities: DayAvailability[] = [];
    
    for (const day of days) {
      // Check if past cutoff date
      if (MOCK_CUTOFF_DATE && day < MOCK_CUTOFF_DATE) {
        continue; // Skip this date if it's past the cutoff
      }
      
      const dateKey = format(day, 'yyyy-MM-dd');
      const monthKey = `${employeeId}-${day.getFullYear()}-${day.getMonth() + 1}`;
      
      if (!MOCK_AVAILABILITIES[monthKey]) {
        MOCK_AVAILABILITIES[monthKey] = [];
      }
      
      // Create TimeSlots with IDs
      const slotsWithIds = timeSlots.map(slot => ({
        ...slot,
        id: Math.random().toString(36).substring(2, 11)
      }));
      
      // Determine overall day status
      const status = determineDayStatus(slotsWithIds);
      
      // Create or update availability
      const existingIndex = MOCK_AVAILABILITIES[monthKey].findIndex(a => a.date === dateKey);
      const availability: DayAvailability = {
        date: dateKey,
        timeSlots: slotsWithIds,
        status,
        notes,
        id: Math.random().toString(36).substring(2, 11),
        employeeId // Adding employeeId
      };
      
      if (existingIndex >= 0) {
        MOCK_AVAILABILITIES[monthKey][existingIndex] = availability;
      } else {
        MOCK_AVAILABILITIES[monthKey].push(availability);
      }
      
      createdAvailabilities.push(availability);
    }
    
    return Promise.resolve(createdAvailabilities);
  },
  
  // Delete availability for a specific date
  deleteAvailability: async (
    employeeId: string,
    date: Date
  ): Promise<boolean> => {
    // Check if past cutoff date
    if (MOCK_CUTOFF_DATE && date < MOCK_CUTOFF_DATE) {
      return Promise.resolve(false); // Cannot delete if past cutoff
    }
    
    const dateKey = format(date, 'yyyy-MM-dd');
    const monthKey = `${employeeId}-${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!MOCK_AVAILABILITIES[monthKey]) {
      return Promise.resolve(false);
    }
    
    const initialLength = MOCK_AVAILABILITIES[monthKey].length;
    MOCK_AVAILABILITIES[monthKey] = MOCK_AVAILABILITIES[monthKey].filter(
      a => a.date !== dateKey
    );
    
    const wasDeleted = MOCK_AVAILABILITIES[monthKey].length < initialLength;
    return Promise.resolve(wasDeleted);
  },
  
  // Apply a preset to a date range
  applyPreset: async (
    employeeId: string,
    presetId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DayAvailability[]> => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) {
      throw new Error('Preset not found');
    }
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const createdAvailabilities: DayAvailability[] = [];
    
    for (const day of days) {
      // Check if past cutoff date
      if (MOCK_CUTOFF_DATE && day < MOCK_CUTOFF_DATE) {
        continue; // Skip this date if it's past the cutoff
      }
      
      const dayOfWeek = getDay(day);
      
      // Only apply to specific days if the preset specifies days of week
      const timeSlots = preset.timeSlots.filter(slot => {
        if (!slot.daysOfWeek) return true; // Apply to all days if no specific days
        return slot.daysOfWeek.includes(dayOfWeek);
      });
      
      if (timeSlots.length > 0) {
        const result = await availabilityService.setAvailabilityRange(
          employeeId,
          day,
          day,
          timeSlots.map(({ startTime, endTime, status }) => ({ startTime, endTime, status })),
          `Applied preset: ${preset.name}`
        );
        createdAvailabilities.push(...result);
      }
    }
    
    return Promise.resolve(createdAvailabilities);
  },
  
  // Get all presets
  getPresets: async (): Promise<AvailabilityPreset[]> => {
    return Promise.resolve([...PRESETS]);
  },
  
  // Create a custom preset
  createPreset: async (preset: Omit<AvailabilityPreset, 'id'>): Promise<AvailabilityPreset> => {
    const newPreset: AvailabilityPreset = {
      ...preset,
      id: Math.random().toString(36).substring(2, 11)
    };
    
    PRESETS.push(newPreset);
    return Promise.resolve(newPreset);
  },
  
  // Set cutoff date (for manager use)
  setCutoffDate: async (date: Date | null): Promise<boolean> => {
    // Store the cutoff date in the mock database
    MOCK_CUTOFF_DATE = date;
    return Promise.resolve(true);
  },
  
  // Get current cutoff date (for UI display)
  getCutoffDate: async (): Promise<Date | null> => {
    return Promise.resolve(MOCK_CUTOFF_DATE);
  }
};
