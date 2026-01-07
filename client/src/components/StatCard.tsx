import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "danger" | "warning" | "success";
}

export default function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className,
  variant = "default"
}: StatCardProps) {
  
  const variantStyles = {
    default: "border-l-4 border-l-primary",
    danger: "border-l-4 border-l-destructive bg-destructive/5",
    warning: "border-l-4 border-l-amber-500 bg-amber-500/5",
    success: "border-l-4 border-l-emerald-500 bg-emerald-500/5",
  };

  const iconStyles = {
    default: "text-primary bg-primary/10",
    danger: "text-destructive bg-destructive/10",
    warning: "text-amber-600 bg-amber-100",
    success: "text-emerald-600 bg-emerald-100",
  };

  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow duration-200", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-full", iconStyles[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-display font-bold tracking-tight">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {trend && (
              <span className={cn(
                "font-medium mr-2",
                trend.isPositive ? "text-emerald-600" : "text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
