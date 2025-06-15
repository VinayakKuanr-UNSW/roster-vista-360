
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BroadcastDbClient } from '@/utils/db-client';
import { BroadcastGroup } from '@/types/broadcast';
import { MessageSquare, Send } from 'lucide-react';

const BroadcastForm = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<BroadcastGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Fetching groups for user:', user.id);
      const userGroups = await BroadcastDbClient.fetchUserGroups(user.id);
      console.log('Fetched user groups:', userGroups);
      
      // Filter to only show groups where user is admin (can send broadcasts)
      const adminGroups = userGroups.filter(group => group.is_admin);
      console.log('Admin groups:', adminGroups);
      
      setGroups(adminGroups);
    } catch (error: any) {
      console.error('Error fetching user groups:', error);
      toast({
        title: "Error",
        description: `Failed to load groups: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendBroadcast = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to send broadcasts",
        variant: "destructive"
      });
      return;
    }

    if (!selectedGroupId) {
      toast({
        title: "Validation Error",
        description: "Please select a group to broadcast to",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a message to broadcast",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSending(true);
      console.log('Sending broadcast to group:', selectedGroupId);
      
      // Create the broadcast
      const broadcast = await BroadcastDbClient.createBroadcast(
        selectedGroupId,
        user.id,
        message.trim()
      );
      
      console.log('Broadcast created:', broadcast);
      
      // Get group members to create notifications
      const groupMembers = await BroadcastDbClient.fetchGroupMembers(selectedGroupId);
      const memberUserIds = groupMembers.map(member => member.user_id);
      
      // Create notifications for all group members (except sender)
      const recipientIds = memberUserIds.filter(id => id !== user.id);
      if (recipientIds.length > 0) {
        await BroadcastDbClient.createNotificationsForBroadcast(broadcast.id, recipientIds);
        console.log('Notifications created for recipients:', recipientIds);
      }
      
      toast({
        title: "Success",
        description: `Broadcast sent to ${groupMembers.length} group members`
      });
      
      // Clear the form
      setMessage('');
      setSelectedGroupId('');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('broadcastSent', { 
        detail: { groupId: selectedGroupId, broadcast } 
      }));
      
    } catch (error: any) {
      console.error('Error sending broadcast:', error);
      toast({
        title: "Error",
        description: `Failed to send broadcast: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchGroups();

    // Listen for group updates
    const handleGroupsUpdated = () => {
      console.log('Groups updated, refreshing...');
      fetchGroups();
    };

    window.addEventListener('groupsUpdated', handleGroupsUpdated);

    return () => {
      window.removeEventListener('groupsUpdated', handleGroupsUpdated);
    };
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Compose Broadcast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div>Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-4" />
            <p>You don't have admin access to any broadcast groups.</p>
            <p className="text-sm">Contact your administrator to be granted admin access.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="group-select" className="text-sm font-medium">
                Select Group
              </label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group to broadcast to" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Enter your broadcast message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {message.length} characters
              </div>
            </div>

            <Button 
              onClick={sendBroadcast} 
              disabled={isSending || !selectedGroupId || !message.trim()}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? "Sending..." : "Send Broadcast"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BroadcastForm;
