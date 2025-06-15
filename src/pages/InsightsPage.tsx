
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4 md:p-8">
        <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Insights & Analytics</h1>
            <p className="text-white/60">
              Track performance metrics and operational statistics.
            </p>
          </div>
          
          <WorkforceUtilizationSection />
          <EventLevelMetricsSection />
          <TimeAttendanceSection />
          <EmployeeBehaviorSection />
          <SchedulingEfficiencySection />
          <CommunicationInteractionSection />
          <FinancialBudgetSection />
          <ForecastingPlanningSection />
          <LocationBasedSection />
          
          <ChartsSection />
          
          <DepartmentSpecificInsights />
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
