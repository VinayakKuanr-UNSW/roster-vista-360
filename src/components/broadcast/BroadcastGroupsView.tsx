
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        // Fetch groups where the user is a member
        const groups = await BroadcastDbClient.fetchUserGroups(user.id);
        setUserGroups(groups);
        
        // For each group, fetch the broadcast messages
        const broadcastsData: {[key: string]: Broadcast[]} = {};
        for (const group of groups) {
          const groupBroadcasts = await BroadcastDbClient.fetchGroupBroadcasts(group.id);
          broadcastsData[group.id] = groupBroadcasts;
        }
        setBroadcasts(broadcastsData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load broadcast data: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserGroups();
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

  if (userGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Broadcast Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You are not a member of any broadcast groups. Please contact your administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {userGroups.map(group => (
        <Card key={group.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle>{group.name}</CardTitle>
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
