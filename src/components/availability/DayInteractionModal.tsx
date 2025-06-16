
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DayAvailability, AvailabilityStatus } from '@/api/models/types';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
}

interface DayInteractionModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  existingAvailability?: DayAvailability;
  onSave: (data: {
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      status: AvailabilityStatus;
    }>;
    notes?: string;
  }) => void;
  onDelete?: () => void;
  isLocked?: boolean;
}

export function DayInteractionModal({
  open,
  onClose,
  selectedDate,
  existingAvailability,
  onSave,
  onDelete,
  isLocked = false
}: DayInteractionModalProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [notes, setNotes] = useState('');

  // Generate 15-minute interval options for 24-hour format
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    if (existingAvailability) {
      setTimeSlots(existingAvailability.timeSlots.map(slot => ({
        ...slot,
        id: slot.id || Math.random().toString(36).substring(2, 11)
      })));
      setNotes(existingAvailability.notes || '');
    } else {
      setTimeSlots([]);
      setNotes('');
    }
  }, [existingAvailability, open]);

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Math.random().toString(36).substring(2, 11),
      startTime: '09:00',
      endTime: '17:00',
      status: 'Available'
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setTimeSlots(timeSlots.map(slot => slot.id === id ? {
      ...slot,
      [field]: value
    } : slot));
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleQuickAction = (action: 'available' | 'unavailable') => {
    if (isLocked) return;
    const newTimeSlots = action === 'available' ? [{
      startTime: '00:00',
      endTime: '23:59',
      status: 'Available' as AvailabilityStatus
    }] : [{
      startTime: '00:00',
      endTime: '23:59',
      status: 'Unavailable' as AvailabilityStatus
    }];
    onSave({
      timeSlots: newTimeSlots,
      notes: undefined
    });
  };

  const handleSave = () => {
    onSave({
      timeSlots: timeSlots.map(({
        id,
        ...slot
      }) => slot),
      notes: notes.trim() || undefined
    });
  };

  const hasExistingData = existingAvailability && existingAvailability.timeSlots.length > 0;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
            <Clock className="h-6 w-6 text-primary" />
            Availability for {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Set your availability for this day using quick actions or custom time slots.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 pt-4">
          {isLocked && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-800">
                🔒 This date is locked. Changes cannot be made.
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-foreground">Quick Actions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant='outline' 
                onClick={() => handleQuickAction('available')} 
                disabled={isLocked} 
                className="justify-start h-12 text-base border-green-200 hover:bg-green-50"
              >
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3 border-2 border-green-300" />
                Fully Available
              </Button>
              <Button 
                type="button" 
                variant='outline' 
                onClick={() => handleQuickAction('unavailable')} 
                disabled={isLocked} 
                className="justify-start h-12 text-base border-red-200 hover:bg-red-50"
              >
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3 border-2 border-red-300" />
                Fully Unavailable
              </Button>
            </div>
          </div>

          {/* Custom Time Slots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-foreground">Custom Time Slots</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="default" 
                onClick={addTimeSlot} 
                disabled={isLocked}
                className="h-10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Slot
              </Button>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {timeSlots.map(slot => (
                <div key={slot.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4">
                    {/* Start Time */}
                    <div className="lg:col-span-3">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Start Time</Label>
                      <Select
                        value={slot.startTime}
                        onValueChange={(value) => updateTimeSlot(slot.id, 'startTime', value)}
                        disabled={isLocked}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* End Time */}
                    <div className="lg:col-span-3">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">End Time</Label>
                      <Select
                        value={slot.endTime}
                        onValueChange={(value) => updateTimeSlot(slot.id, 'endTime', value)}
                        disabled={isLocked}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-4">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                      <Select
                        value={slot.status}
                        onValueChange={(value) => updateTimeSlot(slot.id, 'status', value)}
                        disabled={isLocked}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full" />
                              Available
                            </div>
                          </SelectItem>
                          <SelectItem value="Unavailable">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full" />
                              Unavailable
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Delete Button */}
                    <div className="lg:col-span-2 flex justify-end">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => removeTimeSlot(slot.id)} 
                        disabled={isLocked}
                        className="h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {timeSlots.length === 0 && (
                <div className="text-center text-base text-muted-foreground py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  No custom time slots added. Use Quick Actions or Add a Slot.
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-semibold text-foreground">Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="e.g., May be late, Only available after 4 PM" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              disabled={isLocked} 
              rows={3}
              className="text-base resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-between">
          <div>
            {hasExistingData && onDelete && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={onDelete} 
                disabled={isLocked}
                className="h-11"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Availability
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLocked || timeSlots.length === 0}
              className="h-11 px-6"
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
