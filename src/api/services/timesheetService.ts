import {
  Timesheet,
  ShiftStatus,
  AuditEvent,
  AuditStatus,
} from '../models/types';
import { currentWeekTimesheets, generateTimesheet } from '../data/mockData';
import { rosterService } from './rosterService';

/* ------------------------------------------------------------------ */
/*                    FLEXIBLE MOCK‑AUDIT GENERATOR                   */
/* ------------------------------------------------------------------ */

interface AuditMockOpts {
  /** total events to return (default = 6) */
  count?: number;
  /** maximum minutes between successive events (default = 15) */
  maxGapMins?: number;
  /** optional subset of statuses to choose from */
  statuses?: AuditStatus[];
}

/** Create semi‑random mock audit events for a timesheet */
const generateMockAuditEvents = (
  timesheetId: number,
  opts: AuditMockOpts = {},
): AuditEvent[] => {
  const {
    count = 6,
    maxGapMins = 15,
    statuses = [
      'Create',
      'Publish',
      'Assign',
      'Accept',
      'ClockIn',
      'ClockOut',
      'Edit',
      'Complete',
      'Cancel',
    ],
  } = opts;

  /* simple array shuffle */
  const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => (Math.random() > 0.5 ? 1 : -1));

  const chosen = shuffle(statuses).slice(0, count);
  let cursor = Date.now() - Math.floor(Math.random() * 86_400_000); // start ≤24 h ago

  return chosen.map((status, idx) => {
    cursor += Math.floor(Math.random() * maxGapMins + 1) * 60_000; // up to maxGapMins
    return {
      id: `${timesheetId}-${idx}`,
      status,
      at: new Date(cursor).toISOString(),
      notes: `Mock ${status} event`,
    };
  });
};

/* ------------------------------------------------------------------ */
/*                       IN‑MEMORY TIMESHEET STORE                    */
/* ------------------------------------------------------------------ */

let timesheets = [...currentWeekTimesheets];

/* handy deep‑clone helper */
const clone = <T,>(obj: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj));

export const timesheetService = {
  /* ----------------------------- READERS ------------------------- */

  getAllTimesheets: async (): Promise<Timesheet[]> =>
    Promise.resolve([...timesheets]),

  getTimesheetsByDateRange: async (
    startDate: string,
    endDate: string,
  ): Promise<Timesheet[]> => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = timesheets.filter(({ date }) => {
      const d = new Date(date);
      return d >= start && d <= end;
    });
    return Promise.resolve(filtered);
  },

  getTimesheetByDate: async (date: string): Promise<Timesheet | null> => {
    const ts = timesheets.find((t) => t.date.split('T')[0] === date.split('T')[0]);
    if (ts) return Promise.resolve(ts);

    /* auto‑generate from roster if missing */
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);

    const newTs = generateTimesheet(roster);
    timesheets.push(newTs);
    return Promise.resolve(newTs);
  },

  /* ----------------------------- WRITERS ------------------------- */

  updateTimesheet: async (
    date: string,
    updates: Partial<Timesheet>,
  ): Promise<Timesheet | null> => {
    const idx = timesheets.findIndex(
      (t) => t.date.split('T')[0] === date.split('T')[0],
    );
    if (idx === -1) return Promise.resolve(null);

    const updated = {
      ...timesheets[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as Timesheet;

    timesheets[idx] = updated;
    return Promise.resolve(updated);
  },

  /* --------------------- SHIFT‑LEVEL OPERATIONS ------------------ */

  updateShiftStatus: async (
    date,
    groupId,
    subGroupId,
    shiftId,
    status,
  ): Promise<Timesheet | null> => {
    const ts = await timesheetService.getTimesheetByDate(date);
    if (!ts) return Promise.resolve(null);

    const copy = clone(ts);

    const group = copy.groups.find((g) => g.id === groupId);
    const sub = group?.subGroups.find((sg) => sg.id === subGroupId);
    const shift = sub?.shifts.find((s) => s.id === shiftId);
    if (!shift) return Promise.resolve(null);

    shift.status = status;
    return timesheetService.updateTimesheet(date, copy);
  },

  clockInShift: async (
    date,
    groupId,
    subGroupId,
    shiftId,
    actualStartTime,
  ): Promise<Timesheet | null> => {
    const ts = await timesheetService.getTimesheetByDate(date);
    if (!ts) return Promise.resolve(null);

    const copy = clone(ts);
    const shift =
      copy.groups
        .find((g) => g.id === groupId)
        ?.subGroups.find((sg) => sg.id === subGroupId)
        ?.shifts.find((s) => s.id === shiftId) ?? null;

    if (!shift || (shift.status !== 'Assigned' && shift.status !== 'Swapped'))
      return Promise.resolve(null);

    shift.actualStartTime = actualStartTime;
    shift.status = 'in-progress';
    return timesheetService.updateTimesheet(date, copy);
  },

  clockOutShift: async (
    date,
    groupId,
    subGroupId,
    shiftId,
    actualEndTime,
  ): Promise<Timesheet | null> => {
    const ts = await timesheetService.getTimesheetByDate(date);
    if (!ts) return Promise.resolve(null);

    const copy = clone(ts);
    const shift =
      copy.groups
        .find((g) => g.id === groupId)
        ?.subGroups.find((sg) => sg.id === subGroupId)
        ?.shifts.find((s) => s.id === shiftId) ?? null;

    if (!shift?.actualStartTime) return Promise.resolve(null);

    shift.actualEndTime = actualEndTime;
    shift.status = 'Completed';
    return timesheetService.updateTimesheet(date, copy);
  },

  swapShift: async (
    date,
    groupId,
    subGroupId,
    shiftId,
    newEmployeeId,
  ): Promise<Timesheet | null> => {
    const ts = await timesheetService.getTimesheetByDate(date);
    if (!ts) return Promise.resolve(null);

    const copy = clone(ts);
    const shift =
      copy.groups
        .find((g) => g.id === groupId)
        ?.subGroups.find((sg) => sg.id === subGroupId)
        ?.shifts.find((s) => s.id === shiftId) ?? null;

    if (!shift) return Promise.resolve(null);

    shift.employeeId = newEmployeeId;
    shift.status = 'Swapped';
    shift.actualStartTime = undefined;
    shift.actualEndTime = undefined;
    return timesheetService.updateTimesheet(date, copy);
  },

  cancelShift: async (
    date,
    groupId,
    subGroupId,
    shiftId,
    reason?,
  ): Promise<Timesheet | null> => {
    const ts = await timesheetService.getTimesheetByDate(date);
    if (!ts) return Promise.resolve(null);

    const copy = clone(ts);
    const shift =
      copy.groups
        .find((g) => g.id === groupId)
        ?.subGroups.find((sg) => sg.id === subGroupId)
        ?.shifts.find((s) => s.id === shiftId) ?? null;

    if (!shift) return Promise.resolve(null);

    shift.status = 'Cancelled';
    shift.notes = reason;
    return timesheetService.updateTimesheet(date, copy);
  },

  /* ----------------------------- AUDIT --------------------------- */

  /**
   * Returns mock audit events.
   * Pass options to control count / randomness if desired.
   */
  getTimesheetAuditEvents: async (
    timesheetId: number,
    opts?: AuditMockOpts,
  ): Promise<AuditEvent[]> =>
    Promise.resolve(generateMockAuditEvents(timesheetId, opts)),
};
