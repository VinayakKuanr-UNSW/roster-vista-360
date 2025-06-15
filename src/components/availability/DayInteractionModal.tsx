
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
  const [quickAction, setQuickAction] = useState<'available' | 'unavailable' | 'custom'>('custom');

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
    if (action === 'available') {
      setTimeSlots([{
        id: Math.random().toString(36).substring(2, 11),
        startTime: '09:00',
        endTime: '17:00',
        status: 'Available'
      }]);
    } else {
      setTimeSlots([{
        id: Math.random().toString(36).substring(2, 11),
        startTime: '00:00',
        endTime: '23:59',
        status: 'Unavailable'
      }]);
    }
    setQuickAction(action);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Availability for {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            <div className="flex gap-2">
              <Button
                type="button"
                variant={quickAction === 'available' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleQuickAction('available')}
                disabled={isLocked}
                className="flex-1"
              >
                🟩 Fully Available
              </Button>
              <Button
                type="button"
                variant={quickAction === 'unavailable' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleQuickAction('unavailable')}
                disabled={isLocked}
                className="flex-1"
              >
                🟥 Fully Unavailable
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

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {timeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                    disabled={isLocked}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                    disabled={isLocked}
                    className="w-20"
                  />
                  <select
                    value={slot.status}
                    onChange={(e) => updateTimeSlot(slot.id, 'status', e.target.value)}
                    disabled={isLocked}
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
                    onClick={() => removeTimeSlot(slot.id)}
                    disabled={isLocked}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {hasExistingData && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isLocked}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Availability
            </Button>
          )}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLocked || timeSlots.length === 0}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
