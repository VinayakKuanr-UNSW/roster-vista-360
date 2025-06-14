
import React from 'react';
import { Button } from '@/components/ui/button';

interface BidStatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const BidStatusFilter: React.FC<BidStatusFilterProps> = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button 
        variant={statusFilter === 'all' ? "outline" : "ghost"} 
        size="sm"
        className={statusFilter === 'all' ? "bg-white/5 border-white/10" : ""}
        onClick={() => setStatusFilter('all')}
      >
        All Bids
      </Button>
      <Button 
        variant={statusFilter === 'Pending' ? "outline" : "ghost"} 
        size="sm"
        className={statusFilter === 'Pending' ? "bg-white/5 border-white/10" : ""}
        onClick={() => setStatusFilter('Pending')}
      >
        Open
      </Button>
      <Button 
        variant={statusFilter === 'Approved' ? "outline" : "ghost"} 
        size="sm"
        className={statusFilter === 'Approved' ? "bg-white/5 border-white/10" : ""}
        onClick={() => setStatusFilter('Approved')}
      >
        Offered
      </Button>
      <Button 
        variant={statusFilter === 'Confirmed' ? "outline" : "ghost"} 
        size="sm"
        className={statusFilter === 'Confirmed' ? "bg-white/5 border-white/10" : ""}
        onClick={() => setStatusFilter('Confirmed')}
      >
        Confirmed
      </Button>
    </div>
  );
};

export default BidStatusFilter;
