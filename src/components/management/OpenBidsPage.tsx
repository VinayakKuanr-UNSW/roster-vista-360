import React, { useState, useEffect } from 'react';
import { useEmployees } from '@/api/hooks/useEmployees';
import { useBids } from '@/api/hooks/useBids';
import { useShifts } from '@/api/hooks/useShifts';
import { processBidsWithDetails } from './utils/bidUtils';
import { BidWithEmployee } from './types/bid-types';
import EnhancedBidCard from './EnhancedBidCard';
import EnhancedManagementHeader from './EnhancedManagementHeader';
import BidFilterPopover from './BidFilterPopover';
import BidSortDropdown from './BidSortDropdown';
import BidCalendarView from './BidCalendarView';
import { motion } from 'framer-motion';

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
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  // Enhanced filtering with search
  const filteredBids = processedBids.filter(bid => {
    const { 
      startDate, endDate, department, subDepartment, role, 
      status, isAssigned, isDraft, minHours, maxHours, remunerationLevel 
    } = filterOptions;
    
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        bid.shiftDetails?.id.toLowerCase().includes(searchLower) ||
        bid.shiftDetails?.department.toLowerCase().includes(searchLower) ||
        bid.shiftDetails?.subDepartment?.toLowerCase().includes(searchLower) ||
        bid.shiftDetails?.role.toLowerCase().includes(searchLower) ||
        bid.employee?.name?.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }
    
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
  ).length + (selectedDate ? 1 : 0) + (searchQuery ? 1 : 0);
  
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
      <div className="p-6 space-y-6">
        <div className="lovable-skeleton h-8 w-64" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="lovable-skeleton h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <EnhancedManagementHeader
        title="Open Bids"
        subtitle="Manage and review shift applications"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFilterClick={() => {}} // BidFilterPopover handles this
        onSortClick={() => {}} // BidSortDropdown handles this
        activeFilterCount={activeFilterCount}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        totalItems={processedBids.length}
        filteredItems={filteredBids.length}
      />
      
      <div className="flex items-center gap-3">
        <BidSortDropdown currentSort={sortOption} onSortChange={setSortOption} />
        <BidFilterPopover 
          filters={filterOptions} 
          onFilterChange={setFilterOptions} 
          activeFilterCount={activeFilterCount}
        />
      </div>
      
      {filteredBids.length === 0 ? (
        <div className="lovable-empty-state">
          <div className="lovable-empty-state-icon">
            📋
          </div>
          <h3 className="text-xl font-medium mb-2">No matching shifts found</h3>
          <p className="text-muted-foreground">
            {processedBids.length === 0 
              ? "No bids have been created yet." 
              : "Try adjusting your filters or search terms to see more results."}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="lovable-stack">
          <motion.div 
            className="lovable-stack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {shiftBids.map((bid, index) => (
              <motion.div
                key={bid.shiftId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <EnhancedBidCard
                  bid={bid}
                  isExpanded={!!expandedItems[bid.shiftId]}
                  onToggleExpand={() => toggleExpand(bid.shiftId)}
                  applicants={bidsByShift[bid.shiftId] || []}
                  onOfferShift={handleOfferShift}
                />
              </motion.div>
            ))}
          </motion.div>
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
