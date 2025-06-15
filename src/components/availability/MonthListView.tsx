
import React, { useState, useMemo } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Plus, Calendar } from 'lucide-react';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface MonthListViewProps {
  onSelectDate: (date: Date) => void;
}

export function MonthListView({ onSelectDate }: MonthListViewProps) {
  const {
    selectedMonth,
    monthlyAvailabilities,
    getDayAvailability,
    getDayStatusColor,
    isDateLocked,
    applyPreset,
    availabilityPresets
  } = useAvailabilities();
  
  const { toast } = useToast();
  const [selectedPresets, setSelectedPresets] = useState<Record<string, string>>({});
  
  // Generate all days of the month
  const allDaysInMonth = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  }, [selectedMonth]);
  
  const getRelativeDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return null;
  };
  
  const handleAddAvailability = (date: Date) => {
    onSelectDate(date);
  };
  
  const handleApplyPreset = async (date: Date, presetId: string) => {
    if (!presetId) return;
    
    const success = await applyPreset({
      presetId,
      startDate: date,
      endDate: date
    });
    
    if (success) {
      toast({
        title: "Preset Applied",
        description: `Applied preset to ${format(date, 'MMMM dd, yyyy')}`,
      });
      
      // Clear the selection
      const dateKey = format(date, 'yyyy-MM-dd');
      setSelectedPresets(prev => ({ ...prev, [dateKey]: '' }));
    }
  };
  
  const handlePresetChange = (date: Date, presetId: string) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setSelectedPresets(prev => ({ ...prev, [dateKey]: presetId }));
    
    if (presetId) {
      handleApplyPreset(date, presetId);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Availabilities for {format(selectedMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{allDaysInMonth.length} days</span>
        </div>
      </div>
      
      {/* Date Cards List */}
      <div className="space-y-3">
        {allDaysInMonth.map((date) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const existingAvailability = getDayAvailability(date);
          const locked = isDateLocked(date);
          const relativeLabel = getRelativeDateLabel(date);
          
          return (
            <Card 
              key={dateKey}
              className={cn(
                "p-4 transition-all duration-200",
                locked && "opacity-60 bg-gray-50",
                existingAvailability && "border-l-4",
                existingAvailability?.status.toLowerCase() === 'available' && "border-l-green-500",
                existingAvailability?.status.toLowerCase() === 'unavailable' && "border-l-red-500",
                existingAvailability?.status.toLowerCase() === 'partial' && "border-l-yellow-500"
              )}
            >
              <div className="flex items-center justify-between">
                {/* Date Information */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium text-base">
                        {format(date, 'EEEE, MMMM d, yyyy')}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {relativeLabel && (
                          <Badge variant="secondary" className="text-xs">
                            {relativeLabel}
                          </Badge>
                        )}
                        {existingAvailability && (
                          <Badge className={cn(
                            "text-xs text-white",
                            getDayStatusColor(existingAvailability.status)
                          )}>
                            {existingAvailability.status}
                          </Badge>
                        )}
                        {!existingAvailability && (
                          <Badge variant="outline" className="text-xs">
                            No availability set
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Time Slots Preview */}
                  {existingAvailability?.timeSlots && existingAvailability.timeSlots.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {existingAvailability.timeSlots.map((slot, i) => (
                        <span key={i} className="mr-3">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Notes Preview */}
                  {existingAvailability?.notes && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {existingAvailability.notes}
                    </p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Preset Selector */}
                  <Select
                    value={selectedPresets[dateKey] || ''}
                    onValueChange={(value) => handlePresetChange(date, value)}
                    disabled={locked}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Apply preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityPresets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Add/Edit Availability Button */}
                  <Button
                    onClick={() => handleAddAvailability(date)}
                    disabled={locked}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {existingAvailability ? 'Edit' : 'Add'} Availability
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
