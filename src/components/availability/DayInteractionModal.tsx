
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
    timeSlots: Array<{ startTime: string; endTime: string; status: AvailabilityStatus }>;
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
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleQuickAction = (action: 'available' | 'unavailable') => {
    if (isLocked) return;
    
    const newTimeSlots = action === 'available'
        ? [{ startTime: '09:00', endTime: '17:00', status: 'Available' as AvailabilityStatus }]
        : [{ startTime: '00:00', endTime: '23:59', status: 'Unavailable' as AvailabilityStatus }];

    onSave({
      timeSlots: newTimeSlots,
      notes: undefined
    });
  };

  const handleSave = () => {
    onSave({
      timeSlots: timeSlots.map(({ id, ...slot }) => slot),
      notes: notes.trim() || undefined
    });
  };

  const hasExistingData = existingAvailability && existingAvailability.timeSlots.length > 0;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Availability for {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
          <DialogDescription>
            Set your availability for this day using quick actions or custom time slots.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {isLocked && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                🔒 This date is locked. Changes cannot be made.
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Actions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant='outline'
                onClick={() => handleQuickAction('available')}
                disabled={isLocked}
                className="justify-start"
              >
                <div className="w-3.5 h-3.5 bg-green-500 rounded-full mr-3 border-2 border-green-300" />
                Fully Available
              </Button>
              <Button
                type="button"
                variant='outline'
                onClick={() => handleQuickAction('unavailable')}
                disabled={isLocked}
                className="justify-start"
              >
                <div className="w-3.5 h-3.5 bg-red-500 rounded-full mr-3 border-2 border-red-300" />
                Fully Unavailable
              </Button>
            </div>
          </div>

          {/* Custom Time Slots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Custom Time Slots</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
                disabled={isLocked}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Slot
              </Button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {timeSlots.map((slot) => (
                <div key={slot.id} className="grid grid-cols-1 sm:grid-cols-8 items-center gap-2 p-2 border rounded-lg">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                    disabled={isLocked}
                    className="sm:col-span-2"
                  />
                  <span className="text-sm text-muted-foreground text-center hidden sm:block">to</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                    disabled={isLocked}
                    className="sm:col-span-2"
                  />
                  <div className="sm:col-span-2">
                    <select
                      value={slot.status}
                      onChange={(e) => updateTimeSlot(slot.id, 'status', e.target.value)}
                      disabled={isLocked}
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-ring focus:ring-1 focus:outline-none"
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeSlot(slot.id)}
                    disabled={isLocked}
                    className="sm:col-span-1 justify-self-end"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {timeSlots.length === 0 && (
                 <div className="text-center text-sm text-muted-foreground py-4">
                    No custom time slots added. Use Quick Actions or Add a Slot.
                 </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g., May be late, Only available after 4 PM"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLocked}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-between">
          <div>
            {hasExistingData && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isLocked}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Availability
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLocked || timeSlots.length === 0}
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
