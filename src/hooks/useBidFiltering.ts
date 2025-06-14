
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { BidWithEmployee, GroupedBids } from '@/components/management/types/bid-types';
import { DateRange } from 'react-day-picker';

export const useBidFiltering = (bids: BidWithEmployee[], dateRange?: DateRange) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [subDepartmentFilter, setSubDepartmentFilter] = useState('All Sub-departments');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [sortByScore, setSortByScore] = useState(false);

  const filteredBids = useMemo(() => {
    return bids.filter(bid => {
      if (dateRange?.from && dateRange?.to) {
        const bidDate = new Date(bid.createdAt);
        if (bidDate < dateRange.from || bidDate > dateRange.to) {
          return false;
        }
      }
      
      if (statusFilter !== 'all' && bid.status !== statusFilter) {
        return false;
      }
      
      if (departmentFilter !== 'All Departments' && 
          bid.shiftDetails?.department !== departmentFilter) {
        return false;
      }
      
      if (subDepartmentFilter !== 'All Sub-departments' && 
          bid.shiftDetails?.subDepartment !== subDepartmentFilter) {
        return false;
      }
      
      if (roleFilter !== 'All Roles' && 
          bid.shiftDetails?.role !== roleFilter) {
        return false;
      }
      
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          (bid.employee?.name?.toLowerCase().includes(searchLower) || false) ||
          bid.shiftId.toLowerCase().includes(searchLower) ||
          (bid.notes?.toLowerCase().includes(searchLower) || false) ||
          (bid.shiftDetails?.role.toLowerCase().includes(searchLower) || false)
        );
      }
      
      return true;
    });
  }, [bids, dateRange, statusFilter, departmentFilter, subDepartmentFilter, roleFilter, searchQuery]);

  const groupedBids: GroupedBids = useMemo(() => {
    return filteredBids.reduce((groups, bid) => {
      const date = format(new Date(bid.createdAt), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(bid);
      return groups;
    }, {} as GroupedBids);
  }, [filteredBids]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedBids).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedBids]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    subDepartmentFilter,
    setSubDepartmentFilter,
    roleFilter,
    setRoleFilter,
    sortByScore,
    setSortByScore,
    filteredBids,
    groupedBids,
    sortedDates,
  };
};
