
import { supabase } from '@/integrations/supabase/client';
import type { BroadcastGroup, GroupMember, Broadcast, Notification, Employee } from '@/types/broadcast';

// Helper class to provide typed methods for accessing broadcast tables
export class BroadcastDbClient {
  // Broadcast Groups methods
  static async fetchBroadcastGroups() {
    const { data, error } = await supabase
      .from('broadcast_groups')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as BroadcastGroup[];
  }

  static async createBroadcastGroup(name: string) {
    const { data, error } = await supabase
      .from('broadcast_groups')
      .insert([{ name }])
      .select();
    
    if (error) throw error;
    return data as BroadcastGroup[];
  }

  static async updateBroadcastGroup(id: string, name: string) {
    const { error } = await supabase
      .from('broadcast_groups')
      .update({ name })
      .eq('id', id);
    
    if (error) throw error;
  }

  static async deleteBroadcastGroup(id: string) {
    const { error } = await supabase
      .from('broadcast_groups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Group Members methods
  static async fetchGroupMembers(groupId: string) {
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
  }

  static async addGroupMember(groupId: string, userId: string, isAdmin: boolean = false) {
    const { error } = await supabase
      .from('broadcast_group_members')
      .insert([{
        group_id: groupId,
        user_id: userId,
        is_admin: isAdmin
      }]);
    
    if (error) throw error;
  }

  static async removeGroupMember(memberId: string) {
    const { error } = await supabase
      .from('broadcast_group_members')
      .delete()
      .eq('id', memberId);
    
    if (error) throw error;
  }

  static async updateMemberAdminStatus(memberId: string, isAdmin: boolean) {
    const { error } = await supabase
      .from('broadcast_group_members')
      .update({ is_admin: isAdmin })
      .eq('id', memberId);
    
    if (error) throw error;
  }

  // User Groups methods
  static async fetchUserGroups(userId: string) {
    console.log('Fetching user groups for user:', userId);
    
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
  }

  // Broadcasts methods
  static async createBroadcast(groupId: string, senderId: string, message: string) {
    console.log('Creating broadcast:', { groupId, senderId, message });
    
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
  }

  // Fetch broadcasts for a specific group
  static async fetchGroupBroadcasts(groupId: string) {
    console.log('Fetching broadcasts for group:', groupId);
    
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
  }

  // Notifications methods
  static async fetchUserNotifications(userId: string) {
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
  }

  static async markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
      .from('broadcast_notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  }

  static async markAllNotificationsAsRead(userId: string) {
    const { error } = await supabase
      .from('broadcast_notifications')
      .update({ read: true })
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  static async createNotificationsForBroadcast(broadcastId: string, userIds: string[]) {
    console.log('Creating notifications for broadcast:', broadcastId, 'users:', userIds);
    
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
  }

  // Employees / Users methods
  static async fetchUsers() {
    console.log('Fetching users from auth_users_view');
    
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
  }
}
