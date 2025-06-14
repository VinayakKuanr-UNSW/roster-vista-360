// src/components/birds-view/HeaderRow.tsx
import React from 'react';
import { format, isToday } from 'date-fns';
import clsx from 'clsx';
import { EMP_COL_W, DAY_COL_W } from './constants';

interface Props {
  days: Date[];
}

/**
 * Frozen header with weekday + date labels.
 * Forwarding the ref lets the parent sync horizontal scroll.
 */
export const HeaderRow = React.forwardRef<HTMLDivElement, Props>(
  ({ days }, ref) => (
    <div
      ref={ref}
      className="overflow-x-auto overflow-y-hidden border-b border-neutral-700 scrollbar-thin"
    >
      <div
        style={{ minWidth: EMP_COL_W + DAY_COL_W * days.length, display: 'flex' }}
      >
        {/* empty corner cell */}
        <div
          style={{ width: EMP_COL_W }}
          className="sticky left-0 z-10 bg-black/90 backdrop-blur"
        />
        {days.map((d) => (
          <div
            key={d.toISOString()}
            style={{ width: DAY_COL_W }}
            className={clsx(
              'text-center py-2 text-sm font-medium bg-black/90 backdrop-blur border-l border-neutral-700',
              isToday(d) && 'text-purple-300'
            )}
          >
            <div>{format(d, 'EEE')}</div>
            <div className="text-xs text-neutral-400">{format(d, 'MMM d')}</div>
          </div>
        ))}
      </div>
    </div>
  )
);
HeaderRow.displayName = 'HeaderRow';
