
import { Employee, Shift, Roster } from '@/api/models/types';

// Filter types
export type FilterCategory = 
  | 'employee' 
  | 'region' 
  | 'location' 
  | 'department' 
  | 'role' 
  | 'area' 
  | 'assignment'
  | 'status'
  | 'shiftDefinition'
  | 'employmentType'
  | 'event'
  | 'function'
  | 'shiftType'
  | 'eventType';

export interface FilterOption {
  id: string;
  label: string;
  category: FilterCategory;
}

export interface ShiftWithDetails {
  shift: Shift;
  groupName: string;
  groupColor: string;
  subGroupName: string;
}

export interface ShiftAssignment {
  shiftId: string;
  employeeId: string;
}
