
import React from 'react';
import { Award, Clock, ChevronUp, ChevronDown, Users, CalendarDays, Briefcase, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import BidStatusBadge from './BidStatusBadge';
import ApplicantList from './ApplicantList';
import { BidWithEmployee } from './types/bid-types';
import { formatShiftTime, getStatusColor } from './utils/bidUtils';

interface BidItemProps {
  bid: BidWithEmployee;
  isExpanded: boolean;
  toggleExpand: () => void;
  toggleSelect: () => void;
  isSelected: boolean;
  applicants: BidWithEmployee[];
  handleOfferShift: (bid: BidWithEmployee) => void;
  sortByScore: boolean;
}

const BidItem: React.FC<BidItemProps> = ({ 
  bid, 
  isExpanded, 
  toggleExpand,
  toggleSelect,
  isSelected,
  applicants,
  handleOfferShift,
  sortByScore
}) => {
  // Check if the shift is filled (has an employee assigned or status is filled)
  const isShiftFilled = 
    bid.shiftDetails?.assignedEmployee !== null && 
    bid.shiftDetails?.assignedEmployee !== undefined && 
    bid.shiftDetails?.assignedEmployee !== '' ||
    bid.shiftDetails?.status === 'Filled';
  
  // Format the shift's date
  const formatShiftDate = () => {
    try {
      const date = new Date(bid.shiftDetails?.date || '');
      return date.toLocaleDateString(undefined, { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return bid.shiftDetails?.date || 'Unknown date';
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={toggleExpand}>
      <div className={`p-4 transition-colors rounded-lg mb-3 ${isExpanded ? 'bg-gray-900' : 'hover:bg-gray-900/50 bg-gray-800'}`}>
        <div className="flex items-start justify-between">
          <div className="flex">
            <input
              type="checkbox"
              className="mr-3 mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              checked={isSelected}
              onChange={toggleSelect}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-medium text-white">
                  {bid.shiftDetails?.department} - {bid.shiftDetails?.role}
                </h4>
                
                {bid.shiftDetails?.isDraft && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    DRAFT
                  </Badge>
                )}
                
                <Badge className={getStatusColor(bid.shiftDetails?.status || 'Unknown')}>
                  {bid.shiftDetails?.status || 'Unknown'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 mt-1">
                <div className="flex items-center text-sm text-white/70">
                  <CalendarDays className="mr-1 h-3.5 w-3.5 text-white/50" />
                  {formatShiftDate()}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Clock className="mr-1 h-3.5 w-3.5 text-white/50" />
                  {bid.shiftDetails && formatShiftTime(bid.shiftDetails.startTime, bid.shiftDetails.endTime)}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Briefcase className="mr-1 h-3.5 w-3.5 text-white/50" />
                  {bid.shiftDetails?.subDepartment || 'No Sub-Department'}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <MapPin className="mr-1 h-3.5 w-3.5 text-white/50" />
                  Shift ID: {bid.shiftId}
                </div>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-sm">
                <div className="text-purple-400 font-medium">
                  Level: {bid.shiftDetails?.remunerationLevel}
                </div>
                <div className="text-white/70">
                  Break: {bid.shiftDetails?.paidBreakDuration}
                </div>
                <div className="text-white/70">
                  Assigned: {bid.shiftDetails?.assignedEmployee || 'Unassigned'}
                </div>
                <div className="text-white/70">
                  Net Length: {bid.shiftDetails?.netLength}h
                </div>
              </div>
            </div>
          </div>
          
          <CollapsibleTrigger asChild>
            <Button 
              variant={isExpanded ? "default" : "outline"}
              size="sm" 
              className={isExpanded ? "" : "border-white/10 min-w-[120px]"}
            >
              <Users className="mr-2 h-4 w-4" />
              Applicants ({applicants.length})
              {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="mt-4 pt-4 border-t border-white/10">
            {isShiftFilled && (
              <div className="mb-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg flex items-center text-sm text-purple-300">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">This shift has been filled</p>
                  <p className="text-xs">Assigned to: {bid.shiftDetails?.assignedEmployee}</p>
                </div>
              </div>
            )}
            
            <ApplicantList 
              applicants={applicants}
              handleOfferShift={handleOfferShift}
              sortByScore={sortByScore}
              isShiftFilled={isShiftFilled}
              allBids={[bid, ...applicants]} // Include current bid for context
            />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default BidItem;
