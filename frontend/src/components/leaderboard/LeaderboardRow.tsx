import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LeaderboardEntry } from "../../types/contract";
import { AgentRankBadge } from "../ui/AgentRankBadge";
import { ProofBadge } from "../ui/ProofBadge";
import { cn } from "../ui/GlassCard";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  index: number;
}

function formatBalance(bal: bigint): string {
  if (bal >= 1_000_000n) return `${(Number(bal) / 1_000_000).toFixed(2)}M`;
  if (bal >= 1_000n) return `${(Number(bal) / 1_000).toFixed(1)}K`;
  return bal.toString();
}

function truncateId(id: string, chars = 8): string {
  return `${id.slice(0, chars)}…${id.slice(-4)}`;
}

export function LeaderboardRow({ entry, index }: LeaderboardRowProps) {
  const navigate = useNavigate();

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/agent/${entry.agentId}`)}
      className={cn(
        "group cursor-pointer border-b border-white/5 transition-all duration-200",
        "hover:bg-white/5",
        entry.rank <= 3 && "hover:bg-accent-cyan/5"
      )}
    >
      {/* Rank */}
      <td className="px-4 py-3">
        <AgentRankBadge rank={entry.rank} size="sm" />
      </td>

      {/* Agent */}
      <td className="px-4 py-3">
        <div>
          <p className="font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
            {entry.agentName || "Unknown Agent"}
          </p>
          <p className="text-xs text-text-muted font-mono">
            {truncateId(entry.agentId)}
          </p>
        </div>
      </td>

      {/* Proven Return */}
      <td className="px-4 py-3">
        <span
          className={cn(
            "font-mono font-bold text-lg",
            entry.returnPercent >= 0 ? "text-success" : "text-danger"
          )}
        >
          {entry.returnPercent >= 0 ? "+" : ""}
          {entry.returnPercent.toFixed(2)}%
        </span>
      </td>

      {/* Proof status */}
      <td className="px-4 py-3">
        <ProofBadge passed={entry.isVerified} size="sm" animated={entry.isVerified} />
      </td>

      {/* Vault Balance */}
      <td className="px-4 py-3">
        <span className="font-mono text-text-primary">
          {formatBalance(entry.vaultBalance)}{" "}
          <span className="text-text-muted text-xs">tMIDT</span>
        </span>
      </td>

      {/* Epoch */}
      <td className="px-4 py-3">
        <span className="text-text-secondary text-sm">
          #{entry.epoch}
        </span>
      </td>

      {/* Action */}
      <td className="px-4 py-3">
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-lg border border-accent-cyan/30 px-3 py-1.5",
            "text-xs font-medium text-accent-cyan bg-accent-cyan/5",
            "opacity-0 group-hover:opacity-100 transition-all duration-200",
            "hover:bg-accent-cyan/15 hover:border-accent-cyan/50"
          )}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/agent/${entry.agentId}?action=deposit`);
          }}
        >
          Deposit
          <ArrowRight size={11} />
        </button>
      </td>
    </motion.tr>
  );
}
