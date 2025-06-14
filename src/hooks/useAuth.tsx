
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Check if the user is eligible for a specific shift
  const isEligibleForShift = (shiftDepartment: string, shiftRole: string) => {
    if (!context.user) return false;
    
    // Simple eligibility check based on department and role
    // In a real app, this would be more sophisticated and check tier, availability, etc.
    const userDepartment = context.user.department;
    const userRole = context.user.role;
    
    // Admin can bid on any shift
    if (userRole === 'admin') return true;
    
    // Manager can bid on shifts in their department
    if (userRole === 'manager' && userDepartment === shiftDepartment.toLowerCase()) return true;
    
    // Team lead can only bid on specific roles in their department
    if (userRole === 'teamlead' && userDepartment === shiftDepartment.toLowerCase()) {
      // Add logic for which roles a team lead can bid on
      return true;
    }
    
    return false;
  };
  
  // Check compliance with maximum work hours
  const checkWorkHourCompliance = (shiftDate: string, shiftHours: number) => {
    // In a real app, this would check against the database for existing shifts
    // and calculate total hours to ensure compliance with daily and monthly limits
    return {
      compliant: true,
      dailyHours: shiftHours,
      weeklyHours: shiftHours * 5, // Example calculation
      monthlyHours: shiftHours * 20, // Example calculation
      dailyLimit: 12,
      weeklyLimit: 48,
      monthlyLimit: 152
    };
  };

  // Check if the user has permission to access a specific feature
  const hasPermission = (feature: string): boolean => {
    if (!context.user) return false;
    
    const role = context.user.role;
    
    switch (feature) {
      case 'dashboard':
        return true; // All roles can access dashboard
        
      case 'my-roster':
      case 'availabilities':
      case 'bids':
        return true; // All roles can access these features
        
      case 'templates':
      case 'rosters':
      case 'birds-view':
        return role === 'admin' || role === 'manager'; // Only admin and manager
        
      case 'timesheet-edit':
        return role === 'admin' || role === 'manager'; // Only admin and manager can edit
        
      case 'timesheet-view':
        return role === 'admin' || role === 'manager' || role === 'teamlead'; // Admin, manager, teamlead can view
        
      case 'management':
        return role === 'admin' || role === 'manager'; // Only admin and manager
        
      case 'broadcast':
        // Making sure admin, manager, teamlead AND member can access broadcast
        // Members will have limited functionality, handled in the component
        return true;
        
      case 'insights':
        return role === 'admin' || role === 'manager'; // Only admin and manager
        
      case 'configurations':
        return role === 'admin'; // Only admin
        
      default:
        return context.hasPermission('read'); // Fall back to basic permission check
    }
  };
  
  return { 
    ...context, 
    isEligibleForShift,
    checkWorkHourCompliance,
    hasPermission
  };
};
