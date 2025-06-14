
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { employeeService } from '@/api/services/employeeService';
import { Employee, Role, RemunerationLevel } from '@/api/models/types';
import { AlertCircle, Database, Settings, Users } from 'lucide-react';

const ConfigurationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("employees");
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: 'Staff' as Role,
    remunerationLevel: '1' as RemunerationLevel
  });

  // Fetch employees data
  const { data: employees, isLoading: loadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAllEmployees,
  });

  const handleAddEmployee = () => {
    toast({
      title: "Employee Added",
      description: `${newEmployee.firstName} ${newEmployee.lastName} has been added successfully.`,
    });
    // Reset form
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: 'Staff' as Role,
      remunerationLevel: '1' as RemunerationLevel
    });
  };

  const handleSystemSettingSave = (setting: string) => {
    toast({
      title: "Setting Updated",
      description: `${setting} has been updated successfully.`,
    });
  };

  const handleRestoreDatabase = () => {
    toast({
      title: "Database Restored",
      description: "The database has been restored to the default state.",
      variant: "destructive"
    });
  };

  return (
    <div className="w-full">
      <div className="glass-panel p-6 mb-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">System Configurations</h1>
            <p className="text-white/60">
              Manage system settings, database operations, and employee data
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <div className="bg-purple-600/20 text-purple-300 text-xs px-2.5 py-1 rounded-full border border-purple-600/30">
              Admin Access
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Employees</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Database</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>System Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Employee Form */}
              <Card className="col-span-1 border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle>Add New Employee</CardTitle>
                  <CardDescription>Create a new employee record</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={newEmployee.firstName}
                          onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          value={newEmployee.lastName}
                          onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select 
                        value={newEmployee.department}
                        onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="convention">Convention Centre</SelectItem>
                          <SelectItem value="exhibition">Exhibition Centre</SelectItem>
                          <SelectItem value="theatre">Theatre</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={newEmployee.role}
                        onValueChange={(value) => setNewEmployee({...newEmployee, role: value as Role})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Supervisor">Supervisor</SelectItem>
                          <SelectItem value="Team Leader">Team Leader</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                          <SelectItem value="Contractor">Contractor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remunerationLevel">Remuneration Level</Label>
                      <Select 
                        value={String(newEmployee.remunerationLevel)}
                        onValueChange={(value) => setNewEmployee({...newEmployee, remunerationLevel: value as RemunerationLevel})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1</SelectItem>
                          <SelectItem value="2">Level 2</SelectItem>
                          <SelectItem value="3">Level 3</SelectItem>
                          <SelectItem value="4">Level 4</SelectItem>
                          <SelectItem value="5">Level 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleAddEmployee} 
                      type="button" 
                      className="w-full"
                    >
                      Add Employee
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Employee List */}
              <Card className="col-span-1 lg:col-span-2 border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle>Employee Directory</CardTitle>
                  <CardDescription>Manage existing employee records</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingEmployees ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              Loading employees...
                            </TableCell>
                          </TableRow>
                        ) : employees && employees.length > 0 ? (
                          employees.map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell className="font-medium">
                                {employee.firstName} {employee.lastName}
                              </TableCell>
                              <TableCell>{employee.department}</TableCell>
                              <TableCell>{employee.role}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  employee.status === 'active' 
                                    ? 'bg-green-600/20 text-green-300' 
                                    : 'bg-red-600/20 text-red-300'
                                }`}>
                                  {employee.status || 'active'}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              No employees found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Database Operations */}
              <Card className="border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle>Database Operations</CardTitle>
                  <CardDescription>Manage database backups and restoration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-md flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-500">Warning</p>
                      <p className="text-xs text-amber-400/80 mt-1">
                        Database operations can permanently modify or delete data. Please ensure you have proper backups before proceeding.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center p-4 border border-white/10 rounded-md bg-white/5">
                      <div>
                        <p className="text-sm font-medium">Export Database</p>
                        <p className="text-xs text-white/60">Download a copy of the entire database</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border border-white/10 rounded-md bg-white/5">
                      <div>
                        <p className="text-sm font-medium">Import Data</p>
                        <p className="text-xs text-white/60">Import records from CSV or JSON file</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Import
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border border-white/10 rounded-md bg-white/5">
                      <div>
                        <p className="text-sm font-medium">Clear Test Data</p>
                        <p className="text-xs text-white/60">Remove all test and demo records</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Clear
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border border-red-500/20 rounded-md bg-red-500/10">
                      <div>
                        <p className="text-sm font-medium text-red-400">Reset Database</p>
                        <p className="text-xs text-red-400/70">Restore database to default state</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleRestoreDatabase}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Metrics */}
              <Card className="border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle>Data Metrics</CardTitle>
                  <CardDescription>Overview of database statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-md bg-white/5 border border-white/10">
                        <p className="text-xs text-white/60">Total Employees</p>
                        <p className="text-2xl font-bold">142</p>
                      </div>
                      <div className="p-4 rounded-md bg-white/5 border border-white/10">
                        <p className="text-xs text-white/60">Total Shifts</p>
                        <p className="text-2xl font-bold">1,248</p>
                      </div>
                      <div className="p-4 rounded-md bg-white/5 border border-white/10">
                        <p className="text-xs text-white/60">Active Templates</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <div className="p-4 rounded-md bg-white/5 border border-white/10">
                        <p className="text-xs text-white/60">Database Size</p>
                        <p className="text-2xl font-bold">438 MB</p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-md bg-white/5 border border-white/10">
                      <p className="text-sm font-medium mb-2">Storage Usage</p>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '38%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-white/60">
                        <span>438 MB used</span>
                        <span>1.2 GB total</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-md bg-white/5 border border-white/10">
                      <p className="text-sm font-medium mb-2">Last Backup</p>
                      <p className="text-white/80">2023-07-05 09:14:22</p>
                      <p className="text-xs text-white/60 mt-1">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <Card className="border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure system behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="ICC Sydney" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">System Timezone</Label>
                    <Select defaultValue="Australia/Sydney">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                        <SelectItem value="Australia/Melbourne">Australia/Melbourne</SelectItem>
                        <SelectItem value="Australia/Brisbane">Australia/Brisbane</SelectItem>
                        <SelectItem value="Australia/Perth">Australia/Perth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="DD/MM/YYYY">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select defaultValue="12h">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={() => handleSystemSettingSave("General Settings")}>
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card className="border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced system parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxShiftHours">Maximum Shift Hours</Label>
                    <Input id="maxShiftHours" type="number" defaultValue="12" />
                    <p className="text-xs text-white/60 mt-1">Maximum allowed hours for a single shift</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxWeeklyHours">Maximum Weekly Hours</Label>
                    <Input id="maxWeeklyHours" type="number" defaultValue="48" />
                    <p className="text-xs text-white/60 mt-1">Maximum allowed hours per week per employee</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notificationWindow">Notification Window (Days)</Label>
                    <Input id="notificationWindow" type="number" defaultValue="7" />
                    <p className="text-xs text-white/60 mt-1">Days in advance to send roster notifications</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention Period (Months)</Label>
                    <Input id="dataRetention" type="number" defaultValue="36" />
                    <p className="text-xs text-white/60 mt-1">How long to keep historical data</p>
                  </div>
                  
                  <Button onClick={() => handleSystemSettingSave("Advanced Settings")}>
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConfigurationsPage;
