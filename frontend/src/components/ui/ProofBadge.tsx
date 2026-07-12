import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "./GlassCard";

interface ProofBadgeProps {
  passed: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function ProofBadge({
  passed,
  size = "md",
  animated = true,
}: ProofBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  const iconSizes = { sm: 10, md: 12, lg: 16 };

  if (!passed) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border font-mono font-semibold",
          "border-danger/30 bg-danger/10 text-danger",
          sizeClasses[size]
        )}
      >
        <span className="text-danger">✗</span>
        <span>UNPROVEN</span>
      </span>
    );
  }

  const badge = (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-mono font-semibold",
        "border-success/40 bg-success/10 text-success",
        sizeClasses[size]
      )}
      style={{
        boxShadow: animated
          ? "0 0 12px rgba(16,185,129,0.3), 0 0 24px rgba(16,185,129,0.1)"
          : undefined,
      }}
    >
      <ShieldCheck size={iconSizes[size]} />
      <span>ZK PROVEN ✓</span>
    </span>
  );

  if (!animated) return badge;

  return (
    <motion.div
      className="inline-flex"
      animate={{
        filter: [
          "brightness(1)",
          "brightness(1.3)",
          "brightness(1)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {badge}
    </motion.div>
  );
}
