
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InsightMetricCardProps {
  title: string;
  metric: string | number | React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  highlightColor?: string;
  children?: React.ReactNode;
}

const InsightMetricCard: React.FC<InsightMetricCardProps> = ({
  title,
  metric,
  description,
  icon,
  highlightColor = "",
  children,
}) => (
  <Card
    className={cn(
      "group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:-translate-y-1 min-h-[140px] flex flex-col justify-between",
      highlightColor
    )}
  >
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <CardHeader className="pb-3 relative z-10">
      <CardTitle className="text-sm font-medium flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-200">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="line-clamp-2 leading-tight">{title}</span>
      </CardTitle>
    </CardHeader>
    
    <CardContent className="flex flex-col gap-2 pt-0 relative z-10">
      <div className="text-2xl font-bold text-white group-hover:text-white transition-colors duration-200">
        {metric}
      </div>
      {description && (
        <div className="text-xs text-white/60 group-hover:text-white/70 transition-colors duration-200 leading-relaxed">
          {description}
        </div>
      )}
      {children}
    </CardContent>
  </Card>
);

export default InsightMetricCard;
