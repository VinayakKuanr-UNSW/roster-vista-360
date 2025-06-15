
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { MessageSquare, User } from "lucide-react";

const CommunicationInteractionSection: React.FC = () => {
  // Mock Data for Communication & Interaction
  const swapRequestVolume = "9 this week (78% approved)";
  const broadcastEngagement = "35 views, 10 replies";
  const feedbackMetrics = "4.2 ★ avg (12 responses)";

  return (
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
  );
};

export default CommunicationInteractionSection;
