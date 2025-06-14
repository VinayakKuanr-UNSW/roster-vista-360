import React, { useState, useMemo } from 'react';
import { TimesheetRow } from './TimesheetRow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { 
  Clock, 
  MoreHorizontal, 
  Pencil, 
  Check, 
  X,
  ArrowUp,
  ArrowDown,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface TimesheetEntry {
  id: number;
  date: Date;
  employee: string;
  role: string;
  department: string;
  subGroup: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  totalHours: string;
  status: 'Completed' | 'Cancelled' | 'Active' | 'No-Show' | 'Swapped';
  bidId?: number;
  assignedTime?: string;
  originalEmployee?: string | null;
  replacementEmployee?: string | null;
  cancellationReason?: string | null;
  remunerationLevel?: string;
  tier?: string;
  clockInTime?: string;
  clockOutTime?: string;
  approximatePay?: string;
}

interface TimesheetTableProps {
  selectedDate: Date;
  readOnly?: boolean;
  statusFilter: string | null;
  viewMode: 'table' | 'group';
  onViewChange: (view: 'table' | 'group') => void;
  searchQuery?: string;
  departmentFilter?: string;
  subGroupFilter?: string;
  roleFilter?: string;
  tierFilter?: string;
  onSaveEntry?: (id: number, updates: Partial<TimesheetEntry>) => void;
  onBulkAction?: (ids: number[], action: 'approve' | 'reject') => void;
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({ 
  selectedDate, 
  readOnly,
  statusFilter,
  viewMode,
  onViewChange,
  searchQuery = '',
  departmentFilter = 'all',
  subGroupFilter = 'all',
  roleFilter = 'all',
  tierFilter = 'all',
  onSaveEntry,
  onBulkAction
}) => {
  // State for sorting
  const [sortField, setSortField] = useState<keyof TimesheetEntry | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const { theme } = useTheme();

  // Sample data for demonstration
  const timesheetEntries = [
    { 
      id: 1, 
      date: new Date(selectedDate), 
      employee: 'Vinayak Singh', 
      role: 'Team Leader',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      startTime: '05:45', 
      endTime: '14:00', 
      breakDuration: '30 min',
      totalHours: '7.75',
      status: 'Active' as const,
      bidId: 201,
      assignedTime: '2 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD',
      tier: 'GOLD',
      clockInTime: '05:40',
      clockOutTime: '',
      approximatePay: '$232.50'
    },
    { 
      id: 2, 
      date: new Date(selectedDate), 
      employee: 'John Smith', 
      role: 'TM3',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      startTime: '06:15', 
      endTime: '14:00', 
      breakDuration: '30 min',
      totalHours: '7.25',
      status: 'Active' as const,
      bidId: 202,
      assignedTime: '3 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD',
      tier: 'GOLD',
      clockInTime: '06:10',
      clockOutTime: '',
      approximatePay: '$217.50'
    },
    { 
      id: 3, 
      date: new Date(selectedDate), 
      employee: 'Emma Watson', 
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      startTime: '06:30', 
      endTime: '14:00', 
      breakDuration: '30 min',
      totalHours: '7',
      status: 'Completed' as const,
      bidId: 203,
      assignedTime: '5 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD',
      tier: 'GOLD',
      clockInTime: '06:25',
      clockOutTime: '14:05',
      approximatePay: '$210.00'
    },
    { 
      id: 4, 
      date: new Date(selectedDate), 
      employee: 'David Miller', 
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      startTime: '06:30', 
      endTime: '14:00', 
      breakDuration: '30 min',
      totalHours: '7',
      status: 'Cancelled' as const,
      bidId: 204,
      assignedTime: '4 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: 'Personal emergency',
      remunerationLevel: 'SILVER',
      tier: 'SILVER',
      clockInTime: '',
      clockOutTime: '',
      approximatePay: '$175.00'
    },
    { 
      id: 5, 
      date: new Date(selectedDate), 
      employee: 'Sarah Johnson', 
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'AM Assist',
      startTime: '11:30', 
      endTime: '16:30', 
      breakDuration: '30 min',
      totalHours: '4.5',
      status: 'Active' as const,
      bidId: 205,
      assignedTime: '1 day ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'SILVER',
      tier: 'SILVER',
      clockInTime: '11:25',
      clockOutTime: '',
      approximatePay: '$112.50'
    },
    { 
      id: 6, 
      date: new Date(selectedDate), 
      employee: 'Casey Morgan', 
      role: 'Team Leader',
      department: 'Convention Centre',
      subGroup: 'PM Base',
      startTime: '13:15', 
      endTime: '21:30', 
      breakDuration: '45 min',
      totalHours: '7.5',
      status: 'Swapped' as const,
      bidId: 206,
      assignedTime: '2 days ago',
      originalEmployee: 'Riley Wilson',
      replacementEmployee: 'Casey Morgan',
      cancellationReason: 'Shift swap requested by original employee',
      remunerationLevel: 'GOLD',
      tier: 'GOLD',
      clockInTime: '13:10',
      clockOutTime: '',
      approximatePay: '$225.00'
    },
    { 
      id: 7, 
      date: new Date(selectedDate), 
      employee: 'Alex Carter', 
      role: 'TM3',
      department: 'Convention Centre',
      subGroup: 'Late',
      startTime: '16:30', 
      endTime: '23:00', 
      breakDuration: '30 min',
      totalHours: '6',
      status: 'No-Show' as const,
      bidId: 207,
      assignedTime: '5 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: 'Employee did not show up for shift',
      remunerationLevel: 'GOLD',
      tier: 'GOLD',
      clockInTime: '',
      clockOutTime: '',
      approximatePay: '$180.00'
    },
    { 
      id: 8, 
      date: new Date(selectedDate), 
      employee: 'Jordan Davis', 
      role: 'Coordinator',
      department: 'Exhibition Centre',
      subGroup: 'Bump-In',
      startTime: '09:00', 
      endTime: '17:00', 
      breakDuration: '45 min',
      totalHours: '7.25',
      status: 'Active' as const,
      bidId: 208,
      assignedTime: '3 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD',
      tier: 'GOLD',
      clockInTime: '08:55',
      clockOutTime: '',
      approximatePay: '$217.50'
    },
    { 
      id: 9, 
      date: new Date(selectedDate), 
      employee: 'Taylor Brown', 
      role: 'Supervisor',
      department: 'Theatre',
      subGroup: 'AM Floaters',
      startTime: '08:00', 
      endTime: '16:00', 
      breakDuration: '60 min',
      totalHours: '7',
      status: 'Active' as const,
      bidId: 209,
      assignedTime: '4 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD',
      tier: 'GOLD',
      clockInTime: '07:55',
      clockOutTime: '',
      approximatePay: '$210.00'
    },
  ];
  
  // Handle sorting
  const handleSort = (field: keyof TimesheetEntry) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, sort by this field in ascending order
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort indicator
  const getSortIndicator = (field: keyof TimesheetEntry) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="inline h-3 w-3 ml-1" /> : 
      <ArrowDown className="inline h-3 w-3 ml-1" />;
  };

  // Handle saving timesheet entry changes
  const handleSaveEntry = (id: number, updates: Partial<TimesheetEntry>) => {
    if (onSaveEntry) {
      onSaveEntry(id, updates);
    }
  };
  
  // Apply filters and search
  const filteredEntries = useMemo(() => {
    return timesheetEntries.filter(entry => {
      // Status filter
      if (statusFilter && entry.status !== statusFilter) {
        return false;
      }
      
      // Department filter
      if (departmentFilter !== 'all' && entry.department !== departmentFilter) {
        return false;
      }
      
      // Sub-group filter
      if (subGroupFilter !== 'all' && entry.subGroup !== subGroupFilter) {
        return false;
      }
      
      // Role filter
      if (roleFilter !== 'all' && entry.role !== roleFilter) {
        return false;
      }
      
      // Tier filter
      if (tierFilter !== 'all' && entry.tier !== tierFilter && entry.remunerationLevel !== tierFilter) {
        return false;
      }
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          entry.employee.toLowerCase().includes(query) ||
          entry.role.toLowerCase().includes(query) ||
          entry.department.toLowerCase().includes(query) ||
          entry.subGroup.toLowerCase().includes(query) ||
          entry.status.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [timesheetEntries, statusFilter, departmentFilter, subGroupFilter, roleFilter, tierFilter, searchQuery]);
  
  // Apply sorting
  const sortedEntries = useMemo(() => {
    if (!sortField) return filteredEntries;
    
    return [...filteredEntries].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime() 
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });
  }, [filteredEntries, sortField, sortDirection]);
  
  // Group entries by department and subgroup
  const groupedEntries = useMemo(() => {
    return sortedEntries.reduce((acc, entry) => {
      const department = entry.department;
      const subGroup = entry.subGroup;
      
      if (!acc[department]) {
        acc[department] = {};
      }
      
      if (!acc[department][subGroup]) {
        acc[department][subGroup] = [];
      }
      
      acc[department][subGroup].push(entry);
      
      return acc;
    }, {} as Record<string, Record<string, typeof timesheetEntries>>);
  }, [sortedEntries]);
  
  const formattedDate = format(selectedDate, 'MMMM d, yyyy');

  // Toggle selection of a timesheet entry
  const toggleSelection = (id: number) => {
    setSelectedEntries(prev => 
      prev.includes(id) ? prev.filter(entryId => entryId !== id) : [...prev, id]
    );
  };

  // Toggle selection of all timesheet entries
  const toggleSelectAll = () => {
    if (selectedEntries.length === sortedEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(sortedEntries.map(entry => entry.id));
    }
  };

  // Handle bulk approve action
  const handleBulkApprove = () => {
    if (onBulkAction) {
      onBulkAction(selectedEntries, 'approve');
    }
    setSelectedEntries([]);
  };

  // Handle bulk reject action
  const handleBulkReject = () => {
    if (onBulkAction) {
      onBulkAction(selectedEntries, 'reject');
    }
    setSelectedEntries([]);
  };

  // Create a sortable header cell
  const SortableHeader = ({ field, label }: { field: keyof TimesheetEntry, label: string }) => (
    <th 
      className="text-left p-3 text-sm font-medium text-white/80 cursor-pointer hover:bg-white/5"
      onClick={() => handleSort(field)}
    >
      {label} {getSortIndicator(field)}
    </th>
  );

  // Get container background class based on theme
  const getContainerBgClass = () => {
    if (theme === 'light') {
      return 'bg-white border-gray-200';
    } else if (theme === 'dark') {
      return 'bg-gray-900 border-gray-700';
    } else {
      return 'bg-transparent backdrop-blur-md border-white/10';
    }
  };

  return (
    <div>
      <Tabs value={viewMode} className="mt-6">
        <TabsContent value="table" className="mt-0">
          <div className={cn("overflow-x-auto rounded-lg border p-4", getContainerBgClass())}>
            <div className="text-lg font-semibold mb-4">Timesheets for {formattedDate}</div>
            
            {selectedEntries.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm">Selected: {selectedEntries.length}</span>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleBulkApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve Selected
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleBulkReject}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject Selected
                </Button>
              </div>
            )}
            
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black/30">
                  <th className="p-3 text-sm font-medium text-white/80 rounded-tl-md">
                    <input 
                      type="checkbox" 
                      checked={selectedEntries.length === sortedEntries.length && sortedEntries.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <SortableHeader field="employee" label="Employee" />
                  <SortableHeader field="department" label="Department" />
                  <SortableHeader field="subGroup" label="Sub-Group" />
                  <SortableHeader field="role" label="Role" />
                  <SortableHeader field="tier" label="Tier" />
                  <SortableHeader field="startTime" label="Start Time" />
                  <SortableHeader field="endTime" label="End Time" />
                  <SortableHeader field="clockInTime" label="Clock In" />
                  <SortableHeader field="clockOutTime" label="Clock Out" />
                  <SortableHeader field="breakDuration" label="Break" />
                  <SortableHeader field="totalHours" label="Total Hours" />
                  <SortableHeader field="approximatePay" label="Approx. Pay" />
                  <SortableHeader field="status" label="Status" />
                  <th className="text-left p-3 text-sm font-medium text-white/80 rounded-tr-md">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((entry) => (
                  <TimesheetRow 
                    key={entry.id} 
                    entry={entry} 
                    readOnly={readOnly} 
                    onSave={handleSaveEntry}
                    isSelected={selectedEntries.includes(entry.id)}
                    onToggleSelect={() => toggleSelection(entry.id)}
                  />
                ))}
              </tbody>
            </table>
            
            {sortedEntries.length === 0 && (
              <div className="text-center py-8 text-white/60">
                No shifts found matching the selected filter for {formattedDate}.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="group" className="mt-0">
          <div className={cn("space-y-8 rounded-lg border p-4", getContainerBgClass())}>
            <div className="text-lg font-semibold mb-4">Timesheets for {formattedDate}</div>
            
            {selectedEntries.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm">Selected: {selectedEntries.length}</span>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleBulkApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve Selected
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleBulkReject}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject Selected
                </Button>
              </div>
            )}
            
            {Object.entries(groupedEntries).map(([department, subGroups]) => (
              <div key={department} className="space-y-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    department === 'Convention Centre' ? 'bg-blue-500' : 
                    department === 'Exhibition Centre' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  {department}
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(subGroups).map(([subGroup, entries]) => (
                    <div key={subGroup} className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <h4 className="text-lg font-medium mb-3">{subGroup}</h4>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {entries.map(entry => (
                          <div key={entry.id} className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                checked={selectedEntries.includes(entry.id)}
                                onChange={() => toggleSelection(entry.id)}
                                className="mr-3 rounded"
                              />
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-medium text-white">{entry.employee}</span>
                                  <span className="ml-3 text-xs px-2 py-0.5 rounded bg-blue-500/20 text-white/80 border border-blue-500/20">
                                    {entry.role}
                                  </span>
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                    entry.remunerationLevel === 'GOLD' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30' :
                                    entry.remunerationLevel === 'SILVER' ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30' :
                                    'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                                  }`}>
                                    {entry.remunerationLevel}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-white/70">
                                  <Clock size={12} className="mr-1" />
                                  {entry.startTime} - {entry.endTime} ({entry.totalHours} hrs)
                                </div>
                                <div className="flex items-center text-sm text-white/70 mt-1">
                                  <Clock size={12} className="mr-1" />
                                  Clock: {entry.clockInTime || 'Not clocked in'} - {entry.clockOutTime || 'Not clocked out'}
                                </div>
                                <div className="flex items-center text-sm text-white/70 mt-1">
                                  <DollarSign size={12} className="mr-1" />
                                  {entry.approximatePay}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                entry.status === 'Active' ? 'bg-blue-500/20 text-blue-300' :
                                entry.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                                entry.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' :
                                entry.status === 'Swapped' ? 'bg-purple-500/20 text-purple-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {entry.status}
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>View History</span>
                                  </DropdownMenuItem>
                                  
                                  {!readOnly && entry.status !== 'Completed' && entry.status !== 'Cancelled' && (
                                    <DropdownMenuItem onClick={() => {}}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Edit Times</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {!readOnly && entry.status === 'Active' && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleSaveEntry(entry.id, { status: 'Completed' })}>
                                        <Check className="mr-2 h-4 w-4" />
                                        <span>Approve</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleSaveEntry(entry.id, { status: 'Cancelled' })}>
                                        <X className="mr-2 h-4 w-4" />
                                        <span>Reject</span>
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(groupedEntries).length === 0 && (
              <div className="text-center py-8 text-white/60">
                No shifts found matching the selected filter for {formattedDate}.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};