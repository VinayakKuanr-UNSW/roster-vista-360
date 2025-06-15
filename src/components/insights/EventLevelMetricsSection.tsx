
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
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
          <ChartBar size={24} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Event-Level Metrics</h2>
          <p className="text-white/60 text-sm">Real-time event staffing and coverage analysis</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightMetricCard
          metricId="shift-demand-supply"
          title="Shift Demand vs. Supply"
          metric={`${shiftDemand} / ${shiftSupply}`}
          description="Required vs. staff available"
          icon={<Calendar size={18} className="text-cyan-400" />}
        />
        <InsightMetricCard
          metricId="role-coverage"
          title="Role Coverage"
          metric={roleCoveragePercent}
          description="All critical roles filled"
          icon={<User size={18} className="text-purple-300" />}
        />
        <InsightMetricCard
          metricId="conflict-analysis"
          title="Conflict Analysis"
          metric={eventConflicts ? `${eventConflicts} conflict` : "None"}
          description="Overlapping event conflicts"
          icon={<Clock size={18} className="text-orange-300" />}
        />
      </div>
    </section>
  );
};

export default EventLevelMetricsSection;
