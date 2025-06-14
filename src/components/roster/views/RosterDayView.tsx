import React from 'react';
import { Roster, DepartmentName, DepartmentColor } from '@/api/models/types';
import RosterGroup from "../RosterGroup";

export interface RosterDayViewProps {
  date: Date;
  roster: Roster | null;
  readOnly?: boolean;
  onAddGroup?: (group: { name: DepartmentName; color: DepartmentColor }) => void;
}

export const RosterDayView: React.FC<RosterDayViewProps> = ({ 
  date, 
  roster, 
  readOnly = false,
  onAddGroup
}) => {
  return (
    <div className="space-y-6">
      {roster && roster.groups.map(group => (
        <RosterGroup 
          key={group.id} 
          group={group}
          readOnly={readOnly}
        />
      ))}
      
      {!roster && (
        <div className="text-center py-10 text-white/60">
          No roster found for this date. Click "Apply Template" to create one.
        </div>
      )}
    </div>
  );
};

export default RosterDayView;