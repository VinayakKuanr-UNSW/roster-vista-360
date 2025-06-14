import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import MyRosterCalendar from '@/components/myroster/MyRosterCalendar';
import { useRosterView, CalendarView } from '@/hooks/useRosterView';
import { CalendarDays, Info } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const MyRosterPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { view, setView, selectedDate, setSelectedDate, viewOptions } = useRosterView();
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Please log in to view your roster</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
          <CalendarDays className="mr-2 text-primary" size={28} />
          My Roster
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-base md:text-lg">Welcome back, {user.name}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Department: {user.department.charAt(0).toUpperCase() + user.department.slice(1)}</p>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
            {viewOptions.map(option => (
              <Button
                key={option.value}
                onClick={() => setView(option.value as CalendarView)} 
                variant={view === option.value ? "default" : "outline"}
                size="sm"
                className={`${
                  view === option.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                } transition-all duration-200`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden bg-card/30 backdrop-blur-lg rounded-lg border border-border shadow-xl">
        <div className="h-full w-full p-2 md:p-4">
          <MyRosterCalendar 
            view={view} 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </div>
      </div>
      
      <div className="flex-shrink-0 mt-4 bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs md:text-sm flex items-start">
        <Info className="text-primary mr-2 mt-0.5 flex-shrink-0" size={16} />
        <div>
          <h3 className="text-primary font-medium mb-1">Viewing Your Roster</h3>
          <p className="text-foreground/80">
            Use the view options above to switch between Day, 3-Day, Week, and Month views. 
            Click on any shift to see more details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRosterPage;