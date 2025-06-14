// src/components/birds-view/BirdsViewGrid.tsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { HeaderRow } from './HeaderRow';
import { EmployeeRow } from './EmployeeRow';
import { employeeService } from '@/api/services/employeeService';
import { Employee, Roster } from '@/api/models/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { EMP_COL_W, DAY_COL_W } from './constants';
import clsx from 'clsx';

interface Props {
  startDate: Date;
  endDate: Date;
  rosters: Roster[];
  isLoading: boolean;
  searchQuery: string;
  /** layout classes from the parent (optional) */
  className?: string;
}

export const BirdsViewGrid: React.FC<Props> = ({
  startDate,
  endDate,
  rosters,
  isLoading,
  searchQuery,
  className,
}) => {
  /* ───────── employees ───────── */
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmp, setLoadingEmp] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
      } finally {
        setLoadingEmp(false);
      }
    })();
  }, []);

  /* ───────── derived data ───────── */
  const days = useMemo(
    () => eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (e) =>
        !q ||
        e.name.toLowerCase().includes(q) ||
        (e.role ?? '').toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  const rowData = useMemo(() => {
    return filtered.map((emp) => {
      const perDay: any[][] = days.map(() => []);
      rosters.forEach((r) => {
        const rDate = parseISO(r.date);
        r.groups.forEach((g) =>
          g.subGroups.forEach((sg) =>
            sg.shifts.forEach((s) => {
              if (s.employeeId === emp.id) {
                const dIdx = days.findIndex((d) => isSameDay(d, rDate));
                if (dIdx >= 0) perDay[dIdx].push({ ...s, group: g, sub: sg });
              }
            })
          )
        );
      });
      return { emp, perDay };
    });
  }, [filtered, rosters, days]);

  /* ───────── refs & callbacks (before early returns) ───────── */
  const bodyRef   = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (headerRef.current)
        headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    },
    []
  );

  const exportCSV = useCallback(() => {
    const csv = [
      ['Employee', ...days.map((d) => format(d, 'MMM d'))].join(','),
      ...rowData.map((r) =>
        [r.emp.name, ...r.perDay.map((sh) => sh.length)].join(',')
      ),
    ].join('\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'birds-view.csv');
  }, [rowData, days]);

  /* ───────── early exits ───────── */
  if (isLoading || loadingEmp) {
    return (
      <div className={clsx('p-8 flex justify-center', className)}>
        <Skeleton className="w-full h-[300px]" />
      </div>
    );
  }
  if (!rowData.length) {
    return (
      <p className={clsx('text-neutral-500 text-center py-10', className)}>
        No employees match your filters.
      </p>
    );
  }

  /* ───────── render ───────── */
  return (
    <div className={clsx('flex flex-col flex-1 min-h-0', className)}>
      {/* sticky top bar */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur
                      flex justify-between items-center px-4 py-2">
        <span className="text-neutral-400">
          {rowData.length} employees • {days.length} days
        </span>
        <Button
          variant="outline"
          size="icon"
          title="Export CSV"
          onClick={exportCSV}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* header */}
      <HeaderRow ref={headerRef} days={days} />

      {/* body */}
      <div
        ref={bodyRef}
        onScroll={syncScroll}
        className="overflow-auto flex-1 min-h-0"
      >
        <table
          className="border-collapse"
          style={{ minWidth: EMP_COL_W + DAY_COL_W * days.length }}
        >
          <tbody>
            {rowData.map(({ emp, perDay }, idx) => (
              <EmployeeRow
                key={emp.id}
                emp={emp}
                perDay={perDay}
                days={days}
                rowIdx={idx}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
