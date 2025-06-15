
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { Search, Calendar, ChartBar, Brain } from "lucide-react";

const ForecastingPlanningSection: React.FC = () => {
  // Mock Data for Forecasting & Planning
  const seasonalDemand = "↑ Next month (49 shifts)";
  const shiftTrends = "Wednesdays highest (12%)";
  const aiRecommendation = "Suggest more AM Assist coverage Thu";

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <Search size={20} className="text-pink-400" /> Forecasting & Planning
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InsightMetricCard
          metricId="demand-forecasting"
          title="Demand Forecasting"
          metric={seasonalDemand}
          description="By month/type/location"
          icon={<Calendar size={18} className="text-cyan-400" />}
        />
        <InsightMetricCard
          metricId="historical-trends"
          title="Historical Shift Trends"
          metric={shiftTrends}
          description="Staff demand patterns"
          icon={<ChartBar size={18} className="text-green-400" />}
        />
        <InsightMetricCard
          metricId="ai-recommendations"
          title="AI-based Recommendations"
          metric={aiRecommendation}
          description="Staffing suggestions"
          icon={<Brain size={18} className="text-orange-400" />}
        />
      </div>
    </div>
  );
};

export default ForecastingPlanningSection;
