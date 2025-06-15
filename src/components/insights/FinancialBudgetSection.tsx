
import React from "react";
import InsightMetricCard from "./InsightMetricCard";
import { DollarSign, User, ChartBar } from "lucide-react";

const FinancialBudgetSection: React.FC = () => {
  // Mock Data for Financial & Budget Tracking
  const laborCostPerEvent = "$4,550";
  const costPerRole = "$2,200 (Supervisors)";
  const budgetVariance = "-$480 (underspend)";
  const highCostStaff = "Jane Smith (5x)";

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <DollarSign size={20} className="text-yellow-300" /> Financial & Budget Tracking
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InsightMetricCard
          title="Labor Cost per Event"
          metric={laborCostPerEvent}
          description="Wages, overtime, etc."
          icon={<DollarSign size={18} className="text-lime-400" />}
        />
        <InsightMetricCard
          title="Cost per Role/Dept."
          metric={costPerRole}
          description="High/low cost roles"
          icon={<User size={18} className="text-blue-400" />}
        />
        <InsightMetricCard
          title="Budget Variance"
          metric={budgetVariance}
          description="Actual vs forecasted"
          icon={<ChartBar size={18} className="text-red-400" />}
        />
        <InsightMetricCard
          title="High Cost Staff Patterns"
          metric={highCostStaff}
          description="Most expensive assignments"
          icon={<User size={18} className="text-yellow-400" />}
        />
      </div>
    </div>
  );
};

export default FinancialBudgetSection;
