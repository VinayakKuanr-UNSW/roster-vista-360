import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import InsightMetricCard from "@/components/insights/InsightMetricCard";
import { Brain, ChartBar, Clock, User, Calendar, DollarSign, Search, MapPin, MessageSquare } from "lucide-react";

const InsightsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Sample data for charts
  const staffAttendanceData = [
    { name: 'Mon', convention: 85, exhibition: 78, theatre: 90 },
    { name: 'Tue', convention: 88, exhibition: 82, theatre: 93 },
    { name: 'Wed', convention: 90, exhibition: 85, theatre: 88 },
    { name: 'Thu', convention: 92, exhibition: 80, theatre: 85 },
    { name: 'Fri', convention: 86, exhibition: 75, theatre: 92 },
    { name: 'Sat', convention: 78, exhibition: 72, theatre: 80 },
    { name: 'Sun', convention: 75, exhibition: 68, theatre: 75 },
  ];
  
  const departmentPerformanceData = [
    { name: 'Convention', value: 85, color: '#3b82f6' },
    { name: 'Exhibition', value: 78, color: '#22c55e' },
    { name: 'Theatre', value: 92, color: '#ef4444' },
  ];
  
  const shiftStatusData = [
    { name: 'Completed', value: 68 },
    { name: 'Cancelled', value: 8 },
    { name: 'Active', value: 15 },
    { name: 'No-Show', value: 4 },
    { name: 'Swapped', value: 5 },
  ];
  
  const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#eab308', '#a855f7'];

  // --- Mock Data for New Metrics (use realistic demo numbers) ---

  // 1. Workforce Utilization & Productivity
  const shiftFillRate = "92%";
  const employeeUtilization = "78%";
  const noShowRate = "2.8%";
  const lateStart = "5 shifts last week";
  const earlyFinish = "2 shifts last week";
  const underutilizedStaff = ["Jamie Smith", "Taylor Brown"]; // just demo names

  // 2. Event-Level Metrics
  const shiftDemand = 48;
  const shiftSupply = 51;
  const roleCoveragePercent = "100%";
  const eventConflicts = 1; // mock conflict found

  // 3. Time & Attendance Tracking
  const actualScheduledHours = "316h vs 322h";
  const clockDiscrepancies = "4% mismatches";
  const overtimeEvents = "3 events, $430 cost";

  // 4. Employee Behavior Insights
  const topPerformers = ["Alex Johnson", "Sam Wilson"];
  const mostSwappedSlots = "Fri 3-5pm (AM Base)";
  const fatigueCount = "2 flagged staff";

  // 5. Scheduling Efficiency
  const rosterApprovalTime = "36h avg";
  const shiftEditFrequency = "14 edits this week";
  const stabilityIndex = "91%";

  // 6. Communication & Interaction
  const swapRequestVolume = "9 this week (78% approved)";
  const broadcastEngagement = "35 views, 10 replies";
  const feedbackMetrics = "4.2 ★ avg (12 responses)";

  // 7. Financial & Budget Tracking
  const laborCostPerEvent = "$4,550";
  const costPerRole = "$2,200 (Supervisors)";
  const budgetVariance = "-$480 (underspend)";
  const highCostStaff = "Jane Smith (5x)";

  // 8. Forecasting & Planning
  const seasonalDemand = "↑ Next month (49 shifts)";
  const shiftTrends = "Wednesdays highest (12%)";
  const aiRecommendation = "Suggest more AM Assist coverage Thu";

  // 9. Location-based Insights
  const venueHeatmap = "Main Hall (12% overtime)";
  const travelTimeTracking = "Avg 22min, 2 flagged late";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4 md:p-8">
        <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Insights & Analytics</h1>
            <p className="text-white/60">
              Track performance metrics and operational statistics.
            </p>
          </div>
          
          {/* ==== 1. Workforce Utilization & Productivity ==== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Brain size={20} className="text-blue-300" /> Workforce Utilization & Productivity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <InsightMetricCard
                title="Shift Fill Rate"
                metric={shiftFillRate}
                description="% of planned shifts filled"
                icon={<ChartBar size={18} className="text-green-400" />}
              />
              <InsightMetricCard
                title="Employee Utilization"
                metric={employeeUtilization}
                description="Rostered vs. available"
                icon={<User size={18} className="text-sky-400" />}
              />
              <InsightMetricCard
                title="No-show Rate"
                metric={noShowRate}
                description="Missed shifts/assignments"
                icon={<Clock size={18} className="text-rose-400" />}
              />
              <InsightMetricCard
                title="Late Start / Early Finish"
                metric={lateStart + " / " + earlyFinish}
                description="Recent irregularities"
                icon={<Clock size={18} className="text-orange-400" />}
              />
              <InsightMetricCard
                title="Underutilized Staff Alerts"
                metric={underutilizedStaff.length ? underutilizedStaff.join(", ") : "None"}
                description="Consistently not rostered"
                icon={<User size={18} className="text-yellow-400" />}
              />
            </div>
          </div>

          {/* ==== 2. Event-Level Metrics ==== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <ChartBar size={20} className="text-emerald-400" /> Event-Level Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InsightMetricCard
                title="Shift Demand vs. Supply"
                metric={`${shiftDemand} / ${shiftSupply}`}
                description="Required vs. staff available"
                icon={<Calendar size={18} className="text-cyan-400" />}
              />
              <InsightMetricCard
                title="Role Coverage"
                metric={roleCoveragePercent}
                description="All critical roles filled"
                icon={<User size={18} className="text-purple-300" />}
              />
              <InsightMetricCard
                title="Conflict Analysis"
                metric={eventConflicts ? `${eventConflicts} conflict` : "None"}
                description="Overlapping event conflicts"
                icon={<Clock size={18} className="text-orange-300" />}
              />
            </div>
          </div>
          
          {/* ==== 3. Time & Attendance Tracking ==== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Clock size={20} className="text-teal-300" /> Time & Attendance Tracking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InsightMetricCard
                title="Actual vs. Scheduled Hours"
                metric={actualScheduledHours}
                description="Real vs. planned shift hours"
                icon={<Clock size={18} className="text-indigo-400" />}
              />
              <InsightMetricCard
                title="Clock Discrepancies"
                metric={clockDiscrepancies}
                description="Clock-in/out mismatches"
                icon={<User size={18} className="text-amber-400" />}
              />
              <InsightMetricCard
                title="Overtime Analysis"
                metric={overtimeEvents}
                description="Trends & cost"
                icon={<DollarSign size={18} className="text-pink-400" />}
              />
            </div>
          </div>

          {/* ==== 4. Employee Behavior Insights ==== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <User size={20} className="text-fuchsia-400" /> Employee Behavior Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InsightMetricCard
                title="Top Performers"
                metric={topPerformers.length ? topPerformers.join(", ") : "—"}
                description="Based on attendance & reliability"
                icon={<User size={18} className="text-green-400" />}
              />
              <InsightMetricCard
                title="Most Swapped/Declined Shifts"
                metric={mostSwappedSlots}
                description="Unpopular time slots/venues"
                icon={<Calendar size={18} className="text-blue-400" />}
              />
              <InsightMetricCard
                title="Fatigue Risk Indicators"
                metric={fatigueCount}
                description="Long shifts, short rests"
                icon={<Clock size={18} className="text-orange-400" />}
              />
            </div>
          </div>

          {/* ==== 5. Scheduling Efficiency ==== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Calendar size={20} className="text-violet-400" /> Scheduling Efficiency
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InsightMetricCard
                title="Roster Approval Time"
                metric={rosterApprovalTime}
                description="Draft → published (avg.)"
                icon={<Clock size={18} className="text-lime-400" />}
              />
              <InsightMetricCard
                title="Shift Edit Frequency"
                metric={shiftEditFrequency}
                description="Edits post-publish"
                icon={<Calendar size={18} className="text-orange-400" />}
              />
              <InsightMetricCard
                title="Roster Stability Index"
                metric={stabilityIndex}
                description="Week-to-week stability"
                icon={<ChartBar size={18} className="text-yellow-400" />}
              />
            </div>
          </div>

          {/* ==== 6. Communication & Interaction ==== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <MessageSquare size={20} className="text-cyan-400" /> Communication & Interaction
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InsightMetricCard
                title="Swap Requests & Approvals"
                metric={swapRequestVolume}
                description="Requests & approval rate"
                icon={<User size={18} className="text-purple-400" />}
              />
              <InsightMetricCard
                title="Broadcast Engagement"
                metric={broadcastEngagement}
                description="Message views & replies"
                icon={<MessageSquare size={18} className="text-green-400" />}
              />
              <InsightMetricCard
                title="Staff Feedback"
                metric={feedbackMetrics}
                description="Event survey results"
                icon={<MessageSquare size={18} className="text-rose-400" />}
              />
            </div>
          </div>

          {/* ==== 7. Financial & Budget Tracking ==== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <DollarSign size={20} className="text-yellow-300" /> Financial & Budget Tracking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InsightMetricCard
                title="Labor Cost per Event"
                metric={laborCostPerEvent}
                description="Wages, overtime, etc."
                icon={<DollarSign size={18} className="text-lime-400" />}
              />
              <InsightMetricCard
                title="Cost per Role/Dept."
                metric={costPerRole}
                description="High/low cost roles"
                icon={<User size={18} className="text-blue-400" />}
              />
              <InsightMetricCard
                title="Budget Variance"
                metric={budgetVariance}
                description="Actual vs forecasted"
                icon={<ChartBar size={18} className="text-red-400" />}
              />
              <InsightMetricCard
                title="High Cost Staff Patterns"
                metric={highCostStaff}
                description="Most expensive assignments"
                icon={<User size={18} className="text-yellow-400" />}
              />
            </div>
          </div>

          {/* ==== 8. Forecasting & Planning ==== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Search size={20} className="text-pink-400" /> Forecasting & Planning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InsightMetricCard
                title="Demand Forecasting"
                metric={seasonalDemand}
                description="By month/type/location"
                icon={<Calendar size={18} className="text-cyan-400" />}
              />
              <InsightMetricCard
                title="Historical Shift Trends"
                metric={shiftTrends}
                description="Staff demand patterns"
                icon={<ChartBar size={18} className="text-green-400" />}
              />
              <InsightMetricCard
                title="AI-based Recommendations"
                metric={aiRecommendation}
                description="Staffing suggestions"
                icon={<Brain size={18} className="text-orange-400" />}
              />
            </div>
          </div>

          {/* ==== 9. Location-based Insights ==== */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <MapPin size={20} className="text-blue-400" /> Location-based Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InsightMetricCard
                title="Venue Staffing Heatmaps"
                metric={venueHeatmap}
                description="Most demanding venues"
                icon={<MapPin size={18} className="text-indigo-400" />}
              />
              <InsightMetricCard
                title="Travel Time Tracking"
                metric={travelTimeTracking}
                description="Punctuality & fatigue"
                icon={<Clock size={18} className="text-teal-400" />}
              />
            </div>
          </div>
          
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Staff Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={staffAttendanceData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#444' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="convention" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="exhibition" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="theatre" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
            
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformanceData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#444' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {departmentPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
            
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Shift Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={shiftStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {shiftStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#444' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffAttendanceData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#444' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="convention" name="Convention" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="exhibition" name="Exhibition" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="theatre" name="Theatre" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Department-specific insights */}
          {user?.department && (
            <Card className={
              user.department === 'convention' ? 'bg-blue-900/20 border-blue-500/20' :
              user.department === 'exhibition' ? 'bg-green-900/20 border-green-500/20' :
              user.department === 'theatre' ? 'bg-red-900/20 border-red-500/20' :
              'bg-purple-900/20 border-purple-500/20'
            }>
              <CardHeader>
                <CardTitle className="text-lg capitalize">{user.department} Department Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">
                  Detailed performance metrics and KPIs specific to your department.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-sm text-white/60 mb-1">Staff Utilization</div>
                    <div className="text-2xl font-bold">
                      {user.department === 'convention' ? '85%' : 
                       user.department === 'exhibition' ? '78%' : 
                       user.department === 'theatre' ? '92%' : '87%'}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-sm text-white/60 mb-1">Shift Completion</div>
                    <div className="text-2xl font-bold">
                      {user.department === 'convention' ? '92%' : 
                       user.department === 'exhibition' ? '88%' : 
                       user.department === 'theatre' ? '94%' : '90%'}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-sm text-white/60 mb-1">Avg. Shift Duration</div>
                    <div className="text-2xl font-bold">
                      {user.department === 'convention' ? '7.2h' : 
                       user.department === 'exhibition' ? '6.8h' : 
                       user.department === 'theatre' ? '5.5h' : '7.0h'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
