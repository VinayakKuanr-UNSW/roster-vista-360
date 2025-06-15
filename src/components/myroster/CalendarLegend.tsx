
import React from 'react';
import { Sun, Moon, Plus, Edit, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CalendarLegend: React.FC = () => {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3 mb-4">
      <h4 className="text-sm font-medium text-white mb-2">Legend</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {/* Shift indicators */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs px-2 py-1">2</Badge>
          <span className="text-gray-300">Number of shifts</span>
        </div>
        
        {/* Time indicators */}
        <div className="flex items-center gap-2">
          <Sun size={14} className="text-yellow-400" />
          <span className="text-gray-300">AM shifts</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Moon size={14} className="text-blue-300" />
          <span className="text-gray-300">PM shifts</span>
        </div>
        
        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Plus size={14} className="text-green-400" />
          <span className="text-gray-300">Add shift</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Edit size={14} className="text-blue-400" />
          <span className="text-gray-300">Edit shift</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Info size={14} className="text-purple-400" />
          <span className="text-gray-300">View details</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend;
