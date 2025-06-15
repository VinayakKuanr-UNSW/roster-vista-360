
import React, { useState, useMemo } from 'react';
import { format, isToday, isTomorrow, isYesterday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Trash2, AlertTriangle, Calendar, Clock, Edit, Plus } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface MonthListViewProps {
  onSelectDate: (date: Date) => void;
}

type SortOption = 'date-asc' | 'date-desc' | 'status' | 'recent';
type FilterOption = 'all' | 'available' | 'unavailable' | 'partial' | 'locked';

export function MonthListView({ onSelectDate }: MonthListViewProps) {
  const {
    selectedMonth,
    monthlyAvailabilities,
    getDayStatusColor,
    deleteAvailability,
    isDateLocked
  } = useAvailabilities();
  
  const { toast } = useToast();
  
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Generate all days of the month for gap detection
  const allDaysInMonth = useMemo(() => {
    const start = startOfWeek(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1));
    const end = endOfWeek(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0));
    return eachDayOfInterval({ start, end }).filter(date => 
      date.getMonth() === selectedMonth.getMonth()
    );
  }, [selectedMonth]);
  
  // Find days without availability
  const daysWithoutAvailability = useMemo(() => {
    return allDaysInMonth.filter(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return !monthlyAvailabilities.some(avail => avail.date === dateStr);
    });
  }, [allDaysInMonth, monthlyAvailabilities]);
  
  const sortedAndFilteredAvailabilities = useMemo(() => {
    let filtered = [...monthlyAvailabilities];
    
    // Apply filters
    if (filterBy !== 'all') {
      if (filterBy === 'locked') {
        filtered = filtered.filter(availability => 
          isDateLocked(new Date(availability.date))
        );
      } else {
        filtered = filtered.filter(availability => 
          availability.status.toLowerCase() === filterBy
        );
      }
    }
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(availability => 
        format(new Date(availability.date), 'EEEE, MMMM d, yyyy')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        availability.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        availability.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'recent':
          // Sort by creation/modification date (mock with date for now)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  }, [monthlyAvailabilities, sortBy, filterBy, searchQuery, isDateLocked]);
  
  const getRelativeDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return null;
  };
  
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
  
  const handleQuickAdd = (date: Date) => {
    onSelectDate(date);
  };
  
  const stats = useMemo(() => {
    const total = monthlyAvailabilities.length;
    const available = monthlyAvailabilities.filter(a => a.status.toLowerCase() === 'available').length;
    const unavailable = monthlyAvailabilities.filter(a => a.status.toLowerCase() === 'unavailable').length;
    const partial = monthlyAvailabilities.filter(a => a.status.toLowerCase() === 'partial').length;
    const locked = monthlyAvailabilities.filter(a => isDateLocked(new Date(a.date))).length;
    
    return { total, available, unavailable, partial, locked, gaps: daysWithoutAvailability.length };
  }, [monthlyAvailabilities, isDateLocked, daysWithoutAvailability]);
  
  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Availabilities for {format(selectedMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{stats.total} set, {stats.gaps} missing</span>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-green-600">{stats.available}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-red-600">{stats.unavailable}</div>
            <div className="text-xs text-muted-foreground">Unavailable</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-yellow-600">{stats.partial}</div>
            <div className="text-xs text-muted-foreground">Partial</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-amber-600">{stats.locked}</div>
            <div className="text-xs text-muted-foreground">Locked</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-blue-600">{stats.gaps}</div>
            <div className="text-xs text-muted-foreground">Missing</div>
          </Card>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Input
            placeholder="Search by date, status, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:max-w-xs"
          />
          
          <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {sortedAndFilteredAvailabilities.length} of {monthlyAvailabilities.length} shown
        </div>
      </div>
      
      {/* Missing Dates Alert */}
      {stats.gaps > 0 && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-800">
                {stats.gaps} dates missing availability
              </h4>
              <p className="text-sm text-orange-700">
                Consider setting availability for all dates in {format(selectedMonth, 'MMMM yyyy')}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              Fill Gaps
            </Button>
          </div>
        </Card>
      )}
      
      {/* Availability List */}
      {sortedAndFilteredAvailabilities.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {monthlyAvailabilities.length === 0 
              ? `No availabilities set for ${format(selectedMonth, 'MMMM yyyy')}`
              : 'No matches found'
            }
          </h3>
          <p className="text-muted-foreground mb-4">
            {monthlyAvailabilities.length === 0 
              ? 'Click the "Add Availability" button to set your availability.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="mr-2"
            >
              Clear Search
            </Button>
          )}
          {filterBy !== 'all' && (
            <Button 
              variant="outline" 
              onClick={() => setFilterBy('all')}
            >
              Clear Filter
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedAndFilteredAvailabilities.map((availability) => {
            const date = new Date(availability.date);
            const locked = isDateLocked(date);
            const relativeLabel = getRelativeDateLabel(date);
            
            return (
              <Card 
                key={availability.date} 
                className={cn(
                  "p-4 cursor-pointer hover:shadow-md transition-all duration-200 group",
                  locked && "opacity-60 bg-gray-50",
                  "border-l-4",
                  availability.status.toLowerCase() === 'available' && "border-l-green-500",
                  availability.status.toLowerCase() === 'unavailable' && "border-l-red-500",
                  availability.status.toLowerCase() === 'partial' && "border-l-yellow-500"
                )}
                onClick={() => !locked && onSelectDate(date)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-base leading-tight">
                          {format(date, 'EEEE, MMMM d, yyyy')}
                        </h4>
                        {relativeLabel && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {relativeLabel}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
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
                        
                        <Badge className={cn(
                          "font-normal text-white",
                          getDayStatusColor(availability.status)
                        )}>
                          {availability.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Time Slots */}
                    {availability.timeSlots && availability.timeSlots.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        {availability.timeSlots.map((slot, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {slot.startTime} - {slot.endTime}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Notes */}
                    {availability.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {availability.notes}
                      </p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 ml-4">
                    {!locked && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectDate(date);
                                }}
                              >
                                <Edit size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit availability</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => handleDelete(availability.date, e)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete availability</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Quick Add for Missing Dates */}
      {daysWithoutAvailability.length > 0 && filterBy === 'all' && !searchQuery && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium mb-3 text-blue-800">Quick Add Missing Dates</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {daysWithoutAvailability.slice(0, 14).map((date) => (
              <Button
                key={format(date, 'yyyy-MM-dd')}
                variant="outline"
                size="sm"
                className="h-auto p-2 border-blue-300 text-blue-700 hover:bg-blue-100 flex flex-col"
                onClick={() => handleQuickAdd(date)}
              >
                <Plus className="h-3 w-3 mb-1" />
                <span className="text-xs font-medium">
                  {format(date, 'MMM d')}
                </span>
                <span className="text-xs text-blue-600">
                  {format(date, 'EEE')}
                </span>
              </Button>
            ))}
          </div>
          {daysWithoutAvailability.length > 14 && (
            <p className="text-sm text-blue-600 mt-2">
              And {daysWithoutAvailability.length - 14} more dates...
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
