
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortOption } from './types/bid-types';

interface BidSortDropdownProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

const BidSortDropdown: React.FC<BidSortDropdownProps> = ({ currentSort, onSortChange }) => {
  const sortOptions: SortOption[] = [
    { id: 'date', name: 'Date', value: 'date', direction: 'asc' },
    { id: 'startTime', name: 'Start Time', value: 'startTime', direction: 'asc' },
    { id: 'netLength', name: 'Net Hours', value: 'netLength', direction: 'desc' },
    { id: 'status', name: 'Status', value: 'status', direction: 'asc' },
    { id: 'role', name: 'Role', value: 'role', direction: 'asc' },
    { id: 'department', name: 'Department', value: 'department', direction: 'asc' },
    { id: 'suitabilityScore', name: 'Suitability Score', value: 'suitabilityScore', direction: 'desc' },
    { id: 'timestamp', name: 'Application Time', value: 'timestamp', direction: 'asc' },
  ];
  
  const toggleDirection = (option: SortOption): SortOption => {
    return {
      ...option,
      direction: option.direction === 'asc' ? 'desc' : 'asc'
    };
  };
  
  const handleSortSelect = (option: SortOption) => {
    // If selecting the same option, toggle direction
    if (option.id === currentSort.id) {
      onSortChange(toggleDirection(currentSort));
    } else {
      onSortChange(option);
    }
  };
  
  const getDirectionIcon = (direction: 'asc' | 'desc') => {
    return direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort: {sortOptions.find(opt => opt.id === currentSort.id)?.name}
          {getDirectionIcon(currentSort.direction)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map(option => (
          <DropdownMenuItem 
            key={option.id} 
            onClick={() => handleSortSelect(option)}
            className={`flex justify-between ${currentSort.id === option.id ? 'bg-muted' : ''}`}
          >
            <span>{option.name}</span>
            {currentSort.id === option.id && getDirectionIcon(currentSort.direction)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onSortChange(sortOptions[0])}>Reset to Default</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BidSortDropdown;
