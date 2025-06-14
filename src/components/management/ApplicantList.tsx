
import React from 'react';
import { BidWithEmployee } from './types/bid-types';
import ApplicantItem from './ApplicantItem';

interface ApplicantListProps {
  applicants: BidWithEmployee[];
  handleOfferShift: (bid: BidWithEmployee) => void;
  sortByScore: boolean;
  isShiftFilled: boolean;
  allBids: BidWithEmployee[];
}

const ApplicantList: React.FC<ApplicantListProps> = ({ 
  applicants, 
  handleOfferShift,
  sortByScore,
  isShiftFilled,
  allBids
}) => {
  // Sort applicants based on score or timestamp
  const sortedApplicants = [...applicants].sort((a, b) => {
    if (sortByScore) {
      // Convert tier to number for comparison
      const scoreA = Number(a.employee?.tier || 0);
      const scoreB = Number(b.employee?.tier || 0);
      return scoreB - scoreA; // Higher score first
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Earlier first
    }
  });

  if (sortedApplicants.length === 0) {
    return (
      <div className="p-4 text-center text-white/70 italic">
        No applicants found for this shift.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
      {sortedApplicants.map((applicant) => (
        <ApplicantItem
          key={applicant.id}
          applicant={applicant}
          handleOfferShift={handleOfferShift}
          isShiftFilled={isShiftFilled}
          allBids={allBids}
        />
      ))}
    </div>
  );
};

export default ApplicantList;
