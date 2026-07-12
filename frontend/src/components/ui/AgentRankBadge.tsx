import React from "react";
import { motion } from "framer-motion";
import { cn } from "./GlassCard";

interface AgentRankBadgeProps {
  rank: number;
  size?: "sm" | "md" | "lg";
}

const RANK_CONFIG = {
  1: {
    color: "#fbbf24",
    shadow: "0 0 12px rgba(251,191,36,0.7), 0 0 24px rgba(251,191,36,0.3)",
    label: "🥇",
  },
  2: {
    color: "#94a3b8",
    shadow: "0 0 10px rgba(148,163,184,0.5), 0 0 20px rgba(148,163,184,0.2)",
    label: "🥈",
  },
  3: {
    color: "#cd7f32",
    shadow: "0 0 10px rgba(205,127,50,0.5), 0 0 20px rgba(205,127,50,0.2)",
    label: "🥉",
  },
} as const;

export function AgentRankBadge({ rank, size = "md" }: AgentRankBadgeProps) {
  const sizeClasses = {
    sm: "w-7 h-7 text-sm",
    md: "w-9 h-9 text-base",
    lg: "w-12 h-12 text-xl",
  };

  const config = RANK_CONFIG[rank as 1 | 2 | 3];

  if (config) {
    return (
      <motion.div
        className={cn(
          "flex items-center justify-center rounded-full font-bold font-mono border",
          sizeClasses[size]
        )}
        style={{
          color: config.color,
          borderColor: `${config.color}40`,
          background: `${config.color}15`,
          boxShadow: config.shadow,
        }}
        animate={{ boxShadow: [config.shadow, `${config.shadow}, 0 0 0px transparent`, config.shadow] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        #{rank}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold font-mono",
        "border border-white/10 bg-white/5 text-text-secondary",
        sizeClasses[size]
      )}
    >
      #{rank}
    </div>
  );
}
