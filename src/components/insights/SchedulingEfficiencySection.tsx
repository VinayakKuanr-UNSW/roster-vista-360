
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { Calendar, Clock, ChartBar } from "lucide-react";

const SchedulingEfficiencySection: React.FC = () => {
  // Mock Data for Scheduling Efficiency
  const rosterApprovalTime = "36h avg";
  const shiftEditFrequency = "14 edits this week";
  const stabilityIndex = "91%";

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <Calendar size={20} className="text-violet-400" /> Scheduling Efficiency
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InsightMetricCard
          metricId="roster-approval-time"
          title="Roster Approval Time"
          metric={rosterApprovalTime}
          description="Draft → published (avg.)"
          icon={<Clock size={18} className="text-lime-400" />}
        />
        <InsightMetricCard
          metricId="shift-edit-frequency"
          title="Shift Edit Frequency"
          metric={shiftEditFrequency}
          description="Edits post-publish"
          icon={<Calendar size={18} className="text-orange-400" />}
        />
        <InsightMetricCard
          metricId="roster-stability"
          title="Roster Stability Index"
          metric={stabilityIndex}
          description="Week-to-week stability"
          icon={<ChartBar size={18} className="text-yellow-400" />}
        />
      </div>
    </div>
  );
};

export default SchedulingEfficiencySection;
