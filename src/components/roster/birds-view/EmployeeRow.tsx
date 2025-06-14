// src/components/birds-view/EmployeeRow.tsx
import React from 'react';
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShiftCell } from './ShiftCell';
import { EMP_COL_W, ROW_H } from './constants';
import { Employee } from '@/api/models/types';

interface Props {
  emp: Employee;
  perDay: any[][]; // array-of-days → array-of-shifts (same shape you built)
  days: Date[];
  rowIdx: number;  // so we can zebra-stripe
}

export const EmployeeRow: React.FC<Props> = ({ emp, perDay, days, rowIdx }) => (
  <tr key={emp.id} style={{ height: ROW_H }}>
    {/* frozen employee column */}
    <td
      style={{ width: EMP_COL_W }}
      className={clsx(
        'sticky left-0 z-10 bg-gray-900 border-r border-neutral-700 px-3',
        rowIdx % 2 && 'bg-gray-800'
      )}
    >
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={emp.avatar} />
          <AvatarFallback>{emp.name[0]}</AvatarFallback>
        </Avatar>
        <div className="truncate leading-tight">
          <div className="font-medium truncate">{emp.name}</div>
          <div className="text-xs text-neutral-400 truncate">{emp.role}</div>
        </div>
      </div>
    </td>

    {/* day cells */}
    {perDay.map((shifts, colIdx) => (
      <ShiftCell
        key={colIdx}
        day={days[colIdx]}
        rowOdd={rowIdx % 2 === 1}
        shifts={shifts}
      />
    ))}
  </tr>
);
