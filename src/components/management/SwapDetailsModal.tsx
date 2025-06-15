import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Check, X, ArrowLeftRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";

interface SwapRequest {
  id: string;
  requestor: {
    id: string;
    name: string;
    avatar: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar: string;
  };
  department: string;
  fromDate: string; // ISO 8601
  toDate: string; // ISO 8601
  status: "pending" | "approved" | "rejected";
  submittedOn: string; // ISO 8601
  reason?: string;
}

interface SwapDetailsModalProps {
  swapRequest: SwapRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: "approved" | "rejected") => void;
  onUndo?: (id: string) => void; // optional undo handler
}

/**
 * Internal badge for status presentation
 */
const StatusBadge: React.FC<{ status: "pending" | "approved" | "rejected" }> = ({
  status,
}) => {
  const colorMap = {
    pending: "bg-amber-500/10 text-yellow-700",
    approved: "bg-green-500/10 text-green-700",
    rejected: "bg-red-500/10 text-red-700",
  } as const;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status]}`}
      role="status"
    >
      {status}
    </span>
  );
};

/**
 * Reusable card (avatar + name + date box)
 */
const SwapUserCard: React.FC<{
  user: { name: string; avatar: string };
  label: string;
  date: string;
  color: "from" | "to";
}> = ({ user, label, date, color }) => {
  const boxColor =
    color === "from"
      ? "bg-indigo-700/30 text-indigo-300"
      : "bg-teal-700/30 text-teal-300";
  return (
    <div className="flex items-start space-x-3">
      <Avatar>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-white/60">
          <div>{label}</div>
          <div
            className={`mt-1 px-3 py-1.5 rounded-md text-sm font-medium ${boxColor}`}
          >
            {format(new Date(date), "EEE d MMM, HH:mm")}
          </div>
        </div>
      </div>
    </div>
  );
};

const SwapDetailsModal: React.FC<SwapDetailsModalProps> = ({
  swapRequest,
  isOpen,
  onClose,
  onStatusUpdate,
  onUndo,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<"approved" | "rejected" | null>(
    null
  );

  // keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen || !swapRequest || swapRequest.status !== "pending") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleUpdateStatus("approved");
      } else if (e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleUpdateStatus("rejected");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, swapRequest]);

  if (!swapRequest) return null;

  const handleUpdateStatus = (status: "approved" | "rejected") => {
    setIsLoading(status);

    // Simulated API call
    setTimeout(() => {
      onStatusUpdate(swapRequest.id, status);
      toast({
        title: `Swap request ${status}`,
        description: `The swap request has been ${status} successfully.`,
        action:
          status === "rejected" || !onUndo ? undefined : (
            <Button
              variant="link"
              className="text-indigo-300"
              onClick={() => onUndo?.(swapRequest.id)}
            >
              Undo
            </Button>
          ),
      });
      setIsLoading(null);
      onClose();
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white text-gray-900 border-gray-300 focus:outline-none max-w-lg rounded-2xl shadow-xl anim-scale-in"
        aria-labelledby="swap-dialog-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          <DialogHeader>
            <DialogTitle id="swap-dialog-title" className="text-xl font-bold text-gray-900">
              Swap Request Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Review details before approving or rejecting.
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="space-y-6 my-4">
            {/* Users section */}
            <div className="flex flex-col gap-4">
              <SwapUserCard
                user={swapRequest.requestor}
                label="Requesting swap from"
                date={swapRequest.fromDate}
                color="from"
              />
              <div className="flex justify-center" aria-hidden>
                <ArrowLeftRight className="h-5 w-5 text-gray-400" />
              </div>
              <SwapUserCard
                user={swapRequest.recipient}
                label="Swap to"
                date={swapRequest.toDate}
                color="to"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Department</p>
                <p className="font-medium mt-0.5">{swapRequest.department}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <StatusBadge status={swapRequest.status} />
              </div>
              <div>
                <p className="text-gray-500">Submitted</p>
                <p className="font-medium mt-0.5">
                  {format(new Date(swapRequest.submittedOn), "d MMM yyyy, HH:mm")} ({formatDistanceToNow(new Date(swapRequest.submittedOn))} ago)
                </p>
              </div>
            </div>

            {/* Reason */}
            {swapRequest.reason && (
              <div>
                <p className="text-gray-500 text-sm">Reason</p>
                <p className="p-3 bg-gray-100 rounded mt-1 text-sm whitespace-pre-line max-h-40 overflow-y-auto">
                  {swapRequest.reason}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {swapRequest.status === "pending" && (
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-200"
                onClick={() => handleUpdateStatus("rejected")}
                disabled={isLoading !== null}
              >
                {isLoading === "rejected" ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                Reject
              </Button>
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleUpdateStatus("approved")}
                disabled={isLoading !== null}
              >
                {isLoading === "approved" ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve
              </Button>
            </DialogFooter>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SwapDetailsModal;
