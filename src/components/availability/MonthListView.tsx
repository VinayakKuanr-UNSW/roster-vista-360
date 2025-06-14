
import React from 'react';
import { format } from 'date-fns';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface MonthListViewProps {
  onSelectDate: (date: Date) => void;
}

export function MonthListView({ onSelectDate }: MonthListViewProps) {
  const {
    selectedMonth,
    monthlyAvailabilities,
    getDayStatusColor,
    deleteAvailability,
    isDateLocked
  } = useAvailabilities();
  
  const { toast } = useToast();
  
  const sortedAvailabilities = React.useMemo(() => {
    return [...monthlyAvailabilities].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [monthlyAvailabilities]);
  
  const handleDelete = async (dateStr: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const date = new Date(dateStr);
    
    if (isDateLocked(date)) {
      toast({
        title: "Cannot Delete",
        description: "This date is locked and cannot be modified.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await deleteAvailability(date);
    if (success) {
      toast({
        title: "Availability Deleted",
        description: `Availability for ${format(date, 'MMMM dd, yyyy')} has been removed.`,
      });
    }
  };
  
  if (sortedAvailabilities.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium">No availabilities set for {format(selectedMonth, 'MMMM yyyy')}</h3>
        <p className="text-muted-foreground mt-2">
          Click the "Add Availability" button to set your availability.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Availabilities for {format(selectedMonth, 'MMMM yyyy')}
      </h2>
      
      <div className="space-y-2">
        {sortedAvailabilities.map((availability) => {
          const date = new Date(availability.date);
          const locked = isDateLocked(date);
          
          return (
            <div 
              key={availability.date} 
              className={cn(
                "p-4 border rounded-lg bg-card flex justify-between items-center cursor-pointer hover:bg-muted/30 transition-colors group",
                locked && "opacity-60"
              )}
              onClick={() => !locked && onSelectDate(date)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</h4>
                  
                  {locked && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-amber-500">
                            <AlertTriangle size={16} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Date locked - past cutoff</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className={cn(
                    "font-normal",
                    getDayStatusColor(availability.status)
                  )}>
                    {availability.status}
                  </Badge>
                  
                  {availability.timeSlots && availability.timeSlots.map((slot, i) => (
                    <Badge key={i} variant="outline">
                      {slot.startTime} - {slot.endTime}
                    </Badge>
                  ))}
                </div>
                
                {availability.notes && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {availability.notes}
                  </p>
                )}
              </div>
              
              {!locked && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDelete(availability.date, e)}
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
