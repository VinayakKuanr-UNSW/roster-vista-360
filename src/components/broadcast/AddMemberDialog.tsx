
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmployeeSelector from './EmployeeSelector';

interface AddMemberDialogProps {
  isOpen: boolean;
  groupName: string;
  onOpenChange: (open: boolean) => void;
  onAddMember: (userId: string, isAdmin: boolean) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  isOpen,
  groupName,
  onOpenChange,
  onAddMember
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member to {groupName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <EmployeeSelector onSelect={(userId, isAdmin) => onAddMember(userId, isAdmin || false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
