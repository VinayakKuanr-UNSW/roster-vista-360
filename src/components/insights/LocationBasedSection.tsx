
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { MapPin, Clock } from "lucide-react";

const LocationBasedSection: React.FC = () => {
  // Mock Data for Location-based Insights
  const venueHeatmap = "Main Hall (12% overtime)";
  const travelTimeTracking = "Avg 22min, 2 flagged late";

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <MapPin size={20} className="text-blue-400" /> Location-based Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InsightMetricCard
          metricId="venue-heatmaps"
          title="Venue Staffing Heatmaps"
          metric={venueHeatmap}
          description="Most demanding venues"
          icon={<MapPin size={18} className="text-indigo-400" />}
        />
        <InsightMetricCard
          metricId="travel-time-tracking"
          title="Travel Time Tracking"
          metric={travelTimeTracking}
          description="Punctuality & fatigue"
          icon={<Clock size={18} className="text-teal-400" />}
        />
      </div>
    </div>
  );
};

export default LocationBasedSection;
