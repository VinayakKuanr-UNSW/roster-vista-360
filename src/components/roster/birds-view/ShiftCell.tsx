// src/components/birds-view/ShiftCell.tsx
import React from 'react';
import clsx from 'clsx';
import { isToday } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ShiftCard } from './ShiftCard';
import { DAY_COL_W } from './constants';

interface Props {
  day: Date;
  rowOdd: boolean;
  shifts: any[];          // same “enriched shift” object you built before
}

export const ShiftCell: React.FC<Props> = ({ day, rowOdd, shifts }) => (
  <td
    style={{ width: DAY_COL_W }}
    className={clsx(
      'border-l border-neutral-700 p-1 align-top',
      isToday(day) && 'bg-purple-900/15',
      rowOdd && 'bg-gray-800'
    )}
  >
    {shifts.slice(0, 2).map((s, i) => (
      <Tooltip key={i}>
        <TooltipTrigger asChild>
          <div>
            <ShiftCard shift={s} group={s.group} subGroup={s.sub} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {s.role} • {s.startTime}–{s.endTime}
        </TooltipContent>
      </Tooltip>
    ))}

    {shifts.length > 2 && (
      <div className="mt-0.5 text-[10px] text-center bg-neutral-700/30 rounded">
        +{shifts.length - 2} more
      </div>
    )}
  </td>
);
