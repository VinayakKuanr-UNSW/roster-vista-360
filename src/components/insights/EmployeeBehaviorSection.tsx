
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { User, Calendar, Clock } from "lucide-react";

const EmployeeBehaviorSection: React.FC = () => {
  // Mock Data for Employee Behavior Insights
  const topPerformers = ["Alex Johnson", "Sam Wilson"];
  const mostSwappedSlots = "Fri 3-5pm (AM Base)";
  const fatigueCount = "2 flagged staff";

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <User size={20} className="text-fuchsia-400" /> Employee Behavior Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InsightMetricCard
          metricId="top-performers"
          title="Top Performers"
          metric={topPerformers.length ? topPerformers.join(", ") : "—"}
          description="Based on attendance & reliability"
          icon={<User size={18} className="text-green-400" />}
        />
        <InsightMetricCard
          metricId="shift-swaps"
          title="Most Swapped/Declined Shifts"
          metric={mostSwappedSlots}
          description="Unpopular time slots/venues"
          icon={<Calendar size={18} className="text-blue-400" />}
        />
        <InsightMetricCard
          metricId="fatigue-risk"
          title="Fatigue Risk Indicators"
          metric={fatigueCount}
          description="Long shifts, short rests"
          icon={<Clock size={18} className="text-orange-400" />}
        />
      </div>
    </div>
  );
};

export default EmployeeBehaviorSection;
