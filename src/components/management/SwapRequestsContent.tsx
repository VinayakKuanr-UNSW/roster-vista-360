import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isWithinInterval, parseISO } from 'date-fns';
import { 
  AlertCircle, 
  Calendar, 
  Check, 
  ChevronDown, 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Trash, 
  X, 
  Clock,
  Building,
  User,
  CalendarRange,
  FileText,
  CheckSquare,
  XSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import ManagementSearch from '@/components/management/ManagementSearch';
import ManagementFilter from '@/components/management/ManagementFilter';
import SwapDetailsModal from '@/components/management/SwapDetailsModal';

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
  subDepartment?: string;
  fromDate: string;
  fromTime?: string;
  toDate: string;
  toTime?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedOn: string;
  reason?: string;
  notes?: string;
  priority?: 'high' | 'medium' | 'low';
}

const SwapRequestsContent: React.FC = () => {
  // Sample data for swap requests
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([
    { 
      id: "swap-1",
      requestor: { 
        id: "emp-1", 
        name: "Emma Thompson", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emma",
        department: "Convention Centre",
        role: "Team Leader"
      },
      recipient: { 
        id: "emp-2", 
        name: "Michael Johnson", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Michael",
        department: "Convention Centre",
        role: "TM3"
      },
      department: "Convention Centre",
      subDepartment: "AM Base",
      fromDate: "June 15, 2023",
      fromTime: "9AM-5PM",
      toDate: "June 17, 2023",
      toTime: "10AM-6PM",
      status: "pending",
      submittedOn: "May 25, 2023",
      priority: "medium"
    },
    { 
      id: "swap-2",
      requestor: { 
        id: "emp-3", 
        name: "David Wilson", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=David",
        department: "Exhibition Centre",
        role: "Supervisor"
      },
      recipient: { 
        id: "emp-4", 
        name: "Sarah Brown", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah",
        department: "Exhibition Centre",
        role: "TM2"
      },
      department: "Exhibition Centre",
      subDepartment: "Bump-In",
      fromDate: "July 8, 2023",
      fromTime: "2PM-10PM",
      toDate: "July 10, 2023",
      toTime: "10AM-6PM",
      status: "approved",
      submittedOn: "June 1, 2023",
      reason: "Family commitment",
      priority: "high"
    },
    { 
      id: "swap-3",
      requestor: { 
        id: "emp-5", 
        name: "Jessica Miller", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jessica",
        department: "Theatre",
        role: "TM2"
      },
      recipient: { 
        id: "emp-6", 
        name: "Robert Davis", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Robert",
        department: "Theatre",
        role: "TM3"
      },
      department: "Theatre",
      subDepartment: "AM Floaters",
      fromDate: "June 22, 2023",
      fromTime: "5PM-11PM",
      toDate: "June 24, 2023",
      toTime: "1PM-7PM",
      status: "rejected",
      submittedOn: "May 20, 2023",
      reason: "Medical appointment",
      notes: "Rejected due to insufficient coverage on June 24",
      priority: "low"
    },
    { 
      id: "swap-4",
      requestor: { 
        id: "emp-7", 
        name: "John Smith", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John",
        department: "Convention Centre",
        role: "Team Leader"
      },
      recipient: { 
        id: "emp-8", 
        name: "Emily Clark", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emily",
        department: "Convention Centre",
        role: "TM3"
      },
      department: "Convention Centre",
      subDepartment: "PM Base",
      fromDate: "July 5, 2023",
      fromTime: "8AM-4PM",
      toDate: "July 7, 2023",
      toTime: "12PM-8PM",
      status: "pending",
      submittedOn: "June 10, 2023",
      reason: "Personal commitment",
      priority: "medium"
    },
    { 
      id: "swap-5",
      requestor: { 
        id: "emp-9", 
        name: "Alexandra Johnson", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Alexandra",
        department: "Exhibition Centre",
        role: "Supervisor"
      },
      recipient: { 
        id: "emp-10", 
        name: "Thomas Wright", 
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Thomas",
        department: "Exhibition Centre",
        role: "TM2"
      },
      department: "Exhibition Centre",
      subDepartment: "Bump-Out",
      fromDate: "August 12, 2023",
      fromTime: "10AM-6PM",
      toDate: "August 14, 2023",
      toTime: "2PM-10PM",
      status: "pending",
      submittedOn: "July 20, 2023",
      priority: "high"
    }
  ]);
  
  // State for selected swap request and modal
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isConfirmActionOpen, setIsConfirmActionOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedSwaps, setSelectedSwaps] = useState<string[]>([]);
  const [isBatchActionOpen, setIsBatchActionOpen] = useState(false);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [subDepartmentFilter, setSubDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  // Simulate loading on initial render
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter options
  const filterOptions = [
    { label: 'All Requests', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];
  
  // Department options
  const departmentOptions = [
    { label: 'All Departments', value: 'all' },
    { label: 'Convention Centre', value: 'Convention Centre' },
    { label: 'Exhibition Centre', value: 'Exhibition Centre' },
    { label: 'Theatre', value: 'Theatre' }
  ];
  
  // Sub-department options
  const subDepartmentOptions = [
    { label: 'All Sub-departments', value: 'all' },
    { label: 'AM Base', value: 'AM Base' },
    { label: 'PM Base', value: 'PM Base' },
    { label: 'AM Floaters', value: 'AM Floaters' },
    { label: 'Bump-In', value: 'Bump-In' },
    { label: 'Bump-Out', value: 'Bump-Out' }
  ];
  
  // Role options
  const roleOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Team Leader', value: 'Team Leader' },
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'TM3', value: 'TM3' },
    { label: 'TM2', value: 'TM2' }
  ];
  
  // Employee options (derived from swap requests)
  const employeeOptions = React.useMemo(() => {
    const employees = new Set<string>();
    swapRequests.forEach(swap => {
      employees.add(swap.requestor.name);
      employees.add(swap.recipient.name);
    });
    
    return [
      { label: 'All Employees', value: 'all' },
      ...Array.from(employees).map(name => ({ label: name, value: name }))
    ];
  }, [swapRequests]);
  
  // Priority options
  const priorityOptions = [
    { label: 'All Priorities', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];
  
  // Filter swap requests based on all filters
  const filteredSwaps = React.useMemo(() => {
    return swapRequests.filter(swap => {
      // Status filter
      if (activeFilter !== 'all' && swap.status !== activeFilter) {
        return false;
      }
      
      // Department filter
      if (departmentFilter !== 'all' && swap.department !== departmentFilter) {
        return false;
      }
      
      // Sub-department filter
      if (subDepartmentFilter !== 'all' && swap.subDepartment !== subDepartmentFilter) {
        return false;
      }
      
      // Role filter
      if (roleFilter !== 'all' && 
          (swap.requestor.role !== roleFilter && swap.recipient.role !== roleFilter)) {
        return false;
      }
      
      // Employee filter
      if (employeeFilter !== 'all' && 
          (swap.requestor.name !== employeeFilter && swap.recipient.name !== employeeFilter)) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== 'all' && swap.priority !== priorityFilter) {
        return false;
      }
      
      // Date range filter
      if (dateRange?.from && dateRange?.to) {
        try {
          const fromDate = parseISO(swap.fromDate);
          if (!isWithinInterval(fromDate, { start: dateRange.from, end: dateRange.to })) {
            return false;
          }
        } catch (e) {
          // If date parsing fails, don't filter out
          console.error('Date parsing error:', e);
        }
      }
      
      // Calendar view date filter
      if (viewMode === 'calendar' && selectedDate) {
        try {
          const fromDate = new Date(swap.fromDate);
          if (fromDate.toDateString() !== selectedDate.toDateString()) {
            return false;
          }
        } catch (e) {
          // If date parsing fails, don't filter out
          console.error('Date parsing error:', e);
        }
      }
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          swap.requestor.name.toLowerCase().includes(query) ||
          swap.recipient.name.toLowerCase().includes(query) ||
          swap.department.toLowerCase().includes(query) ||
          (swap.subDepartment && swap.subDepartment.toLowerCase().includes(query)) ||
          swap.fromDate.toLowerCase().includes(query) ||
          swap.toDate.toLowerCase().includes(query) ||
          (swap.reason && swap.reason.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [
    swapRequests, 
    activeFilter, 
    departmentFilter, 
    subDepartmentFilter, 
    roleFilter, 
    employeeFilter,
    priorityFilter,
    dateRange,
    searchQuery,
    viewMode,
    selectedDate
  ]);
  
  // Paginate filtered swaps
  const paginatedSwaps = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSwaps.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSwaps, currentPage, itemsPerPage]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredSwaps.length / itemsPerPage);
  
  // Group swaps by date for calendar view
  const swapsByDate = React.useMemo(() => {
    const grouped: Record<string, SwapRequest[]> = {};
    
    filteredSwaps.forEach(swap => {
      const dateKey = swap.fromDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(swap);
    });
    
    return grouped;
  }, [filteredSwaps]);
  
  // Handle view details
  const handleViewDetails = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setIsDetailsModalOpen(true);
  };
  
  // Handle add note
  const handleAddNote = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setNoteText(swap.notes || '');
    setIsAddNoteModalOpen(true);
  };
  
  // Save note
  const handleSaveNote = () => {
    if (!selectedSwap) return;
    
    setSwapRequests(prev => 
      prev.map(swap => 
        swap.id === selectedSwap.id ? { ...swap, notes: noteText } : swap
      )
    );
    
    toast({
      title: "Note Saved",
      description: "Your note has been saved successfully."
    });
    
    setIsAddNoteModalOpen(false);
  };
  
  // Handle approve/reject action
  const handleActionClick = (swap: SwapRequest, action: 'approve' | 'reject') => {
    setSelectedSwap(swap);
    setConfirmAction(action);
    setRejectionReason('');
    setIsConfirmActionOpen(true);
  };
  
  // Confirm action
  const handleConfirmAction = () => {
    if (!selectedSwap || !confirmAction) return;
    
    setSwapRequests(prev => 
      prev.map(swap => 
        swap.id === selectedSwap.id 
          ? { 
              ...swap, 
              status: confirmAction, 
              notes: confirmAction === 'rejected' ? rejectionReason : swap.notes 
            } 
          : swap
      )
    );
    
    toast({
      title: confirmAction === 'approve' ? "Swap Approved" : "Swap Rejected",
      description: confirmAction === 'approve' 
        ? "The swap request has been approved successfully." 
        : "The swap request has been rejected."
    });
    
    setIsConfirmActionOpen(false);
    setSelectedSwaps(prev => prev.filter(id => id !== selectedSwap.id));
  };
  
  // Toggle swap selection
  const toggleSwapSelection = (swapId: string) => {
    setSelectedSwaps(prev => 
      prev.includes(swapId) 
        ? prev.filter(id => id !== swapId) 
        : [...prev, swapId]
    );
  };
  
  // Select all swaps
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSwaps(paginatedSwaps.map(swap => swap.id));
    } else {
      setSelectedSwaps([]);
    }
  };
  
  // Handle batch action
  const handleBatchAction = (action: 'approve' | 'reject') => {
    if (selectedSwaps.length === 0) return;
    
    setConfirmAction(action);
    setRejectionReason('');
    setIsBatchActionOpen(true);
  };
  
  // Confirm batch action
  const handleConfirmBatchAction = () => {
    if (!confirmAction) return;
    
    setSwapRequests(prev => 
      prev.map(swap => 
        selectedSwaps.includes(swap.id) 
          ? { 
              ...swap, 
              status: confirmAction, 
              notes: confirmAction === 'rejected' ? rejectionReason : swap.notes 
            } 
          : swap
      )
    );
    
    toast({
      title: confirmAction === 'approve' ? "Swaps Approved" : "Swaps Rejected",
      description: `${selectedSwaps.length} swap request${selectedSwaps.length > 1 ? 's' : ''} have been ${confirmAction === 'approve' ? 'approved' : 'rejected'}.`
    });
    
    setIsBatchActionOpen(false);
    setSelectedSwaps([]);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setDepartmentFilter('all');
    setSubDepartmentFilter('all');
    setRoleFilter('all');
    setEmployeeFilter('all');
    setPriorityFilter('all');
    setDateRange(undefined);
    setSelectedDate(undefined);
    
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset."
    });
  };
  
  // Get color based on status
  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };
  
  // Get color based on priority
  const getPriorityColor = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };
  
  // Get department color
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Convention Centre':
        return 'bg-blue-900/20 border-blue-500/20';
      case 'Exhibition Centre':
        return 'bg-green-900/20 border-green-500/20';
      case 'Theatre':
        return 'bg-red-900/20 border-red-500/20';
      default:
        return 'bg-gray-900/20 border-gray-500/20';
    }
  };
  
  // Count active filters
  const activeFilterCount = [
    activeFilter !== 'all' ? 1 : 0,
    departmentFilter !== 'all' ? 1 : 0,
    subDepartmentFilter !== 'all' ? 1 : 0,
    roleFilter !== 'all' ? 1 : 0,
    employeeFilter !== 'all' ? 1 : 0,
    priorityFilter !== 'all' ? 1 : 0,
    dateRange?.from && dateRange?.to ? 1 : 0,
    searchQuery ? 1 : 0
  ].reduce((a, b) => a + b, 0);
  
  // Navigation functions for pagination
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-full" />
        </div>
        
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and view toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-64">
          <ManagementSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            placeholder="Search swap requests..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}>
            <TabsList className="bg-black/20 border border-white/10">
              <TabsTrigger value="list" className="data-[state=active]:bg-white/10">
                List View
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-white/10">
                Calendar View
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-gray-900/95 backdrop-blur-xl border-gray-800">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 text-xs">
                    <X className="mr-1 h-3 w-3" />
                    Clear All
                  </Button>
                </div>
                
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm">Status</label>
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                      {filterOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Department Filter */}
                <div className="space-y-2">
                  <label className="text-sm">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                      {departmentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sub-department Filter */}
                <div className="space-y-2">
                  <label className="text-sm">Sub-department</label>
                  <Select value={subDepartmentFilter} onValueChange={setSubDepartmentFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select sub-department" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                      {subDepartmentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Role Filter */}
                <div className="space-y-2">
                  <label className="text-sm">Role</label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                      {roleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Employee Filter */}
                <div className="space-y-2">
                  <label className="text-sm">Employee</label>
                  <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                      {employeeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Priority Filter */}
                <div className="space-y-2">
                  <label className="text-sm">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm">Date Range</label>
                  <div className="bg-white/5 border border-white/10 rounded-md p-4">
                    <CalendarComponent
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={1}
                      className="mx-auto"
                    />
                    {dateRange?.from && dateRange?.to && (
                      <div className="text-center text-xs text-white/70 mt-2">
                        {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => {
                          const today = new Date();
                          const nextWeek = addDays(today, 7);
                          setDateRange({ from: today, to: nextWeek });
                        }}
                      >
                        Next 7 Days
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => {
                          const today = new Date();
                          const nextMonth = new Date(today);
                          nextMonth.setMonth(nextMonth.getMonth() + 1);
                          setDateRange({ from: today, to: nextMonth });
                        }}
                      >
                        Next 30 Days
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Status filter buttons */}
      <div className="mb-6">
        <ManagementFilter 
          options={filterOptions} 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
      
      {/* Batch actions */}
      {selectedSwaps.length > 0 && (
        <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox 
              checked={paginatedSwaps.every(swap => selectedSwaps.includes(swap.id))}
              onCheckedChange={handleSelectAll}
              className="mr-2"
            />
            <span className="text-sm">{selectedSwaps.length} request{selectedSwaps.length !== 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBatchAction('approve')}
              className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-600/30"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve Selected
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBatchAction('reject')}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-600/30"
            >
              <X className="mr-2 h-4 w-4" />
              Reject Selected
            </Button>
          </div>
        </div>
      )}
      
      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Status: {activeFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setActiveFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {departmentFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Department: {departmentFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setDepartmentFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {subDepartmentFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Sub-department: {subDepartmentFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setSubDepartmentFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {roleFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Role: {roleFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setRoleFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {employeeFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Employee: {employeeFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setEmployeeFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {priorityFilter !== 'all' && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Priority: {priorityFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setPriorityFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {dateRange?.from && dateRange?.to && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Date: {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setDateRange(undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {searchQuery && (
            <Badge variant="outline" className="bg-white/10 gap-1 px-2 py-1">
              Search: {searchQuery}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {activeFilterCount > 1 && (
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="h-7 px-2 py-0 text-xs">
              Clear All Filters
            </Button>
          )}
        </div>
      )}
      
      {/* Empty state */}
      {filteredSwaps.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No swap requests found</h3>
          <p className="text-white/60 mt-2">
            {searchQuery || activeFilter !== 'all' || departmentFilter !== 'all' || subDepartmentFilter !== 'all' || 
             roleFilter !== 'all' || employeeFilter !== 'all' || priorityFilter !== 'all' || 
             (dateRange?.from && dateRange?.to)
              ? "No requests match your search criteria. Try adjusting your filters." 
              : "There are no swap requests in the system yet."}
          </p>
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && filteredSwaps.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-hidden border border-white/10 rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-black/30">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox 
                      checked={paginatedSwaps.length > 0 && paginatedSwaps.every(swap => selectedSwaps.includes(swap.id))}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left">Requestor</th>
                  <th className="p-3 text-left">Recipient</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left">From Date</th>
                  <th className="p-3 text-left">To Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSwaps.map((swap) => (
                  <tr key={swap.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-3">
                      <Checkbox 
                        checked={selectedSwaps.includes(swap.id)}
                        onCheckedChange={() => toggleSwapSelection(swap.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={swap.requestor.avatar} />
                          <AvatarFallback>{swap.requestor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{swap.requestor.name}</div>
                          <div className="text-xs text-white/60">{swap.requestor.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={swap.recipient.avatar} />
                          <AvatarFallback>{swap.recipient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{swap.recipient.name}</div>
                          <div className="text-xs text-white/60">{swap.recipient.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div>{swap.department}</div>
                        {swap.subDepartment && (
                          <div className="text-xs text-white/60">{swap.subDepartment}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div>{swap.fromDate}</div>
                        {swap.fromTime && (
                          <div className="text-xs text-white/60">{swap.fromTime}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div>{swap.toDate}</div>
                        {swap.toTime && (
                          <div className="text-xs text-white/60">{swap.toTime}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(swap.status)}`}>
                        {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      {swap.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(swap.priority)}`}>
                          {swap.priority.charAt(0).toUpperCase() + swap.priority.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(swap)}
                          className="h-8 px-2 py-0"
                        >
                          Details
                        </Button>
                        
                        {swap.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleActionClick(swap, 'approve')}
                              className="h-8 px-2 py-0 bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-600/30"
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleActionClick(swap, 'reject')}
                              className="h-8 px-2 py-0 bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-600/30"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddNote(swap)}
                          className="h-8 px-2 py-0"
                        >
                          Note
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={goToPreviousPage} 
                      className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={goToNextPage} 
                      className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
      
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  if (selectedDate) {
                    setSelectedDate(subDays(selectedDate, 1));
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium">
                {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'Select a date'}
              </h3>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  if (selectedDate) {
                    setSelectedDate(addDays(selectedDate, 1));
                  }
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mx-auto"
              components={{
                Day: ({ date, ...props }) => {
                  // Check if there are swaps on this date
                  const dateStr = format(date, 'MMMM d, yyyy');
                  const hasSwaps = Object.keys(swapsByDate).some(key => {
                    try {
                      return new Date(key).toDateString() === date.toDateString();
                    } catch (e) {
                      return false;
                    }
                  });
                  
                  return (
                    <div
                      {...props}
                      className={cn(
                        props.className,
                        hasSwaps && 'relative'
                      )}
                    >
                      {props.children}
                      {hasSwaps && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  );
                }
              }}
            />
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span>Days with swap requests</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            {selectedDate ? (
              <>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  <Badge className="ml-2" variant="outline">
                    {Object.values(swapsByDate).flat().filter(swap => {
                      try {
                        return new Date(swap.fromDate).toDateString() === selectedDate.toDateString();
                      } catch (e) {
                        return false;
                      }
                    }).length} swaps
                  </Badge>
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(swapsByDate).map(([date, swaps]) => {
                    try {
                      if (new Date(date).toDateString() !== selectedDate.toDateString()) {
                        return null;
                      }
                      
                      return swaps.map(swap => (
                        <Card key={swap.id} className={`${getDepartmentColor(swap.department)}`}>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                              <CardTitle className="text-lg font-medium">Shift Swap Request</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-white/70">{swap.department}</span>
                                {swap.subDepartment && (
                                  <>
                                    <span className="text-xs text-white/40">•</span>
                                    <span className="text-sm text-white/70">{swap.subDepartment}</span>
                                  </>
                                )}
                                <span className="text-xs text-white/40">•</span>
                                <span className="text-sm text-white/70">Submitted on {swap.submittedOn}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(swap.status)}`}>
                                {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                              </span>
                              {swap.priority && (
                                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(swap.priority)}`}>
                                  {swap.priority.charAt(0).toUpperCase() + swap.priority.slice(1)}
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col mt-4 space-y-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={swap.requestor.avatar} />
                                    <AvatarFallback>{swap.requestor.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{swap.requestor.name}</div>
                                    <div className="text-xs text-white/60">Requesting swap from</div>
                                  </div>
                                </div>
                                
                                <div className="bg-white/10 px-3 py-1.5 rounded-md">
                                  <span className="text-sm">{swap.fromDate}</span>
                                  {swap.fromTime && (
                                    <span className="text-xs text-white/60 block">{swap.fromTime}</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex justify-center">
                                <div className="bg-white/5 w-0.5 h-6"></div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={swap.recipient.avatar} />
                                    <AvatarFallback>{swap.recipient.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{swap.recipient.name}</div>
                                    <div className="text-xs text-white/60">Swap to</div>
                                  </div>
                                </div>
                                
                                <div className="bg-white/10 px-3 py-1.5 rounded-md">
                                  <span className="text-sm">{swap.toDate}</span>
                                  {swap.toTime && (
                                    <span className="text-xs text-white/60 block">{swap.toTime}</span>
                                  )}
                                </div>
                              </div>
                              
                              {swap.reason && (
                                <div className="mt-2 p-2 bg-white/5 rounded-md">
                                  <div className="text-xs text-white/60">Reason:</div>
                                  <div className="text-sm">{swap.reason}</div>
                                </div>
                              )}
                              
                              {swap.notes && (
                                <div className="mt-2 p-2 bg-white/5 rounded-md">
                                  <div className="text-xs text-white/60">Notes:</div>
                                  <div className="text-sm">{swap.notes}</div>
                                </div>
                              )}
                              
                              <div className="flex justify-end space-x-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewDetails(swap)}
                                >
                                  View Details
                                </Button>
                                
                                {swap.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleActionClick(swap, 'approve')}
                                      className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-600/30"
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleActionClick(swap, 'reject')}
                                      className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-600/30"
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ));
                    } catch (e) {
                      return null;
                    }
                  })}
                  
                  {Object.values(swapsByDate).flat().filter(swap => {
                    try {
                      return new Date(swap.fromDate).toDateString() === selectedDate.toDateString();
                    } catch (e) {
                      return false;
                    }
                  }).length === 0 && (
                    <Card className="bg-gray-800/50 h-64 flex items-center justify-center">
                      <CardContent className="text-center text-gray-400">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No swap requests</h3>
                        <p>No swap requests found for this date.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Card className="bg-gray-800/50 h-64 flex items-center justify-center">
                <CardContent className="text-center text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No date selected</h3>
                  <p>Select a date from the calendar to see swap requests.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      
      {/* Swap Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
          <DialogHeader>
            <DialogTitle>Swap Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedSwap && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedSwap.requestor.avatar} />
                    <AvatarFallback>{selectedSwap.requestor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedSwap.requestor.name}</div>
                    <div className="text-sm text-white/60">
                      <div>Requesting swap from</div>
                      <div className="mt-1 bg-white/10 px-3 py-1.5 rounded-md">
                        {selectedSwap.fromDate}
                        {selectedSwap.fromTime && (
                          <span className="text-xs text-white/60 block">{selectedSwap.fromTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-white/5 w-0.5 h-6"></div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedSwap.recipient.avatar} />
                    <AvatarFallback>{selectedSwap.recipient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedSwap.recipient.name}</div>
                    <div className="text-sm text-white/60">
                      <div>Swap to</div>
                      <div className="mt-1 bg-white/10 px-3 py-1.5 rounded-md">
                        {selectedSwap.toDate}
                        {selectedSwap.toTime && (
                          <span className="text-xs text-white/60 block">{selectedSwap.toTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-white/60">Department</p>
                  <p className="font-medium">{selectedSwap.department}</p>
                  {selectedSwap.subDepartment && (
                    <p className="text-sm text-white/60">{selectedSwap.subDepartment}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-white/60">Status</p>
                  <p className="font-medium capitalize">{selectedSwap.status}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Submitted On</p>
                  <p className="font-medium">{selectedSwap.submittedOn}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Priority</p>
                  <p className="font-medium capitalize">{selectedSwap.priority || 'Normal'}</p>
                </div>
              </div>
              
              {selectedSwap.reason && (
                <div>
                  <p className="text-sm text-white/60">Reason</p>
                  <p className="p-3 bg-white/5 rounded mt-1">{selectedSwap.reason}</p>
                </div>
              )}
              
              {selectedSwap.notes && (
                <div>
                  <p className="text-sm text-white/60">Notes</p>
                  <p className="p-3 bg-white/5 rounded mt-1">{selectedSwap.notes}</p>
                </div>
              )}
              
              {selectedSwap.status === 'pending' && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleActionClick(selectedSwap, 'reject');
                    }}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-600/30"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleActionClick(selectedSwap, 'approve');
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Note Modal */}
      <Dialog open={isAddNoteModalOpen} onOpenChange={setIsAddNoteModalOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea 
                id="note" 
                value={noteText} 
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add your notes here..."
                className="bg-white/5 border-white/10 min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Action Modal */}
      <Dialog open={isConfirmActionOpen} onOpenChange={setIsConfirmActionOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approve' ? 'Approve Swap Request' : 'Reject Swap Request'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'approve' 
                ? 'Are you sure you want to approve this swap request?' 
                : 'Please provide a reason for rejecting this swap request.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {confirmAction === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Textarea 
                  id="rejectionReason" 
                  value={rejectionReason} 
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmActionOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAction}
              className={confirmAction === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'}
            >
              {confirmAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Batch Action Modal */}
      <Dialog open={isBatchActionOpen} onOpenChange={setIsBatchActionOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approve' ? 'Approve Selected Requests' : 'Reject Selected Requests'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'approve' 
                ? `Are you sure you want to approve ${selectedSwaps.length} swap request${selectedSwaps.length > 1 ? 's' : ''}?` 
                : `Please provide a reason for rejecting ${selectedSwaps.length} swap request${selectedSwaps.length > 1 ? 's' : ''}.`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {confirmAction === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="batchRejectionReason">Rejection Reason</Label>
                <Textarea 
                  id="batchRejectionReason" 
                  value={rejectionReason} 
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchActionOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmBatchAction}
              className={confirmAction === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'}
            >
              {confirmAction === 'approve' ? 'Approve All' : 'Reject All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SwapRequestsContent;