
import React, { useState } from 'react';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AvailabilityStatus } from '@/api/models/types';

interface TimeSlot {
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
}

interface BatchApplyModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (data: {
    startDate: Date;
    endDate: Date;
    timeSlots: TimeSlot[];
    notes?: string;
  }) => void;
  availabilityPresets: Array<{
    id: string;
    name: string;
    timeSlots: Array<{ startTime: string; endTime: string }>;
  }>;
  isLocked?: boolean;
}

export function BatchApplyModal({
  open,
  onClose,
  onApply,
  availabilityPresets,
  isLocked = false
}: BatchApplyModalProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDates(prev => {
      const dateExists = prev.some(d => d.toDateString() === date.toDateString());
      if (dateExists) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return [...prev, date];
      }
    });
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = availabilityPresets.find(p => p.id === presetId);
    if (preset) {
      setTimeSlots(preset.timeSlots.map(slot => ({
        ...slot,
        status: 'Available' as AvailabilityStatus
      })));
    }
  };

  const addCustomTimeSlot = () => {
    setTimeSlots([...timeSlots, {
      startTime: '09:00',
      endTime: '17:00',
      status: 'Available'
    }]);
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    setTimeSlots(slots => slots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(slots => slots.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    if (selectedDates.length === 0 || timeSlots.length === 0) return;

    // Sort dates to get start and end
    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    
    onApply({
      startDate: sortedDates[0],
      endDate: sortedDates[sortedDates.length - 1],
      timeSlots,
      notes: notes.trim() || undefined
    });

    // Reset form
    setSelectedDates([]);
    setTimeSlots([]);
    setNotes('');
    setSelectedPreset('');
  };

  const isValid = selectedDates.length > 0 && timeSlots.length > 0;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Batch Apply Availability
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLocked && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                🔒 Some dates may be locked and cannot be modified.
              </p>
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Select Dates ({selectedDates.length} selected)
            </Label>
            <div className="border rounded-lg p-3">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleDateSelect}
                className="rounded-md"
              />
            </div>
            {selectedDates.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedDates.map((date, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {format(date, 'MMM d')}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Time Configuration */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Configure Time Slots
            </Label>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preset' | 'custom')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preset">Use Preset</TabsTrigger>
                <TabsTrigger value="custom">Custom Times</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preset" className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {availabilityPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      type="button"
                      variant={selectedPreset === preset.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePresetSelect(preset.id)}
                      className="h-auto p-3 text-left"
                    >
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {preset.timeSlots.map(slot => `${slot.startTime}-${slot.endTime}`).join(', ')}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-3">
                <div className="space-y-2">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                        className="w-24"
                      />
                      <select
                        value={slot.status}
                        onChange={(e) => updateTimeSlot(index, 'status', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                        <option value="Partial">Partial</option>
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomTimeSlot}
                    className="w-full"
                  >
                    Add Time Slot
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="batch-notes" className="text-sm font-medium">Notes (Optional)</Label>
            <Textarea
              id="batch-notes"
              placeholder="Add notes for all selected dates..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!isValid}>
            Apply to {selectedDates.length} Date{selectedDates.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
