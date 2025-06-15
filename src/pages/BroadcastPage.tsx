
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BroadcastGroups from '@/components/broadcast/BroadcastGroups';
import BroadcastForm from '@/components/broadcast/BroadcastForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BroadcastGroupsView } from '@/components/broadcast/BroadcastGroupsView';
import { BroadcastAnalytics } from '@/components/broadcast/BroadcastAnalytics';
import { BroadcastNotificationsList } from '@/components/broadcast/BroadcastNotificationsList';
import { MessageSquare, BarChart3, Bell, Settings } from 'lucide-react';

const BroadcastPage = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if the user has broadcast permission
  const hasBroadcastAccess = hasPermission('broadcast');
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isTeamLead = user?.role === 'teamlead';
  const isTeamMember = user?.role === 'member';

  // Set default tab based on user role
  useEffect(() => {
    if (isTeamMember) {
      setActiveTab('messages');
    } else {
      setActiveTab('dashboard');
    }
  }, [isTeamMember]);

  if (!hasBroadcastAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
            <CardDescription>
              You don't have permission to access the broadcast system.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isTeamMember) {
    // Team member view - simplified interface
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Broadcast Messages</h1>
          <p className="text-muted-foreground">
            View broadcasts from your groups and manage notifications
          </p>
        </div>
        
        <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages">
            <BroadcastGroupsView />
          </TabsContent>
          
          <TabsContent value="notifications">
            <BroadcastNotificationsList />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Admin, Manager, Team Lead view - full functionality
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Broadcast Management</h1>
        <p className="text-muted-foreground">
          Manage broadcast groups, send messages, and view analytics
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage Groups
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="space-y-6">
            <BroadcastAnalytics />
            <BroadcastGroupsView />
          </div>
        </TabsContent>
        
        <TabsContent value="compose">
          <BroadcastForm />
        </TabsContent>
        
        <TabsContent value="groups">
          <BroadcastGroups />
        </TabsContent>
        
        <TabsContent value="notifications">
          <BroadcastNotificationsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BroadcastPage;
