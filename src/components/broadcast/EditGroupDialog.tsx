
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface EditGroupDialogProps {
  isOpen: boolean;
  groupName: string;
  onOpenChange: (open: boolean) => void;
  onGroupNameChange: (name: string) => void;
  onSave: () => void;
}

const EditGroupDialog: React.FC<EditGroupDialogProps> = ({
  isOpen,
  groupName,
  onOpenChange,
  onGroupNameChange,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Broadcast Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-name">Group Name</label>
            <Input
              id="edit-name"
              value={groupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSave();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialog;
