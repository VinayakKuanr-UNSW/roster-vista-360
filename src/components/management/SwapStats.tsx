
import React from "react";
import { Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SwapRequest {
  status: "pending" | "approved" | "rejected";
  priority?: "high" | "medium" | "low";
}

interface SwapStatsProps {
  swapRequests: SwapRequest[];
}

const getStatusCount = (
  requests: SwapRequest[],
  status: SwapRequest["status"]
) => requests.filter((r) => r.status === status).length;

const getPriorityCount = (
  requests: SwapRequest[],
  priority: SwapRequest["priority"]
) => requests.filter((r) => r.priority === priority).length;

const SwapStats: React.FC<SwapStatsProps> = ({ swapRequests }) => {
  const total = swapRequests.length;
  const pending = getStatusCount(swapRequests, "pending");
  const approved = getStatusCount(swapRequests, "approved");
  const rejected = getStatusCount(swapRequests, "rejected");

  const highPriority = getPriorityCount(swapRequests, "high");
  const mediumPriority = getPriorityCount(swapRequests, "medium");
  const lowPriority = getPriorityCount(swapRequests, "low");

  return (
    <div className="flex flex-wrap gap-4 items-center mb-2">
      <div className="flex flex-col px-4 py-3 rounded-lg bg-primary/90 text-white min-w-[120px] shadow anim-fade-in">
        <span className="font-semibold text-lg">{total}</span>
        <span className="text-xs">Total Requests</span>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Badge className="bg-yellow-200 text-yellow-800 gap-1 px-3" variant="secondary">
          <Clock className="w-4 h-4 mr-1" /> Pending: {pending}
        </Badge>
        <Badge className="bg-green-200 text-green-800 gap-1 px-3" variant="success">
          <Check className="w-4 h-4 mr-1" /> Approved: {approved}
        </Badge>
        <Badge className="bg-red-200 text-red-800 gap-1 px-3" variant="destructive">
          <X className="w-4 h-4 mr-1" /> Rejected: {rejected}
        </Badge>
      </div>
      <div className="flex gap-2 flex-wrap ml-auto">
        <span className="text-xs text-gray-500">Priority: </span>
        <Badge className="bg-red-100 text-red-800 px-2" variant="destructive">
          High {highPriority}
        </Badge>
        <Badge className="bg-orange-100 text-orange-800 px-2" variant="warning">
          Medium {mediumPriority}
        </Badge>
        <Badge className="bg-blue-100 text-blue-800 px-2" variant="secondary">
          Low {lowPriority}
        </Badge>
      </div>
    </div>
  );
};

export default SwapStats;
