import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BirdsViewHeader } from '@/components/roster/birds-view/BirdsViewHeader';
import { BirdsViewGrid } from '@/components/roster/birds-view/BirdsViewGrid';
import { addDays, format, startOfWeek, endOfWeek } from 'date-fns';
import { useRosters } from '@/api/hooks';
import { useToast } from '@/hooks/use-toast';

const BirdsViewPage: React.FC = () => {
  /* ───────── state ───────── */
  const [startDate, setStartDate] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [endDate, setEndDate] = useState<Date>(() =>
    endOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [searchQuery, setSearchQuery] = useState('');

  /* ───────── data ───────── */
  const { useRostersByDateRange } = useRosters();
  const { toast } = useToast();

  const { data: rosters, isLoading } = useRostersByDateRange(
    format(startDate, 'yyyy-MM-dd'),
    format(endDate,   'yyyy-MM-dd')
  );

  /* ───────── handlers ───────── */
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = (query: string) => setSearchQuery(query);

  /* ───────── render ───────── */
  return (
    <DndProvider backend={HTML5Backend}>
      {/* full-viewport flex column */}
      <div className="flex flex-col h-screen">
        {/* glass panel + padding wrapper */}
        <div className="flex-1 p-4 md:p-6 flex flex-col min-h-0">
          <div className="glass-panel flex flex-col flex-1 min-h-0
                          p-4 md:p-6 rounded-lg bg-black/20 backdrop-blur-sm
                          border border-white/10">
            <BirdsViewHeader
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
              onSearch={handleSearch}
            />

            {/* grid wrapper now fills remaining space */}
            <div className="mt-6 flex-1 min-h-0 overflow-auto">
              <BirdsViewGrid
                startDate={startDate}
                endDate={endDate}
                rosters={rosters || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default BirdsViewPage;
