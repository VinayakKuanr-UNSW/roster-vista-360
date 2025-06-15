
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

  const handleQuickApprove = (id: string) => {
    setFilteredRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status: "approved" as const }
          : request
      )
    );
    onUpdateStatus(id, "approved");
    
    if (selectedRequest?.id === id && selectedRequest.status === "rejected") {
      toast({
        title: "Swap approved",
        description: "The swap request has been approved successfully.",
      });
    }
  };

  const handleQuickReject = (id: string) => {
    setFilteredRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status: "rejected" as const }
          : request
      )
    );
    onUpdateStatus(id, "rejected");
    
    if (selectedRequest?.id === id && selectedRequest.status === "rejected") {
      toast({
        title: "Swap rejected",
        description: "The swap request has been rejected.",
      });
    }
  };

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

  const handlePreviousMonth = () => {
    setDisplayMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(prev => addMonths(prev, 1));
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Swap Requests</h2>
          <Badge variant="secondary">
            {filteredRequests.length} requests
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center gap-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
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
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No swap requests found matching your criteria.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(request.status)}
                    {getPriorityBadge(request.priority)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{request.requestor.name}</p>
                      <p className="text-sm text-gray-600">
                        From: {format(new Date(request.fromDate), 'PPP')}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">{request.recipient.name}</p>
                      <p className="text-sm text-gray-600">
                        To: {format(new Date(request.toDate), 'PPP')}
                      </p>
                    </div>
                  </div>
                  
                  {request.reason && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {request.reason}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
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
                        onClick={() => handleQuickReject(request.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleQuickApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      <SwapDetailsModal
        swapRequest={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={(id, status) => {
          onUpdateStatus(id, status);
          // Update local state
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
