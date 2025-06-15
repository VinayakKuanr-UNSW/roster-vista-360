
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Mock data for demonstration purposes. In a real application, this would come from an API.
const analysisData: { [key: string]: any } = {
  'shift-fill-rate': {
    title: 'Shift Fill Rate Analysis',
    summary: '92% of planned shifts were filled over the last 30 days.',
    details: 'The shift fill rate is a key indicator of scheduling effectiveness and staff availability. A high rate suggests that the workforce is sufficient and rostering is well-aligned with demand. The current rate of 92% is healthy, though slightly below the target of 95%.',
    recommendations: [
      'Analyze unfilled shifts to identify patterns (e.g., specific roles, times, or locations).',
      'Review staff availability and preferences to improve schedule alignment.',
      'Consider increasing the pool of casual or on-call staff for hard-to-fill shifts.',
    ],
  },
  'employee-utilization': {
    title: 'Employee Utilization Analysis',
    summary: 'Average employee utilization is at 78% for the current month.',
    details: 'This metric compares rostered hours to available hours. A rate of 78% indicates there is some capacity within the workforce. Drilling down can reveal which employees or departments have lower utilization, presenting opportunities for cross-training or re-assigning duties.',
    recommendations: [
      'Identify staff with consistently low utilization for potential training opportunities.',
      'Cross-reference with skill-gap analysis to better deploy underutilized staff.',
    ],
  },
};

const AnalysisPage: React.FC = () => {
  const { metricId } = useParams<{ metricId: string }>();

  if (!metricId) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Metric ID was not provided.
      </div>
    );
  }
  
  const data = analysisData[metricId] || {
    title: `Analysis for ${metricId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
    summary: 'Detailed analysis for this metric is not yet available.',
    details: 'Please check back later for a full breakdown, historical trends, and actionable insights related to this performance indicator.',
    recommendations: [],
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Button asChild variant="ghost" className="text-white/80 hover:bg-white/10 hover:text-white pl-1">
          <Link to="/insights">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insights Overview
          </Link>
        </Button>
      </div>

      <div className="glass-panel p-8 border border-white/10 rounded-2xl backdrop-blur-xl bg-white/5">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{data.title}</h1>
        <p className="text-lg text-white/70">{data.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white/90">Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 leading-relaxed">{data.details}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white/90">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recommendations.length > 0 ? (
              <ul className="list-disc list-inside space-y-3 text-white/80">
                {data.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60">No specific recommendations at this time.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisPage;
