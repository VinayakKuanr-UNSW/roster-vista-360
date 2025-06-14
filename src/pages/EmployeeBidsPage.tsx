import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Info,
  Filter as FilterIcon,
  Columns,
  List as ListIcon,
  User,
  Building,
  Calendar,
  Clock,
  Award,
  ThumbsUp,
  ShieldAlert,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BidStatusBadge } from '@/components/bids/BidStatusBadge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Additional UI imports for filters
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface ShiftData {
  id: number;
  role: string;
  department: string;
  subGroup: string; // sub-department
  date: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  remunerationLevel: 'Level-4' | 'Level-3' | 'Level-2';
  assignedTo: string | null;
  isEligible: boolean;
  openForBids: boolean;
  ineligibilityReason?: string;
}

interface BidData {
  id: number;
  shiftId: number;
  role: string;
  department: string;
  subGroup: string;
  date: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  remunerationLevel: 'Level-4' | 'Level-3' | 'Level-2';
  status: 'pending' | 'approved' | 'rejected';
  bidTime: string;
  notes: string | null;
}

// HELPER: Color-code cards by department
function getDeptColor(dept: string) {
  const d = dept.toLowerCase();
  if (d.includes('convention')) {
    // Convention Centre → Blue
    return 'bg-blue-900/20 border-blue-500/30';
  } else if (d.includes('exhibition')) {
    // Exhibition Centre → Green
    return 'bg-green-900/20 border-green-500/30';
  } else if (d.includes('theatre')) {
    // Theatre → Red
    return 'bg-red-900/20 border-red-500/30';
  }
  // fallback
  return 'bg-white/10 border-white/20';
}

const EmployeeBidsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // For tab selection (available vs myBids)
  const [activeTab, setActiveTab] = useState<'available' | 'myBids'>(
    'available'
  );

  // For toggling card/table view
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Filter states
  const [deptFilter, setDeptFilter] = useState('all');
  const [subDeptFilter, setSubDeptFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Sample Shifts
  const [availableShifts] = useState<ShiftData[]>([
    {
      id: 1,
      role: 'Team Leader',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      date: '2023-04-10',
      startTime: '05:45',
      endTime: '14:00',
      breakDuration: '30 min',
      remunerationLevel: 'Level-4',
      assignedTo: null,
      isEligible: true,
      openForBids: true,
    },
    {
      id: 2,
      role: 'TM3',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      date: '2023-04-10',
      startTime: '06:15',
      endTime: '14:00',
      breakDuration: '30 min',
      remunerationLevel: 'Level-4',
      assignedTo: null,
      isEligible: true,
      openForBids: true,
    },
    {
      id: 3,
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'AM Assist',
      date: '2023-04-10',
      startTime: '11:30',
      endTime: '16:30',
      breakDuration: '30 min',
      remunerationLevel: 'Level-3',
      assignedTo: null,
      isEligible: false,
      openForBids: true,
      ineligibilityReason: 'Role requirements not met',
    },
    {
      id: 4,
      role: 'Team Leader',
      department: 'Exhibition Centre',
      subGroup: 'Bump-In',
      date: '2023-04-11',
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: '45 min',
      remunerationLevel: 'Level-4',
      assignedTo: null,
      isEligible: false,
      openForBids: true,
      ineligibilityReason: 'Department mismatch',
    },
    {
      id: 5,
      role: 'Supervisor',
      department: 'Theatre',
      subGroup: 'AM Floaters',
      date: '2023-04-12',
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: '45 min',
      remunerationLevel: 'Level-4',
      assignedTo: null,
      isEligible: true,
      openForBids: true,
    },
  ]);

  // Sample Bids
  const [myBids, setMyBids] = useState<BidData[]>([
    {
      id: 101,
      shiftId: 5,
      role: 'Supervisor',
      department: 'Theatre',
      subGroup: 'AM Floaters',
      date: '2023-04-12',
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: '45 min',
      remunerationLevel: 'Level-4',
      status: 'pending',
      bidTime: '2023-04-02 14:30',
      notes: null,
    },
    {
      id: 102,
      shiftId: 1,
      role: 'Team Leader',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      date: '2023-04-03',
      startTime: '05:45',
      endTime: '14:00',
      breakDuration: '30 min',
      remunerationLevel: 'Level-4',
      status: 'approved',
      bidTime: '2023-04-01 09:15',
      notes: 'Assigned on manager approval',
    },
    {
      id: 103,
      shiftId: 3,
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'PM Base',
      date: '2023-04-02',
      startTime: '14:00',
      endTime: '21:30',
      breakDuration: '30 min',
      remunerationLevel: 'Level-3',
      status: 'rejected',
      bidTime: '2023-03-29 16:45',
      notes: 'Shift assigned to employee with higher seniority',
    },
  ]);

  // --------------------------------------------------------------------------
  // 1) Manage Selection State
  //    We'll use a single "selectedBidIds" array to store the IDs of whatever
  //    we’ve currently selected—shifts in Available tab or bids in My Bids tab.
  // --------------------------------------------------------------------------
  const [selectedBidIds, setSelectedBidIds] = useState<number[]>([]);

  // --------------------------------------------------------------------------
  // 2) Implement "Select All" for "Available Shifts"
  // --------------------------------------------------------------------------
  const handleSelectAllAvailable = (isChecked: boolean) => {
    // We only select the shifts that are currently filtered + eligible
    const eligibleShifts = filterShifts(availableShifts)
      .filter((shift) => shift.isEligible)
      .map((shift) => shift.id);
    setSelectedBidIds(isChecked ? eligibleShifts : []);
  };

  // --------------------------------------------------------------------------
  //    Implement "Select All" for "My Bids"
  // --------------------------------------------------------------------------
  const handleSelectAllMyBids = (isChecked: boolean) => {
    // We select all bids in the current (filtered) My Bids
    const allBidIds = filterBids(myBids).map((bid) => bid.id);
    setSelectedBidIds(isChecked ? allBidIds : []);
  };

  // --------------------------------------------------------------------------
  // 3) Handle Individual Selection
  //    Toggles either a shift's ID or a bid's ID (depending on current tab).
  // --------------------------------------------------------------------------
  const handleSelectBid = (id: number) => {
    setSelectedBidIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --------------------------------------------------------------------------
  // 4) Validate Selections Before Actions
  //    - If action is "express": we check the selected shifts for eligibility.
  //    - If action is "withdraw": we check the selected bids.
  // --------------------------------------------------------------------------
  const validateSelections = (action: 'express' | 'withdraw') => {
    if (action === 'express') {
      // Which shifts did the user select?
      const selectedShifts = availableShifts.filter((shift) =>
        selectedBidIds.includes(shift.id)
      );

      // 1) Ineligible shifts?
      const ineligibleShifts = selectedShifts.filter(
        (shift) => !shift.isEligible
      );
      if (ineligibleShifts.length > 0) {
        toast({
          title: 'Ineligible Shifts Selected',
          description: 'Please deselect ineligible shifts before proceeding.',
          variant: 'destructive',
        });
        return false;
      }

      // 2) Already expressed interest?
      //    i.e. shifts that appear in myBids
      const alreadyProcessed = myBids.filter((bid) =>
        selectedBidIds.includes(bid.shiftId)
      );
      if (alreadyProcessed.length > 0) {
        toast({
          title: 'Already Expressed Interest',
          description:
            'You have already expressed interest in some selected shifts.',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } else {
      // action === 'withdraw'
      // We’re withdrawing from selected Bids, so let's find them
      const selectedUserBids = myBids.filter((b) =>
        selectedBidIds.includes(b.id)
      );

      // Do not allow withdrawing from "rejected" bids
      const rejected = selectedUserBids.filter((b) => b.status === 'rejected');
      if (rejected.length > 0) {
        toast({
          title: 'Rejected Bids',
          description: 'You can’t withdraw from already rejected bids.',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    }
  };

  // --------------------------------------------------------------------------
  // 5) Perform Bulk Actions: "Bulk Express" and "Bulk Withdraw"
  // --------------------------------------------------------------------------
  const handleBulkExpressInterest = () => {
    if (!validateSelections('express')) return;

    // Proceed with expressing interest for each selected shift ID
    selectedBidIds.forEach((shiftId) => {
      handleBidForShift(shiftId);
    });

    // Clear selections after action
    setSelectedBidIds([]);
  };

  const handleBulkWithdraw = () => {
    if (!validateSelections('withdraw')) return;

    // Proceed with withdrawing from each selected bid ID
    selectedBidIds.forEach((bidId) => {
      handleWithdrawBid(bidId);
    });

    // Clear selections after action
    setSelectedBidIds([]);
  };

  // --------------------------------------------------------------------------
  // FILTER LOGIC
  // --------------------------------------------------------------------------
  const filterShifts = (items: ShiftData[]) => {
    return items.filter((shift) => {
      if (deptFilter !== 'all' && shift.department !== deptFilter) return false;
      if (subDeptFilter !== 'all' && shift.subGroup !== subDeptFilter)
        return false;
      if (roleFilter !== 'all' && shift.role !== roleFilter) return false;
      return true;
    });
  };

  const filterBids = (items: BidData[]) => {
    return items.filter((bid) => {
      if (deptFilter !== 'all' && bid.department !== deptFilter) return false;
      if (subDeptFilter !== 'all' && bid.subGroup !== subDeptFilter)
        return false;
      if (roleFilter !== 'all' && bid.role !== roleFilter) return false;
      return true;
    });
  };

  // SHIFT COVERAGE DEMO
  const getShiftCoveragePercent = (start: string, end: string) => {
    const s = parseInt(start.slice(0, 2), 10) || 0;
    const e = parseInt(end.slice(0, 2), 10) || 0;
    const diff = e - s;
    return Math.max(0, Math.min(100, (diff / 24) * 100));
  };

  // HANDLERS
  const handleBidForShift = (shiftId: number) => {
    toast({
      title: 'Bid Submitted',
      description: `Your bid for shift #${shiftId} has been submitted.`,
    });
  };

  const handleWithdrawBid = (bidId: number) => {
    setMyBids((prev) => prev.filter((b) => b.id !== bidId));
    toast({
      title: 'Bid Withdrawn',
      description: `You have withdrawn from bid #${bidId}.`,
    });
  };

  // CLEAR FILTERS
  const clearFilters = () => {
    setDeptFilter('all');
    setSubDeptFilter('all');
    setRoleFilter('all');
  };

  // HELPER to get weekday string from shift/bid date
  const getWeekday = (dateStr: string) => {
    const weekday = new Date(dateStr).toLocaleString('en-US', {
      weekday: 'long',
    });
    return weekday || '';
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2 text-white/80 font-semibold">
          <FilterIcon size={20} />
          <span>Filters:</span>
        </div>

        {/* DEPARTMENT FILTER */}
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white/80">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Depts</SelectItem>
            <SelectItem value="Convention Centre">Convention Centre</SelectItem>
            <SelectItem value="Exhibition Centre">Exhibition Centre</SelectItem>
            <SelectItem value="Theatre">Theatre</SelectItem>
          </SelectContent>
        </Select>

        {/* SUB-DEPT FILTER */}
        <Select value={subDeptFilter} onValueChange={setSubDeptFilter}>
          <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white/80">
            <SelectValue placeholder="Sub-Dept" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="AM Base">AM Base</SelectItem>
            <SelectItem value="AM Assist">AM Assist</SelectItem>
            <SelectItem value="Bump-In">Bump-In</SelectItem>
            <SelectItem value="AM Floaters">AM Floaters</SelectItem>
            <SelectItem value="PM Base">PM Base</SelectItem>
          </SelectContent>
        </Select>

        {/* ROLE FILTER */}
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white/80">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Team Leader">Team Leader</SelectItem>
            <SelectItem value="TM3">TM3</SelectItem>
            <SelectItem value="TM2">TM2</SelectItem>
            <SelectItem value="Supervisor">Supervisor</SelectItem>
          </SelectContent>
        </Select>

        {/* CLEAR ALL FILTERS */}
        <Button
          variant="outline"
          className="text-sm text-white/80 border-white/10"
          onClick={clearFilters}
        >
          Clear All
        </Button>

        {/* CARD/TABLE VIEW TOGGLE (on the right) */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode('card')}
            className={`flex items-center gap-2 text-sm ${
              viewMode === 'card'
                ? 'bg-white/10 text-white border-white/20'
                : 'text-white/80'
            }`}
          >
            <Columns size={16} />
            Card View
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 text-sm ${
              viewMode === 'table'
                ? 'bg-white/10 text-white border-white/20'
                : 'text-white/80'
            }`}
          >
            <ListIcon size={16} />
            Table View
          </Button>
        </div>
      </div>

      {/* MAIN BIDDING PAGE */}
      <h1 className="text-2xl font-bold mb-6 flex items-center text-white">
        <User className="mr-2 text-purple-400" size={24} />
        Shift Bidding
      </h1>

      <Tabs
        defaultValue="available"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as typeof activeTab)}
      >
        <TabsList className="bg-black/20 border border-white/10 mb-6">
          <TabsTrigger
            value="available"
            className="data-[state=active]:bg-white/10"
          >
            Available Shifts
          </TabsTrigger>
          <TabsTrigger
            value="myBids"
            className="data-[state=active]:bg-white/10"
          >
            My Bids
          </TabsTrigger>
        </TabsList>

        {/* ---------------------------------------- */}
        {/* TAB 1: AVAILABLE SHIFTS */}
        <TabsContent value="available" className="space-y-6">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex items-start">
            <Info className="text-blue-400 mr-3 mt-1" size={20} />
            <div>
              <h3 className="text-blue-300 font-medium mb-1">
                Bidding Information
              </h3>
              <p className="text-white/80 text-sm">
                You can bid on shifts that match your role, department, and
                sub-department. The system will check your eligibility and work
                hour compliance before bidding.
              </p>
            </div>
          </div>

          {/* 7) Add Bulk Action Buttons (for expressing interest) */}
          <div className="flex gap-2">
            <Button
              onClick={handleBulkExpressInterest}
              disabled={selectedBidIds.length === 0}
            >
              Express Interest in Selected
            </Button>
          </div>

          {/* SHIFT LIST */}
          {viewMode === 'card' ? (
            // --- CARD VIEW ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterShifts(availableShifts).map((shift) => {
                const coveragePct = getShiftCoveragePercent(
                  shift.startTime,
                  shift.endTime
                );
                return (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg border ${getDeptColor(
                      shift.department
                    )} transition-all duration-300`}
                  >
                    {/* Checkbox for selection */}
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedBidIds.includes(shift.id)}
                        onChange={() => handleSelectBid(shift.id)}
                        disabled={!shift.isEligible}
                        className="mr-2"
                      />
                      <span className="text-sm text-white/80">Select</span>
                    </div>

                    {/* Shift Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-white">{shift.role}</h3>
                        <div className="flex items-center mt-1">
                          <Building size={14} className="text-white/60 mr-1" />
                          <span className="text-sm text-white/80">
                            {shift.department} - {shift.subGroup}
                          </span>
                        </div>
                      </div>
                      {/* Tier */}
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          shift.remunerationLevel === 'Level-4'
                            ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                            : shift.remunerationLevel === 'Level-3'
                            ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30'
                            : 'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                        }`}
                      >
                        {shift.remunerationLevel}
                      </div>
                    </div>

                    {/* Date/Time/Break */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">{shift.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Award size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">
                          Break: {shift.breakDuration}
                        </span>
                      </div>
                      {/* SHIFT COVERAGE BAR */}
                      <div className="mt-2 text-xs text-white/60">
                        Shift coverage:
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded relative">
                        {/* Coverage bar */}
                        <div
                          className="absolute top-0 left-0 h-2 bg-purple-500 rounded transition-all duration-300"
                          style={{ width: `${coveragePct}%` }}
                        />
                        {/* Coverage label */}
                        <div className="absolute right-1 top-0 text-[10px] text-white/80 h-full flex items-center">
                          {Math.round(coveragePct)}%
                        </div>
                      </div>
                    </div>

                    {/* CTA or Ineligible */}
                    {shift.isEligible ? (
                      <Button
                        onClick={() => handleBidForShift(shift.id)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Express Interest
                      </Button>
                    ) : (
                      <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3 text-sm mt-2">
                        <div className="flex items-center text-red-300 mb-1">
                          <ShieldAlert size={14} className="mr-1" />
                          <span className="font-medium">Not Eligible</span>
                        </div>
                        <p className="text-white/70">
                          {shift.ineligibilityReason || 'Reason not provided'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {filterShifts(availableShifts).length === 0 && (
                <div className="text-center py-6 text-white/60 col-span-full">
                  No shifts match the selected filters.
                </div>
              )}
            </div>
          ) : (
            // --- TABLE VIEW ---
            <div className="overflow-x-auto border border-white/10 rounded-lg">
              <table className="w-full border-collapse text-white">
                <thead className="sticky top-0 bg-black/80 z-10 text-sm">
                  <tr>
                    {/* Add the select-all checkbox for available shifts */}
                    <th className="p-4">
                      <input
                        type="checkbox"
                        checked={filterShifts(availableShifts)
                          .filter((shift) => shift.isEligible)
                          .every((shift) => selectedBidIds.includes(shift.id))}
                        onChange={(e) =>
                          handleSelectAllAvailable(e.target.checked)
                        }
                      />
                    </th>
                    <th className="p-4 text-left font-medium">Dept</th>
                    <th className="p-4 text-left font-medium">Sub-Dept</th>
                    <th className="p-4 text-left font-medium">Role</th>
                    <th className="p-4 text-left font-medium">Tier</th>
                    <th className="p-4 text-left font-medium">Date</th>
                    <th className="p-4 text-left font-medium">Day</th>
                    <th className="p-4 text-left font-medium">Time</th>
                    <th className="p-4 text-left font-medium">Coverage</th>
                    <th className="p-4 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterShifts(availableShifts).map((shift, index) => {
                    const coveragePct = getShiftCoveragePercent(
                      shift.startTime,
                      shift.endTime
                    );
                    const day = new Date(shift.date).toLocaleString('en-US', {
                      weekday: 'long',
                    });

                    return (
                      <tr
                        key={shift.id}
                        className={`border-b border-white/10 text-sm ${
                          index % 2 === 0 ? 'bg-white/5' : ''
                        } hover:bg-white/10 ${
                          !shift.isEligible ? 'opacity-70' : ''
                        }`}
                      >
                        {/* Individual selection checkbox */}
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedBidIds.includes(shift.id)}
                            onChange={() => handleSelectBid(shift.id)}
                            disabled={!shift.isEligible}
                          />
                        </td>
                        <td className="p-4">{shift.department}</td>
                        <td className="p-4">{shift.subGroup}</td>
                        <td className="p-4">{shift.role}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              shift.remunerationLevel === 'Level-4'
                                ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                                : shift.remunerationLevel === 'Level-3'
                                ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30'
                                : 'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                            }`}
                          >
                            {shift.remunerationLevel}
                          </span>
                        </td>
                        <td className="p-4">{shift.date}</td>
                        <td className="p-4">{day}</td>
                        <td className="p-4">
                          {shift.startTime} - {shift.endTime}
                        </td>
                        {/* Coverage */}
                        <td className="p-4">
                          <div className="w-full h-2 bg-white/10 rounded relative">
                            <div
                              className="absolute top-0 left-0 h-2 bg-purple-500 rounded transition-all duration-300"
                              style={{ width: `${coveragePct}%` }}
                            />
                            <div className="absolute right-1 top-0 text-[10px] text-white/80 h-full flex items-center">
                              {Math.round(coveragePct)}%
                            </div>
                          </div>
                        </td>
                        {/* Action */}
                        <td className="p-4">
                          {shift.isEligible ? (
                            <Button
                              onClick={() => handleBidForShift(shift.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1"
                            >
                              Express Interest
                            </Button>
                          ) : (
                            <span className="text-red-400 text-xs font-medium">
                              Not Eligible
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filterShifts(availableShifts).length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center p-4 text-white/60 text-sm"
                      >
                        No shifts match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* ---------------------------------------- */}
        {/* TAB 2: MY BIDS */}
        <TabsContent value="myBids" className="space-y-6">
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 flex items-start">
            <Info className="text-purple-400 mr-3 mt-1" size={20} />
            <div>
              <h3 className="text-purple-300 font-medium mb-1">My Bids</h3>
              <p className="text-white/80 text-sm">
                You can review and withdraw from any of your active bids here.
              </p>
            </div>
          </div>

          {/* 7) Add Bulk Action Buttons (for withdrawing) */}
          <div className="flex gap-2">
            <Button
              onClick={handleBulkWithdraw}
              disabled={selectedBidIds.length === 0}
            >
              Withdraw Selected Bids
            </Button>
          </div>

          {viewMode === 'card' ? (
            // CARD VIEW for My Bids
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBids(myBids).map((bid) => {
                const coveragePct = getShiftCoveragePercent(
                  bid.startTime,
                  bid.endTime
                );
                return (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg border ${getDeptColor(
                      bid.department
                    )} transition-all duration-300`}
                  >
                    {/* Checkbox for selection */}
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedBidIds.includes(bid.id)}
                        onChange={() => handleSelectBid(bid.id)}
                        disabled={bid.status === 'rejected'}
                        className="mr-2"
                      />
                      <span className="text-sm text-white/80">Select</span>
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-white">{bid.role}</h3>
                        <div className="flex items-center mt-1">
                          <Building size={14} className="text-white/60 mr-1" />
                          <span className="text-sm text-white/80">
                            {bid.department} - {bid.subGroup}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          bid.remunerationLevel === 'Level-4'
                            ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                            : bid.remunerationLevel === 'Level-3'
                            ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30'
                            : 'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                        }`}
                      >
                        {bid.remunerationLevel}
                      </div>
                    </div>

                    {/* Date/Time */}
                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">{bid.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">
                          {bid.startTime} - {bid.endTime}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Award size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">
                          Break: {bid.breakDuration}
                        </span>
                      </div>
                      {/* SHIFT COVERAGE BAR */}
                      <div className="mt-2 text-xs text-white/60">
                        Shift coverage:
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded relative">
                        <div
                          className="absolute top-0 left-0 h-2 bg-purple-500 rounded"
                          style={{ width: `${coveragePct}%` }}
                        />
                        <div className="absolute right-1 top-0 text-[10px] text-white/80 h-full flex items-center">
                          {Math.round(coveragePct)}%
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="text-sm mb-3">
                      <BidStatusBadge status={bid.status} />
                      {bid.notes && (
                        <div className="text-xs text-white/60 mt-1">
                          {bid.notes}
                        </div>
                      )}
                    </div>

                    {/* Withdraw if not rejected */}
                    {bid.status !== 'rejected' && (
                      <Button
                        variant="outline"
                        className="w-full border-red-400 text-red-400 hover:bg-red-400/20"
                        onClick={() => handleWithdrawBid(bid.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Withdraw
                      </Button>
                    )}
                  </motion.div>
                );
              })}

              {filterBids(myBids).length === 0 && (
                <div className="text-center py-6 text-white/60 col-span-full">
                  No bids match the selected filters.
                </div>
              )}
            </div>
          ) : (
            // TABLE VIEW for My Bids
            <div className="overflow-x-auto border border-white/10 rounded-lg">
              <table className="w-full border-collapse text-white">
                <thead className="sticky top-0 bg-black/80 z-10 text-sm">
                  <tr>
                    {/* Select-all checkbox for My Bids */}
                    <th className="p-4">
                      <input
                        type="checkbox"
                        checked={filterBids(myBids).every((bid) =>
                          selectedBidIds.includes(bid.id)
                        )}
                        onChange={(e) =>
                          handleSelectAllMyBids(e.target.checked)
                        }
                      />
                    </th>
                    <th className="p-4 text-left font-medium">Dept</th>
                    <th className="p-4 text-left font-medium">Sub-Dept</th>
                    <th className="p-4 text-left font-medium">Role</th>
                    <th className="p-4 text-left font-medium">Tier</th>
                    <th className="p-4 text-left font-medium">Date</th>
                    <th className="p-4 text-left font-medium">Day</th>
                    <th className="p-4 text-left font-medium">Time</th>
                    <th className="p-4 text-left font-medium">Coverage</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBids(myBids).map((bid, index) => {
                    const coveragePct = getShiftCoveragePercent(
                      bid.startTime,
                      bid.endTime
                    );
                    const day = new Date(bid.date).toLocaleString('en-US', {
                      weekday: 'long',
                    });

                    return (
                      <tr
                        key={bid.id}
                        className={`border-b border-white/10 text-sm ${
                          index % 2 === 0 ? 'bg-white/5' : ''
                        } hover:bg-white/10`}
                      >
                        {/* Individual selection checkbox */}
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedBidIds.includes(bid.id)}
                            onChange={() => handleSelectBid(bid.id)}
                            disabled={bid.status === 'rejected'}
                          />
                        </td>
                        <td className="p-4">{bid.department}</td>
                        <td className="p-4">{bid.subGroup}</td>
                        <td className="p-4">{bid.role}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              bid.remunerationLevel === 'Level-4'
                                ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                                : bid.remunerationLevel === 'Level-3'
                                ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30'
                                : 'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                            }`}
                          >
                            {bid.remunerationLevel}
                          </span>
                        </td>
                        <td className="p-4">{bid.date}</td>
                        <td className="p-4">{day}</td>
                        <td className="p-4">
                          {bid.startTime} - {bid.endTime}
                        </td>
                        {/* Coverage */}
                        <td className="p-4">
                          <div className="w-full h-2 bg-white/10 rounded relative">
                            <div
                              className="absolute top-0 left-0 h-2 bg-purple-500 rounded"
                              style={{ width: `${coveragePct}%` }}
                            />
                            <div className="absolute right-1 top-0 text-[10px] text-white/80 h-full flex items-center">
                              {Math.round(coveragePct)}%
                            </div>
                          </div>
                        </td>
                        {/* Status */}
                        <td className="p-4">
                          <BidStatusBadge status={bid.status} />
                          {bid.notes && (
                            <div className="text-xs text-white/60 mt-1">
                              {bid.notes}
                            </div>
                          )}
                        </td>
                        {/* Action */}
                        <td className="p-4">
                          {bid.status !== 'rejected' && (
                            <Button
                              variant="outline"
                              className="border-red-400 text-red-400 hover:bg-red-400/20 text-xs px-2 py-1"
                              onClick={() => handleWithdrawBid(bid.id)}
                            >
                              Withdraw
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filterBids(myBids).length === 0 && (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center p-4 text-white/60 text-sm"
                      >
                        No bids match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeBidsPage;
