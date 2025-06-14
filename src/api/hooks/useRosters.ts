
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rosterService } from '../services/rosterService';
import { Roster, Role, RemunerationLevel, DepartmentName, DepartmentColor } from '../models/types';

export const useRosters = () => {
  const queryClient = useQueryClient();
  
  // Get all rosters
  const useAllRosters = () => {
    return useQuery({
      queryKey: ['rosters'],
      queryFn: rosterService.getAllRosters
    });
  };
  
  // Get rosters by date range
  const useRostersByDateRange = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['rosters', 'range', startDate, endDate],
      queryFn: () => rosterService.getRostersByDateRange(startDate, endDate),
      enabled: !!startDate && !!endDate
    });
  };
  
  // Get roster by date
  const useRosterByDate = (date: string) => {
    return useQuery({
      queryKey: ['rosters', 'date', date],
      queryFn: () => rosterService.getRosterByDate(date),
      enabled: !!date
    });
  };
  
  // Create roster
  const useCreateRoster = () => {
    return useMutation({
      mutationFn: ({ date, templateId }: { date: string, templateId: number }) => 
        rosterService.createRoster(date, templateId),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['rosters'] });
        queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
      }
    });
  };
  
  // Update roster
  const useUpdateRoster = () => {
    return useMutation({
      mutationFn: ({ date, updates }: { date: string, updates: Partial<Roster> }) => 
        rosterService.updateRoster(date, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  // Assign employee to shift
  const useAssignEmployeeToShift = () => {
    return useMutation({
      mutationFn: ({ 
        date, 
        groupId, 
        subGroupId, 
        shiftId, 
        employeeId 
      }: { 
        date: string; 
        groupId: number; 
        subGroupId: number; 
        shiftId: string; 
        employeeId: string;
      }) => 
        rosterService.assignEmployeeToShift(date, groupId, subGroupId, shiftId, employeeId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  // Update shift in roster
  const useUpdateShift = () => {
    return useMutation({
      mutationFn: ({ 
        date, 
        groupId, 
        subGroupId, 
        shiftId, 
        updates 
      }: { 
        date: string; 
        groupId: number; 
        subGroupId: number; 
        shiftId: string; 
        updates: Partial<{ startTime: string; endTime: string; role: Role; remunerationLevel: RemunerationLevel; breakDuration: string }>;
      }) => 
        rosterService.updateShift(date, groupId, subGroupId, shiftId, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  // Add shift to roster
  const useAddShift = () => {
    return useMutation({
      mutationFn: ({ 
        date, 
        groupId, 
        subGroupId, 
        shift 
      }: { 
        date: string; 
        groupId: number; 
        subGroupId: number; 
        shift: any;
      }) => 
        rosterService.addShiftToRoster(date, groupId, subGroupId, shift),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  // Remove shift from roster
  const useRemoveShift = () => {
    return useMutation({
      mutationFn: ({ 
        date, 
        groupId, 
        subGroupId, 
        shiftId 
      }: { 
        date: string; 
        groupId: number; 
        subGroupId: number; 
        shiftId: string;
      }) => 
        rosterService.removeShiftFromRoster(date, groupId, subGroupId, shiftId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  // Add group to roster
  const useAddGroup = () => {
    return useMutation({
      mutationFn: ({ 
        date, 
        group 
      }: { 
        date: string; 
        group: { name: DepartmentName; color: DepartmentColor };
      }) => 
        rosterService.addGroupToRoster(date, group),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  // Add subgroup to roster
  const useAddSubGroup = () => {
    return useMutation({
      mutationFn: ({ 
        date, 
        groupId, 
        name 
      }: { 
        date: string; 
        groupId: number; 
        name: string;
      }) => 
        rosterService.addSubGroupToRoster(date, groupId, name),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  // Remove group from roster
  const useRemoveGroup = () => {
    return useMutation({
      mutationFn: ({ 
        date, 
        groupId 
      }: { 
        date: string; 
        groupId: number;
      }) => 
        rosterService.removeGroupFromRoster(date, groupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  // Remove subgroup from roster
  const useRemoveSubGroup = () => {
    return useMutation({
      mutationFn: ({ 
        date, 
        groupId, 
        subGroupId 
      }: { 
        date: string; 
        groupId: number; 
        subGroupId: number;
      }) => 
        rosterService.removeSubGroupFromRoster(date, groupId, subGroupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['rosters'] });
          queryClient.invalidateQueries({ queryKey: ['rosters', 'date', data.date] });
        }
      }
    });
  };
  
  return {
    useAllRosters,
    useRostersByDateRange,
    useRosterByDate,
    useCreateRoster,
    useUpdateRoster,
    useAssignEmployeeToShift,
    useUpdateShift,
    useAddShift,
    useRemoveShift,
    useAddGroup,
    useAddSubGroup,
    useRemoveGroup,
    useRemoveSubGroup
  };
};
