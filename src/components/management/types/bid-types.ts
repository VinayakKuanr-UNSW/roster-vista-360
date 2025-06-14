
import { Bid, Employee } from '@/api/models/types';

export interface ShiftDetails {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  netLength: string;
  paidBreakDuration: string;
  unpaidBreakDuration: string;
  department: string;
  subDepartment: string;
  role: string;
  remunerationLevel: string | number;
  status: string;
  isDraft: boolean;
  assignedEmployee?: string;
}

export interface BidWithEmployee extends Bid {
  employee?: Employee;
  shiftDetails?: ShiftDetails;
}

export type GroupedBids = Record<string, BidWithEmployee[]>;

export interface ApplicantTag {
  text: string;
  color: string;
  tooltip?: string;
}

export interface SortOption {
  id: string;
  name: string;
  value: keyof ShiftDetails | 'timestamp' | 'suitabilityScore';
  direction: 'asc' | 'desc';
}

// Adding the missing exports
export const departments = [
  'All Departments',
  'Convention Centre',
  'Exhibition Centre',
  'Theatre',
  'IT',
  'Darling Harbor Theatre'
];

export const subDepartments = [
  'All Sub-departments',
  'AM Base',
  'AM Assist',
  'AM Floaters',
  'Bump-In',
  'Tech Support'
];

export const roles = [
  'All Roles',
  'Manager',
  'Supervisor',
  'Team Leader',
  'Staff',
  'Casual',
  'Contractor',
  'TM2',
  'TM3',
  'Coordinator'
];
