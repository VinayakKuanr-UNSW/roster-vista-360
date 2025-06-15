
import React from 'react';
import { UserPlus, ShieldAlert, UserMinus, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BroadcastGroup, GroupMember } from '@/types/broadcast';

interface GroupMembersProps {
  selectedGroup: BroadcastGroup | null;
  groupMembers: GroupMember[];
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  onToggleAdminStatus: (memberId: string, currentStatus: boolean) => void;
}

const GroupMembers: React.FC<GroupMembersProps> = ({
  selectedGroup,
  groupMembers,
  onAddMember,
  onRemoveMember,
  onToggleAdminStatus
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {selectedGroup ? `${selectedGroup.name} - Members` : 'Group Members'}
        </CardTitle>
        {selectedGroup && (
          <Button size="sm" className="px-2" onClick={onAddMember}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
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
                        onClick={() => onToggleAdminStatus(member.id, member.is_admin)}
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
                        onClick={() => onRemoveMember(member.id)}
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
  );
};

export default GroupMembers;
