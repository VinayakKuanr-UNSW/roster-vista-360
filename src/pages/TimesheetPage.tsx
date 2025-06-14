import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { TimesheetHeader } from '@/components/timesheet/TimesheetHeader';
import { TimesheetTable } from '@/components/timesheet/TimesheetTable';
import { TimesheetFilters } from '@/components/timesheet/TimesheetFilters';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const TimesheetPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'group'>('table');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [subGroupFilter, setSubGroupFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  
  // New entry form state
  const [newEntry, setNewEntry] = useState({
    employee: '',
    department: 'Convention Centre',
    subGroup: 'AM Base',
    role: 'Team Leader',
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: '30 min',
    remunerationLevel: 'GOLD'
  });
  
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const { theme } = useTheme();

  // Calculate active filter count
  const activeFilterCount = [
    searchQuery ? 1 : 0,
    departmentFilter !== 'all' ? 1 : 0,
    subGroupFilter !== 'all' ? 1 : 0,
    roleFilter !== 'all' ? 1 : 0,
    tierFilter !== 'all' ? 1 : 0,
    statusFilter ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);

    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);

      toast({
        title: 'Timesheets refreshed',
        description: 'Latest timesheet data has been loaded.',
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: 'Exporting timesheets',
      description: 'Your timesheet data is being prepared for download.',
    });

    // Simulate export delay
    setTimeout(() => {
      toast({
        title: 'Export complete',
        description: 'Your timesheet data has been exported successfully.',
      });
    }, 1500);
  };

  const handleNewEntry = () => {
    setIsNewEntryDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setSubGroupFilter('all');
    setRoleFilter('all');
    setTierFilter('all');
    setStatusFilter(null);
    
    toast({
      title: 'Filters cleared',
      description: 'All filters have been reset.',
    });
  };
  
  const handleSaveEntry = (id: number, updates: Partial<TimesheetEntry>) => {
    // In a real app, this would call an API to update the entry
    console.log('Saving entry:', id, updates);
    
    toast({
      title: 'Entry Updated',
      description: 'Timesheet entry has been updated successfully.',
    });
  };
  
  const handleCreateNewEntry = () => {
    // In a real app, this would call an API to create a new entry
    console.log('Creating new entry:', newEntry);
    
    toast({
      title: 'Entry Created',
      description: 'New timesheet entry has been created successfully.',
    });
    
    setIsNewEntryDialogOpen(false);
    
    // Reset form
    setNewEntry({
      employee: '',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      role: 'Team Leader',
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: '30 min',
      remunerationLevel: 'GOLD'
    });
  };
  
  const handleBulkAction = (ids: number[], action: 'approve' | 'reject') => {
    // In a real app, this would call an API to update multiple entries
    console.log(`Bulk ${action}:`, ids);
    
    // Validate that we're not trying to approve/reject entries that are already completed/cancelled
    if (ids.length === 0) {
      toast({
        title: 'No Entries Selected',
        description: 'Please select at least one entry to perform this action.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: `Entries ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `${ids.length} timesheet ${ids.length === 1 ? 'entry has' : 'entries have'} been ${action === 'approve' ? 'approved' : 'rejected'}.`,
    });
  };

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
    <div className="p-4 md:p-6 lg:p-8 max-w-full">
      <div className={`rounded-lg shadow-xl p-4 md:p-6 border ${getContainerBgClass()}`}>
        <TimesheetHeader
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onViewChange={setViewMode}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onNewEntry={handleNewEntry}
          onExport={handleExport}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className="mt-6">
          <TimesheetFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            subGroupFilter={subGroupFilter}
            setSubGroupFilter={setSubGroupFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            tierFilter={tierFilter}
            setTierFilter={setTierFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectedDate={selectedDate}
            onClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <TimesheetTable
          selectedDate={selectedDate}
          readOnly={!hasPermission('update')}
          statusFilter={statusFilter}
          viewMode={viewMode}
          onViewChange={setViewMode}
          searchQuery={searchQuery}
          departmentFilter={departmentFilter}
          subGroupFilter={subGroupFilter}
          roleFilter={roleFilter}
          tierFilter={tierFilter}
          onSaveEntry={handleSaveEntry}
          onBulkAction={handleBulkAction}
        />
      </div>

      {/* New Entry Dialog */}
      <Dialog open={isNewEntryDialogOpen} onOpenChange={setIsNewEntryDialogOpen}>
        <DialogContent className={`p-6 rounded-lg shadow-lg max-w-md mx-4 ${getContainerBgClass()}`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Timesheet Entry</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select 
                value={newEntry.employee} 
                onValueChange={(value) => setNewEntry({...newEntry, employee: value})}
              >
                <SelectTrigger id="employee" className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vinayak Singh">Vinayak Singh</SelectItem>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Emma Watson">Emma Watson</SelectItem>
                  <SelectItem value="David Miller">David Miller</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={newEntry.department} 
                  onValueChange={(value) => setNewEntry({...newEntry, department: value})}
                >
                  <SelectTrigger id="department" className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Convention Centre">Convention Centre</SelectItem>
                    <SelectItem value="Exhibition Centre">Exhibition Centre</SelectItem>
                    <SelectItem value="Theatre">Theatre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subGroup">Sub-Group</Label>
                <Select 
                  value={newEntry.subGroup} 
                  onValueChange={(value) => setNewEntry({...newEntry, subGroup: value})}
                >
                  <SelectTrigger id="subGroup" className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select sub-group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM Base">AM Base</SelectItem>
                    <SelectItem value="AM Assist">AM Assist</SelectItem>
                    <SelectItem value="PM Base">PM Base</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newEntry.role} 
                onValueChange={(value) => setNewEntry({...newEntry, role: value})}
              >
                <SelectTrigger id="role" className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team Leader">Team Leader</SelectItem>
                  <SelectItem value="TM3">TM3</SelectItem>
                  <SelectItem value="TM2">TM2</SelectItem>
                  <SelectItem value="Coordinator">Coordinator</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input 
                  id="startTime" 
                  type="time" 
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input 
                  id="endTime" 
                  type="time" 
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breakDuration">Break Duration</Label>
                <Select 
                  value={newEntry.breakDuration} 
                  onValueChange={(value) => setNewEntry({...newEntry, breakDuration: value})}
                >
                  <SelectTrigger id="breakDuration" className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select break duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 min">15 min</SelectItem>
                    <SelectItem value="30 min">30 min</SelectItem>
                    <SelectItem value="45 min">45 min</SelectItem>
                    <SelectItem value="60 min">60 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remunerationLevel">Remuneration Level</Label>
                <Select 
                  value={newEntry.remunerationLevel} 
                  onValueChange={(value) => setNewEntry({...newEntry, remunerationLevel: value})}
                >
                  <SelectTrigger id="remunerationLevel" className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOLD">GOLD</SelectItem>
                    <SelectItem value="SILVER">SILVER</SelectItem>
                    <SelectItem value="BRONZE">BRONZE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsNewEntryDialogOpen(false)}
              className="bg-white/5 border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewEntry}
              className="bg-primary text-primary-foreground"
            >
              Create Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimesheetPage;