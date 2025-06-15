
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { Clock, User, DollarSign } from "lucide-react";

const TimeAttendanceSection: React.FC = () => {
  // Mock Data for Time & Attendance Tracking
  const actualScheduledHours = "316h vs 322h";
  const clockDiscrepancies = "4% mismatches";
  const overtimeEvents = "3 events, $430 cost";

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <Clock size={20} className="text-teal-300" /> Time & Attendance Tracking
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InsightMetricCard
          metricId="actual-vs-scheduled-hours"
          title="Actual vs. Scheduled Hours"
          metric={actualScheduledHours}
          description="Real vs. planned shift hours"
          icon={<Clock size={18} className="text-indigo-400" />}
        />
        <InsightMetricCard
          metricId="clock-discrepancies"
          title="Clock Discrepancies"
          metric={clockDiscrepancies}
          description="Clock-in/out mismatches"
          icon={<User size={18} className="text-amber-400" />}
        />
        <InsightMetricCard
          metricId="overtime-analysis"
          title="Overtime Analysis"
          metric={overtimeEvents}
          description="Trends & cost"
          icon={<DollarSign size={18} className="text-pink-400" />}
        />
      </div>
    </div>
  );
};

export default TimeAttendanceSection;
