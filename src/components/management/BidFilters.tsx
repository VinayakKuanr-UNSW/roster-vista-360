/* BidFilters.tsx */

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface BidFiltersProps {
  /* search */
  searchQuery: string;
  setSearchQuery: (v: string) => void;

  /* simple dropdown filters */
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  sortOption: string;
  setSortOption: (v: string) => void;

  /* date */
  dateRange: DateRange | undefined;
  setDateRange: (r: DateRange | undefined) => void;

  /* “More Filters” pop-over */
  departmentFilter: string;
  setDepartmentFilter: (v: string) => void;
  subDepartmentFilter: string;
  setSubDepartmentFilter: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  remunerationLevelFilter: string;
  setRemunerationLevelFilter: (v: string) => void;
}

const BidFilters: React.FC<BidFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption,
  dateRange,
  setDateRange,
  departmentFilter,
  setDepartmentFilter,
  subDepartmentFilter,
  setSubDepartmentFilter,
  roleFilter,
  setRoleFilter,
  remunerationLevelFilter,
  setRemunerationLevelFilter,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sticky top-0 z-10 bg-black/80 backdrop-blur-sm pt-4 pb-4">
      {/* ── SEARCH ─────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
        <Input
          aria-label="Search bids"
          placeholder="Search bids..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/5 border-white/10 pl-9 text-white"
        />
      </div>

      {/* ── SORT + DATE ────────────────────────── */}
      <div className="flex gap-2">
        {/* sort */}
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="bg-white/5 border-white/10 w-full">
            <SelectValue placeholder="Sort by…" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            <SelectItem value="date-asc">Date • Oldest</SelectItem>
            <SelectItem value="date-desc">Date • Newest</SelectItem>
            <SelectItem value="time-asc">Start • Earliest</SelectItem>
            <SelectItem value="time-desc">Start • Latest</SelectItem>
            <SelectItem value="hours-asc">Net hrs • Low→High</SelectItem>
            <SelectItem value="hours-desc">Net hrs • High→Low</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="role">Role (A-Z)</SelectItem>
            <SelectItem value="department">Department (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        {/* date range */}
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* ── STATUS + MORE FILTERS ──────────────── */}
      <div className="flex gap-2">
        {/* status */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white/5 border-white/10 w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Offered">Offered</SelectItem>
            <SelectItem value="Filled">Filled</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        {/* pop-over with remaining filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 py-2 border-white/10"
              aria-label="More filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              More
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 bg-slate-900 border-white/10">
            <div className="space-y-5">
              <h3 className="font-medium">More filters</h3>

              {/* department */}
              <div className="space-y-1">
                <Label>Department</Label>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="All Departments">
                      All Departments
                    </SelectItem>
                    <SelectItem value="Convention Centre">
                      Convention Centre
                    </SelectItem>
                    <SelectItem value="Exhibition Centre">
                      Exhibition Centre
                    </SelectItem>
                    <SelectItem value="Theatre">Theatre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* sub-department */}
              <div className="space-y-1">
                <Label>Sub-Department</Label>
                <Select
                  value={subDepartmentFilter}
                  onValueChange={setSubDepartmentFilter}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All sub-departments" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="All Sub-departments">
                      All Sub-departments
                    </SelectItem>
                    <SelectItem value="AM Base">AM Base</SelectItem>
                    <SelectItem value="PM Base">PM Base</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* role */}
              <div className="space-y-1">
                <Label>Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="All Roles">All Roles</SelectItem>
                    <SelectItem value="Team Leader">Team Leader</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="TM3">TM3</SelectItem>
                    <SelectItem value="TM2">TM2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* remuneration */}
              <div className="space-y-1">
                <Label>Remuneration Level</Label>
                <Select
                  value={remunerationLevelFilter}
                  onValueChange={setRemunerationLevelFilter}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="All">All Levels</SelectItem>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BidFilters;
