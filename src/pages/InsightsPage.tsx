
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import WorkforceUtilizationSection from '@/components/insights/WorkforceUtilizationSection';
import EventLevelMetricsSection from '@/components/insights/EventLevelMetricsSection';
import TimeAttendanceSection from '@/components/insights/TimeAttendanceSection';
import EmployeeBehaviorSection from '@/components/insights/EmployeeBehaviorSection';
import SchedulingEfficiencySection from '@/components/insights/SchedulingEfficiencySection';
import CommunicationInteractionSection from '@/components/insights/CommunicationInteractionSection';
import FinancialBudgetSection from '@/components/insights/FinancialBudgetSection';
import ForecastingPlanningSection from '@/components/insights/ForecastingPlanningSection';
import LocationBasedSection from '@/components/insights/LocationBasedSection';
import ChartsSection from '@/components/insights/ChartsSection';
import DepartmentSpecificInsights from '@/components/insights/DepartmentSpecificInsights';

const InsightsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <main className="flex-1 p-4 md:p-8 space-y-8">
        {/* Header Section */}
        <div className="glass-panel p-8 mb-8 border border-white/10 rounded-2xl backdrop-blur-xl bg-white/5">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Insights & Analytics
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Comprehensive performance metrics and operational statistics to drive informed decisions.
            </p>
          </div>
        </div>
        
        {/* Metrics Sections */}
        <div className="space-y-12">
          <WorkforceUtilizationSection />
          
          <Separator className="bg-white/10" />
          
          <EventLevelMetricsSection />
          
          <Separator className="bg-white/10" />
          
          <TimeAttendanceSection />
          
          <Separator className="bg-white/10" />
          
          <EmployeeBehaviorSection />
          
          <Separator className="bg-white/10" />
          
          <SchedulingEfficiencySection />
          
          <Separator className="bg-white/10" />
          
          <CommunicationInteractionSection />
          
          <Separator className="bg-white/10" />
          
          <FinancialBudgetSection />
          
          <Separator className="bg-white/10" />
          
          <ForecastingPlanningSection />
          
          <Separator className="bg-white/10" />
          
          <LocationBasedSection />
          
          <Separator className="bg-white/10" />
          
          {/* Charts Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Visual Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartsSection />
            </div>
          </div>
          
          <Separator className="bg-white/10" />
          
          <DepartmentSpecificInsights />
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
