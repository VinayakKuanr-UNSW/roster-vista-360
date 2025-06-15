import { Group, Template, Roster, Timesheet, Bid, Employee, ShiftStatus } from '../models/types';

// Mock employees data
export const employees: Employee[] = [
  {
    id: '1',
    name: 'Vinayak Sharma',
    email: 'vinayak@example.com',
    department: 'Convention Centre',
    role: 'Team Leader',
    tier: 'GOLD',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Vinayak'
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    department: 'Convention Centre',
    role: 'TM3',
    tier: 'GOLD',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=John'
  },
  {
    id: '3',
    name: 'Sara Johnson',
    email: 'sara@example.com',
    department: 'Convention Centre',
    role: 'TM2',
    tier: 'GOLD',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Sara'
  },
  {
    id: '4',
    name: 'Michael Chen',
    email: 'michael@example.com',
    department: 'Convention Centre',
    role: 'TM2',
    tier: 'GOLD',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Michael'
  },
  {
    id: '5',
    name: 'Emily Wilson',
    email: 'emily@example.com',
    department: 'Convention Centre',
    role: 'TM2',
    tier: 'SILVER',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Emily'
  },
  {
    id: '6',
    name: 'Carlos Rodriguez',
    email: 'carlos@example.com',
    department: 'Convention Centre',
    role: 'TM2',
    tier: 'BRONZE',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Carlos'
  },
  {
    id: '7',
    name: 'Priya Patel',
    email: 'priya@example.com',
    department: 'Exhibition Centre',
    role: 'Coordinator',
    tier: 'GOLD',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Priya'
  },
  {
    id: '8',
    name: 'James Wilson',
    email: 'james@example.com',
    department: 'Theatre',
    role: 'Supervisor',
    tier: 'GOLD',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=James'
  }
];

// Template data (same as previously defined)
export const templateData: Group[] = [
  {
    id: 1,
    name: 'Convention Centre',
    color: 'blue',
    subGroups: [
      {
        id: 101,
        name: 'AM Base',
        shifts: [
          { id: '1001', role: 'Team Leader', startTime: '05:45', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1002', role: 'TM3', startTime: '06:15', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1003', role: 'TM2', startTime: '06:30', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1004', role: 'TM2', startTime: '06:30', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1005', role: 'TM2', startTime: '06:30', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'SILVER' },
          { id: '1006', role: 'TM2', startTime: '06:30', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'BRONZE' },
        ]
      },
      {
        id: 102,
        name: 'AM Assist',
        shifts: [
          { id: '1007', role: 'TM2', startTime: '11:30', endTime: '16:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
          { id: '1008', role: 'TM2', startTime: '11:30', endTime: '16:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
        ]
      },
      {
        id: 103,
        name: 'PM Base',
        shifts: [
          { id: '1009', role: 'Team Leader', startTime: '13:15', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1010', role: 'TM3', startTime: '13:45', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1011', role: 'TM2', startTime: '14:00', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1012', role: 'TM2', startTime: '14:00', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1013', role: 'TM2', startTime: '14:00', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
          { id: '1014', role: 'TM2', startTime: '14:00', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'BRONZE' },
        ]
      },
      {
        id: 104,
        name: 'PM Assist',
        shifts: [
          { id: '1015', role: 'TM2', startTime: '16:30', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
          { id: '1016', role: 'TM2', startTime: '16:30', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
        ]
      },
      {
        id: 105,
        name: 'Late',
        shifts: [
          { id: '1017', role: 'TM3', startTime: '16:30', endTime: '23:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: '1018', role: 'TM2', startTime: '16:30', endTime: '23:00', breakDuration: '30 min', remunerationLevel: 'SILVER' },
        ]
      },
    ]
  },
  {
    id: 2,
    name: 'Exhibition Centre',
    color: 'green',
    subGroups: [
      {
        id: 201,
        name: 'Bump-In',
        shifts: [
          { id: '2001', role: 'TM3', startTime: '09:00', endTime: '17:00', breakDuration: '45 min', remunerationLevel: 'GOLD' },
          { id: '2002', role: 'TM2', startTime: '08:30', endTime: '16:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
        ]
      },
      {
        id: 202,
        name: 'Bump-Out',
        shifts: [
          { id: '2003', role: 'TM3', startTime: '10:00', endTime: '18:00', breakDuration: '45 min', remunerationLevel: 'GOLD' },
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Theatre',
    color: 'red',
    subGroups: [
      {
        id: 301,
        name: 'AM Floaters',
        shifts: [
          { id: '3001', role: 'TM3', startTime: '08:00', endTime: '16:00', breakDuration: '60 min', remunerationLevel: 'GOLD' },
          { id: '3002', role: 'TM2', startTime: '08:00', endTime: '16:00', breakDuration: '45 min', remunerationLevel: 'SILVER' },
        ]
      },
      {
        id: 302,
        name: 'PM Floaters',
        shifts: [
          { id: '3003', role: 'TM3', startTime: '15:00', endTime: '23:00', breakDuration: '60 min', remunerationLevel: 'GOLD' },
          { id: '3004', role: 'TM2', startTime: '15:00', endTime: '23:00', breakDuration: '45 min', remunerationLevel: 'SILVER' },
        ]
      }
    ]
  }
];

// Create templates based on templateData
export const templates: Template[] = [
  {
    id: 1,
    name: 'Standard Weekday Template',
    description: 'Standard template for weekday operations across all venues',
    groups: templateData,
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2023-06-15T08:00:00Z',
    status: 'draft'
  },
  {
    id: 2,
    name: 'Weekend Template',
    description: 'Modified staffing for weekend operations',
    groups: templateData.map(group => ({
      ...group,
      subGroups: group.subGroups.map(subGroup => ({
        ...subGroup,
        shifts: subGroup.shifts.map(shift => ({...shift}))
      }))
    })),
    createdAt: '2023-06-20T10:30:00Z',
    updatedAt: '2023-07-01T14:45:00Z',
    status: 'published'
  }
];

// Generate roster data based on template
export const generateRoster = (date: string, templateId: number = 1): Roster => {
  const template = templates.find(t => t.id === templateId) || templates[0];
  
  // Deep clone the template groups to create a roster
  const rosterGroups = JSON.parse(JSON.stringify(template.groups)) as Group[];
  
  return {
    id: Date.now(),
    date,
    templateId,
    groups: rosterGroups,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Generate populated roster with assigned employees
export const generatePopulatedRoster = (date: string, templateId: number = 1): Roster => {
  const roster = generateRoster(date, templateId);
  
  // Assign employees to shifts based on department, role, and tier
  roster.groups.forEach(group => {
    const departmentEmployees = employees.filter(emp => 
      emp.department === group.name
    );
    
    let empIndex = 0;
    
    group.subGroups.forEach(subGroup => {
      subGroup.shifts.forEach(shift => {
        // Find a matching employee for this shift
        const matchingEmployees = departmentEmployees.filter(emp => 
          emp.role === shift.role && emp.tier === shift.remunerationLevel
        );
        
        if (matchingEmployees.length > 0) {
          const employee = matchingEmployees[empIndex % matchingEmployees.length];
          shift.employeeId = employee.id;
          shift.employee = employee;
          shift.status = 'Assigned';
        }
        
        empIndex++;
      });
    });
  });
  
  return roster;
};

// Generate timesheet data based on roster
export const generateTimesheet = (roster: Roster): Timesheet => {
  // Deep clone the roster groups to create a timesheet
  const timesheetGroups = JSON.parse(JSON.stringify(roster.groups)) as Group[];
  
  // Add random status and actual times to shifts
  timesheetGroups.forEach(group => {
    group.subGroups.forEach(subGroup => {
      subGroup.shifts.forEach(shift => {
        if (shift.employeeId) {
          // Randomly assign a status
          const statuses: ShiftStatus[] = ['Assigned', 'Completed', 'Cancelled', 'Swapped', 'No-Show'];
          const randomStatus = statuses[Math.floor(Math.random() * 5)];
          
          shift.status = randomStatus;
          
          // Add actual start/end times with some variation
          if (randomStatus === 'Completed' || randomStatus === 'Swapped') {
            // Parse hours and minutes
            const [startHour, startMin] = shift.startTime.split(':').map(Number);
            const [endHour, endMin] = shift.endTime.split(':').map(Number);
            
            // Add slight variations (5 minutes earlier or later)
            const actualStartMinutes = startMin + Math.floor(Math.random() * 11) - 5;
            const actualEndMinutes = endMin + Math.floor(Math.random() * 11) - 5;
            
            // Format properly
            const formatTime = (hour: number, minutes: number) => {
              let adjustedHour = hour;
              let adjustedMinutes = minutes;
              
              if (adjustedMinutes < 0) {
                adjustedMinutes += 60;
                adjustedHour -= 1;
              } else if (adjustedMinutes >= 60) {
                adjustedMinutes -= 60;
                adjustedHour += 1;
              }
              
              return `${adjustedHour.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
            };
            
            shift.actualStartTime = formatTime(startHour, actualStartMinutes);
            shift.actualEndTime = formatTime(endHour, actualEndMinutes);
          }
        }
      });
    });
  });
  
  return {
    id: Date.now(),
    date: roster.date,
    rosterId: roster.id,
    groups: timesheetGroups,
    totalHours: Math.floor(Math.random() * 40) + 20,
    totalPay: Math.floor(Math.random() * 2000) + 1000,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Generate sample rosters for a week
export const generateWeekRosters = (startDate: Date = new Date()): Roster[] => {
  const rosters: Roster[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Use weekend template for Saturday and Sunday
    const templateId = date.getDay() === 0 || date.getDay() === 6 ? 2 : 1;
    
    rosters.push(generatePopulatedRoster(date.toISOString().split('T')[0], templateId));
  }
  
  return rosters;
};

// Generate sample timesheets for a week
export const generateWeekTimesheets = (rosters: Roster[]): Timesheet[] => {
  return rosters.map(roster => generateTimesheet(roster));
};

// Pre-generate some data
export const currentWeekRosters = generateWeekRosters();
export const currentWeekTimesheets = generateWeekTimesheets(currentWeekRosters);

// Generate sample bids
export const generateBids = (): Bid[] => {
  const bids: Bid[] = [];
  
  // Generate random bids for shifts
  currentWeekRosters.forEach(roster => {
    roster.groups.forEach(group => {
      group.subGroups.forEach(subGroup => {
        subGroup.shifts.forEach(shift => {
          // 20% chance of having a bid
          if (Math.random() < 0.2) {
            // Pick a random employee that doesn't already have this shift
            const availableEmployees = employees.filter(emp => 
              emp.id !== shift.employeeId && 
              emp.department === group.name
            );
            
            if (availableEmployees.length > 0) {
              const randomEmp = availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
              
              bids.push({
                id: `bid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                employeeId: randomEmp.id,
                shiftId: shift.id,
                status: Math.random() < 0.7 ? 'Pending' : (Math.random() < 0.5 ? 'Approved' : 'Rejected'),
                createdAt: new Date().toISOString(),
                notes: Math.random() < 0.3 ? 'Requesting this shift for personal reasons' : undefined
              });
            }
          }
        });
      });
    });
  });
  
  return bids;
};

export const currentBids = generateBids();
