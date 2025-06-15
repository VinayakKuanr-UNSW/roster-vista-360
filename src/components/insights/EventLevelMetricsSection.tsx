
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { ChartBar, Calendar, User, Clock } from "lucide-react";

const EventLevelMetricsSection: React.FC = () => {
  // Mock Data for Event-Level Metrics
  const shiftDemand = 48;
  const shiftSupply = 51;
  const roleCoveragePercent = "100%";
  const eventConflicts = 1;

  return (
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
  );
};

export default EventLevelMetricsSection;
