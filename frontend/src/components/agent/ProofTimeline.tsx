import React from "react";
import { motion } from "framer-motion";
import type { ProofHistoryItem } from "../../types/contract";
import { ProofBadge } from "../ui/ProofBadge";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "../ui/GlassCard";

interface ProofTimelineProps {
  history: ProofHistoryItem[];
  isLoading: boolean;
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortHash(hash: string): string {
  if (!hash || hash === "0".repeat(64)) return "—";
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

export function ProofTimeline({ history, isLoading }: ProofTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl border border-white/5 bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <GlassCard className="p-6 text-center">
        <p className="text-text-secondary">No proof history yet</p>
      </GlassCard>
    );
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

      {history.map((item, i) => (
        <motion.div
          key={`${item.epoch}-${item.timestamp}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className="relative flex gap-4 pb-6"
        >
          {/* Timeline dot */}
          <div
            className={cn(
              "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2",
              item.passed
                ? "border-success/50 bg-success/10 text-success"
                : "border-danger/50 bg-danger/10 text-danger"
            )}
            style={
              item.passed
                ? { boxShadow: "0 0 12px rgba(16,185,129,0.3)" }
                : { boxShadow: "0 0 12px rgba(239,68,68,0.3)" }
            }
          >
            <span className="text-xs font-bold font-mono">E{item.epoch}</span>
          </div>

          {/* Content */}
          <GlassCard className="flex-1 p-4">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-text-primary">
                    Epoch {item.epoch}
                  </span>
                  <ProofBadge passed={item.passed} size="sm" animated={false} />
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  Threshold:{" "}
                  <span className="font-mono text-text-primary">
                    {(item.threshold / 100).toFixed(2)}%
                  </span>
                </p>
              </div>
              <p className="text-xs text-text-muted">{formatDate(item.timestamp)}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-text-muted">Commitment:</span>
              <code className="text-xs font-mono text-accent-cyan/80">
                {shortHash(item.commitment)}
              </code>
              {item.txHash && (
                <code className="text-xs font-mono text-text-muted ml-auto">
                  tx: {shortHash(item.txHash)}
                </code>
              )}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
