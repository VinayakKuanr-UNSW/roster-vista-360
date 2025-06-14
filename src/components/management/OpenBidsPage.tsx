
import React, { useState, useEffect } from 'react';
import { useEmployees } from '@/api/hooks/useEmployees';
import { useBids } from '@/api/hooks/useBids';
import { useShifts } from '@/api/hooks/useShifts';
import { processBidsWithDetails } from './utils/bidUtils';
import { BidWithEmployee } from './types/bid-types';
import BidItem from './BidItem';
import BidFilterPopover from './BidFilterPopover';
import BidSortDropdown from './BidSortDropdown';
import BidCalendarView from './BidCalendarView';
import { Button } from '@/components/ui/button';
import { Calendar, LayoutGrid, List } from 'lucide-react';

const OpenBidsPage: React.FC = () => {
  // State for all bids with employee data
  const [processedBids, setProcessedBids] = useState<BidWithEmployee[]>([]);
  
  // State for expanded items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // State for selected items (not needed anymore but keeping for compatibility)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  
  // State for sort option
  const [sortOption, setSortOption] = useState({
    id: 'date',
    name: 'Date',
    value: 'date' as keyof BidWithEmployee['shiftDetails'] | 'timestamp' | 'suitabilityScore',
    direction: 'asc' as 'asc' | 'desc'
  });
  
  // State for filter options
  const [filterOptions, setFilterOptions] = useState<any>({});
  
  // State for view mode (list or calendar)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // State for calendar selected date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Get employees and bids from our hooks
  const { useAllEmployees } = useEmployees();
  const { data: employees = [] } = useAllEmployees();
  
  const { useAllBids, useUpdateBidStatus } = useBids();
  const { data: bids = [], isLoading: bidsLoading } = useAllBids();
  const { mutateAsync: updateBidStatus } = useUpdateBidStatus();
  
  const { useUpdateShiftStatus } = useShifts();
  const { mutateAsync: updateShiftStatus } = useUpdateShiftStatus();
  
  // Process bids on load
  useEffect(() => {
    const fetchAndProcessBids = async () => {
      if (!bidsLoading && bids.length > 0 && employees.length > 0) {
        try {
          const processed = await processBidsWithDetails(bids, employees);
          setProcessedBids(processed);
        } catch (error) {
          console.error('Error processing bids:', error);
        }
      }
    };
    
    fetchAndProcessBids();
  }, [bids, employees, bidsLoading]);
  
  // Load filter state from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('bidFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        
        // Convert date strings back to Date objects
        if (parsedFilters.startDate) {
          parsedFilters.startDate = new Date(parsedFilters.startDate);
        }
        if (parsedFilters.endDate) {
          parsedFilters.endDate = new Date(parsedFilters.endDate);
        }
        
        setFilterOptions(parsedFilters);
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
    
    const savedSortOption = localStorage.getItem('bidSortOption');
    if (savedSortOption) {
      try {
        setSortOption(JSON.parse(savedSortOption));
      } catch (error) {
        console.error('Error loading saved sort option:', error);
      }
    }
    
    const savedViewMode = localStorage.getItem('bidViewMode');
    if (savedViewMode === 'list' || savedViewMode === 'calendar') {
      setViewMode(savedViewMode);
    }
  }, []);
  
  // Save filter state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bidFilters', JSON.stringify(filterOptions));
  }, [filterOptions]);
  
  // Save sort option to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bidSortOption', JSON.stringify(sortOption));
  }, [sortOption]);
  
  // Save view mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bidViewMode', viewMode);
  }, [viewMode]);
  
  // Filter bids
  const filteredBids = processedBids.filter(bid => {
    const { 
      startDate, endDate, department, subDepartment, role, 
      status, isAssigned, isDraft, minHours, maxHours, remunerationLevel 
    } = filterOptions;
    
    // Date filter
    if (startDate && bid.shiftDetails?.date && new Date(bid.shiftDetails.date) < startDate) {
      return false;
    }
    
    if (endDate && bid.shiftDetails?.date && new Date(bid.shiftDetails.date) > endDate) {
      return false;
    }
    
    // Department filter
    if (department && bid.shiftDetails?.department !== department) {
      return false;
    }
    
    // Sub-department filter
    if (subDepartment && bid.shiftDetails?.subDepartment !== subDepartment) {
      return false;
    }
    
    // Role filter
    if (role && bid.shiftDetails?.role !== role) {
      return false;
    }
    
    // Status filter
    if (status && bid.shiftDetails?.status !== status) {
      return false;
    }
    
    // Assigned filter
    if (isAssigned !== undefined) {
      const hasAssignee = !!bid.shiftDetails?.assignedEmployee;
      if (isAssigned !== hasAssignee) {
        return false;
      }
    }
    
    // Draft filter
    if (isDraft !== undefined && bid.shiftDetails?.isDraft !== isDraft) {
      return false;
    }
    
    // Hours filter
    if (minHours !== undefined || maxHours !== undefined) {
      const hours = Number(bid.shiftDetails?.netLength || 0);
      if ((minHours !== undefined && hours < minHours) || 
          (maxHours !== undefined && hours > maxHours)) {
        return false;
      }
    }
    
    // Remuneration level filter
    if (remunerationLevel && bid.shiftDetails?.remunerationLevel !== remunerationLevel) {
      return false;
    }
    
    // Calendar date filter
    if (selectedDate && viewMode === 'calendar') {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      if (bid.shiftDetails?.date !== selectedDateStr) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort bids
  const sortedBids = [...filteredBids].sort((a, b) => {
    const { value, direction } = sortOption;
    const modifier = direction === 'asc' ? 1 : -1;
    
    if (value === 'timestamp') {
      // Sort by timestamp
      return modifier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (value === 'suitabilityScore') {
      // Sort by suitability score (using tier as a proxy)
      const scoreA = Number(a.employee?.tier || 0);
      const scoreB = Number(b.employee?.tier || 0);
      return modifier * (scoreB - scoreA);
    } else if (a.shiftDetails && b.shiftDetails) {
      // Sort by shift details
      const aValue = a.shiftDetails[value];
      const bValue = b.shiftDetails[value];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return modifier * aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return modifier * (aValue - bValue);
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return modifier * (aValue === bValue ? 0 : aValue ? 1 : -1);
      }
    }
    
    return 0;
  });
  
  // Count active filters
  const activeFilterCount = Object.values(filterOptions).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length + (selectedDate ? 1 : 0);
  
  // Handle offer shift
  const handleOfferShift = async (bid: BidWithEmployee) => {
    try {
      // Update bid status to Approved
      await updateBidStatus({
        id: bid.id,
        status: 'Approved'
      });
      
      // Also update shift status to Offered/Filled and assign employee
      if (bid.shiftDetails) {
        await updateShiftStatus({
          id: bid.shiftDetails.id,
          status: 'Filled',
          assignedEmployee: bid.employeeId
        });
      }
      
      // Refresh the data
      const processed = await processBidsWithDetails(bids, employees);
      setProcessedBids(processed);
    } catch (error) {
      console.error('Error offering shift:', error);
      // We would show an error toast here in a real app
    }
  };
  
  // Group bids by shift ID
  const bidsByShift: Record<string, BidWithEmployee[]> = {};
  sortedBids.forEach(bid => {
    if (!bidsByShift[bid.shiftId]) {
      bidsByShift[bid.shiftId] = [];
    }
    bidsByShift[bid.shiftId].push(bid);
  });
  
  // Get unique shift IDs from processed bids
  const shiftIds = [...new Set(sortedBids.map(bid => bid.shiftId))];
  
  // Get one representative bid for each shift
  const shiftBids = shiftIds.map(shiftId => 
    sortedBids.find(bid => bid.shiftId === shiftId)
  ).filter(Boolean) as BidWithEmployee[];
  
  // Toggle expanded state for a bid
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Toggle selected state for a bid
  const toggleSelect = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Loading state
  if (bidsLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl mb-4">Open Bids</h2>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">Open Bids</h2>
        
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          </div>
          
          <BidSortDropdown currentSort={sortOption} onSortChange={setSortOption} />
          <BidFilterPopover 
            filters={filterOptions} 
            onFilterChange={setFilterOptions} 
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>
      
      {filteredBids.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-10 text-center">
          <h3 className="text-xl font-medium mb-2">No matching shifts found</h3>
          <p className="text-white/70">
            {processedBids.length === 0 
              ? "No bids have been created yet." 
              : "Try adjusting your filters to see more results."}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div>
          <p className="mb-4 text-white/70">
            Showing {filteredBids.length} of {processedBids.length} total shifts
          </p>
          
          <div className="space-y-2">
            {shiftBids.map((bid) => (
              <BidItem
                key={bid.shiftId}
                bid={bid}
                isExpanded={!!expandedItems[bid.shiftId]}
                toggleExpand={() => toggleExpand(bid.shiftId)}
                isSelected={!!selectedItems[bid.id]}
                toggleSelect={() => toggleSelect(bid.id)}
                applicants={bidsByShift[bid.shiftId] || []}
                handleOfferShift={handleOfferShift}
                sortByScore={sortOption.value === 'suitabilityScore'}
              />
            ))}
          </div>
        </div>
      ) : (
        <BidCalendarView 
          bids={filteredBids}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default OpenBidsPage;
