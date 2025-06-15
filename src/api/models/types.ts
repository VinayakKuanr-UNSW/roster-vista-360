
/* ------------------------------------------------------------------ */
/*                          GLOBAL ENUMS & TYPES                      */
/* ------------------------------------------------------------------ */

/** All statuses we log in the audit trail - standardized to snake_case */
export type AuditStatus =
  // 1⃣ Creation
  | "created_draft" | "created_final" | "generated_auto"
  // 2⃣ Assignment & bidding
  | "unassigned" | "assigned"
  | "offered_for_bidding" | "bid_pending" | "bid_confirmed"
  // 3⃣ Employee response
  | "accepted" | "declined" | "no_response"
  // 4⃣ Live / in‑shift
  | "confirmed" | "in_progress" | "on_break" | "completed"
  // 5⃣ Edits & reassign
  | "edited_time" | "edited_details" | "reassigned"
  // 6⃣ Swap flow
  | "swap_requested" | "swap_pending" | "swap_approved"
  | "swap_rejected" | "swap_cancelled"
  // 7⃣ Cancellation & no‑show
  | "cancelled_by_employee" | "cancelled_by_admin" | "late_cancellation"
  | "no_show"
  // 8⃣ Deletion
  | "deleted"
  // 9⃣ Post‑shift audit
  | "under_review" | "disputed"
  | "approved_timesheet" | "rejected_timesheet";

/** A single audit‑trail record */
export interface AuditEvent {
  id: string;          // unique id
  status: AuditStatus; // what happened
  at: string;          // ISO timestamp
  notes?: string;      // optional reason / comment
}

/* ------------------------------------------------------------------ */
/*                             TEMPLATE TYPES                         */
/* ------------------------------------------------------------------ */

export interface Template {
  id: number;
  name: string;
  description?: string;
  groups: Group[];
  createdAt: string;
  updatedAt: string;
  department_id?: number;
  sub_department_id?: number;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'published';
}

export interface DBTemplate {
  template_id: number;
  name: string;
  description?: string;
  groups?: Group[] | string;
  created_at: string;
  updated_at: string;
  department_id: number;
  sub_department_id: number;
  start_date: string;
  end_date: string;
  status?: string;
}

/* ------------------------------------------------------------------ */
/*                               GROUPS                               */
/* ------------------------------------------------------------------ */

export interface Group {
  id: number;
  name: DepartmentName;
  color: DepartmentColor;
  subGroups: SubGroup[];
}

export interface SubGroup {
  id: number;
  name: string;
  shifts: Shift[];
}

/* ------------------------------------------------------------------ */
/*                                SHIFTS                              */
/* ------------------------------------------------------------------ */

export interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  role: Role;
  requiredSkills?: string[];
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  employeeId?: string;
  employee?: Employee;
  status?: ShiftStatus;
  notes?: string;
  remunerationLevel?: RemunerationLevel;
  breakDuration?: string;
  actualStartTime?: string;
  actualEndTime?: string;
}

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
  assignedEmployee?: string | null;
}

export type ShiftStatus =
  | 'scheduled'
  | 'completed'
  | 'in-progress'
  | 'cancelled'
  | 'no-show'
  | 'Assigned'
  | 'Completed'
  | 'Cancelled'
  | 'Swapped'
  | 'No-Show';

export type Role =
  | 'Manager'
  | 'Supervisor'
  | 'Team Leader'
  | 'Staff'
  | 'Casual'
  | 'Contractor'
  | 'TM2'
  | 'TM3'
  | 'Coordinator';

export type RemunerationLevel = 1 | 2 | 3 | 4 | 5 | string;

/* ------------------------------------------------------------------ */
/*                           DEPARTMENTS                              */
/* ------------------------------------------------------------------ */

export type DepartmentName =
  | 'Convention Centre'
  | 'Exhibition Centre'
  | 'Theatre'
  | 'IT'
  | 'Darling Harbor Theatre'
  | string;

export type DepartmentColor = 'blue' | 'green' | 'red' | 'purple' | 'sky' | string;

/* ------------------------------------------------------------------ */
/*                              ROSTERS                               */
/* ------------------------------------------------------------------ */

export interface Roster {
  id: number;
  date: string;
  groups: Group[];
  status: 'draft' | 'published' | 'approved';
  createdAt: string;
  updatedAt: string;
  templateId?: number;
  rosterId?: number;
}

/* ------------------------------------------------------------------ */
/*                             EMPLOYEES                              */
/* ------------------------------------------------------------------ */

export interface Employee {
  id: string;
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  department?: string;
  role?: Role;
  tier?: string;
  remunerationLevel?: RemunerationLevel;
  status?: 'active' | 'inactive' | 'on-leave';
  availability?: Record<string, TimeSlot[]>;
  avatar?: string;
}

/* ------------------------------------------------------------------ */
/*                            TIMESHEETS                              */
/* ------------------------------------------------------------------ */

export interface Timesheet {
  id: number;
  date: string;
  groups: Group[];
  totalHours: number;
  totalPay: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  rosterId?: number;
}

/* ------------------------------------------------------------------ */
/*                               BIDS                                 */
/* ------------------------------------------------------------------ */

export interface Bid {
  id: string;
  shiftId: string;
  employeeId: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Confirmed';
  createdAt: string;
  notes?: string;
}

/* ------------------------------------------------------------------ */
/*                        AVAILABILITY TYPES                          */
/* ------------------------------------------------------------------ */

export interface DayAvailability {
  date: string;
  timeSlots: TimeSlot[];
  status?: AvailabilityStatus;
  notes?: string;
  id?: string;
  employeeId?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
  daysOfWeek?: number[];
}

export type AvailabilityStatus =
  | 'available'
  | 'unavailable'
  | 'preferred'
  | 'Available'
  | 'Unavailable'
  | 'Partial'
  | 'partial'
  | 'Limited'
  | 'limited'
  | 'Tentative'
  | 'tentative'
  | 'On Leave'
  | 'on leave'
  | 'On-Leave'
  | 'on-leave'
  | 'Not Specified';

export interface AvailabilityPreset {
  id: string;
  name: string;
  pattern: Record<string, TimeSlot[]>;
  type?: string;
  timeSlots?: any;
}

export type TimeSlotNoId = Omit<TimeSlot, 'id'>;
