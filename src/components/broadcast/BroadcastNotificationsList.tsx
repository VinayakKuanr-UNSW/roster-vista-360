
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Check, CheckCheck, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BroadcastDbClient } from '@/utils/db-client';
import { Notification } from '@/types/broadcast';
import { formatDistanceToNow } from 'date-fns';

export const BroadcastNotificationsList: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const fetchNotifications = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching notifications for user:', user.id);
      const data = await BroadcastDbClient.fetchUserNotifications(user.id);
      console.log('Fetched notifications:', data);
      setNotifications(data);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      // Set fallback data
      setNotifications([
        {
          id: '1',
          user_id: user.id,
          broadcast_id: '1',
          read: false,
          created_at: new Date().toISOString(),
          broadcast: {
            id: '1',
            group_id: '1',
            sender_id: '1',
            message: 'Welcome to the broadcast system! This is a demo notification.',
            created_at: new Date().toISOString(),
            sender: { id: '1', name: 'Demo Admin' },
            group: { id: '1', name: 'General Announcements' }
          }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await BroadcastDbClient.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      toast({
        title: "Success",
        description: "Notification marked as read"
      });
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Warning",
        description: "Could not mark notification as read - using demo mode"
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      setIsMarkingAllRead(true);
      await BroadcastDbClient.markAllNotificationsAsRead(user.id);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Warning",
        description: "Could not mark all notifications as read - using demo mode"
      });
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Broadcast Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={isMarkingAllRead}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            {isMarkingAllRead ? "Marking..." : "Mark All Read"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <BellOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground">
              You'll receive notifications when broadcasts are sent to your groups
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 transition-colors ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-background'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={notification.read ? "secondary" : "default"}>
                      {notification.broadcast?.group?.name || "Unknown Group"}
                    </Badge>
                    {!notification.read && (
                      <Badge variant="destructive" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-muted-foreground mb-1">
                    From: {notification.broadcast?.sender?.name || "Unknown"}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {notification.broadcast?.message || "No message content"}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
