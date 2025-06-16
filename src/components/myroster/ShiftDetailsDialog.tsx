import React, { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CalendarDays, Clock, User, ArrowLeftRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Shift } from '@/api/models/types';
interface ShiftDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Callback that receives the selected employee's ID when a swap request is sent.
   */
  onSwap?: (employeeId: string) => void;
  onCancelShift?: () => void; // Callback to handle shift cancellation logic
  shift?: {
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
    organizationName?: string;
    departmentName?: string;
    subDepartmentName?: string;
  };
}
const ShiftDetailsDialog: React.FC<ShiftDetailsDialogProps> = ({
  isOpen,
  onClose,
  onSwap,
  onCancelShift,
  shift
}) => {
  // State for cancellation confirmation dialog
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  // State for swap request dialog
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  // State for selected employee from dropdown
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  // Dummy list of eligible employees; replace with real data if needed
  const eligibleEmployees = useMemo(() => [{
    id: '1',
    name: 'John Doe'
  }, {
    id: '2',
    name: 'Jane Smith'
  }, {
    id: '3',
    name: 'Alex Johnson'
  }], []);

  // Always call hooks; instead of returning null if no shift data,
  // we render a fallback message. This avoids disrupting the hook order.
  const hasShiftData = shift && shift.shift;

  // Destructure shift details, using defaults if data is missing.
  const organizationName = shift?.organizationName || 'ICC Sydney';
  const departmentName = shift?.departmentName || shift?.groupName || '';
  const subDepartmentName = shift?.subDepartmentName || shift?.subGroupName || '';
  const groupName = shift?.groupName || 'Unknown Group';
  const groupColor = shift?.groupColor || 'gray';
  const subGroupName = shift?.subGroupName || 'Unknown Sub-Group';
  const role = shift?.shift?.role || 'Unknown Role';
  const startTime = shift?.shift?.startTime;
  const endTime = shift?.shift?.endTime;
  const breakDuration = shift?.shift?.breakDuration;
  const status = shift?.shift?.status || 'Scheduled';
  const notes = shift?.shift?.notes || '';
  const remunerationLevel = shift?.shift?.remunerationLevel || '';

  // Memoize formatted dates to avoid re-computation on every render.
  const formattedStartTime = useMemo(() => {
    if (!startTime) return 'Invalid time';
    try {
      return formatTime(startTime);
    } catch (e) {
      return 'Invalid time';
    }
  }, [startTime]);
  const formattedEndTime = useMemo(() => {
    if (!endTime) return 'Invalid time';
    try {
      return formatTime(endTime);
    } catch (e) {
      return 'Invalid time';
    }
  }, [endTime]);

  // Helper function to format time
  function formatTime(timeStr: string): string {
    // Handle ISO format or just time format
    const timePart = timeStr.includes('T') ? timeStr.split('T')[1].substring(0, 5) : timeStr;
    const [hours, minutes] = timePart.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  // Utility function: get background class based on groupColor.
  const getBgColorClass = useCallback((color: string) => {
    switch (color.toLowerCase()) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'red':
        return 'bg-red-500';
      case 'purple':
        return 'bg-purple-500';
      case 'sky':
        return 'bg-sky-500';
      default:
        return 'bg-gray-700';
    }
  }, []);
  const bgClass = getBgColorClass(groupColor);

  // Handlers for cancellation flow.
  const handleCancelClick = useCallback(() => {
    setIsCancelConfirmOpen(true);
  }, []);
  const handleConfirmCancel = useCallback(() => {
    if (onCancelShift) {
      onCancelShift();
    }
    setIsCancelConfirmOpen(false);
    onClose();
  }, [onCancelShift, onClose]);
  const handleCloseCancelConfirm = useCallback(() => {
    setIsCancelConfirmOpen(false);
  }, []);

  // Handlers for swap flow.
  const handleSwapClick = useCallback(() => {
    setIsSwapDialogOpen(true);
  }, []);
  const handleSendSwapRequest = useCallback(() => {
    if (selectedEmployee && onSwap) {
      onSwap(selectedEmployee);
    }
    setIsSwapDialogOpen(false);
  }, [selectedEmployee, onSwap]);
  const handleCloseSwapDialog = useCallback(() => {
    setIsSwapDialogOpen(false);
  }, []);
  return <>
      {/* Main Shift Details Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn("max-w-md text-white border border-gray-800", bgClass)}>
          {hasShiftData ? <>
              <DialogHeader>
                <div className="mb-2 text-sm">
                  <span className="font-semibold">Organization:</span> {organizationName} | 
                  <span className="font-semibold ml-1">Department:</span> {departmentName} | 
                  <span className="font-semibold ml-1">Sub-Department:</span> {subDepartmentName}
                </div>
                <div className="mb-2 inline-block bg-black/20 py-1 px-3 rounded-full text-xs">
                  {groupName}
                </div>
                <DialogTitle className="text-xl font-bold">{role}</DialogTitle>
                <DialogDescription className="text-gray-200">{subGroupName}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {/* Date & Time Section */}
                <div className="flex items-center gap-3">
                  <Clock className="text-gray-300" size={18} />
                  <div>
                    <div className="font-medium">
                      {formattedStartTime} - {formattedEndTime}
                    </div>
                    <div className="text-sm text-gray-300">
                      Paid Break: {breakDuration || 'N/A'}
                    </div>
                  </div>
                </div>
                
                {/* Shift Status */}
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-gray-300" size={18} />
                  <div className="font-medium">{status}</div>
                </div>
                
                {/* Remuneration Level */}
                <div className="flex items-center gap-3">
                  <User className="text-gray-300" size={18} />
                  <div className="font-medium">
                    Remuneration Level: {remunerationLevel || 'N/A'}
                  </div>
                </div>
                
                {/* Notes */}
                {notes && <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-medium mb-2">Notes</h4>
                    <p className="text-sm text-gray-300">{notes}</p>
                  </div>}
              </div>
              
              {/* Action Buttons */}
              <DialogFooter className="mt-6 flex justify-end gap-3">
                <Button onClick={onClose} variant="outline" className="bg-black/20 border-white/20 hover:bg-black/30">
                  Close
                </Button>
                <Button onClick={handleSwapClick} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <ArrowLeftRight size={16} className="mr-2" /> Swap Shift
                </Button>
                <Button onClick={handleCancelClick} className="bg-red-600 hover:bg-red-500 rounded-full text-white font-normal text-base mx-0 my-0 py-0 px-[10px]">
                  <X size={16} className="mr-2" /> Cancel Shift
                </Button>
              </DialogFooter>
            </> : <div className="text-center">
              <DialogTitle>No shift data available</DialogTitle>
              <Button onClick={onClose} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                Close
              </Button>
            </div>}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent className="max-w-md border border-gray-800 p-4 bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Confirm Cancel
            </DialogTitle>
            <DialogDescription className="text-gray-200">
              Are you sure you want to cancel this shift?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button onClick={handleCloseCancelConfirm} className="bg-gray-600 hover:bg-gray-700 text-white">
              No, Go Back
            </Button>
            <Button onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Swap Request Dialog */}
      <Dialog open={isSwapDialogOpen} onOpenChange={setIsSwapDialogOpen}>
        <DialogContent className="max-w-md border border-gray-800 p-4 bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Swap Shift Request
            </DialogTitle>
            <DialogDescription className="text-gray-200">
              Please select an eligible employee to swap your shift.
            </DialogDescription>
          </DialogHeader>
          
          {/* Dropdown for selecting eligible employee */}
          <div className="mt-4">
            <label htmlFor="swap-employee" className="block text-sm font-medium mb-1">
              Eligible Employees
            </label>
            <select id="swap-employee" className="w-full p-2 text-black rounded" value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
              <option value="">Select an employee</option>
              {eligibleEmployees.map(emp => <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>)}
            </select>
          </div>

          {/* Action Buttons for swap request */}
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button onClick={handleCloseSwapDialog} className="bg-gray-600 hover:bg-gray-700 text-white">
              No, Go Back
            </Button>
            <Button onClick={handleSendSwapRequest} className="bg-green-600 hover:bg-green-700 text-white">
              Send Swap Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default ShiftDetailsDialog;