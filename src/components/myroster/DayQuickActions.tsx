
import React from 'react';
import { Plus, Edit, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DayQuickActionsProps {
  onAddShift: () => void;
  onEditShift: () => void;
  onViewDetails: () => void;
  hasShifts: boolean;
}

const DayQuickActions: React.FC<DayQuickActionsProps> = ({
  onAddShift,
  onEditShift,
  onViewDetails,
  hasShifts
}) => {
  return (
    <TooltipProvider>
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 bg-black/50 hover:bg-black/70 text-white border border-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onAddShift();
              }}
            >
              <Plus size={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add shift</TooltipContent>
        </Tooltip>
        
        {hasShifts && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 bg-black/50 hover:bg-black/70 text-white border border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditShift();
                  }}
                >
                  <Edit size={12} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit shifts</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 bg-black/50 hover:bg-black/70 text-white border border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails();
                  }}
                >
                  <Info size={12} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View details</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

export default DayQuickActions;
