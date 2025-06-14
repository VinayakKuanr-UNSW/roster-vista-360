
import { Roster, Group, Role, ShiftStatus, Employee, RemunerationLevel, DepartmentName, DepartmentColor, SubGroup } from '../models/types';
import { currentWeekRosters, generatePopulatedRoster } from '../data/mockData';

// Local storage for rosters - in a real app this would be a database
let rosters = [...currentWeekRosters];

export const rosterService = {
  getAllRosters: async (): Promise<Roster[]> => {
    return Promise.resolve([...rosters]);
  },
  
  getRostersByDateRange: async (startDate: string, endDate: string): Promise<Roster[]> => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredRosters = rosters.filter(roster => {
      const rosterDate = new Date(roster.date);
      return rosterDate >= start && rosterDate <= end;
    });
    
    return Promise.resolve(filteredRosters);
  },
  
  getEmployeeRostersByDateRange: async (employeeId: string, startDate: string, endDate: string): Promise<Roster[]> => {
    const allRosters = await rosterService.getRostersByDateRange(startDate, endDate);
    
    // Filter for rosters that have shifts assigned to this employee
    const employeeRosters = allRosters.filter(roster => {
      let hasShift = false;
      
      // Check each group, subgroup, and shift to find if the employee has any shift in this roster
      roster.groups.forEach(group => {
        group.subGroups.forEach(subGroup => {
          subGroup.shifts.forEach(shift => {
            if (shift.employeeId === employeeId) {
              hasShift = true;
            }
          });
        });
      });
      
      return hasShift;
    });
    
    return Promise.resolve(employeeRosters);
  },
  
  getRosterByDate: async (date: string): Promise<Roster | null> => {
    const roster = rosters.find(r => r.date.split('T')[0] === date.split('T')[0]);
    return Promise.resolve(roster || null);
  },
  
  createRoster: async (date: string, templateId: number): Promise<Roster> => {
    // Check if roster already exists for this date
    const existingRoster = await rosterService.getRosterByDate(date);
    if (existingRoster) {
      return Promise.resolve(existingRoster);
    }
    
    // Generate a new roster from template
    const newRoster = generatePopulatedRoster(date, templateId);
    rosters.push(newRoster);
    
    return Promise.resolve(newRoster);
  },
  
  updateRoster: async (date: string, updates: Partial<Roster>): Promise<Roster | null> => {
    const index = rosters.findIndex(r => r.date.split('T')[0] === date.split('T')[0]);
    if (index === -1) return Promise.resolve(null);
    
    const updatedRoster = {
      ...rosters[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    rosters[index] = updatedRoster;
    return Promise.resolve(updatedRoster);
  },
  
  assignEmployeeToShift: async (
    date: string, 
    groupId: number, 
    subGroupId: number, 
    shiftId: string, 
    employeeId: string
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the shift and update it
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shift = subGroup.shifts.find(s => s.id === shiftId);
    if (!shift) return Promise.resolve(null);
    
    // Update the shift with the new employee
    shift.employeeId = employeeId;
    shift.status = 'Assigned';
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  updateShift: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string,
    updates: Partial<{ startTime: string; endTime: string; role: Role; remunerationLevel: RemunerationLevel; breakDuration: string }>
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the shift and update it
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shiftIndex = subGroup.shifts.findIndex(s => s.id === shiftId);
    if (shiftIndex === -1) return Promise.resolve(null);
    
    // Update the shift with the new properties
    subGroup.shifts[shiftIndex] = {
      ...subGroup.shifts[shiftIndex],
      ...updates
    };
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  addShiftToRoster: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shift: Omit<Group['subGroups'][0]['shifts'][0], 'id'>
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the subgroup to add the shift to
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    // Create a new shift with a unique ID
    const newShift = {
      ...shift,
      id: `${groupId}-${subGroupId}-${Date.now()}`
    };
    
    // Add the shift to the subgroup
    subGroup.shifts.push(newShift);
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  removeShiftFromRoster: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the subgroup to remove the shift from
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    // Remove the shift
    const shiftIndex = subGroup.shifts.findIndex(s => s.id === shiftId);
    if (shiftIndex === -1) return Promise.resolve(null);
    
    subGroup.shifts.splice(shiftIndex, 1);
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  // Add a new group to a roster
  addGroupToRoster: async (
    date: string,
    group: { name: DepartmentName; color: DepartmentColor }
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Generate a new ID for the group
    const maxGroupId = Math.max(...updatedRoster.groups.map(g => g.id), 0);
    const newGroup: Group = {
      id: maxGroupId + 1,
      name: group.name,
      color: group.color,
      subGroups: []
    };
    
    // Add the new group to the roster
    updatedRoster.groups.push(newGroup);
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  // Add a new subgroup to a group in a roster
  addSubGroupToRoster: async (
    date: string,
    groupId: number,
    name: string
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the group to add the subgroup to
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    // Generate a new ID for the subgroup
    const maxSubGroupId = Math.max(...group.subGroups.map(sg => sg.id), 0);
    const newSubGroup: SubGroup = {
      id: maxSubGroupId + 1,
      name,
      shifts: []
    };
    
    // Add the new subgroup to the group
    group.subGroups.push(newSubGroup);
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  // Remove a group from a roster
  removeGroupFromRoster: async (
    date: string,
    groupId: number
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the index of the group to remove
    const groupIndex = updatedRoster.groups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return Promise.resolve(null);
    
    // Remove the group
    updatedRoster.groups.splice(groupIndex, 1);
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  // Remove a subgroup from a group in a roster
  removeSubGroupFromRoster: async (
    date: string,
    groupId: number,
    subGroupId: number
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the group that contains the subgroup
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    // Find the index of the subgroup to remove
    const subGroupIndex = group.subGroups.findIndex(sg => sg.id === subGroupId);
    if (subGroupIndex === -1) return Promise.resolve(null);
    
    // Remove the subgroup
    group.subGroups.splice(subGroupIndex, 1);
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  }
};
