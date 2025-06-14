
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTheme } from '@/contexts/ThemeContext';

interface AddGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newGroup: { name: string; color: string };
  setNewGroup: React.Dispatch<React.SetStateAction<{ name: string; color: string }>>;
  onAddGroup: () => void;
}

const AddGroupDialog: React.FC<AddGroupDialogProps> = ({
  isOpen,
  onOpenChange,
  newGroup,
  setNewGroup,
  onAddGroup
}) => {
  const { theme } = useTheme();
  const isGlassTheme = theme === 'glass';
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={isGlassTheme ? "backdrop-blur-xl bg-black/40 border border-white/20" : ""}>
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="groupName">Group Name</label>
            <Input
              id="groupName"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              placeholder="Enter group name"
              className={isGlassTheme ? "bg-white/10 border-white/20" : ""}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="groupColor">Group Color</label>
            <Select value={newGroup.color} onValueChange={(value) => setNewGroup({ ...newGroup, color: value })}>
              <SelectTrigger id="groupColor" className={isGlassTheme ? "bg-white/10 border-white/20" : ""}>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent className={isGlassTheme ? "backdrop-blur-xl bg-black/80 border border-white/20" : ""}>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="sky">Sky Blue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant={isGlassTheme ? "glass" : "outline"} 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant={isGlassTheme ? "glass" : "default"} 
            onClick={onAddGroup}
          >
            Add Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupDialog;
