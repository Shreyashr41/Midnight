import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GlassCard, cn } from "./GlassCard";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export function StatCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  icon,
  highlight = false,
}: StatCardProps) {
  const TrendIcon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-danger"
        : "text-text-secondary";

  return (
    <GlassCard
      className="p-4"
      glowColor={highlight ? "cyan" : "none"}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
            {label}
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <motion.span
              className={cn(
                "text-2xl font-bold font-mono",
                highlight ? "text-accent-cyan" : "text-text-primary"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {value}
            </motion.span>
            {unit && (
              <span className="text-sm text-text-secondary">{unit}</span>
            )}
          </div>
          {trend && trendValue && (
            <div className={cn("mt-1 flex items-center gap-1 text-xs", trendColor)}>
              <TrendIcon size={12} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-3 rounded-lg bg-white/5 p-2 text-text-secondary">
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
