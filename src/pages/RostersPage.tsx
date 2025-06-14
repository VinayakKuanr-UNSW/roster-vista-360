import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RosterSidebar } from '@/components/roster/RosterSidebar';
import { RosterCalendar } from '@/components/roster/RosterCalendar';
import { RosterHeader } from '@/components/roster/RosterHeader';
import { useAuth } from '@/hooks/useAuth';
import { useRosters } from '@/api/hooks';
import { useRosterView, CalendarView } from '@/hooks/useRosterView';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DepartmentName, DepartmentColor } from '@/api/models/types';

const RostersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const { 
    view, 
    setView, 
    selectedDate, 
    setSelectedDate, 
    navigatePrevious, 
    navigateNext, 
    getDateRange 
  } = useRosterView();
  
  const {
    useRosterByDate,
    useCreateRoster,
    useUpdateRoster,
    useAssignEmployeeToShift,
    useAddShift,
    useAddGroup,
    useAddSubGroup,
    useRemoveShift,
  } = useRosters();

  // Get date range based on current view
  const dateRange = getDateRange();

  const { data: currentRoster, isLoading } = useRosterByDate(
    selectedDate.toISOString().split('T')[0]
  );
  const createRosterMutation = useCreateRoster();
  const updateRosterMutation = useUpdateRoster();
  const assignEmployeeMutation = useAssignEmployeeToShift();
  const addGroupMutation = useAddGroup ? useAddGroup() : null;
  const addSubGroupMutation = useAddSubGroup ? useAddSubGroup() : null;
  const addShiftMutation = useAddShift ? useAddShift() : null;

  // Set hasUnsavedChanges to true when roster changes
  useEffect(() => {
    if (currentRoster) {
      setHasUnsavedChanges(true);
    }
  }, [currentRoster]);

  // === Global Collapse/Expand Functions ===
  const collapseAllGroups = () => {
    if (!currentRoster) return;
    // Update every group and subgroup in the roster to be collapsed
    const updatedRoster = {
      ...currentRoster,
      groups: currentRoster.groups.map((group) => ({
        ...group,
        collapsed: true,
        subGroups: group.subGroups.map((subGroup) => ({
          ...subGroup,
          collapsed: true,
        })),
      })),
    };
    updateRosterMutation.mutate({
      date: selectedDate.toISOString().split('T')[0],
      updates: updatedRoster,
    });
  };

  const expandAllGroups = () => {
    if (!currentRoster) return;
    const updatedRoster = {
      ...currentRoster,
      groups: currentRoster.groups.map((group) => ({
        ...group,
        collapsed: false,
        subGroups: group.subGroups.map((subGroup) => ({
          ...subGroup,
          collapsed: false,
        })),
      })),
    };
    updateRosterMutation.mutate({
      date: selectedDate.toISOString().split('T')[0],
      updates: updatedRoster,
    });
  };

  // Toggle lock/unlock roster
  const toggleLock = () => {
    setIsLocked(!isLocked);
    toast({
      title: isLocked ? 'Roster Unlocked' : 'Roster Locked',
      description: isLocked ? 'The roster can now be edited.' : 'The roster is now locked for editing.',
    });
  };

  // Handle saving roster
  const handleSaveRoster = () => {
    if (!currentRoster) return;

    updateRosterMutation.mutate(
      {
        date: selectedDate.toISOString().split('T')[0],
        updates: currentRoster,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Roster Saved',
            description: 'All changes have been saved successfully.',
          });
          setHasUnsavedChanges(false);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to save roster. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  // Handle applying template
  const handleApplyTemplate = (templateId: number) => {
    createRosterMutation.mutate(
      { date: selectedDate.toISOString().split('T')[0], templateId },
      {
        onSuccess: () => {
          toast({
            title: 'Template Applied',
            description:
              'The roster has been created from the selected template.',
          });
          setIsTemplateDialogOpen(false);
          setHasUnsavedChanges(true);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to apply template. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  // Handle assigning employee to shift
  const handleAssignEmployee = (shiftId: string, employeeId: string) => {
    if (!currentRoster || isLocked) return;
    
    let groupId = 0;
    let subGroupId = 0;
    outer: for (const group of currentRoster.groups) {
      for (const subGroup of group.subGroups) {
        const shift = subGroup.shifts.find((s) => s.id === shiftId);
        if (shift) {
          groupId = group.id;
          subGroupId = subGroup.id;
          break outer;
        }
      }
    }

    if (groupId && subGroupId) {
      assignEmployeeMutation.mutate(
        {
          date: selectedDate.toISOString().split('T')[0],
          groupId,
          subGroupId,
          shiftId,
          employeeId,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Employee Assigned',
              description: 'The employee has been assigned to the shift.',
            });
            setHasUnsavedChanges(true);
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to assign employee. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    }
  };

  // Handle adding a new group
  const handleAddGroup = (group: {
    name: DepartmentName;
    color: DepartmentColor;
  }) => {
    if (isLocked) return;
    
    if (addGroupMutation) {
      addGroupMutation.mutate(
        { date: selectedDate.toISOString().split('T')[0], group },
        {
          onSuccess: () => {
            toast({
              title: 'Department Added',
              description: `${group.name} department has been added to the roster.`,
            });
            setHasUnsavedChanges(true);
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to add department. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      toast({
        title: 'Department Added (Mock)',
        description: `${group.name} department would be added to the roster.`,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle view change
  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex">
          {/* Main content */}
          <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
            <div className="glass-panel p-4 md:p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 mb-6 flex-grow overflow-auto">
              <RosterHeader
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onApplyTemplate={() => setIsTemplateDialogOpen(true)}
                onSaveRoster={handleSaveRoster}
                view={view}
                onViewChange={handleViewChange}
                navigatePrevious={navigatePrevious}
                navigateNext={navigateNext}
                isLocked={isLocked}
                onToggleLock={toggleLock}
                hasUnsavedChanges={hasUnsavedChanges}
              />

              {/* Global Collapse/Expand Buttons */}
              <div className="flex gap-2 my-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={collapseAllGroups}
                  disabled={!currentRoster || isLocked}
                >
                  Collapse All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={expandAllGroups}
                  disabled={!currentRoster || isLocked}
                >
                  Expand All
                </Button>
              </div>

              <div className="mt-6 overflow-x-auto">
                <RosterCalendar
                  selectedDate={selectedDate}
                  readOnly={!hasPermission('update') || isLocked}
                  roster={currentRoster}
                  isLoading={isLoading}
                  onAssignEmployee={handleAssignEmployee}
                  onAddGroup={handleAddGroup}
                  view={view}
                  dateRange={dateRange}
                />
              </div>
            </div>
          </div>

          {/* Employee sidebar */}
          {sidebarOpen && <RosterSidebar readOnly={!hasPermission('update') || isLocked} />}
        </div>

        {/* Template Selection Dialog */}
        <Dialog
          open={isTemplateDialogOpen}
          onOpenChange={setIsTemplateDialogOpen}
        >
          <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
            <DialogHeader>
              <DialogTitle>Apply Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Template</label>
                <Select
                  onValueChange={(value) => handleApplyTemplate(Number(value))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                    <SelectItem value="1">Standard Weekday Template</SelectItem>
                    <SelectItem value="2">Weekend Template</SelectItem>
                    <SelectItem value="3">Special Event Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-white/60">
                This will create a new roster based on the selected template.
                Any existing roster for this date will be overwritten.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
};

export default RostersPage;