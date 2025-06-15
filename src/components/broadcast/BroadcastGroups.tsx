
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { BroadcastDbClient } from '@/utils/db-client';
import { BroadcastGroup, GroupMember } from '@/types/broadcast';
import GroupsList from './GroupsList';
import GroupMembers from './GroupMembers';
import CreateGroupDialog from './CreateGroupDialog';
import EditGroupDialog from './EditGroupDialog';
import AddMemberDialog from './AddMemberDialog';

const BroadcastGroups = () => {
  const [groups, setGroups] = useState<BroadcastGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<BroadcastGroup | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [editGroupName, setEditGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching broadcast groups...');
      const data = await BroadcastDbClient.fetchBroadcastGroups();
      console.log('Fetched groups:', data);
      setGroups(data);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: `Failed to load broadcast groups: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      console.log('Fetching members for group:', groupId);
      const data = await BroadcastDbClient.fetchGroupMembers(groupId);
      console.log('Fetched members:', data);
      setGroupMembers(data);
    } catch (error: any) {
      console.error('Error fetching group members:', error);
      toast({
        title: "Error",
        description: `Failed to load group members: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const createGroup = async (groupName: string) => {
    if (!groupName) {
      toast({
        title: "Validation Error",
        description: "Group name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      console.log('Creating new group:', groupName);
      
      const newGroups = await BroadcastDbClient.createBroadcastGroup(groupName);
      console.log('Created group:', newGroups);
      
      toast({
        title: "Success",
        description: "Broadcast group created successfully"
      });
      
      setIsAddDialogOpen(false);
      
      // Refresh the groups list and trigger refresh event
      await fetchGroups();
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('groupsUpdated'));
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: `Failed to create group: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const updateGroup = async () => {
    if (!selectedGroup) return;
    if (!editGroupName.trim()) {
      toast({
        title: "Validation Error",
        description: "Group name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      await BroadcastDbClient.updateBroadcastGroup(selectedGroup.id, editGroupName.trim());
      
      toast({
        title: "Success",
        description: "Broadcast group updated successfully"
      });
      
      setIsEditDialogOpen(false);
      await fetchGroups();
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('groupsUpdated'));
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update group: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? This will remove all members and broadcasts associated with it.')) {
      return;
    }

    try {
      await BroadcastDbClient.deleteBroadcastGroup(groupId);
      
      toast({
        title: "Success",
        description: "Broadcast group deleted successfully"
      });
      
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
        setGroupMembers([]);
      }
      
      await fetchGroups();
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('groupsUpdated'));
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete group: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const addMemberToGroup = async (userId: string, isAdmin: boolean = false) => {
    if (!selectedGroup) return;

    try {
      await BroadcastDbClient.addGroupMember(selectedGroup.id, userId, isAdmin);
      
      toast({
        title: "Success",
        description: "Member added to group successfully"
      });
      
      setIsAddMemberDialogOpen(false);
      fetchGroupMembers(selectedGroup.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add member: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the group?')) {
      return;
    }

    try {
      await BroadcastDbClient.removeGroupMember(memberId);
      
      toast({
        title: "Success",
        description: "Member removed from group successfully"
      });
      
      if (selectedGroup) {
        fetchGroupMembers(selectedGroup.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to remove member: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const toggleAdminStatus = async (memberId: string, currentStatus: boolean) => {
    try {
      await BroadcastDbClient.updateMemberAdminStatus(memberId, !currentStatus);
      
      toast({
        title: "Success",
        description: `User ${currentStatus ? 'removed as' : 'set as'} group admin successfully`
      });
      
      if (selectedGroup) {
        fetchGroupMembers(selectedGroup.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update admin status: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleSelectGroup = (group: BroadcastGroup) => {
    setSelectedGroup(group);
    fetchGroupMembers(group.id);
  };

  const handleEditGroup = (group: BroadcastGroup) => {
    setSelectedGroup(group);
    setEditGroupName(group.name);
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <GroupsList
        groups={groups}
        selectedGroup={selectedGroup}
        isLoading={isLoading}
        onSelectGroup={handleSelectGroup}
        onEditGroup={handleEditGroup}
        onDeleteGroup={deleteGroup}
        onCreateGroup={() => setIsAddDialogOpen(true)}
      />

      <GroupMembers
        selectedGroup={selectedGroup}
        groupMembers={groupMembers}
        onAddMember={() => setIsAddMemberDialogOpen(true)}
        onRemoveMember={removeMember}
        onToggleAdminStatus={toggleAdminStatus}
      />

      <CreateGroupDialog
        isOpen={isAddDialogOpen}
        isCreating={isCreating}
        onOpenChange={setIsAddDialogOpen}
        onCreateGroup={createGroup}
      />

      <EditGroupDialog
        isOpen={isEditDialogOpen}
        groupName={editGroupName}
        onOpenChange={setIsEditDialogOpen}
        onGroupNameChange={setEditGroupName}
        onSave={updateGroup}
      />

      <AddMemberDialog
        isOpen={isAddMemberDialogOpen}
        groupName={selectedGroup?.name || ''}
        onOpenChange={setIsAddMemberDialogOpen}
        onAddMember={addMemberToGroup}
      />
    </div>
  );
};

export default BroadcastGroups;
