
import { supabase } from '@/integrations/supabase/client';
import { DayAvailability, TimeSlot, AvailabilityPreset } from '../models/types';
import { format, eachDayOfInterval } from 'date-fns';

// Helper function to determine overall day status based on time slots
const determineDayStatus = (timeSlots: Omit<TimeSlot, 'id'>[]): 'Available' | 'Unavailable' | 'Partial' => {
  if (!timeSlots || timeSlots.length === 0) return 'Available';
  
  const hasAvailable = timeSlots.some(slot => slot.status === 'Available');
  const hasUnavailable = timeSlots.some(slot => slot.status === 'Unavailable');
  
  if (hasAvailable && hasUnavailable) return 'Partial';
  if (hasAvailable) return 'Available';
  return 'Unavailable';
};

// Helper function to normalize status values for database
const normalizeStatus = (status: string): 'Available' | 'Unavailable' | 'Partial' | 'Limited' | 'Tentative' | 'On Leave' | 'Not Specified' => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'Available';
    case 'unavailable':
      return 'Unavailable';
    case 'partial':
      return 'Partial';
    case 'limited':
      return 'Limited';
    case 'tentative':
      return 'Tentative';
    case 'on leave':
    case 'on-leave':
      return 'On Leave';
    default:
      return 'Not Specified';
  }
};

export const availabilityService = {
  // Get all availabilities for an employee in a given month
  getMonthlyAvailabilities: async (
    employeeId: string,
    year: number,
    month: number
  ): Promise<DayAvailability[]> => {
    try {
      // Calculate date range for the month
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
      
      console.log(`Fetching availabilities for ${employeeId} from ${startDate} to ${endDate}`);
      
      // Fetch availabilities with their time slots
      const { data: availabilities, error } = await supabase
        .from('availabilities')
        .select(`
          *,
          availability_time_slots (
            id,
            start_time,
            end_time,
            status
          )
        `)
        .eq('employee_id', employeeId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date');
      
      if (error) {
        console.error('Error fetching availabilities:', error);
        throw error;
      }
      
      // Transform the data to match DayAvailability interface
      const result: DayAvailability[] = (availabilities || []).map(avail => ({
        id: avail.id,
        employeeId: avail.employee_id,
        date: avail.date,
        status: avail.status,
        notes: avail.notes,
        timeSlots: (avail.availability_time_slots || []).map((slot: any) => ({
          id: slot.id,
          startTime: slot.start_time,
          endTime: slot.end_time,
          status: slot.status
        }))
      }));
      
      console.log(`Found ${result.length} availabilities for the month`);
      return result;
    } catch (error) {
      console.error('Error in getMonthlyAvailabilities:', error);
      throw error;
    }
  },
  
  // Get availability for a specific day
  getDayAvailability: async (
    employeeId: string,
    date: Date
  ): Promise<DayAvailability | null> => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const { data: availability, error } = await supabase
        .from('availabilities')
        .select(`
          *,
          availability_time_slots (
            id,
            start_time,
            end_time,
            status
          )
        `)
        .eq('employee_id', employeeId)
        .eq('date', dateStr)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found
          return null;
        }
        throw error;
      }
      
      return {
        id: availability.id,
        employeeId: availability.employee_id,
        date: availability.date,
        status: availability.status,
        notes: availability.notes,
        timeSlots: (availability.availability_time_slots || []).map((slot: any) => ({
          id: slot.id,
          startTime: slot.start_time,
          endTime: slot.end_time,
          status: slot.status
        }))
      };
    } catch (error) {
      console.error('Error in getDayAvailability:', error);
      throw error;
    }
  },
  
  // Set availability for a date range
  setAvailabilityRange: async (
    employeeId: string,
    startDate: Date,
    endDate: Date,
    timeSlots: Omit<TimeSlot, 'id'>[],
    notes?: string
  ): Promise<DayAvailability[]> => {
    try {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const createdAvailabilities: DayAvailability[] = [];
      
      // Check cutoff date first
      const { data: cutoffs } = await supabase
        .from('availability_cutoffs')
        .select('cutoff_date')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      const cutoffDate = cutoffs?.[0]?.cutoff_date ? new Date(cutoffs[0].cutoff_date) : null;
      
      for (const day of days) {
        // Skip if past cutoff date
        if (cutoffDate && day < cutoffDate) {
          console.log(`Skipping ${format(day, 'yyyy-MM-dd')} - past cutoff date`);
          continue;
        }
        
        const dateStr = format(day, 'yyyy-MM-dd');
        const status = determineDayStatus(timeSlots);
        
        // Create or update availability record
        const { data: availability, error: availError } = await supabase
          .from('availabilities')
          .upsert({
            employee_id: employeeId,
            date: dateStr,
            status,
            notes
          }, {
            onConflict: 'employee_id,date'
          })
          .select()
          .single();
        
        if (availError) {
          console.error('Error creating availability:', availError);
          throw availError;
        }
        
        // Delete existing time slots for this availability
        await supabase
          .from('availability_time_slots')
          .delete()
          .eq('availability_id', availability.id);
        
        // Create new time slots
        if (timeSlots.length > 0) {
          const slotsToInsert = timeSlots.map(slot => ({
            availability_id: availability.id,
            start_time: slot.startTime,
            end_time: slot.endTime,
            status: normalizeStatus(slot.status || status)
          }));
          
          const { data: createdSlots, error: slotsError } = await supabase
            .from('availability_time_slots')
            .insert(slotsToInsert)
            .select();
          
          if (slotsError) {
            console.error('Error creating time slots:', slotsError);
            throw slotsError;
          }
          
          // Build the complete availability object
          const dayAvailability: DayAvailability = {
            id: availability.id,
            employeeId: availability.employee_id,
            date: availability.date,
            status: availability.status,
            notes: availability.notes,
            timeSlots: (createdSlots || []).map(slot => ({
              id: slot.id,
              startTime: slot.start_time,
              endTime: slot.end_time,
              status: slot.status
            }))
          };
          
          createdAvailabilities.push(dayAvailability);
        }
      }
      
      console.log(`Created ${createdAvailabilities.length} availability records`);
      return createdAvailabilities;
    } catch (error) {
      console.error('Error in setAvailabilityRange:', error);
      throw error;
    }
  },
  
  // Delete availability for a specific date
  deleteAvailability: async (
    employeeId: string,
    date: Date
  ): Promise<boolean> => {
    try {
      // Check cutoff date
      const { data: cutoffs } = await supabase
        .from('availability_cutoffs')
        .select('cutoff_date')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      const cutoffDate = cutoffs?.[0]?.cutoff_date ? new Date(cutoffs[0].cutoff_date) : null;
      
      if (cutoffDate && date < cutoffDate) {
        console.log('Cannot delete - past cutoff date');
        return false;
      }
      
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('availabilities')
        .delete()
        .eq('employee_id', employeeId)
        .eq('date', dateStr);
      
      if (error) {
        console.error('Error deleting availability:', error);
        throw error;
      }
      
      console.log(`Deleted availability for ${dateStr}`);
      return true;
    } catch (error) {
      console.error('Error in deleteAvailability:', error);
      throw error;
    }
  },
  
  // Apply a preset to a date range
  applyPreset: async (
    employeeId: string,
    presetId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DayAvailability[]> => {
    try {
      // Fetch the preset with its time slots
      const { data: preset, error: presetError } = await supabase
        .from('availability_presets')
        .select(`
          *,
          preset_time_slots (
            start_time,
            end_time,
            status,
            days_of_week
          )
        `)
        .eq('id', presetId)
        .single();
      
      if (presetError) {
        console.error('Error fetching preset:', presetError);
        throw new Error('Preset not found');
      }
      
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const createdAvailabilities: DayAvailability[] = [];
      
      for (const day of days) {
        const dayOfWeek = day.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Filter time slots for this day of week
        const applicableSlots = (preset.preset_time_slots || []).filter((slot: any) => {
          if (!slot.days_of_week || slot.days_of_week.length === 0) {
            return true; // Apply to all days if no specific days
          }
          return slot.days_of_week.includes(dayOfWeek);
        });
        
        if (applicableSlots.length > 0) {
          const timeSlots = applicableSlots.map((slot: any) => ({
            startTime: slot.start_time,
            endTime: slot.end_time,
            status: slot.status
          }));
          
          const result = await availabilityService.setAvailabilityRange(
            employeeId,
            day,
            day,
            timeSlots,
            `Applied preset: ${preset.name}`
          );
          
          createdAvailabilities.push(...result);
        }
      }
      
      console.log(`Applied preset "${preset.name}" to ${createdAvailabilities.length} days`);
      return createdAvailabilities;
    } catch (error) {
      console.error('Error in applyPreset:', error);
      throw error;
    }
  },
  
  // Get all presets
  getPresets: async (): Promise<AvailabilityPreset[]> => {
    try {
      const { data: presets, error } = await supabase
        .from('availability_presets')
        .select(`
          *,
          preset_time_slots (
            id,
            start_time,
            end_time,
            status,
            days_of_week
          )
        `)
        .order('name');
      
      if (error) {
        console.error('Error fetching presets:', error);
        throw error;
      }
      
      return (presets || []).map(preset => ({
        id: preset.id,
        name: preset.name,
        type: preset.type,
        pattern: {}, // Simplified pattern handling
        timeSlots: (preset.preset_time_slots || []).map((slot: any) => ({
          id: slot.id,
          startTime: slot.start_time,
          endTime: slot.end_time,
          status: slot.status,
          daysOfWeek: slot.days_of_week
        }))
      }));
    } catch (error) {
      console.error('Error in getPresets:', error);
      throw error;
    }
  },
  
  // Create a custom preset
  createPreset: async (preset: Omit<AvailabilityPreset, 'id'>): Promise<AvailabilityPreset> => {
    try {
      const { data: newPreset, error: presetError } = await supabase
        .from('availability_presets')
        .insert({
          name: preset.name,
          type: preset.type,
          pattern: JSON.stringify(preset.pattern) // Convert to JSON string
        })
        .select()
        .single();
      
      if (presetError) {
        console.error('Error creating preset:', presetError);
        throw presetError;
      }
      
      // Create time slots for the preset
      if (preset.timeSlots && preset.timeSlots.length > 0) {
        const slotsToInsert = preset.timeSlots.map(slot => ({
          preset_id: newPreset.id,
          start_time: slot.startTime,
          end_time: slot.endTime,
          status: normalizeStatus(slot.status),
          days_of_week: slot.daysOfWeek
        }));
        
        const { data: createdSlots, error: slotsError } = await supabase
          .from('preset_time_slots')
          .insert(slotsToInsert)
          .select();
        
        if (slotsError) {
          console.error('Error creating preset time slots:', slotsError);
          throw slotsError;
        }
        
        return {
          id: newPreset.id,
          name: newPreset.name,
          type: newPreset.type,
          pattern: {}, // Simplified pattern handling
          timeSlots: (createdSlots || []).map(slot => ({
            id: slot.id,
            startTime: slot.start_time,
            endTime: slot.end_time,
            status: slot.status,
            daysOfWeek: slot.days_of_week
          }))
        };
      }
      
      return {
        id: newPreset.id,
        name: newPreset.name,
        type: newPreset.type,
        pattern: {},
        timeSlots: []
      };
    } catch (error) {
      console.error('Error in createPreset:', error);
      throw error;
    }
  },
  
  // Set cutoff date (for manager use)
  setCutoffDate: async (date: Date | null): Promise<boolean> => {
    try {
      if (date) {
        // Deactivate existing cutoffs
        await supabase
          .from('availability_cutoffs')
          .update({ is_active: false })
          .eq('is_active', true);
        
        // Create new cutoff
        const { error } = await supabase
          .from('availability_cutoffs')
          .insert({
            cutoff_date: format(date, 'yyyy-MM-dd'),
            created_by: 'current-user', // This should be the actual user ID
            is_active: true
          });
        
        if (error) {
          console.error('Error setting cutoff date:', error);
          throw error;
        }
      } else {
        // Remove all active cutoffs
        const { error } = await supabase
          .from('availability_cutoffs')
          .update({ is_active: false })
          .eq('is_active', true);
        
        if (error) {
          console.error('Error removing cutoff date:', error);
          throw error;
        }
      }
      
      console.log(`Cutoff date ${date ? 'set to ' + format(date, 'yyyy-MM-dd') : 'removed'}`);
      return true;
    } catch (error) {
      console.error('Error in setCutoffDate:', error);
      throw error;
    }
  },
  
  // Get current cutoff date
  getCutoffDate: async (): Promise<Date | null> => {
    try {
      const { data: cutoffs, error } = await supabase
        .from('availability_cutoffs')
        .select('cutoff_date')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching cutoff date:', error);
        throw error;
      }
      
      return cutoffs?.[0]?.cutoff_date ? new Date(cutoffs[0].cutoff_date) : null;
    } catch (error) {
      console.error('Error in getCutoffDate:', error);
      throw error;
    }
  }
};
