
/* BidFilterPopover.tsx */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarDays, Filter, FilterX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar'; // assumes range-mode support
import { departments, subDepartments, roles } from './types/bid-types';

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  department?: string;
  subDepartment?: string;
  role?: string;
  status?: string;
  remunerationLevel?: string;
}

interface BidFilterPopoverProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  activeFilterCount: number;
}

const statusOptions = ['All Statuses', 'Open', 'Offered', 'Filled', 'Draft'];
const remunerationLevels = ['All Levels', 'GOLD', 'SILVER', 'BRONZE'];

const BidFilterPopover: React.FC<BidFilterPopoverProps> = ({
  filters,
  onFilterChange,
  activeFilterCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  /* ——— keyboard shortcut to open (⌘/Ctrl + F) ——— */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* helpers */
  const updateLocal = (key: keyof FilterOptions, value: any) =>
    setLocalFilters((p) => ({ ...p, [key]: value }));

  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    onFilterChange({});
    setIsOpen(false);
  };

  /* quick-range helpers */
  const setQuickRange = (days: number) => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + days - 1);
    updateLocal('startDate', now);
    updateLocal('endDate', end);
  };

  const setThisMonth = () => {
    const d = new Date();
    d.setDate(1);
    updateLocal('startDate', d);
    updateLocal('endDate', undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild aria-label="Open filters">
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed relative"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
              aria-live="polite"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 max-h-[96vh] overflow-y-auto p-0 rounded-md shadow-lg"
      >
        {/* ——— Header ——— */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur">
          <h4 className="font-medium">Filter Shifts</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs"
          >
            <FilterX className="mr-2 h-3 w-3" />
            Reset
          </Button>
        </div>

        {/* ——— Body ——— */}
        <div className="px-4 py-3 space-y-6">
          {/* DATE RANGE  */}
          <section className="space-y-2">
            <div className="border-l-2 border-primary pl-3 space-y-2">
              <Label>Date Range</Label>
              <Calendar
                mode="range"
                selected={{
                  from: localFilters.startDate,
                  to: localFilters.endDate,
                }}
                onSelect={({ from, to }) => {
                  updateLocal('startDate', from ?? undefined);
                  updateLocal('endDate', to ?? undefined);
                }}
                initialFocus
                numberOfMonths={1}
                className="rounded-md border bg-popover"
              />
              {/* quick links */}
              <div className="flex gap-3 text-xs mt-1">
                <Button
                  variant="link"
                  size="xs"
                  onClick={() => setQuickRange(1)}
                  className="p-0 h-auto"
                >
                  Today
                </Button>
                <Button
                  variant="link"
                  size="xs"
                  onClick={() => setQuickRange(7)}
                  className="p-0 h-auto"
                >
                  Next 7 days
                </Button>
                <Button
                  variant="link"
                  size="xs"
                  onClick={setThisMonth}
                  className="p-0 h-auto"
                >
                  This month
                </Button>
              </div>
            </div>
          </section>

          {/* DEPT / SUB-DEPT */}
          <section className="space-y-4">
            <div className="border-l-2 border-primary pl-3 space-y-4">
              {/* DEPARTMENT */}
              <div className="space-y-1">
                <Label>Department</Label>
                <select
                  className="w-full border rounded-md h-9 bg-transparent px-2"
                  value={localFilters.department ?? 'All Departments'}
                  onChange={(e) =>
                    updateLocal(
                      'department',
                      e.target.value !== 'All Departments'
                        ? e.target.value
                        : undefined
                    )
                  }
                >
                  {['All Departments', ...departments].map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB-DEPARTMENT */}
              <div className="space-y-1">
                <Label>Sub-Department</Label>
                <select
                  className="w-full border rounded-md h-9 bg-transparent px-2"
                  value={localFilters.subDepartment ?? 'All Sub-departments'}
                  onChange={(e) =>
                    updateLocal(
                      'subDepartment',
                      e.target.value !== 'All Sub-departments'
                        ? e.target.value
                        : undefined
                    )
                  }
                  disabled={
                    !localFilters.department ||
                    localFilters.department === 'All Departments'
                  }
                >
                  {['All Sub-departments', ...subDepartments].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* ROLE */}
              <div className="space-y-1">
                <Label>Role</Label>
                <select
                  className="w-full border rounded-md h-9 bg-transparent px-2"
                  value={localFilters.role ?? 'All Roles'}
                  onChange={(e) =>
                    updateLocal(
                      'role',
                      e.target.value !== 'All Roles'
                        ? e.target.value
                        : undefined
                    )
                  }
                >
                  {['All Roles', ...roles].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* STATUS & LEVEL */}
          <section className="space-y-4">
            <div className="border-l-2 border-primary pl-3 space-y-4">
              {/* STATUS */}
              <div className="space-y-1">
                <Label>Status</Label>
                <select
                  className="w-full border rounded-md h-9 bg-transparent px-2"
                  value={localFilters.status ?? 'All Statuses'}
                  onChange={(e) =>
                    updateLocal(
                      'status',
                      e.target.value !== 'All Statuses'
                        ? e.target.value
                        : undefined
                    )
                  }
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* REMUNERATION LEVEL */}
              <div className="space-y-1">
                <Label>Remuneration Level</Label>
                <select
                  className="w-full border rounded-md h-9 bg-transparent px-2"
                  value={localFilters.remunerationLevel ?? 'All Levels'}
                  onChange={(e) =>
                    updateLocal(
                      'remunerationLevel',
                      e.target.value !== 'All Levels'
                        ? e.target.value
                        : undefined
                    )
                  }
                >
                  {remunerationLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* ——— Sticky footer ——— */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t border-white/10 sticky bottom-0 bg-background/80 backdrop-blur">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BidFilterPopover;
