
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
      "bg-white/5 border border-white/10 shadow-sm flex flex-col justify-between min-h-[120px]",
      highlightColor
    )}
  >
    <CardHeader className="pb-2 flex flex-row items-center justify-between">
      <CardTitle className="text-base flex items-center gap-2 font-semibold">
        {icon && <span>{icon}</span>}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 pt-0 ">
      <div className="text-2xl font-bold">{metric}</div>
      {description && (
        <div className="text-xs text-muted-foreground">{description}</div>
      )}
      {children}
    </CardContent>
  </Card>
);

export default InsightMetricCard;
