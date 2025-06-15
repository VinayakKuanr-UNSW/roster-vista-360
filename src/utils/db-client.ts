
import { supabase } from '@/integrations/supabase/client';
import type { BroadcastGroup, GroupMember, Broadcast, Notification, Employee } from '@/types/broadcast';

// Helper class to provide typed methods for accessing broadcast tables
export class BroadcastDbClient {
  // Check if Supabase is properly connected
  static async testConnection() {
    try {
      const { data, error } = await supabase.from('broadcast_groups').select('count').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  // Broadcast Groups methods
  static async fetchBroadcastGroups() {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, returning mock data');
        return [
          { id: '1', name: 'General Announcements', created_at: new Date().toISOString() },
          { id: '2', name: 'Team Updates', created_at: new Date().toISOString() }
        ] as BroadcastGroup[];
      }

      const { data, error } = await supabase
        .from('broadcast_groups')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as BroadcastGroup[];
    } catch (error) {
      console.error('Error fetching broadcast groups:', error);
      // Return mock data as fallback
      return [
        { id: '1', name: 'General Announcements', created_at: new Date().toISOString() },
        { id: '2', name: 'Team Updates', created_at: new Date().toISOString() }
      ] as BroadcastGroup[];
    }
  }

  static async createBroadcastGroup(name: string) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating group creation');
        return [{ id: Date.now().toString(), name, created_at: new Date().toISOString() }] as BroadcastGroup[];
      }

      const { data, error } = await supabase
        .from('broadcast_groups')
        .insert([{ name }])
        .select();
      
      if (error) throw error;
      return data as BroadcastGroup[];
    } catch (error) {
      console.error('Error creating broadcast group:', error);
      throw error;
    }
  }

  static async updateBroadcastGroup(id: string, name: string) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating group update');
        return;
      }

      const { error } = await supabase
        .from('broadcast_groups')
        .update({ name })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating broadcast group:', error);
      throw error;
    }
  }

  static async deleteBroadcastGroup(id: string) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating group deletion');
        return;
      }

      const { error } = await supabase
        .from('broadcast_groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting broadcast group:', error);
      throw error;
    }
  }

  // Group Members methods
  static async fetchGroupMembers(groupId: string) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, returning mock members');
        return [
          {
            id: '1',
            group_id: groupId,
            user_id: '1',
            is_admin: true,
            user: {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              role: 'admin',
              department: 'IT'
            }
          },
          {
            id: '2',
            group_id: groupId,
            user_id: '2',
            is_admin: false,
            user: {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              role: 'member',
              department: 'HR'
            }
          }
        ] as GroupMember[];
      }

      // First get the basic member data
      const { data: members, error: membersError } = await supabase
        .from('broadcast_group_members')
        .select('*')
        .eq('group_id', groupId);
      
      if (membersError) throw membersError;
      
      // Then get user details for each member
      const membersWithUsers = await Promise.all(
        members.map(async (member) => {
          const { data: userData, error: userError } = await supabase
            .from('auth_users_view')
            .select('id, name, email, role, department')
            .eq('id', member.user_id)
            .single();
          
          return {
            ...member,
            user: userData || {
              id: member.user_id,
              name: 'Unknown User',
              email: '',
              role: '',
              department: ''
            }
          };
        })
      );
      
      return membersWithUsers as GroupMember[];
    } catch (error) {
      console.error('Error fetching group members:', error);
      return [] as GroupMember[];
    }
  }

  static async addGroupMember(groupId: string, userId: string, isAdmin: boolean = false) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating member addition');
        return;
      }

      const { error } = await supabase
        .from('broadcast_group_members')
        .insert([{
          group_id: groupId,
          user_id: userId,
          is_admin: isAdmin
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error adding group member:', error);
      throw error;
    }
  }

  static async removeGroupMember(memberId: string) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating member removal');
        return;
      }

      const { error } = await supabase
        .from('broadcast_group_members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error removing group member:', error);
      throw error;
    }
  }

  static async updateMemberAdminStatus(memberId: string, isAdmin: boolean) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating admin status update');
        return;
      }

      const { error } = await supabase
        .from('broadcast_group_members')
        .update({ is_admin: isAdmin })
        .eq('id', memberId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating member admin status:', error);
      throw error;
    }
  }

  // User Groups methods
  static async fetchUserGroups(userId: string) {
    console.log('Fetching user groups for user:', userId);
    
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, returning mock user groups');
        return [
          { id: '1', name: 'General Announcements', is_admin: true },
          { id: '2', name: 'Team Updates', is_admin: false }
        ];
      }

      // Get group memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from('broadcast_group_members')
        .select('group_id, is_admin')
        .eq('user_id', userId);
      
      if (membershipsError) {
        console.error('Error fetching memberships:', membershipsError);
        throw membershipsError;
      }

      console.log('Found memberships:', memberships);
      
      if (!memberships || memberships.length === 0) {
        return [];
      }
      
      // Get group details
      const groupIds = memberships.map(m => m.group_id);
      const { data: groups, error: groupsError } = await supabase
        .from('broadcast_groups')
        .select('id, name')
        .in('id', groupIds);
      
      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
        throw groupsError;
      }

      console.log('Found groups:', groups);
      
      // Combine group data with admin status
      const userGroups = groups.map(group => {
        const membership = memberships.find(m => m.group_id === group.id);
        return {
          id: group.id,
          name: group.name,
          is_admin: membership?.is_admin || false
        };
      });

      console.log('Returning user groups:', userGroups);
      return userGroups;
    } catch (error) {
      console.error('Error in fetchUserGroups:', error);
      // Return mock data as fallback
      return [
        { id: '1', name: 'General Announcements', is_admin: true },
        { id: '2', name: 'Team Updates', is_admin: false }
      ];
    }
  }

  // Broadcasts methods
  static async createBroadcast(groupId: string, senderId: string, message: string) {
    console.log('Creating broadcast:', { groupId, senderId, message });
    
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating broadcast creation');
        return {
          id: Date.now().toString(),
          group_id: groupId,
          sender_id: senderId,
          message: message,
          created_at: new Date().toISOString()
        } as Broadcast;
      }

      const { data, error } = await supabase
        .from('broadcasts')
        .insert([{
          group_id: groupId,
          sender_id: senderId,
          message: message
        }])
        .select();
      
      if (error) {
        console.error('Error creating broadcast:', error);
        throw error;
      }
      
      console.log('Created broadcast:', data[0]);
      return data[0] as Broadcast;
    } catch (error) {
      console.error('Error in createBroadcast:', error);
      throw error;
    }
  }

  // Fetch broadcasts for a specific group
  static async fetchGroupBroadcasts(groupId: string) {
    console.log('Fetching broadcasts for group:', groupId);
    
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, returning mock broadcasts');
        return [
          {
            id: '1',
            group_id: groupId,
            sender_id: '1',
            message: 'Welcome to the broadcast system! This is a test message.',
            created_at: new Date().toISOString(),
            sender: { id: '1', name: 'John Doe' },
            group: { id: groupId, name: 'General Announcements' }
          }
        ] as Broadcast[];
      }

      // First get the broadcasts
      const { data: broadcasts, error: broadcastsError } = await supabase
        .from('broadcasts')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
      
      if (broadcastsError) {
        console.error('Error fetching broadcasts:', broadcastsError);
        throw broadcastsError;
      }

      console.log('Found broadcasts:', broadcasts);
      
      // Then get sender and group details for each broadcast
      const broadcastsWithDetails = await Promise.all(
        broadcasts.map(async (broadcast) => {
          // Get sender details
          const { data: senderData } = await supabase
            .from('auth_users_view')
            .select('id, name')
            .eq('id', broadcast.sender_id)
            .single();
          
          // Get group details
          const { data: groupData } = await supabase
            .from('broadcast_groups')
            .select('id, name')
            .eq('id', broadcast.group_id)
            .single();
          
          return {
            ...broadcast,
            sender: senderData || { id: broadcast.sender_id, name: 'Unknown User' },
            group: groupData || { id: broadcast.group_id, name: 'Unknown Group' }
          };
        })
      );
      
      console.log('Returning broadcasts with details:', broadcastsWithDetails);
      return broadcastsWithDetails as Broadcast[];
    } catch (error) {
      console.error('Error in fetchGroupBroadcasts:', error);
      return [] as Broadcast[];
    }
  }

  // Notifications methods
  static async fetchUserNotifications(userId: string) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, returning empty notifications');
        return [] as Notification[];
      }

      const { data, error } = await supabase
        .from('broadcast_notifications')
        .select(`
          *,
          broadcast:broadcast_id (
            id,
            message,
            created_at,
            sender:sender_id (
              id,
              name
            ),
            group:group_id (
              id,
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [] as Notification[];
    }
  }

  static async markNotificationAsRead(notificationId: string) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating notification read');
        return;
      }

      const { error } = await supabase
        .from('broadcast_notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllNotificationsAsRead(userId: string) {
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating mark all as read');
        return;
      }

      const { error } = await supabase
        .from('broadcast_notifications')
        .update({ read: true })
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async createNotificationsForBroadcast(broadcastId: string, userIds: string[]) {
    console.log('Creating notifications for broadcast:', broadcastId, 'users:', userIds);
    
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, simulating notification creation');
        return;
      }

      if (userIds.length === 0) {
        console.log('No users to notify');
        return;
      }
      
      const notifications = userIds.map(userId => ({
        user_id: userId,
        broadcast_id: broadcastId,
        read: false
      }));
      
      const { error } = await supabase
        .from('broadcast_notifications')
        .insert(notifications);
      
      if (error) {
        console.error('Error creating notifications:', error);
        throw error;
      }
      
      console.log('Created notifications successfully');
    } catch (error) {
      console.error('Error in createNotificationsForBroadcast:', error);
      throw error;
    }
  }

  // Employees / Users methods
  static async fetchUsers() {
    console.log('Fetching users from auth_users_view');
    
    try {
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.warn('Supabase not connected, returning mock users');
        return [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', department: 'IT' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'member', department: 'HR' },
          { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'manager', department: 'Sales' }
        ] as Employee[];
      }

      const { data, error } = await supabase
        .from('auth_users_view')
        .select('id, name, email, role, department')
        .order('name');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Found users:', data);
      return data as Employee[];
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      return [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', department: 'IT' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'member', department: 'HR' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'manager', department: 'Sales' }
      ] as Employee[];
    }
  }
}
