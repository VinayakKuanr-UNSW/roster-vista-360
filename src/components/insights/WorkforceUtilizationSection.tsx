
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
  );
};

export default WorkforceUtilizationSection;
