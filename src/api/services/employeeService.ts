
import { Employee } from '../models/types';
import { employees } from '../data/mockData';

export const employeeService = {
  getAllEmployees: async (): Promise<Employee[]> => {
    return Promise.resolve([...employees]);
  },
  
  getEmployeeById: async (id: string): Promise<Employee | null> => {
    const employee = employees.find(e => e.id === id);
    return Promise.resolve(employee || null);
  },
  
  getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
    const filteredEmployees = employees.filter(e => 
      e.department.toLowerCase() === department.toLowerCase()
    );
    return Promise.resolve(filteredEmployees);
  },
  
  getAvailableEmployeesForShift: async (
    date: string, 
    department: string, 
    role: string, 
    startTime: string, 
    endTime: string
  ): Promise<Employee[]> => {
    // In a real app, this would check against the database for conflicts
    // For now, just return employees in the same department with matching role
    const filteredEmployees = employees.filter(e => 
      e.department.toLowerCase() === department.toLowerCase() &&
      e.role === role
    );
    
    return Promise.resolve(filteredEmployees);
  }
};
