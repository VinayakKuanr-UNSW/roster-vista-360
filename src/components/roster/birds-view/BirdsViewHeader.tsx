
import React, { useState } from 'react';
import { Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { addDays, addWeeks, format, subWeeks } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface BirdsViewHeaderProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (start: Date, end: Date) => void;
  onSearch: (query: string) => void;
}

export const BirdsViewHeader: React.FC<BirdsViewHeaderProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const { hasPermission } = useAuth();

  const formattedStartDate = format(startDate, 'MMM d, yyyy');
  const formattedEndDate = format(endDate, 'MMM d, yyyy');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handlePreviousWeek = () => {
    const newStart = subWeeks(startDate, 1);
    onDateRangeChange(newStart, subWeeks(endDate, 1));
  };

  const handleNextWeek = () => {
    const newStart = addWeeks(startDate, 1);
    onDateRangeChange(newStart, addWeeks(endDate, 1));
  };

  return (
    <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md py-4">
      <div className="flex flex-col space-y-4 px-4">
        {/* Title + Search */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Birds-view</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="
                pl-10 pr-3 py-2
                bg-neutral-800
                border border-neutral-600
                text-neutral-200
                placeholder:text-neutral-500
                hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500
                transition
                min-w-[200px]
              "
            />
          </div>
        </div>

        {/* Date controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousWeek}
              className="
                h-8 w-8
                border-neutral-600 text-neutral-200
                hover:bg-neutral-700
              "
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="
                    flex items-center gap-2
                    border-neutral-600 text-neutral-200
                    hover:bg-neutral-700
                  "
                >
                  <Calendar className="h-4 w-4" />
                  {formattedStartDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-neutral-900 backdrop-blur-xl border border-neutral-700">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={(d) => {
                    if (d) {
                      const end = d > endDate ? addDays(d, 6) : endDate;
                      onDateRangeChange(d, end);
                      setIsStartDateOpen(false);
                    }
                  }}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>

            <span className="text-neutral-500">to</span>

            <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="
                    flex items-center gap-2
                    border-neutral-600 text-neutral-200
                    hover:bg-neutral-700
                  "
                >
                  <Calendar className="h-4 w-4" />
                  {formattedEndDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-neutral-900 backdrop-blur-xl border border-neutral-700">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={(d) => {
                    if (d) {
                      const start = d < startDate ? d : startDate;
                      onDateRangeChange(start, d);
                      setIsEndDateOpen(false);
                    }
                  }}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextWeek}
              className="
                h-8 w-8
                border-neutral-600 text-neutral-200
                hover:bg-neutral-700
              "
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const today = new Date();
                const start = today;
                onDateRangeChange(start, addDays(start, 6));
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              This Week
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const next = addWeeks(new Date(), 1);
                onDateRangeChange(next, addDays(next, 6));
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Next Week
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
