
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BidWithEmployee } from './types/bid-types';
import ShiftCard from './ShiftCard';

interface ShiftDateGroupProps {
  date: string;
  bids: BidWithEmployee[];
  allBids: BidWithEmployee[];
  handleOfferShift: (bid: BidWithEmployee) => void;
  sortByScore: boolean;
}

const ShiftDateGroup: React.FC<ShiftDateGroupProps> = ({ 
  date, 
  bids, 
  allBids,
  handleOfferShift,
  sortByScore,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedShifts, setExpandedShifts] = useState<Record<string, boolean>>({});
  const formattedDate = format(new Date(date), 'EEEE, MMMM d, yyyy');
  
  // Group bids by shift
  const groupedByShift: Record<string, BidWithEmployee[]> = bids.reduce((acc, bid) => {
    if (!bid.shiftId) return acc;
    
    if (!acc[bid.shiftId]) {
      acc[bid.shiftId] = [];
    }
    
    acc[bid.shiftId].push(bid);
    return acc;
  }, {} as Record<string, BidWithEmployee[]>);
  
  // Toggle specific shift expansion
  const toggleExpandShift = (shiftId: string) => {
    setExpandedShifts(prev => ({
      ...prev,
      [shiftId]: !prev[shiftId]
    }));
  };
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg mb-4">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-medium">{formattedDate}</h3>
          <span className="ml-2 text-white/60 text-sm">
            {Object.keys(groupedByShift).length} shifts
          </span>
        </div>
        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0">
          {Object.entries(groupedByShift).map(([shiftId, shiftsWithBids]) => {
            const firstBid = shiftsWithBids[0];
            if (!firstBid.shiftDetails) return null;
            
            return (
              <ShiftCard
                key={shiftId}
                shiftDetails={firstBid.shiftDetails}
                applicants={shiftsWithBids}
                isExpanded={!!expandedShifts[shiftId]}
                toggleExpand={() => toggleExpandShift(shiftId)}
                handleOfferShift={handleOfferShift}
                sortByScore={sortByScore}
                allBids={allBids}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShiftDateGroup;
