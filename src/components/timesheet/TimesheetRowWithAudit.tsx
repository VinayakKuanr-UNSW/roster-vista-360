
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShiftStatusBadge } from './ShiftStatusBadge';
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
  const navigate = useNavigate();

  const timesheetId = parseInt(shift.id.replace(/\D/g, '')) || 1;

  const handleViewAudit = () => {
    navigate(`/timesheet/audit/${timesheetId}`);
  };

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
          onClick={handleViewAudit}
          className="text-gray-400 hover:text-white"
          title="View audit trail"
        >
          <History className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};
