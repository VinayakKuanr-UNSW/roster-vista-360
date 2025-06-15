import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Calendar as CalendarIcon, X, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SwapDetailsModal from './SwapDetailsModal';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths, subMonths, isToday, isFuture, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import SwapStats from './SwapStats';

interface SwapRequest {
  id: string;
  requestor: {
    id: string;
    name: string;
    avatar: string;
    department?: string;
    role?: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar: string;
    department?: string;
    role?: string;
  };
  department: string;
  fromDate: string;
  toDate: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: string;
  reason?: string;
  notes?: string;
  priority?: "high" | "medium" | "low";
}

interface SwapRequestsContentProps {
  swapRequests: SwapRequest[];
  onUpdateStatus: (id: string, status: "approved" | "rejected") => void;
}

export const SwapRequestsContent: React.FC<SwapRequestsContentProps> = ({
  swapRequests,
  onUpdateStatus,
}) => {
  const [filteredRequests, setFilteredRequests] = useState<SwapRequest[]>(swapRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const { toast } = useToast();

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = swapRequests.filter(request => {
      const matchesSearch = searchQuery === '' || 
        request.requestor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    setFilteredRequests(filtered);
  }, [swapRequests, searchQuery, statusFilter]);

  // New: confirmation dialog state
  const [actionConfirm, setActionConfirm] = useState<{id: string; status: 'approved' | 'rejected'}|null>(null);

  const handleViewDetails = (request: SwapRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: SwapRequest['status']) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800", 
      rejected: "bg-red-100 text-red-800"
    };
    
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <Check className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />
    };

    return (
      <Badge className={cn("flex items-center gap-1", variants[status])}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority?: SwapRequest['priority']) => {
    if (!priority) return null;
    
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-orange-100 text-orange-800",
      low: "bg-blue-100 text-blue-800"
    };

    return (
      <Badge className={cn("flex items-center gap-1", variants[priority])}>
        {priority === 'high' && <AlertTriangle className="w-3 h-3" />}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  // Updated Approve/Reject with modal confirmation (for safety)
  const handleAction = (id: string, status: "approved" | "rejected") => {
    setActionConfirm({id, status});
  };

  // On confirm (modal action)
  const handleConfirmAction = () => {
    if (!actionConfirm) return;
    const {id, status} = actionConfirm;
    setFilteredRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status }
          : request
      )
    );
    onUpdateStatus(id, status);

    setActionConfirm(null);
    toast({
      title: `Swap ${status === "approved" ? "approved" : "rejected"}`,
      description: `The swap request has been ${status === "approved" ? "approved" : "rejected"}.`,
    });
  };

  const handlePreviousMonth = () => {
    setDisplayMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(prev => addMonths(prev, 1));
  };

  return (
    <div>
      {/* Quick Stats */}
      <SwapStats swapRequests={swapRequests} />
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between mb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Swap Requests</h2>
          <Badge variant="secondary">
            {filteredRequests.length} showing
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-[220px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or dept"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 bg-white"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center gap-4 py-4 border-b flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 px-3">
                <CalendarIcon className="h-4 w-4" />
                {format(displayMonth, 'MMMM yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={displayMonth}
                onSelect={(date) => date && setDisplayMonth(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4 mt-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No swap requests found matching your criteria.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border bg-white/80 dark:bg-gray-900 shadow-md flex flex-col md:flex-row md:items-center p-4 gap-4 transition hover:shadow-lg hover-scale anim-fade-in"
            >
              {/* Left: Info */}
              <div className="flex-1 flex gap-4 flex-col md:flex-row md:items-center">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    {getStatusBadge(request.status)}
                    {getPriorityBadge(request.priority)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-1">
                    <div>
                      <span className="text-xs text-gray-500">Requestor:</span>
                      <span className="block font-medium">{request.requestor.name}</span>
                      <span className="block text-xs text-gray-500">From: {format(new Date(request.fromDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Recipient:</span>
                      <span className="block font-medium">{request.recipient.name}</span>
                      <span className="block text-xs text-gray-500">To: {format(new Date(request.toDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  {request.reason && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">Reason:</span>
                      <div className="text-sm text-gray-700 truncate">{request.reason}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Right: Actions and details */}
              <div className="flex flex-row md:flex-col gap-2 items-end md:items-center justify-end min-w-[160px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(request)}
                >
                  View Details
                </Button>
                {request.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(request.id, "rejected")}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(request.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Confirm Dialog */}
      {actionConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90vw] max-w-xs anim-scale-in">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1">
                {actionConfirm.status === "approved" ? "Approve Request" : "Reject Request"}
              </h3>
              <p className="text-gray-700 text-sm">
                Are you sure you want to <span className="font-semibold">{actionConfirm.status}</span> this swap request?
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setActionConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                className={actionConfirm.status === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                onClick={handleConfirmAction}
              >
                {actionConfirm.status === "approved" ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <SwapDetailsModal
        swapRequest={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={(id, status) => {
          onUpdateStatus(id, status);
          setFilteredRequests(prev => 
            prev.map(request => 
              request.id === id 
                ? { ...request, status }
                : request
            )
          );
        }}
      />
    </div>
  );
};
