
import React from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BidItem from './BidItem';
import { BidWithEmployee } from './types/bid-types';

interface DateGroupProps {
  date: string;
  bids: BidWithEmployee[];
  isExpanded: boolean;
  toggleExpand: () => void;
  expandedBids: Record<string, boolean>;
  toggleExpandBid: (bidId: string) => void;
  selectedBids: string[];
  toggleSelectBid: (bidId: string) => void;
  getApplicantsForShift: (shiftId: string) => BidWithEmployee[];
  handleOfferShift: (bid: BidWithEmployee) => void;
  sortByScore: boolean;
}

const DateGroup: React.FC<DateGroupProps> = ({
  date,
  bids,
  isExpanded,
  toggleExpand,
  expandedBids,
  toggleExpandBid,
  selectedBids,
  toggleSelectBid,
  getApplicantsForShift,
  handleOfferShift,
  sortByScore
}) => {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 bg-white/5 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <Calendar className="mr-3 h-5 w-5 text-white/60" />
          <h3 className="font-medium">
            {format(new Date(date), 'MMMM d, yyyy')}
            <span className="ml-2 text-sm text-white/60">
              {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
            </span>
          </h3>
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="divide-y divide-white/5">
          {bids.map(bid => (
            <BidItem 
              key={bid.id}
              bid={bid}
              isExpanded={expandedBids[bid.id] || false}
              toggleExpand={() => toggleExpandBid(bid.id)}
              toggleSelect={() => toggleSelectBid(bid.id)}
              isSelected={selectedBids.includes(bid.id)}
              applicants={getApplicantsForShift(bid.shiftId)}
              handleOfferShift={handleOfferShift}
              sortByScore={sortByScore}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DateGroup;
