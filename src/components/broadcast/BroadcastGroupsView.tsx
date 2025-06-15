
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BroadcastDbClient } from '@/utils/db-client';
import { Broadcast, BroadcastGroup } from '@/types/broadcast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const BroadcastGroupsView: React.FC = () => {
  const { user } = useAuth();
  const [userGroups, setUserGroups] = useState<BroadcastGroup[]>([]);
  const [broadcasts, setBroadcasts] = useState<{[key: string]: Broadcast[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGroupsAndBroadcasts = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Fetching user groups and broadcasts for user:', user.id);
      setIsLoading(true);
      setError(null);
      
      // Fetch groups where the user is a member
      const groups = await BroadcastDbClient.fetchUserGroups(user.id);
      console.log('Fetched user groups:', groups);
      setUserGroups(groups);
      
      // For each group, fetch the broadcast messages
      const broadcastsData: {[key: string]: Broadcast[]} = {};
      for (const group of groups) {
        try {
          console.log('Fetching broadcasts for group:', group.id);
          const groupBroadcasts = await BroadcastDbClient.fetchGroupBroadcasts(group.id);
          broadcastsData[group.id] = groupBroadcasts;
          console.log(`Found ${groupBroadcasts.length} broadcasts for group ${group.name}`);
        } catch (groupError: any) {
          console.error(`Error fetching broadcasts for group ${group.id}:`, groupError);
          broadcastsData[group.id] = [];
        }
      }
      setBroadcasts(broadcastsData);
    } catch (error: any) {
      console.error('Error fetching broadcast data:', error);
      setError(error.message);
      
      // Set fallback data on error
      const fallbackGroups = [
        { id: '1', name: 'General Announcements', is_admin: true },
        { id: '2', name: 'Team Updates', is_admin: false }
      ];
      setUserGroups(fallbackGroups);
      
      const fallbackBroadcasts: {[key: string]: Broadcast[]} = {};
      fallbackGroups.forEach(group => {
        fallbackBroadcasts[group.id] = [
          {
            id: `${group.id}-1`,
            group_id: group.id,
            sender_id: '1',
            message: `Welcome to ${group.name}! This is a demo message showing how broadcasts will appear.`,
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            sender: { id: '1', name: 'Demo Admin' },
            group: { id: group.id, name: group.name }
          }
        ];
      });
      setBroadcasts(fallbackBroadcasts);
      
      toast({
        title: "Warning",
        description: "Using demo data - Supabase connection failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserGroupsAndBroadcasts();

    // Listen for group updates and broadcast updates
    const handleGroupsUpdated = () => {
      console.log('Groups updated, refreshing groups view...');
      fetchUserGroupsAndBroadcasts();
    };

    const handleBroadcastSent = (event: CustomEvent) => {
      console.log('New broadcast sent, refreshing groups view...', event.detail);
      fetchUserGroupsAndBroadcasts();
    };

    window.addEventListener('groupsUpdated', handleGroupsUpdated);
    window.addEventListener('broadcastSent', handleBroadcastSent as EventListener);

    return () => {
      window.removeEventListener('groupsUpdated', handleGroupsUpdated);
      window.removeEventListener('broadcastSent', handleBroadcastSent as EventListener);
    };
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error && userGroups.length === 0) {
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
            variant="outline"
          >
            Reload Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (userGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Broadcast Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You are not a member of any broadcast groups. Please contact your administrator to be added to a group.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-orange-800">
              ⚠️ Demo Mode: Currently showing sample data due to connection issues
            </div>
          </CardContent>
        </Card>
      )}
      
      {userGroups.map(group => (
        <Card key={group.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center justify-between">
              <span>{group.name}</span>
              {group.is_admin && (
                <Badge variant="secondary">Admin</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {broadcasts[group.id]?.length > 0 ? (
              <div className="space-y-4">
                {broadcasts[group.id].map(broadcast => (
                  <div key={broadcast.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold">
                        {broadcast.sender?.name || "Unknown"}
                      </div>
                      <Badge variant="outline">
                        {formatDistanceToNow(new Date(broadcast.created_at), { addSuffix: true })}
                      </Badge>
                    </div>
                    <p className="whitespace-pre-wrap">{broadcast.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No broadcasts in this group yet.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
