
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
    const { data, error } = await supabase
      .from('broadcast_group_members')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email,
          role,
          department
        )
      `)
      .eq('group_id', groupId);
    
    if (error) throw error;
    return data as GroupMember[];
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
    const { data, error } = await supabase
      .from('broadcast_group_members')
      .select(`
        group_id,
        is_admin,
        broadcast_groups:group_id (
          id,
          name
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.broadcast_groups.id,
      name: item.broadcast_groups.name,
      is_admin: item.is_admin
    }));
  }

  // Broadcasts methods
  static async createBroadcast(groupId: string, senderId: string, message: string) {
    const { data, error } = await supabase
      .from('broadcasts')
      .insert([{
        group_id: groupId,
        sender_id: senderId,
        message: message
      }])
      .select();
    
    if (error) throw error;
    return data[0] as Broadcast;
  }

  // New method to fetch broadcasts for a specific group
  static async fetchGroupBroadcasts(groupId: string) {
    const { data, error } = await supabase
      .from('broadcasts')
      .select(`
        *,
        sender:sender_id (
          id,
          name
        ),
        group:group_id (
          id,
          name
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Broadcast[];
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
    const notifications = userIds.map(userId => ({
      user_id: userId,
      broadcast_id: broadcastId,
      read: false
    }));
    
    const { error } = await supabase
      .from('broadcast_notifications')
      .insert(notifications);
    
    if (error) throw error;
  }

  // Employees / Users methods
  static async fetchUsers() {
    const { data, error } = await supabase
      .from('auth_users_view')
      .select('id, name, email, role, department')
      .order('name');
    
    if (error) throw error;
    return data as Employee[];
  }
}
