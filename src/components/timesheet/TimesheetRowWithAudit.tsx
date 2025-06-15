
import React, { useState } from 'react';
import { ShiftStatusBadge } from './ShiftStatusBadge';
import AuditTrailModal from '@/components/AuditTrailModal';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface TimesheetRowWithAuditProps {
  shift: {
    id: string;
    startTime: string;
    endTime: string;
    role: string;
    assignedEmployeeName?: string;
    status: 'Completed' | 'Cancelled' | 'Active' | 'No-Show' | 'Swapped';
  };
  date: string;
}

export const TimesheetRowWithAudit: React.FC<TimesheetRowWithAuditProps> = ({ shift, date }) => {
  const [auditOpen, setAuditOpen] = useState(false);

  // Convert shift ID to numeric timesheet ID for the audit
  const timesheetId = parseInt(shift.id.replace(/\D/g, '')) || 1;

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800/50">
      <td className="px-6 py-4 text-sm text-gray-300">{date}</td>
      <td className="px-6 py-4 text-sm text-gray-300">{shift.startTime}</td>
      <td className="px-6 py-4 text-sm text-gray-300">{shift.endTime}</td>
      <td className="px-6 py-4 text-sm text-gray-300">{shift.role}</td>
      <td className="px-6 py-4 text-sm text-gray-300">{shift.assignedEmployeeName || 'Unassigned'}</td>
      <td className="px-6 py-4">
        <ShiftStatusBadge status={shift.status} />
      </td>
      <td className="px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAuditOpen(true)}
          className="text-gray-400 hover:text-white"
        >
          <History className="h-4 w-4" />
        </Button>
      </td>

      <AuditTrailModal
        timesheetId={timesheetId}
        open={auditOpen}
        onOpenChange={setAuditOpen}
      />
    </tr>
  );
};
