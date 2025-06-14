import React from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  PlusCircle, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, subDays } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimesheetHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: 'table' | 'group') => void;
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
  onNewEntry: () => void;
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({
  selectedDate,
  onDateChange,
  onViewChange,
  onNewEntry,
  onExport,
  onRefresh,
  isRefreshing
}) => {
  const goToPreviousDay = () => {
    const newDate = subDays(selectedDate, 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    onDateChange(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Calendar className="mr-2 text-primary" size={24} />
          <h1 className="text-2xl font-bold">Timesheets</h1>
        </div>

        <div className="flex flex-wrap gap-2 ml-auto">
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
            onClick={onNewEntry}
          >
            <PlusCircle className="mr-1.5 h-4 w-4" />
            New Entry
          </Button>

          <Button 
            variant="default"
            className="bg-primary hover:bg-primary/90" 
            size="sm"
            onClick={onExport}
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Date Navigation and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center bg-black/20 p-2 rounded-md border border-white/10">
          <Button 
            variant="ghost"
            size="icon"
            onClick={goToPreviousDay}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2 font-medium text-sm">
            {format(selectedDate, 'MMM dd, yyyy')}
          </span>
          <Button 
            variant="ghost"
            size="icon"
            onClick={goToNextDay}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="table" className="w-auto">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger 
              value="table" 
              className="data-[state=active]:bg-white/10"
              onClick={() => onViewChange('table')}
            >
              Table
            </TabsTrigger>
            <TabsTrigger 
              value="group" 
              className="data-[state=active]:bg-white/10"
              onClick={() => onViewChange('group')}
            >
              Group
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};