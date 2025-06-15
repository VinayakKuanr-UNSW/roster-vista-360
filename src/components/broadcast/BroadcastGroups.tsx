
import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, UserPlus, ShieldAlert, UserMinus, Shield, Users, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import EmployeeSelector from './EmployeeSelector';
import { BroadcastDbClient } from '@/utils/db-client';
import { BroadcastGroup, GroupMember } from '@/types/broadcast';

const BroadcastGroups = () => {
  const [groups, setGroups] = useState<BroadcastGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<BroadcastGroup | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [editGroupName, setEditGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  // Fetch broadcast groups
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

  // Fetch members of a group
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

  // Create a new broadcast group
  const createGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Validation Error",
        description: "Group name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      console.log('Creating new group:', newGroupName.trim());
      
      const newGroups = await BroadcastDbClient.createBroadcastGroup(newGroupName.trim());
      console.log('Created group:', newGroups);
      
      toast({
        title: "Success",
        description: "Broadcast group created successfully"
      });
      
      setNewGroupName('');
      setIsAddDialogOpen(false);
      
      // Refresh the groups list
      await fetchGroups();
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

  // Update a broadcast group
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
      fetchGroups();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update group: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  // Delete a broadcast group
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
      
      fetchGroups();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete group: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  // Add a member to a group
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

  // Remove a member from a group
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

  // Toggle admin status for a member
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

  // Select a group to view its members
  const handleSelectGroup = (group: BroadcastGroup) => {
    setSelectedGroup(group);
    fetchGroupMembers(group.id);
  };

  // Prepare to edit a group
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
      {/* Group List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Broadcast Groups
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="px-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Group
              </Button>
            </DialogTrigger>
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
                        createGroup();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button onClick={createGroup} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Group"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No broadcast groups found.</p>
              <p className="text-sm text-muted-foreground">Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
                    selectedGroup?.id === group.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => handleSelectGroup(group)}
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">{group.name}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGroup(group);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(group.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {selectedGroup ? `${selectedGroup.name} - Members` : 'Group Members'}
          </CardTitle>
          {selectedGroup && (
            <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="px-2">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Member to {selectedGroup.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <EmployeeSelector onSelect={(userId, isAdmin) => addMemberToGroup(userId, isAdmin || false)} />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {!selectedGroup ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a group to view its members</p>
            </div>
          ) : groupMembers.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No members in this group.</p>
              <p className="text-sm text-muted-foreground">Add members to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.user?.name}</div>
                        <div className="text-sm text-muted-foreground">{member.user?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.is_admin ? (
                        <Badge variant="default">Group Admin</Badge>
                      ) : (
                        <Badge variant="outline">Member</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAdminStatus(member.id, member.is_admin)}
                          title={member.is_admin ? "Remove admin rights" : "Make admin"}
                        >
                          {member.is_admin ? (
                            <Shield className="h-4 w-4" />
                          ) : (
                            <ShieldAlert className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMember(member.id)}
                          title="Remove from group"
                        >
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Broadcast Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name">Group Name</label>
              <Input
                id="edit-name"
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateGroup();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateGroup}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BroadcastGroups;
