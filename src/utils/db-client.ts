
import { supabase } from '@/integrations/supabase/client';
import type { BroadcastGroup, GroupMember, Broadcast, Notification, Employee } from '@/types/broadcast';
import { MockStorage } from './mock-storage';

// Helper class to provide typed methods for accessing broadcast tables
export class BroadcastDbClient {
  // Check if Supabase is properly connected
  static async testConnection() {
    try {
      const { data, error } = await supabase.from('bids').select('count').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  // Broadcast Groups methods - Using mock data since broadcast tables don't exist
  static async fetchBroadcastGroups() {
    console.warn('Broadcast tables not available in database, using mock data');
    return MockStorage.getGroups() as BroadcastGroup[];
  }

  static async createBroadcastGroup(name: string) {
    console.warn('Broadcast tables not available in database, simulating group creation');
    const newGroup = { id: Date.now().toString(), name, created_at: new Date().toISOString() };
    return MockStorage.addGroup(newGroup) as BroadcastGroup[];
  }

  static async updateBroadcastGroup(id: string, name: string) {
    console.warn('Broadcast tables not available in database, simulating group update');
    MockStorage.updateGroup(id, name);
    return;
  }

  static async deleteBroadcastGroup(id: string) {
    console.warn('Broadcast tables not available in database, simulating group deletion');
    MockStorage.deleteGroup(id);
    return;
  }

  // Group Members methods - Using mock data since broadcast tables don't exist
  static async fetchGroupMembers(groupId: string) {
    console.warn('Broadcast tables not available in database, returning mock members');
    return MockStorage.getGroupMembers(groupId) as GroupMember[];
  }

  static async addGroupMember(groupId: string, userId: string, isAdmin: boolean = false) {
    console.warn('Broadcast tables not available in database, simulating member addition');
    const newMember = {
      id: Date.now().toString(),
      group_id: groupId,
      user_id: userId,
      is_admin: isAdmin,
      user: {
        id: userId,
        name: 'New User',
        email: 'newuser@example.com',
        role: 'member',
        department: 'General'
      }
    };
    MockStorage.addMember(newMember);
    return;
  }

  static async removeGroupMember(memberId: string) {
    console.warn('Broadcast tables not available in database, simulating member removal');
    MockStorage.removeMember(memberId);
    return;
  }

  static async updateMemberAdminStatus(memberId: string, isAdmin: boolean) {
    console.warn('Broadcast tables not available in database, simulating admin status update');
    MockStorage.updateMemberAdminStatus(memberId, isAdmin);
    return;
  }

  // User Groups methods - Using mock data since broadcast tables don't exist
  static async fetchUserGroups(userId: string) {
    console.log('Fetching user groups for user:', userId);
    console.warn('Broadcast tables not available in database, returning mock user groups');
    return MockStorage.getUserGroups(userId);
  }

  // Broadcasts methods - Using mock data since broadcast tables don't exist
  static async createBroadcast(groupId: string, senderId: string, message: string) {
    console.log('Creating broadcast:', { groupId, senderId, message });
    console.warn('Broadcast tables not available in database, simulating broadcast creation');
    const newBroadcast = {
      id: Date.now().toString(),
      group_id: groupId,
      sender_id: senderId,
      message: message,
      created_at: new Date().toISOString(),
      sender: { id: senderId, name: 'Demo User' },
      group: { id: groupId, name: 'Demo Group' }
    };
    return MockStorage.addBroadcast(newBroadcast) as Broadcast;
  }

  // Fetch broadcasts for a specific group - Using mock data
  static async fetchGroupBroadcasts(groupId: string) {
    console.log('Fetching broadcasts for group:', groupId);
    console.warn('Broadcast tables not available in database, returning mock broadcasts');
    return MockStorage.getGroupBroadcasts(groupId) as Broadcast[];
  }

  // Notifications methods - Using mock data since broadcast tables don't exist
  static async fetchUserNotifications(userId: string) {
    console.warn('Broadcast tables not available in database, returning empty notifications');
    return [] as Notification[];
  }

  static async markNotificationAsRead(notificationId: string) {
    console.warn('Broadcast tables not available in database, simulating notification read');
    return;
  }

  static async markAllNotificationsAsRead(userId: string) {
    console.warn('Broadcast tables not available in database, simulating mark all as read');
    return;
  }

  static async createNotificationsForBroadcast(broadcastId: string, userIds: string[]) {
    console.log('Creating notifications for broadcast:', broadcastId, 'users:', userIds);
    console.warn('Broadcast tables not available in database, simulating notification creation');
    return;
  }

  // Employees / Users methods - Try to use employees table, fallback to mock data
  static async fetchUsers() {
    console.log('Fetching users from employees table');
    
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
        .from('employees')
        .select('id, first_name, last_name, email, status')
        .order('first_name');
      
      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
      
      // Map employees data to the Employee interface expected by broadcast functionality
      const mappedEmployees = data.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        email: emp.email,
        role: emp.status || 'member',
        department: 'General' // Since department info is in separate tables
      }));
      
      console.log('Found employees:', mappedEmployees);
      return mappedEmployees as Employee[];
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
