
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  Bell,
  CheckCircle,
  XCircle,
  UserCheck,
  CalendarDays,
  Activity
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for upcoming shifts
  const upcomingShifts = [
    { 
      id: 1, 
      date: '2023-07-12', 
      startTime: '09:00', 
      endTime: '17:00', 
      role: 'Manager', 
      department: 'Convention Centre' 
    },
    { 
      id: 2, 
      date: '2023-07-14', 
      startTime: '12:00', 
      endTime: '20:00', 
      role: 'Supervisor', 
      department: 'Exhibition Centre' 
    },
    { 
      id: 3, 
      date: '2023-07-16', 
      startTime: '08:00', 
      endTime: '16:00', 
      role: 'Team Leader', 
      department: 'Theatre' 
    }
  ];

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: 'schedule',
      message: 'Your shift on July 12 has been confirmed',
      time: '2h ago',
      read: false
    },
    {
      id: 2,
      type: 'bid',
      message: 'Your bid for July 14 shift was approved',
      time: '5h ago',
      read: true
    },
    {
      id: 3,
      type: 'swap',
      message: 'New swap request from Sarah for July 16',
      time: '1d ago',
      read: false
    },
    {
      id: 4,
      type: 'alert',
      message: 'Please update your availability for next month',
      time: '2d ago',
      read: true
    }
  ];
  
  // Department-specific dashboard content
  const getDepartmentContent = () => {
    switch (user?.department) {
      case 'convention':
        return (
          <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-blue-300">Convention Department</h2>
            <p className="text-white/70 mb-4">
              Manage all convention-related rosters, schedules, and staff assignments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="Active Rosters" 
                value="12" 
                icon={<Calendar className="h-5 w-5 text-blue-400" />} 
                color="blue"
              />
              <DashboardCard 
                title="Staff Available" 
                value="24" 
                icon={<Users className="h-5 w-5 text-blue-400" />} 
                color="blue"
              />
              <DashboardCard 
                title="Pending Shifts" 
                value="8" 
                icon={<Clock className="h-5 w-5 text-blue-400" />} 
                color="blue"
              />
            </div>
          </div>
        );
      case 'exhibition':
        return (
          <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-green-300">Exhibition Department</h2>
            <p className="text-white/70 mb-4">
              Oversee exhibition setup, event management, and gallery operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="Upcoming Exhibitions" 
                value="5" 
                icon={<Calendar className="h-5 w-5 text-green-400" />} 
                color="green"
              />
              <DashboardCard 
                title="Staff Scheduled" 
                value="18" 
                icon={<Users className="h-5 w-5 text-green-400" />} 
                color="green"
              />
              <DashboardCard 
                title="Open Shifts" 
                value="3" 
                icon={<Clock className="h-5 w-5 text-green-400" />} 
                color="green"
              />
            </div>
          </div>
        );
      case 'theatre':
        return (
          <div className="bg-red-900/30 border border-red-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-red-300">Theatre Department</h2>
            <p className="text-white/70 mb-4">
              Coordinate theatre productions, performances, and stage management.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="Upcoming Shows" 
                value="7" 
                icon={<Calendar className="h-5 w-5 text-red-400" />} 
                color="red"
              />
              <DashboardCard 
                title="Cast & Crew" 
                value="32" 
                icon={<Users className="h-5 w-5 text-red-400" />}
                color="red"
              />
              <DashboardCard 
                title="Rehearsals Today" 
                value="4" 
                icon={<Clock className="h-5 w-5 text-red-400" />}
                color="red" 
              />
            </div>
          </div>
        );
      case 'it':
        return (
          <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-purple-300">IT Department</h2>
            <p className="text-white/70 mb-4">
              Maintain system performance, user access, and technical operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="System Status" 
                value="Operational" 
                icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
                color="purple"
              />
              <DashboardCard 
                title="Active Users" 
                value="87" 
                icon={<Users className="h-5 w-5 text-purple-400" />}
                color="purple"
              />
              <DashboardCard 
                title="Open Tickets" 
                value="5" 
                icon={<AlertCircle className="h-5 w-5 text-purple-400" />}
                color="purple"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-900/30 border border-gray-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3">General Dashboard</h2>
            <p className="text-white/70 mb-4">
              Welcome to the management system. Select a department to view specific information.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="w-full">
      <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-white/60">
              Welcome back, {user?.name || 'User'}! Today is {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {user?.role === 'admin' && (
              <div className="bg-purple-600/20 text-purple-300 text-xs px-2.5 py-1 rounded-full border border-purple-600/30">
                Admin
              </div>
            )}
            {user?.role === 'manager' && (
              <div className="bg-blue-600/20 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-600/30">
                Manager
              </div>
            )}
            {user?.role === 'teamlead' && (
              <div className="bg-green-600/20 text-green-300 text-xs px-2.5 py-1 rounded-full border border-green-600/30">
                Team Lead
              </div>
            )}
            {user?.role === 'member' && (
              <div className="bg-amber-600/20 text-amber-300 text-xs px-2.5 py-1 rounded-full border border-amber-600/30">
                Team Member
              </div>
            )}
            
            <div className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-full border border-white/20">
              {user?.department?.charAt(0).toUpperCase() + user?.department?.slice(1) || 'Department'}
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {/* Department-specific content */}
            {getDepartmentContent()}
            
            {/* Stats Overview */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Weekly Hours"
                value="32"
                unit="hours"
                change="+2"
                changeType="positive"
                icon={<Clock className="h-8 w-8 text-blue-400" />}
              />
              <StatsCard
                title="Shift Acceptance"
                value="94"
                unit="%"
                change="+3"
                changeType="positive"
                icon={<CheckCircle className="h-8 w-8 text-green-400" />}
              />
              <StatsCard
                title="Late Arrivals"
                value="2"
                unit="shifts"
                change="-1"
                changeType="positive"
                icon={<XCircle className="h-8 w-8 text-amber-400" />}
              />
              <StatsCard
                title="Team Performance"
                value="87"
                unit="%"
                change="+5"
                changeType="positive"
                icon={<Activity className="h-8 w-8 text-purple-400" />}
              />
            </div>
            
            {/* Additional Admin/Manager Content */}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/5 border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Department Stats</span>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="font-medium">Total Staff</span>
                        <span>48 employees</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="font-medium">Shifts This Week</span>
                        <span>124 shifts</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="font-medium">Coverage Rate</span>
                        <span>96%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Staff Satisfaction</span>
                        <span>4.2/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Pending Approvals</span>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">Leave Requests</span>
                        </div>
                        <span className="bg-blue-600/20 text-blue-300 text-xs px-2.5 py-1 rounded-full">
                          5 pending
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-400" />
                          <span className="font-medium">Shift Swaps</span>
                        </div>
                        <span className="bg-green-600/20 text-green-300 text-xs px-2.5 py-1 rounded-full">
                          3 pending
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-400" />
                          <span className="font-medium">Time Off</span>
                        </div>
                        <span className="bg-amber-600/20 text-amber-300 text-xs px-2.5 py-1 rounded-full">
                          7 pending
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-purple-400" />
                          <span className="font-medium">Timesheets</span>
                        </div>
                        <span className="bg-purple-600/20 text-purple-300 text-xs px-2.5 py-1 rounded-full">
                          12 pending
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Upcoming Shifts</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/my-roster">View Full Schedule</a>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingShifts.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingShifts.map(shift => (
                      <div key={shift.id} className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-md border border-white/10 bg-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{shift.department}</h4>
                            <p className="text-sm text-white/60">{shift.role}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                          <div className="text-center sm:text-left">
                            <p className="text-xs text-white/60">Date</p>
                            <p className="font-medium">{format(new Date(shift.date), 'MMM d, yyyy')}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/60">Time</p>
                            <p className="font-medium">{shift.startTime} - {shift.endTime}</p>
                          </div>
                          <Button variant="outline" size="sm" className="sm:self-center">
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming shifts scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-white/5 border border-white/10">
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Today</span>
                      <span className="bg-green-600/20 text-green-300 text-xs px-2.5 py-1 rounded-full">
                        Available
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Tomorrow</span>
                      <span className="bg-red-600/20 text-red-300 text-xs px-2.5 py-1 rounded-full">
                        Unavailable
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Next Week</span>
                      <span className="bg-amber-600/20 text-amber-300 text-xs px-2.5 py-1 rounded-full">
                        Partial
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                      <a href="/availabilities">Update Availability</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10">
                <CardHeader>
                  <CardTitle>Time Off</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-white/5 border border-white/10">
                      <div className="flex justify-between">
                        <span className="font-medium">Annual Leave</span>
                        <span className="text-sm">12 days remaining</span>
                      </div>
                      <div className="mt-2 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 rounded-md bg-white/5 border border-white/10">
                      <div className="flex justify-between">
                        <span className="font-medium">Sick Leave</span>
                        <span className="text-sm">5 days remaining</span>
                      </div>
                      <div className="mt-2 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Request Time Off
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Recent Notifications</span>
                  <Button variant="outline" size="sm">Mark All as Read</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-md border ${
                          notification.read
                            ? 'border-white/10 bg-white/5'
                            : 'border-blue-500/20 bg-blue-500/5'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                            notification.type === 'schedule'
                              ? 'bg-green-500/20'
                              : notification.type === 'bid'
                                ? 'bg-blue-500/20'
                                : notification.type === 'swap'
                                  ? 'bg-purple-500/20'
                                  : 'bg-amber-500/20'
                          }`}>
                            {notification.type === 'schedule' ? (
                              <Calendar className="h-5 w-5 text-green-400" />
                            ) : notification.type === 'bid' ? (
                              <CheckCircle className="h-5 w-5 text-blue-400" />
                            ) : notification.type === 'swap' ? (
                              <MessageSquare className="h-5 w-5 text-purple-400" />
                            ) : (
                              <Bell className="h-5 w-5 text-amber-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{notification.message}</span>
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-white/60 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No new notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAccessCard 
              title="My Roster" 
              description="View your upcoming shifts" 
              icon={<Calendar className="h-6 w-6" />}
              link="/my-roster"
            />
            {hasPermission('timesheet-view') && (
              <QuickAccessCard 
                title="Timesheets" 
                description="Review and approve work hours" 
                icon={<ClipboardList className="h-6 w-6" />}
                link="/timesheet"
              />
            )}
            {hasPermission('management') && (
              <QuickAccessCard 
                title="Open Bids" 
                description="Manage shift bidding process" 
                icon={<MessageSquare className="h-6 w-6" />}
                link="/management/bids"
              />
            )}
            <QuickAccessCard 
              title="Availability" 
              description="Update your availability" 
              icon={<CalendarDays className="h-6 w-6" />}
              link="/availabilities"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-900/30 border-blue-500/20';
      case 'green':
        return 'bg-green-900/30 border-green-500/20';
      case 'red':
        return 'bg-red-900/30 border-red-500/20';
      case 'purple':
        return 'bg-purple-900/30 border-purple-500/20';
      default:
        return 'bg-gray-900/30 border-gray-500/20';
    }
  };
  
  return (
    <Card className={`${getColorClasses()} border`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  unit: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, change, changeType, icon }) => {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white/70">{title}</h3>
        {icon}
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold mr-1">{value}</span>
        <span className="text-white/60 text-sm">{unit}</span>
      </div>
      <div className={`mt-2 text-xs ${
        changeType === 'positive' 
          ? 'text-green-400' 
          : changeType === 'negative' 
            ? 'text-red-400' 
            : 'text-white/60'
      }`}>
        {change} from last week
      </div>
    </div>
  );
};

// Quick Access Card Component
interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, description, icon, link }) => {
  return (
    <Card className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
      <a href={link} className="block h-full">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="p-2 rounded-full bg-white/10">{icon}</div>
          <div>
            <CardTitle className="text-md font-medium">{title}</CardTitle>
            <p className="text-xs text-white/60">{description}</p>
          </div>
        </CardHeader>
      </a>
    </Card>
  );
};

export default DashboardPage;
