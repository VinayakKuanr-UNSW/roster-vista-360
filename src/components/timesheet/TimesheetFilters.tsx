import React, { useState } from 'react';
import { Search, X, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface TimesheetFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  subGroupFilter: string;
  setSubGroupFilter: (subGroup: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  tierFilter: string;
  setTierFilter: (tier: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  selectedDate: Date;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const TimesheetFilters: React.FC<TimesheetFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  subGroupFilter,
  setSubGroupFilter,
  roleFilter,
  setRoleFilter,
  tierFilter,
  setTierFilter,
  statusFilter,
  setStatusFilter,
  selectedDate,
  onClearFilters,
  activeFilterCount
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search employee, role, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Date Selector */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white/5 border-white/10">
              <Calendar className="mr-2 h-4 w-4" />
              {format(selectedDate, 'MMMM d, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-900/95 backdrop-blur-xl border-gray-800">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  // This would be handled by the parent component
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Filter Button with Badge */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white/5 border-white/10 relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-gray-900/95 backdrop-blur-xl border-gray-800">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Filters</h3>
                <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 px-2 text-xs">
                  <X className="mr-1 h-3 w-3" />
                  Clear All
                </Button>
              </div>

              {/* Department Filter */}
              <div className="space-y-2">
                <label className="text-sm">Department</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Convention Centre">Convention Centre</SelectItem>
                    <SelectItem value="Exhibition Centre">Exhibition Centre</SelectItem>
                    <SelectItem value="Theatre">Theatre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sub-Group Filter */}
              <div className="space-y-2">
                <label className="text-sm">Sub-Group</label>
                <Select value={subGroupFilter} onValueChange={setSubGroupFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Sub-Groups" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                    <SelectItem value="all">All Sub-Groups</SelectItem>
                    <SelectItem value="AM Base">AM Base</SelectItem>
                    <SelectItem value="AM Assist">AM Assist</SelectItem>
                    <SelectItem value="PM Base">PM Base</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                    <SelectItem value="Bump-In">Bump-In</SelectItem>
                    <SelectItem value="AM Floaters">AM Floaters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm">Role</label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Team Leader">Team Leader</SelectItem>
                    <SelectItem value="TM3">TM3</SelectItem>
                    <SelectItem value="TM2">TM2</SelectItem>
                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tier Filter */}
              <div className="space-y-2">
                <label className="text-sm">Tier</label>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Tiers" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="GOLD">GOLD</SelectItem>
                    <SelectItem value="SILVER">SILVER</SelectItem>
                    <SelectItem value="BRONZE">BRONZE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm">Status</label>
                <Select 
                  value={statusFilter || 'all'} 
                  onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="No-Show">No-Show</SelectItem>
                    <SelectItem value="Swapped">Swapped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/5 border-white/10"
          onClick={() => setStatusFilter(null)}
        >
          All Shifts
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={statusFilter === 'Active' ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-white/5 border-white/10"}
          onClick={() => setStatusFilter('Active')}
        >
          Active
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={statusFilter === 'Completed' ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-white/5 border-white/10"}
          onClick={() => setStatusFilter('Completed')}
        >
          Completed
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={statusFilter === 'Cancelled' ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-white/5 border-white/10"}
          onClick={() => setStatusFilter('Cancelled')}
        >
          Cancelled
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={statusFilter === 'Swapped' ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-white/5 border-white/10"}
          onClick={() => setStatusFilter('Swapped')}
        >
          Swapped
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={statusFilter === 'No-Show' ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-white/5 border-white/10"}
          onClick={() => setStatusFilter('No-Show')}
        >
          No-Show
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {departmentFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Department: {departmentFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setDepartmentFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {subGroupFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Sub-Group: {subGroupFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setSubGroupFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {roleFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Role: {roleFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setRoleFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {tierFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Tier: {tierFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setTierFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {statusFilter && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Status: {statusFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setStatusFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilterCount > 1 && (
            <Button variant="outline" size="sm" onClick={onClearFilters} className="h-7 px-2 py-0 text-xs">
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};