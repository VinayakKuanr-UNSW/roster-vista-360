
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bid, Employee } from '@/api/models/types';
import { useBids } from '@/api/hooks/useBids';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

interface BidDetailsModalProps {
  bid: Bid & { employee?: Employee } | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

const BidDetailsModal: React.FC<BidDetailsModalProps> = ({ 
  bid, 
  isOpen, 
  onClose,
  onStatusUpdate
}) => {
  const { useUpdateBidStatus } = useBids();
  const { mutate: updateStatus, isPending } = useUpdateBidStatus();
  const { toast } = useToast();

  if (!bid) return null;

  const handleUpdateStatus = (status: 'Approved' | 'Rejected') => {
    updateStatus(
      { id: bid.id, status },
      {
        onSuccess: () => {
          toast({
            title: `Bid ${status.toLowerCase()}`,
            description: `The bid has been ${status.toLowerCase()} successfully.`,
          });
          onStatusUpdate();
          onClose();
        },
        onError: () => {
          toast({
            title: "Error",
            description: `Failed to ${status.toLowerCase()} the bid.`,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Bid Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/60">Employee</p>
              <p className="font-medium">{bid.employee?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Status</p>
              <p className="font-medium capitalize">{bid.status}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Shift ID</p>
              <p className="font-medium">{bid.shiftId}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Submitted On</p>
              <p className="font-medium">{new Date(bid.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {bid.notes && (
            <div>
              <p className="text-sm text-white/60">Notes</p>
              <p className="p-3 bg-white/5 rounded mt-1">{bid.notes}</p>
            </div>
          )}
        </div>
        
        {bid.status === 'Pending' && (
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              className="border-white/10 hover:bg-white/10"
              onClick={() => handleUpdateStatus('Rejected')}
              disabled={isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700"
              onClick={() => handleUpdateStatus('Approved')}
              disabled={isPending}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BidDetailsModal;
