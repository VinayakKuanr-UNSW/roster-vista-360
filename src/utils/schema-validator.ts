import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class SchemaValidator {
  // Validate roster data structure
  static validateRosterData(roster: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!roster) {
      errors.push('Roster data is null or undefined');
      return { isValid: false, errors, warnings };
    }

    // Check required fields
    if (!roster.date) errors.push('Missing required field: date');
    if (!roster.groups || !Array.isArray(roster.groups)) {
      errors.push('Missing or invalid groups array');
    } else {
      // Validate each group
      roster.groups.forEach((group: any, groupIndex: number) => {
        if (!group.id) errors.push(`Group ${groupIndex}: Missing id`);
        if (!group.name) errors.push(`Group ${groupIndex}: Missing name`);
        if (!group.color) warnings.push(`Group ${groupIndex}: Missing color`);
        
        if (!group.subGroups || !Array.isArray(group.subGroups)) {
          errors.push(`Group ${groupIndex}: Missing or invalid subGroups`);
        } else {
          // Validate each subgroup
          group.subGroups.forEach((subGroup: any, subIndex: number) => {
            if (!subGroup.id) errors.push(`Group ${groupIndex}, SubGroup ${subIndex}: Missing id`);
            if (!subGroup.name) errors.push(`Group ${groupIndex}, SubGroup ${subIndex}: Missing name`);
            
            if (!subGroup.shifts || !Array.isArray(subGroup.shifts)) {
              warnings.push(`Group ${groupIndex}, SubGroup ${subIndex}: No shifts defined`);
            } else {
              // Validate each shift
              subGroup.shifts.forEach((shift: any, shiftIndex: number) => {
                if (!shift.id) errors.push(`Shift ${shiftIndex}: Missing id`);
                if (!shift.startTime) errors.push(`Shift ${shiftIndex}: Missing startTime`);
                if (!shift.endTime) errors.push(`Shift ${shiftIndex}: Missing endTime`);
                if (!shift.role) errors.push(`Shift ${shiftIndex}: Missing role`);
              });
            }
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate database connection and required tables
  static async validateDatabaseSchema(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Define table names with proper typing
      const broadcastTables = [
        'broadcast_groups',
        'broadcast_group_members', 
        'broadcasts',
        'broadcast_notifications'
      ] as const;

      const viewTables = ['auth_users_view'] as const;

      // Check broadcast tables
      for (const table of broadcastTables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            errors.push(`Table ${table} is not accessible: ${error.message}`);
          }
        } catch (e) {
          errors.push(`Failed to query table ${table}`);
        }
      }

      // Check view tables
      for (const table of viewTables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            errors.push(`View ${table} is not accessible: ${error.message}`);
          }
        } catch (e) {
          errors.push(`Failed to query view ${table}`);
        }
      }

      // Test basic connectivity with a known table
      const { data, error } = await supabase.from('broadcast_groups').select('count').limit(1);
      if (error && !errors.some(e => e.includes('broadcast_groups'))) {
        errors.push(`Database connectivity issue: ${error.message}`);
      }

    } catch (e) {
      errors.push('Failed to validate database schema');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
