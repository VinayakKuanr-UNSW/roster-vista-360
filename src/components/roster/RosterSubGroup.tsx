import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Plus, Trash, Copy } from 'lucide-react';
import ShiftItem from '@/components/ShiftItem';
import { SubGroup, RemunerationLevel } from '@/api/models/types';
import AddShiftDialog from './dialogs/AddShiftDialog';
import { useTemplates } from '@/api/hooks';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RosterSubGroupProps {
  templateId?: number;
  subGroup: SubGroup;
  groupId: number;
  groupColor: string;
  readOnly?: boolean;
  onAddShift?: (groupId: number, subGroupId: number, shift: any) => void;
  onEditSubGroup?: (groupId: number, subGroupId: number, name: string) => void;
  onDeleteSubGroup?: (groupId: number, subGroupId: number) => void;
  onCloneSubGroup?: (groupId: number, subGroupId: number) => void;
}

const RosterSubGroup: React.FC<RosterSubGroupProps> = ({ 
  templateId,
  subGroup, 
  groupId,
  groupColor,
  readOnly,
  onAddShift,
  onEditSubGroup,
  onDeleteSubGroup,
  onCloneSubGroup
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(subGroup.name);
  const { toast } = useToast();
  
  const { 
    useAddShift, 
    useUpdateSubGroup,
    useDeleteSubGroup,
    useCloneSubGroup
  } = useTemplates();
  
  const addShiftMutation = useAddShift();
  const updateSubGroupMutation = useUpdateSubGroup();
  const deleteSubGroupMutation = useDeleteSubGroup();
  const cloneSubGroupMutation = useCloneSubGroup();
  
  const handleAddShift = (groupId: number, subGroupId: number, shift: any) => {
    if (onAddShift) {
      onAddShift(groupId, subGroupId, shift);
    } else if (templateId) {
      addShiftMutation.mutate({
        templateId,
        groupId,
        subGroupId,
        shift
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `${shift.role} shift added to ${subGroup.name}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to add shift: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      toast({
        title: "Shift Added",
        description: `${shift.role} shift added to ${subGroup.name}`,
      });
    }
  };
  
  const handleSaveEdit = () => {
    if (onEditSubGroup) {
      onEditSubGroup(groupId, subGroup.id, editName);
    } else if (templateId) {
      updateSubGroupMutation.mutate({
        templateId,
        groupId,
        subGroupId: subGroup.id,
        updates: { name: editName }
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Subgroup updated successfully`,
          });
          setIsEditDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to update subgroup: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      toast({
        title: "Subgroup Updated",
        description: `${subGroup.name} would be updated to ${editName}`,
      });
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDeleteSubGroup = () => {
    if (onDeleteSubGroup) {
      onDeleteSubGroup(groupId, subGroup.id);
    } else if (templateId) {
      deleteSubGroupMutation.mutate({
        templateId,
        groupId,
        subGroupId: subGroup.id
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Subgroup deleted successfully`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete subgroup: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      toast({
        title: "Subgroup Deleted",
        description: `${subGroup.name} would be deleted`,
      });
    }
  };
  
  const handleCloneSubGroup = () => {
    if (onCloneSubGroup) {
      onCloneSubGroup(groupId, subGroup.id);
    } else if (templateId) {
      cloneSubGroupMutation.mutate({
        templateId,
        groupId,
        subGroupId: subGroup.id
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Subgroup cloned successfully`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to clone subgroup: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      toast({
        title: "Subgroup Cloned",
        description: `A copy of ${subGroup.name} would be created`,
      });
    }
  };
  
  return (
    <div className="rounded-lg p-3 bg-black/20 border border-white/10 backdrop-blur-sm">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-md font-medium text-white/90 flex items-center">
          {isExpanded ? (
            <ChevronDown className="mr-2 h-4 w-4 text-white/60" />
          ) : (
            <ChevronUp className="mr-2 h-4 w-4 text-white/60" />
          )}
          {subGroup.name}
          <span className="ml-2 text-xs text-white/60">
            {subGroup.shifts.length} shifts
          </span>
        </h4>
        
        {!readOnly && (
          <div className="flex items-center space-x-2">
            <AddShiftDialog
              groupId={groupId}
              subGroupId={subGroup.id}
              date={new Date().toISOString().split('T')[0]}
              onAddShift={handleAddShift}
              trigger={
                <button 
                  className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all duration-200 hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus size={14} />
                </button>
              }
            />
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <button 
                  className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-blue-400/80 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditName(subGroup.name);
                  }}
                >
                  <Edit size={14} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Edit Subgroup</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subgroup-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="subgroup-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="col-span-3 bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleSaveEdit}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <button 
              className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-indigo-400/80 hover:text-indigo-400 transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleCloneSubGroup();
              }}
            >
              <Copy size={14} />
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-red-400/80 hover:text-red-400 transition-all duration-200 hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash size={14} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subgroup</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the {subGroup.name} subgroup? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteSubGroup}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {subGroup.shifts.map((shift) => (
            <ShiftItem 
              key={shift.id}
              id={shift.id}
              role={shift.role}
              startTime={shift.startTime}
              endTime={shift.endTime}
              breakDuration={shift.breakDuration || ""}
              remunerationLevel={String(shift.remunerationLevel || "")}
              employeeId={shift.employeeId}
              employee={shift.employee}
              status={shift.status}
            />
          ))}
          
          {!readOnly && subGroup.shifts.length === 0 && (
            <div className="text-center p-3 rounded-lg border border-white/5">
              <p className="text-white/60 text-sm mb-2">No shifts in this subgroup</p>
              <AddShiftDialog
                groupId={groupId}
                subGroupId={subGroup.id}
                date={new Date().toISOString().split('T')[0]}
                onAddShift={handleAddShift}
                trigger={
                  <Button variant="ghost" size="sm" className='bg-transparent hover:bg-transparent border-none text-white'>
                    <Plus size={12} className="mr-1" />
                    Add Shift
                  </Button>
                }
              />
            </div>
          )}
          
          {!readOnly && subGroup.shifts.length > 0 && (
            <AddShiftDialog
              groupId={groupId}
              subGroupId={subGroup.id}
              date={new Date().toISOString().split('T')[0]}
              onAddShift={handleAddShift}
              trigger={
                <button className="w-full py-1.5 mt-2 rounded-md flex items-center justify-center bg-black/20 hover:bg-black/30 text-white/70 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-200 text-sm">
                  <Plus size={12} className="mr-1" />
                  <span>Add Shift</span>
                </button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export { RosterSubGroup };
