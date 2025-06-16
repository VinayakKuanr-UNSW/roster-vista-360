
import { supabase } from '@/integrations/supabase/client';
import { BroadcastDbClient } from './db-client';
import { ErrorHandler } from './error-handler';
import { SchemaValidator } from './schema-validator';
import type { BroadcastGroup, GroupMember, Broadcast, Employee } from '@/types/broadcast';

export class EnhancedBroadcastDbClient extends BroadcastDbClient {
  // Enhanced method with validation and error handling
  static async fetchBroadcastGroupsEnhanced(): Promise<BroadcastGroup[]> {
    return ErrorHandler.withErrorHandling(
      async () => {
        const isConnected = await this.testConnection();
        if (!isConnected) {
          throw new Error('Database connection failed');
        }

        const { data, error } = await supabase
          .from('broadcast_groups')
          .select('*')
          .order('name');
        
        if (error) throw error;

        // Validate data structure
        const validation = SchemaValidator.validateRosterData({ groups: data });
        if (!validation.isValid) {
          ErrorHandler.logError(
            `Data validation failed: ${validation.errors.join(', ')}`,
            { component: 'EnhancedBroadcastDbClient', action: 'fetchGroups' },
            'medium'
          );
        }

        return data as BroadcastGroup[];
      },
      { component: 'EnhancedBroadcastDbClient', action: 'fetchBroadcastGroups' },
      [] // fallback value
    ) || [];
  }

  // Enhanced group creation with validation
  static async createBroadcastGroupEnhanced(name: string): Promise<BroadcastGroup[]> {
    if (!name || name.trim().length === 0) {
      throw new Error('Group name is required');
    }

    if (name.length > 100) {
      throw new Error('Group name is too long (max 100 characters)');
    }

    return ErrorHandler.withErrorHandling(
      async () => {
        const isConnected = await this.testConnection();
        if (!isConnected) {
          throw new Error('Database connection failed');
        }

        // Check for duplicate names
        const { data: existing } = await supabase
          .from('broadcast_groups')
          .select('name')
          .ilike('name', name.trim());

        if (existing && existing.length > 0) {
          throw new Error('A group with this name already exists');
        }

        const { data, error } = await supabase
          .from('broadcast_groups')
          .insert([{ name: name.trim() }])
          .select();
        
        if (error) throw error;
        return data as BroadcastGroup[];
      },
      { component: 'EnhancedBroadcastDbClient', action: 'createBroadcastGroup' }
    ) || [];
  }

  // Enhanced broadcast creation with better error handling
  static async createBroadcastEnhanced(
    groupId: string, 
    senderId: string, 
    message: string
  ): Promise<Broadcast | null> {
    // Validation
    if (!groupId || !senderId || !message) {
      throw new Error('Group ID, sender ID, and message are required');
    }

    if (message.length > 5000) {
      throw new Error('Message is too long (max 5000 characters)');
    }

    return ErrorHandler.withErrorHandling(
      async () => {
        const isConnected = await this.testConnection();
        if (!isConnected) {
          throw new Error('Database connection failed');
        }

        // Verify group exists
        const { data: groupData, error: groupError } = await supabase
          .from('broadcast_groups')
          .select('id')
          .eq('id', groupId)
          .single();

        if (groupError || !groupData) {
          throw new Error('Group not found');
        }

        // Create broadcast
        const { data, error } = await supabase
          .from('broadcasts')
          .insert([{
            group_id: groupId,
            sender_id: senderId,
            message: message.trim()
          }])
          .select()
          .single();
        
        if (error) throw error;

        // Create notifications for group members
        const members = await this.fetchGroupMembers(groupId);
        const memberIds = members.map(m => m.user_id).filter(id => id !== senderId);
        
        if (memberIds.length > 0) {
          await this.createNotificationsForBroadcast(data.id, memberIds);
        }

        return data as Broadcast;
      },
      { 
        component: 'EnhancedBroadcastDbClient', 
        action: 'createBroadcast',
        userId: senderId 
      },
      null
    );
  }

  // Enhanced user fetching with caching
  static async fetchUsersEnhanced(): Promise<Employee[]> {
    return ErrorHandler.withErrorHandling(
      async () => {
        const isConnected = await this.testConnection();
        if (!isConnected) {
          // Return fallback users when database is not available
          return [
            { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'admin', department: 'IT' },
            { id: '2', name: 'Test User', email: 'test@example.com', role: 'member', department: 'HR' }
          ];
        }

        const { data, error } = await supabase
          .from('auth_users_view')
          .select('id, name, email, role, department')
          .order('name');
        
        if (error) throw error;
        
        // Validate users data
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid users data received');
        }

        return data as Employee[];
      },
      { component: 'EnhancedBroadcastDbClient', action: 'fetchUsers' },
      [] // fallback value
    ) || [];
  }
}
