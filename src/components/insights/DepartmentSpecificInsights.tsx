
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const DepartmentSpecificInsights: React.FC = () => {
  const { user } = useAuth();

  if (!user?.department) {
    return null;
  }

  return (
    <Card className={
      user.department === 'convention' ? 'bg-blue-900/20 border-blue-500/20' :
      user.department === 'exhibition' ? 'bg-green-900/20 border-green-500/20' :
      user.department === 'theatre' ? 'bg-red-900/20 border-red-500/20' :
      'bg-purple-900/20 border-purple-500/20'
    }>
      <CardHeader>
        <CardTitle className="text-lg capitalize">{user.department} Department Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white/70 mb-4">
          Detailed performance metrics and KPIs specific to your department.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Staff Utilization</div>
            <div className="text-2xl font-bold">
              {user.department === 'convention' ? '85%' : 
               user.department === 'exhibition' ? '78%' : 
               user.department === 'theatre' ? '92%' : '87%'}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Shift Completion</div>
            <div className="text-2xl font-bold">
              {user.department === 'convention' ? '92%' : 
               user.department === 'exhibition' ? '88%' : 
               user.department === 'theatre' ? '94%' : '90%'}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Avg. Shift Duration</div>
            <div className="text-2xl font-bold">
              {user.department === 'convention' ? '7.2h' : 
               user.department === 'exhibition' ? '6.8h' : 
               user.department === 'theatre' ? '5.5h' : '7.0h'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentSpecificInsights;
