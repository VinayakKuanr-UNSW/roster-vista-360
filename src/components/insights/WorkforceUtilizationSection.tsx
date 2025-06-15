
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { Brain, ChartBar, Clock, User } from "lucide-react";

const WorkforceUtilizationSection: React.FC = () => {
  // Mock Data for Workforce Utilization & Productivity
  const shiftFillRate = "92%";
  const employeeUtilization = "78%";
  const noShowRate = "2.8%";
  const lateStart = "5 shifts last week";
  const earlyFinish = "2 shifts last week";
  const underutilizedStaff = ["Jamie Smith", "Taylor Brown"];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
          <Brain size={24} className="text-blue-300" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Workforce Utilization & Productivity</h2>
          <p className="text-white/60 text-sm">Monitor staff efficiency and attendance patterns</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <InsightMetricCard
          metricId="shift-fill-rate"
          title="Shift Fill Rate"
          metric={shiftFillRate}
          description="% of planned shifts filled"
          icon={<ChartBar size={18} className="text-green-400" />}
        />
        <InsightMetricCard
          metricId="employee-utilization"
          title="Employee Utilization"
          metric={employeeUtilization}
          description="Rostered vs. available"
          icon={<User size={18} className="text-sky-400" />}
        />
        <InsightMetricCard
          metricId="no-show-rate"
          title="No-show Rate"
          metric={noShowRate}
          description="Missed shifts/assignments"
          icon={<Clock size={18} className="text-rose-400" />}
        />
        <InsightMetricCard
          metricId="punctuality"
          title="Late Start / Early Finish"
          metric={lateStart + " / " + earlyFinish}
          description="Recent irregularities"
          icon={<Clock size={18} className="text-orange-400" />}
        />
        <InsightMetricCard
          metricId="underutilized-staff"
          title="Underutilized Staff Alerts"
          metric={underutilizedStaff.length ? underutilizedStaff.join(", ") : "None"}
          description="Consistently not rostered"
          icon={<User size={18} className="text-yellow-400" />}
        />
      </div>
    </section>
  );
};

export default WorkforceUtilizationSection;
