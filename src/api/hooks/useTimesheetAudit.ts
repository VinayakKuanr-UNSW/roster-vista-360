import { useEffect, useState } from 'react';
import { AuditEvent } from '@/api/models/types';
import { timesheetService } from '@/api/services/timesheetService';

interface Return {
  data: AuditEvent[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** React hook to fetch (mock) audit events for a timesheet */
export function useTimesheetAudit(timesheetId?: number): Return {
  const [data, setData] = useState<AuditEvent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!timesheetId) return;
    setLoading(true);
    setError(null);

    timesheetService
      .getTimesheetAuditEvents(timesheetId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [timesheetId]);

  return { data, loading, error, refresh: load };
}
