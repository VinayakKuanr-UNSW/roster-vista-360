
import React from 'react';
import { Calendar, List, Filter, Search, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnhancedManagementHeaderProps {
  title: string;
  subtitle?: string;
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  activeFilterCount?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  totalItems?: number;
  filteredItems?: number;
}

const EnhancedManagementHeader: React.FC<EnhancedManagementHeaderProps> = ({
  title,
  subtitle,
  viewMode,
  onViewModeChange,
  onFilterClick,
  onSortClick,
  activeFilterCount = 0,
  searchValue = '',
  onSearchChange,
  totalItems,
  filteredItems
}) => {
  return (
    <div className="management-header space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="lovable-title">{title}</h1>
          {subtitle && (
            <p className="lovable-subtitle">{subtitle}</p>
          )}
          {totalItems !== undefined && filteredItems !== undefined && (
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems} of {totalItems} total items
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-64 lovable-input"
              />
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg overflow-hidden bg-card/50">
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              className={cn(
                "rounded-none border-none",
                viewMode === 'list' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? "default" : "ghost"}
              size="sm"
              className={cn(
                "rounded-none border-none",
                viewMode === 'calendar' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
              onClick={() => onViewModeChange('calendar')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          </div>

          {/* Sort Button */}
          {onSortClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSortClick}
              className="lovable-btn-secondary"
            >
              <SortAsc className="h-4 w-4 mr-1" />
              Sort
            </Button>
          )}

          {/* Filter Button */}
          {onFilterClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterClick}
              className={cn(
                "lovable-btn-secondary relative",
                activeFilterCount > 0 && "border-primary"
              )}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {activeFilterCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedManagementHeader;
