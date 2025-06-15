
import React, { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isEqual, isToday, parseISO } from 'date-fns';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, Filter, 
  Download, Bell, Clock, Users, AlertTriangle, CheckCircle, X,
  Eye, Edit, Trash2, Star, Mail, Phone, MessageSquare, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DayPicker } from 'react-day-picker';
import { BidWithEmployee } from './types/bid-types';
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BidCalendarViewProps {
  bids: BidWithEmployee[];
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const BidCalendarView: React.FC<BidCalendarViewProps> = ({ 
  bids,
  onDateSelect,
  selectedDate
}) => {
  // State for current month
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // State for selected bids for bulk actions
  const [selectedBids, setSelectedBids] = useState<Set<string>>(new Set());
  
  // State for dialogs
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  
  // Get the current month's range
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Filter bids based on search and filters
  const filteredBids = useMemo(() => {
    return bids.filter(bid => {
      const matchesSearch = searchTerm === '' || 
        bid.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.shiftDetails?.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.shiftDetails?.department?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || bid.status === statusFilter;
      
      const matchesDepartment = departmentFilter === 'all' || 
        bid.shiftDetails?.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [bids, searchTerm, statusFilter, priorityFilter, departmentFilter]);
  
  // Count bids for each day
  const bidsByDate = useMemo(() => {
    const counts: Record<string, BidWithEmployee[]> = {};
    
    filteredBids.forEach(bid => {
      if (bid.shiftDetails?.date) {
        const dateKey = bid.shiftDetails.date;
        if (!counts[dateKey]) {
          counts[dateKey] = [];
        }
        counts[dateKey].push(bid);
      }
    });
    
    return counts;
  }, [filteredBids]);
  
  // Calculate statistics
  const stats = useMemo(() => {
    const totalBids = filteredBids.length;
    const pendingBids = filteredBids.filter(bid => bid.status === 'Pending').length;
    const approvedBids = filteredBids.filter(bid => bid.status === 'Approved').length;
    const rejectedBids = filteredBids.filter(bid => bid.status === 'Rejected').length;
    const urgentBids = filteredBids.filter(bid => {
      const shiftDate = bid.shiftDetails?.date ? new Date(bid.shiftDetails.date) : null;
      return shiftDate && shiftDate <= new Date(Date.now() + 24 * 60 * 60 * 1000); // Within 24 hours
    }).length;
    
    return { totalBids, pendingBids, approvedBids, rejectedBids, urgentBids };
  }, [filteredBids]);
  
  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = new Set(bids.map(bid => bid.shiftDetails?.department).filter(Boolean));
    return Array.from(depts);
  }, [bids]);
  
  // Handle next month
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // Handle previous month
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  // Handle bid selection for bulk actions
  const toggleBidSelection = (bidId: string) => {
    const newSelected = new Set(selectedBids);
    if (newSelected.has(bidId)) {
      newSelected.delete(bidId);
    } else {
      newSelected.add(bidId);
    }
    setSelectedBids(newSelected);
  };
  
  // Handle select all for current date
  const handleSelectAllForDate = (dateKey: string) => {
    const dateBids = bidsByDate[dateKey] || [];
    const newSelected = new Set(selectedBids);
    const allSelected = dateBids.every(bid => selectedBids.has(bid.id));
    
    if (allSelected) {
      dateBids.forEach(bid => newSelected.delete(bid.id));
    } else {
      dateBids.forEach(bid => newSelected.add(bid.id));
    }
    setSelectedBids(newSelected);
  };
  
  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setShowBulkActionDialog(true);
  };
  
  // Execute bulk action
  const executeBulkAction = () => {
    console.log(`Executing ${bulkAction} on ${selectedBids.size} bids`);
    // Here you would implement the actual bulk action logic
    setShowBulkActionDialog(false);
    setBulkAction('');
    setSelectedBids(new Set());
  };
  
  // Export calendar data
  const handleExport = () => {
    const dataToExport = filteredBids.map(bid => ({
      employee: bid.employee?.name || 'Unknown',
      role: bid.shiftDetails?.role || 'Unknown',
      department: bid.shiftDetails?.department || 'Unknown',
      date: bid.shiftDetails?.date || 'Unknown',
      startTime: bid.shiftDetails?.startTime || 'Unknown',
      endTime: bid.shiftDetails?.endTime || 'Unknown',
      status: bid.status,
      createdAt: bid.createdAt
    }));
    
    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bids-calendar-${format(currentMonth, 'yyyy-MM')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  // Get priority level for a bid
  const getBidPriority = (bid: BidWithEmployee) => {
    const shiftDate = bid.shiftDetails?.date ? new Date(bid.shiftDetails.date) : null;
    if (!shiftDate) return 'low';
    
    const daysUntilShift = Math.ceil((shiftDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilShift <= 1) return 'urgent';
    if (daysUntilShift <= 3) return 'high';
    if (daysUntilShift <= 7) return 'medium';
    return 'low';
  };
  
  // Custom day cell renderer
  const customDayContent = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayBids = bidsByDate[dateKey] || [];
    const bidCount = dayBids.length;
    
    const hasUrgentBids = dayBids.some(bid => getBidPriority(bid) === 'urgent');
    const hasPendingBids = dayBids.some(bid => bid.status === 'Pending');
    const hasSelectedBids = dayBids.some(bid => selectedBids.has(bid.id));
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative h-full flex flex-col">
              <div className={`
                w-8 h-8 mx-auto flex items-center justify-center rounded-full relative
                ${isEqual(day, selectedDate || new Date(-1)) ? 'bg-primary text-primary-foreground' : ''}
                ${isToday(day) ? 'border-2 border-primary font-bold' : ''}
                ${hasSelectedBids ? 'ring-2 ring-blue-400' : ''}
              `}>
                {format(day, 'd')}
                {hasUrgentBids && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              
              {bidCount > 0 && (
                <div className="mt-1 flex justify-center space-x-1">
                  <Badge 
                    className={`text-xs px-1 py-0.5 ${
                      hasPendingBids ? 'bg-yellow-700/30 border-yellow-600/30' : 
                      'bg-green-700/30 border-green-600/30'
                    }`}
                  >
                    {bidCount}
                  </Badge>
                  {hasUrgentBids && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="font-medium">{format(day, 'EEEE, MMMM d')}</p>
              {bidCount > 0 ? (
                <div className="mt-1">
                  <p>{bidCount} bid{bidCount !== 1 ? 's' : ''}</p>
                  {hasUrgentBids && <p className="text-red-400">⚠ Urgent bids</p>}
                  {hasPendingBids && <p className="text-yellow-400">⏳ Pending approvals</p>}
                </div>
              ) : (
                <p className="text-gray-400">No bids</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  // Get bids for selected date
  const selectedDateBids = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return bidsByDate[dateKey] || [];
  }, [selectedDate, bidsByDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Column - Calendar */}
      <div className="lg:col-span-1 space-y-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="modern-card">
            <div className="p-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold text-foreground">{stats.totalBids}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modern-card">
            <div className="p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-semibold text-foreground">{stats.pendingBids}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modern-card">
            <div className="p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Approved</p>
                  <p className="text-lg font-semibold text-foreground">{stats.approvedBids}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modern-card">
            <div className="p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Urgent</p>
                  <p className="text-lg font-semibold text-foreground">{stats.urgentBids}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="modern-card">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="icon" onClick={handlePrevMonth} className="lovable-button-secondary">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold text-foreground">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <Button variant="outline" size="icon" onClick={handleNextMonth} className="lovable-button-secondary">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              className="mx-auto"
              components={{
                Day: ({ date, displayMonth }) => {
                  if (displayMonth.getMonth() !== date.getMonth()) {
                    return <div className="rdp-day_outside text-muted-foreground">{format(date, 'd')}</div>;
                  }
                  return <>{customDayContent(date)}</>;
                }
              }}
              modifiersStyles={{
                selected: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: '600'
                },
                today: {
                  border: '2px solid hsl(var(--primary))'
                }
              }}
            />
            
            {/* Legend */}
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40 mr-2"></div>
                <span>Filled/Assigned shifts</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40 mr-2"></div>
                <span>Pending bids</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                <span>Urgent (within 24h)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Details and Actions */}
      <div className="lg:col-span-3 space-y-4">
        {/* Search and Filters */}
        <div className="modern-card">
          <div className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-60">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search employees, roles, departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="lovable-input pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 lovable-input">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="modern-card">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48 lovable-input">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="modern-card">
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept as string}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleExport} className="lovable-button-secondary">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            {/* Bulk Actions */}
            {selectedBids.size > 0 && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    {selectedBids.size} bid{selectedBids.size !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('approve')}
                      className="lovable-button-secondary"
                    >
                      Approve All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('reject')}
                      className="lovable-button-secondary"
                    >
                      Reject All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('notify')}
                      className="lovable-button-secondary"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Notify
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedBids(new Set())}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Selected Date Details */}
        {selectedDate ? (
          <div className="modern-card animate-fade-in-up">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <Badge className="ml-2 bg-primary/10 text-primary border-primary/20">
                    {selectedDateBids.length} shifts
                  </Badge>
                </div>
                
                {selectedDateBids.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedDateBids.every(bid => selectedBids.has(bid.id))}
                      onCheckedChange={() => handleSelectAllForDate(format(selectedDate, 'yyyy-MM-dd'))}
                    />
                    <span className="text-sm text-muted-foreground">Select all</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              {selectedDateBids.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-foreground">No shifts found for this date.</p>
                  <p className="text-sm mt-1">Select another date or adjust your filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateBids.map(bid => {
                    const priority = getBidPriority(bid);
                    return (
                      <div key={bid.id} className="modern-card hover:shadow-md transition-all duration-200">
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                checked={selectedBids.has(bid.id)}
                                onCheckedChange={() => toggleBidSelection(bid.id)}
                              />
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium text-foreground">
                                    {bid.shiftDetails?.department} - {bid.shiftDetails?.role}
                                  </h4>
                                  
                                  <Badge 
                                    className={
                                      bid.status === 'Approved' ? "status-badge-filled" :
                                      bid.status === 'Rejected' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                      "status-badge-offered"
                                    }
                                  >
                                    {bid.status}
                                  </Badge>
                                  
                                  {priority === 'urgent' && (
                                    <Badge className="bg-red-500/10 text-red-600 border-red-500/20 animate-pulse">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>
                                    <Clock className="inline w-4 h-4 mr-1" />
                                    {bid.shiftDetails?.startTime} - {bid.shiftDetails?.endTime}
                                  </p>
                                  <p>
                                    <Users className="inline w-4 h-4 mr-1" />
                                    {bid.employee?.name || 'No employee assigned'}
                                  </p>
                                  {bid.employee?.tier && (
                                    <p>
                                      <Star className="inline w-4 h-4 mr-1" />
                                      Tier {bid.employee.tier}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="modern-card">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Bid
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Contact Employee
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Add Note
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Bid
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="modern-card h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No date selected</h3>
              <p>Select a date from the calendar to see shifts and manage bids.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={showBulkActionDialog} onOpenChange={setShowBulkActionDialog}>
        <DialogContent className="modern-card">
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {bulkAction} {selectedBids.size} selected bid{selectedBids.size !== 1 ? 's' : ''}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkActionDialog(false)} className="lovable-button-secondary">
              Cancel
            </Button>
            <Button onClick={executeBulkAction} className="lovable-button">
              Confirm {bulkAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidCalendarView;
