
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, Award, CheckCircle } from 'lucide-react';
import { BidWithEmployee, ApplicantTag } from './types/bid-types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getApplicantTag, checkApplicantConflicts } from './utils/bidUtils';

interface ApplicantItemProps {
  applicant: BidWithEmployee;
  handleOfferShift: (bid: BidWithEmployee) => void;
  isShiftFilled: boolean;
  allBids: BidWithEmployee[];
}

const ApplicantItem: React.FC<ApplicantItemProps> = ({ applicant, handleOfferShift, isShiftFilled, allBids }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Get applicant's tag
  const tag: ApplicantTag | null = getApplicantTag(applicant, allBids);
  
  // Check for scheduling conflicts
  const { hasConflict, conflictReason } = checkApplicantConflicts(applicant, allBids);
  
  // Format the created time for display
  const formatBidTime = () => {
    try {
      const bidDate = new Date(applicant.createdAt);
      return bidDate.toLocaleDateString(undefined, { 
        month: 'short', day: 'numeric'
      }) + ' at ' + bidDate.toLocaleTimeString(undefined, { 
        hour: '2-digit', minute: '2-digit' 
      });
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  // Get initials from employee name
  const getInitials = (): string => {
    if (!applicant.employee) return '??';
    
    const name = applicant.employee.name || `${applicant.employee.firstName || ''} ${applicant.employee.lastName || ''}`;
    
    if (!name.trim()) return '??';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Process offer action
  const handleOfferConfirm = () => {
    handleOfferShift(applicant);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={applicant.employee?.avatar} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div>
            <h5 className="font-medium text-white">
              {applicant.employee?.name || applicant.employee?.firstName || 'Unknown Employee'}
            </h5>
            <div className="flex items-center text-xs text-white/70">
              <Clock className="mr-1 h-3.5 w-3.5" />
              <span>Applied {formatBidTime()}</span>
            </div>
            <div className="flex items-center text-xs text-white/70">
              <Award className="mr-1 h-3.5 w-3.5" />
              <span>{applicant.employee?.tier || 'N/A'} {applicant.employee?.role && `• ${applicant.employee.role}`}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          {tag && (
            <span className={`text-xs px-2 py-1 rounded-full text-white ${tag.color}`} title={tag.tooltip}>
              {tag.text}
            </span>
          )}
          
          <Button
            variant={hasConflict ? "outline" : "default"}
            size="sm"
            className={hasConflict ? "border-red-500 text-red-500 hover:bg-red-900/20" : ""}
            disabled={isShiftFilled || applicant.status === 'Approved' || applicant.status === 'Rejected'}
            onClick={() => setShowConfirmDialog(true)}
          >
            {hasConflict ? (
              <>
                <AlertCircle className="mr-1 h-4 w-4" />
                Conflict
              </>
            ) : applicant.status === 'Approved' ? (
              <>
                <CheckCircle className="mr-1 h-4 w-4" />
                Offered
              </>
            ) : (
              'Offer Shift'
            )}
          </Button>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {hasConflict ? 'Schedule Conflict Detected' : 'Confirm Shift Offer'}
            </DialogTitle>
            <DialogDescription>
              {hasConflict ? (
                <div className="text-red-500 flex items-start mt-2 mb-1">
                  <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Warning: Scheduling Conflict</p>
                    <p>{conflictReason || 'This employee has a scheduling conflict with this shift.'}</p>
                  </div>
                </div>
              ) : (
                <>
                  Are you sure you want to offer this shift to{' '}
                  <span className="font-medium">
                    {applicant.employee?.name || applicant.employee?.firstName || 'this employee'}
                  </span>?
                </>
              )}
              
              <p className="mt-2">
                {hasConflict 
                  ? 'You can still offer the shift, but the employee may not be able to fulfill it.' 
                  : 'This will reject all other applications for this shift.'
                }
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOfferConfirm} variant={hasConflict ? "destructive" : "default"}>
              {hasConflict ? 'Offer Anyway' : 'Confirm Offer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicantItem;
