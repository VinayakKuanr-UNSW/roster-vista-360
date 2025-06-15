
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

interface CreateGroupDialogProps {
  isOpen: boolean;
  isCreating: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (groupName: string) => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  isOpen,
  isCreating,
  onOpenChange,
  onCreateGroup
}) => {
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreate = () => {
    onCreateGroup(newGroupName.trim());
    setNewGroupName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Broadcast Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name">Group Name</label>
            <Input
              id="name"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isCreating) {
                  handleCreate();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
