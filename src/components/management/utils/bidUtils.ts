
import { BidWithEmployee, ApplicantTag } from '../types/bid-types';
import { Employee, Bid } from '@/api/models/types';
import { shiftService } from '@/api/services/shiftService';

// Function to load and process all bids with employee data
export const processBidsWithDetails = async (
  bids: Bid[],
  employees: Employee[]
): Promise<BidWithEmployee[]> => {
  try {
    // Create a map of employees by ID for quick lookup
    const employeeMap = new Map<string, Employee>();
    employees.forEach(employee => {
      employeeMap.set(employee.id, employee);
    });

    // Process each bid to include employee data
    const processedBids = await Promise.all(
      bids.map(async bid => {
        // Find the employee for this bid
        const employee = employeeMap.get(bid.employeeId);

        // Get shift details
        let shiftDetails = null;
        try {
          shiftDetails = await shiftService.getShiftById(bid.shiftId);
        } catch (error) {
          console.error(`Error getting shift details for shift ${bid.shiftId}:`, error);
        }

        // Return the bid with employee data
        return {
          ...bid,
          employee,
          shiftDetails
        } as BidWithEmployee;
      })
    );

    return processedBids;
  } catch (error) {
    console.error('Error processing bids with details:', error);
    return [];
  }
};

// Function to format shift time display
export const formatShiftTime = (
  startTime: string,
  endTime: string
): string => {
  try {
    // Format start time
    const [startHour, startMinute] = startTime.split(':');
    const startHourNum = parseInt(startHour);
    const startTimeStr = `${startHourNum > 12 ? startHourNum - 12 : startHourNum}:${startMinute}${
      startHourNum >= 12 ? 'PM' : 'AM'
    }`;

    // Format end time
    const [endHour, endMinute] = endTime.split(':');
    const endHourNum = parseInt(endHour);
    const endTimeStr = `${endHourNum > 12 ? endHourNum - 12 : endHourNum}:${endMinute}${
      endHourNum >= 12 ? 'PM' : 'AM'
    }`;

    return `${startTimeStr} – ${endTimeStr}`;
  } catch (error) {
    console.error('Error formatting shift time:', error);
    return `${startTime} – ${endTime}`;
  }
};

// Function to get color for shift status
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'filled':
    case 'assigned':
      return 'bg-green-500 hover:bg-green-600';
    case 'cancelled':
      return 'bg-red-500 hover:bg-red-600';
    case 'offered':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'completed':
      return 'bg-gray-500 hover:bg-gray-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

// Function to get applicant tag based on various criteria
export const getApplicantTag = (
  applicant: BidWithEmployee,
  allBids: BidWithEmployee[]
): ApplicantTag | null => {
  // Check if this is the first applicant (earliest timestamp)
  const isFirstToApply = allBids.every(
    bid => bid.id === applicant.id || new Date(bid.createdAt) > new Date(applicant.createdAt)
  );

  // Check if applicant has a high tier/score
  const hasHighScore = Number(applicant.employee?.tier) >= 4;

  // Check if applicant has other offers
  const hasOtherOffers = allBids.some(
    bid =>
      bid.id !== applicant.id &&
      bid.employeeId === applicant.employeeId &&
      bid.status === 'Approved'
  );

  // Assign tag based on above checks
  if (hasHighScore) {
    return {
      text: 'Highly Qualified',
      color: 'bg-green-700',
      tooltip: 'This employee has a high qualification score'
    };
  } else if (isFirstToApply) {
    return {
      text: 'First to Apply',
      color: 'bg-blue-700',
      tooltip: 'This employee was the first to apply for this shift'
    };
  } else if (hasOtherOffers) {
    return {
      text: 'Has Other Offers',
      color: 'bg-yellow-700',
      tooltip: 'This employee has been offered other shifts'
    };
  }

  return null;
};

// Check for applicant conflicts (scheduling, etc.)
export const checkApplicantConflicts = (
  applicant: BidWithEmployee,
  allBids: BidWithEmployee[]
): { hasConflict: boolean; conflictReason: string } => {
  // Default - no conflict
  let hasConflict = false;
  let conflictReason = '';

  // Skip if no shift details
  if (!applicant.shiftDetails) {
    return { hasConflict, conflictReason };
  }

  // Check for time conflicts with other shifts
  const conflictingBids = allBids.filter(bid => {
    // Skip if same bid or no shift details
    if (bid.id === applicant.id || !bid.shiftDetails) return false;

    // Skip if not approved/confirmed or doesn't belong to same employee
    if (
      (bid.status !== 'Approved' && bid.status !== 'Confirmed') ||
      bid.employeeId !== applicant.employeeId
    ) {
      return false;
    }

    // Skip if not on same date
    if (bid.shiftDetails.date !== applicant.shiftDetails!.date) return false;

    // Check for time overlap
    const bidStart = timeToMinutes(bid.shiftDetails.startTime);
    const bidEnd = timeToMinutes(bid.shiftDetails.endTime);
    const applicantStart = timeToMinutes(applicant.shiftDetails!.startTime);
    const applicantEnd = timeToMinutes(applicant.shiftDetails!.endTime);

    // Overlap occurs when:
    // - One shift starts during another shift, or
    // - One shift ends during another shift
    return (
      (bidStart <= applicantStart && applicantStart < bidEnd) ||
      (bidStart < applicantEnd && applicantEnd <= bidEnd) ||
      (applicantStart <= bidStart && bidStart < applicantEnd) ||
      (applicantStart < bidEnd && bidEnd <= applicantEnd)
    );
  });

  if (conflictingBids.length > 0) {
    hasConflict = true;
    conflictReason = `Schedule conflict with ${conflictingBids.length} other shift(s) on the same day.`;
  }

  return { hasConflict, conflictReason };
};

// Helper function: Convert time string (HH:MM) to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
