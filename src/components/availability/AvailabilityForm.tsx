import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2, Clock, Circle } from 'lucide-react';
import { TimeSlot, DayAvailability } from '@/api/models/types';

interface AvailabilityFormProps {
  selectedDate: Date;
  onSubmit: (data: {
    timeSlots: Omit<TimeSlot, 'id'>[];
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
  existingAvailability?: DayAvailability;
}

export function AvailabilityForm({
  selectedDate,
  onSubmit,
  onCancel,
  existingAvailability,
}: AvailabilityFormProps) {
  const [timeSlots, setTimeSlots] = useState<Omit<TimeSlot, 'id'>[]>(
    existingAvailability?.timeSlots
      ? existingAvailability.timeSlots.map(
          ({ startTime, endTime, status }) => ({
            startTime,
            endTime,
            status,
          })
        )
      : [{ startTime: '09:00', endTime: '17:00', status: 'Available' }]
  );
  const [notes, setNotes] = useState(existingAvailability?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { startTime: '09:00', endTime: '17:00', status: 'Available' },
    ]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (
    index: number,
    field: keyof Omit<TimeSlot, 'id'>,
    value: string
  ) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
  };

  const getStatusIcon = (status: string) => {
    const baseClass = 'h-3 w-3';
    if (status === 'Available')
      return (
        <Circle
          className={`${baseClass} text-green-500 drop-shadow-glow`}
          fill="currentColor"
        />
      );
    if (status === 'Unavailable')
      return (
        <Circle
          className={`${baseClass} text-red-500 drop-shadow-glow`}
          fill="currentColor"
        />
      );
    return (
      <Circle
        className={`${baseClass} text-yellow-400 drop-shadow-glow`}
        fill="currentColor"
      />
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ timeSlots, notes });
    setIsSubmitting(false);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Set Availability</DialogTitle>
          <DialogDescription>
            Set your availability for{' '}
            <strong>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Time Slots
            </h3>

            {timeSlots.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No time slots added yet.
              </p>
            )}

            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-md space-y-3 bg-muted/10 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="grid grid-cols-5 gap-3 items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateTimeSlot(index, 'startTime', e.target.value)
                      }
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    to
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        updateTimeSlot(index, 'endTime', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <Select
                    value={slot.status}
                    onValueChange={(value) =>
                      updateTimeSlot(index, 'status', value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">
                        <div className="flex items-center gap-2">
                          {getStatusIcon('Available')}
                          Available
                        </div>
                      </SelectItem>
                      <SelectItem value="Unavailable">
                        <div className="flex items-center gap-2">
                          {getStatusIcon('Unavailable')}
                          Unavailable
                        </div>
                      </SelectItem>
                      <SelectItem value="Partial">
                        <div className="flex items-center gap-2">
                          {getStatusIcon('Partial')}
                          Partial
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {timeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeTimeSlot(index)}
                      title="Remove slot"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeSlot}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </label>
            <Textarea
              id="notes"
              placeholder="e.g. Available till 3PM due to class"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <div className="text-xs text-muted-foreground text-right">
              {notes.length}/200
            </div>
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
