import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { Group, SubGroup } from '@/api/models/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRosters } from '@/api/hooks';
import { format } from 'date-fns';

interface ShiftCardProps {
  shift: any; // mix of types + extra fields
  group?: Group; // ✅ now optional
  subGroup: SubGroup;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  group,
  subGroup,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  /* ----- form state -------------------------------------------------- */
  const [formData, setFormData] = useState({
    startTime: shift.startTime,
    endTime: shift.endTime,
    breakDuration: shift.breakDuration || '00:30',
    role: shift.role,
    remunerationLevel: shift.remunerationLevel,
  });

  /* ----- helper fns -------------------------------------------------- */
  const getCardBgClass = () => {
    switch (group?.color) {
      case 'blue':
        return 'bg-blue-900/40 hover:bg-blue-900/60 border-blue-700/30';
      case 'green':
        return 'bg-green-900/40 hover:bg-green-900/60 border-green-700/30';
      case 'red':
        return 'bg-red-900/40 hover:bg-red-900/60 border-red-700/30';
      case 'purple':
        return 'bg-purple-900/40 hover:bg-purple-900/60 border-purple-700/30';
      default:
        // neutral fallback if group or color missing
        return 'bg-blue-900/40 hover:bg-blue-900/60 border-blue-700/30';
    }
  };

  const calcDuration = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let h = eh - sh;
    let m = em - sm;
    if (m < 0) {
      h -= 1;
      m += 60;
    }
    return `${h}h ${m}m`;
  };

  const calcNet = (start: string, end: string, br = '00:00') => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const [bh, bm] = br.split(':').map(Number);
    const mins = eh * 60 + em - (sh * 60 + sm) - (bh * 60 + bm);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const shiftDuration = calcDuration(shift.startTime, shift.endTime);
  const netDuration = calcNet(
    shift.startTime,
    shift.endTime,
    shift.breakDuration,
  );

  /* ----- mutations --------------------------------------------------- */
  const { useUpdateShift, useRemoveShift } = useRosters();
  const updateShiftMutation = useUpdateShift();
  const removeShiftMutation = useRemoveShift();

  const updateShift = () => {
    const dt = format(shift.date, 'yyyy-MM-dd');
    updateShiftMutation.mutate(
      {
        date: dt,
        groupId: group?.id ?? 0,
        subGroupId: subGroup.id,
        shiftId: shift.id,
        updates: formData,
      },
      {
        onSuccess: () => {
          toast({ title: 'Shift Updated' });
          setIsEditDialogOpen(false);
        },
        onError: () =>
          toast({
            title: 'Error',
            description: 'Failed to update shift.',
            variant: 'destructive',
          }),
      },
    );
  };

  const deleteShift = () => {
    const dt = format(shift.date, 'yyyy-MM-dd');
    removeShiftMutation.mutate(
      {
        date: dt,
        groupId: group?.id ?? 0,
        subGroupId: subGroup.id,
        shiftId: shift.id,
      },
      {
        onSuccess: () => toast({ title: 'Shift Deleted' }),
        onError: () =>
          toast({
            title: 'Error',
            description: 'Failed to delete shift.',
            variant: 'destructive',
          }),
      },
    );
  };

  /* ----- render ------------------------------------------------------ */
  return (
    <>
      <div // Reduced padding from p-2 to p-1, and adjusted margin-bottom on the first line
        className={`p-1 rounded-md border ${getCardBgClass()} transition-colors text-xs`}
      >
        <div className="flex justify-between mb-1">
          <span className="font-semibold">{shift.role}</span>
          <span className="text-neutral-400">{shift.remunerationLevel}</span>
        </div>

        <div className="text-neutral-200">
          {shift.startTime} – {shift.endTime} ({shiftDuration})
        </div>

        {/* Combined Break and Net info, reduced margin-top */}
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-neutral-400">
            Break: {shift.breakDuration || '00:00'} • Net: {netDuration}
          </span>
          <div className="flex space-x-1">
            {/* edit */}
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="p-1 hover:bg-white/10 rounded text-blue-400"
            >
              <Edit size={14} />
            </button>

            {/* delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="p-1 hover:bg-white/10 rounded text-red-400">
                  <Trash size={14} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-neutral-900 border border-neutral-700">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete shift?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={deleteShift}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-neutral-900 border border-neutral-700">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
          </DialogHeader>
          {/* … inputs unchanged … */}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-neutral-700 bg-neutral-800"
            >
              Cancel
            </Button>
            <Button onClick={updateShift}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
