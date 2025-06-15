
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BroadcastDbClient } from '@/utils/db-client';

interface GroupWithAdminStatus {
  id: string;
  name: string;
  is_admin: boolean;
}

const BroadcastForm = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groups, setGroups] = useState<GroupWithAdminStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch broadcast groups where the current user is an admin
  const fetchGroups = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Fetching groups for user:', user.id);
      setIsLoading(true);
      setError(null);
      
      const userGroups = await BroadcastDbClient.fetchUserGroups(user.id);
      console.log('Fetched user groups:', userGroups);
      
      // Filter to only include groups where the user is an admin
      const adminGroups = userGroups.filter(group => group.is_admin);
      console.log('Admin groups:', adminGroups);
      
      setGroups(adminGroups);
      
      // If selectedGroupId is not in the updated list, reset it
      if (selectedGroupId && !adminGroups.find(g => g.id === selectedGroupId)) {
        setSelectedGroupId(adminGroups.length > 0 ? adminGroups[0].id : '');
      } else if (!selectedGroupId && adminGroups.length > 0) {
        setSelectedGroupId(adminGroups[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      setError(error.message);
      
      // Set fallback groups on error
      const fallbackGroups = [
        { id: '1', name: 'General Announcements', is_admin: true }
      ];
      setGroups(fallbackGroups);
      if (!selectedGroupId) {
        setSelectedGroupId(fallbackGroups[0].id);
      }
      
      toast({
        title: "Warning",
        description: "Using demo data - Supabase connection failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for group updates from other components
  useEffect(() => {
    const handleGroupsUpdated = () => {
      console.log('Groups updated event received, refreshing...');
      fetchGroups();
    };

    window.addEventListener('groupsUpdated', handleGroupsUpdated);
    
    return () => {
      window.removeEventListener('groupsUpdated', handleGroupsUpdated);
    };
  }, [user?.id, selectedGroupId]);

  useEffect(() => {
    fetchGroups();
  }, [user?.id]);

  // Send broadcast message
  const sendBroadcast = async () => {
    if (!message.trim()) {
      toast({
        title: "Validation Error",
        description: "Message cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (!selectedGroupId) {
      toast({
        title: "Validation Error",
        description: "Please select a broadcast group",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to send broadcasts",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Sending broadcast...', { selectedGroupId, userId: user.id, message: message.trim() });
      setIsSending(true);
      
      // Create a new broadcast
      const broadcast = await BroadcastDbClient.createBroadcast(
        selectedGroupId,
        user.id,
        message.trim()
      );
      
      console.log('Created broadcast:', broadcast);
      
      // Get all members of the selected group
      const groupMembers = await BroadcastDbClient.fetchGroupMembers(selectedGroupId);
      console.log('Group members:', groupMembers);
      
      if (groupMembers.length > 0) {
        // Create notifications for all members
        const memberIds = groupMembers.map(member => member.user_id);
        await BroadcastDbClient.createNotificationsForBroadcast(broadcast.id, memberIds);
        console.log('Created notifications for members:', memberIds);
      }
      
      toast({
        title: "Success",
        description: "Broadcast sent successfully"
      });
      
      setMessage('');
    } catch (error: any) {
      console.error('Error sending broadcast:', error);
      toast({
        title: "Warning", 
        description: "Broadcast simulated - Supabase connection issues"
      });
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  if (error && groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Broadcast System Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-orange-600 mb-4">
            Demo Mode: Supabase connection not available. This is a demonstration of the broadcast functionality.
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Reload Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Broadcast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="group" className="text-sm font-medium">
            Select Broadcast Group
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : groups.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              You don't have admin access to any broadcast groups. Please contact your administrator to be added as an admin to a group.
            </div>
          ) : (
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger id="group">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Broadcast Message
          </label>
          <Textarea
            id="message"
            placeholder="Enter your broadcast message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
            disabled={isLoading || groups.length === 0}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={sendBroadcast} 
          disabled={isLoading || isSending || groups.length === 0 || !message.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send Broadcast"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BroadcastForm;
