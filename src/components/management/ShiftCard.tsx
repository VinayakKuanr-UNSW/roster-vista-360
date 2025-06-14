
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Building, 
  User, 
  Award, 
  ChevronDown, 
  ChevronUp,
  Users,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BidWithEmployee, ShiftDetails } from './types/bid-types';
import { formatTimeRange } from './utils/displayUtils';
import ShiftStatusBadge from './ShiftStatusBadge';
import ApplicantList from './ApplicantList';

interface ShiftCardProps {
  shiftDetails: ShiftDetails;
  applicants: BidWithEmployee[];
  isExpanded: boolean;
  toggleExpand: () => void;
  handleOfferShift: (bid: BidWithEmployee) => void;
  sortByScore: boolean;
  allBids: BidWithEmployee[];
}

const ShiftCard: React.FC<ShiftCardProps> = ({ 
  shiftDetails, 
  applicants, 
  isExpanded, 
  toggleExpand,
  handleOfferShift,
  sortByScore,
  allBids
}) => {
  const [showApplicantList, setShowApplicantList] = useState(false);
  
  const isShiftFilled = shiftDetails.status === 'Filled' || shiftDetails.status === 'Assigned';
  const isDraft = shiftDetails.isDraft;
  
  return (
    <Collapsible open={isExpanded} onOpenChange={toggleExpand}>
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-white">Shift ID: {shiftDetails.id}</h4>
              <ShiftStatusBadge status={shiftDetails.status} />
              {isDraft && (
                <Badge variant="outline" className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                  DRAFT
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
              <div className="flex items-center text-sm text-white/70">
                <Calendar className="mr-2 h-4 w-4 text-white/50" />
                {shiftDetails.date}
              </div>
              
              <div className="flex items-center text-sm text-white/70">
                <Clock className="mr-2 h-4 w-4 text-white/50" />
                {formatTimeRange(shiftDetails.startTime, shiftDetails.endTime)}
              </div>
              
              <div className="flex items-center text-sm text-white/70">
                <Building className="mr-2 h-4 w-4 text-white/50" />
                {shiftDetails.department} {shiftDetails.subDepartment ? `- ${shiftDetails.subDepartment}` : ''}
              </div>
              
              <div className="flex items-center text-sm text-white/70">
                <Award className="mr-2 h-4 w-4 text-white/50" />
                {shiftDetails.role} (Level {shiftDetails.remunerationLevel})
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-1 text-sm">
              <User className="h-4 w-4 text-white/50" />
              <span className="text-white/70">
                {shiftDetails.assignedEmployee || 'Unassigned'}
              </span>
            </div>
            
            <div className="text-xs text-white/60">
              Net Hours: {shiftDetails.netLength} • Break: {shiftDetails.paidBreakDuration} paid / {shiftDetails.unpaidBreakDuration} unpaid
            </div>
          </div>
          
          <div className="flex items-center">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/10"
                disabled={isShiftFilled}
              >
                <Users className="mr-2 h-4 w-4" />
                Applicants ({applicants.length})
                {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        
        {isShiftFilled && (
          <div className="mt-3 py-2 px-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-center text-sm">
            <Award className="h-4 w-4 mr-2 text-green-400" />
            <span>This shift has been filled</span>
          </div>
        )}
        
        <CollapsibleContent>
          <div className="mt-4 pt-4 border-t border-white/10">
            {applicants.length === 0 ? (
              <p className="text-white/60 text-sm">No applicants for this shift yet.</p>
            ) : (
              <ApplicantList 
                applicants={applicants}
                handleOfferShift={handleOfferShift}
                sortByScore={sortByScore}
                isShiftFilled={isShiftFilled}
                allBids={allBids}
              />
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ShiftCard;
