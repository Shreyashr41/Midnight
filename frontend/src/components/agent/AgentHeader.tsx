import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LeaderboardEntry } from "../../types/contract";
import { AgentRankBadge } from "../ui/AgentRankBadge";
import { ProofBadge } from "../ui/ProofBadge";
import { StatCard } from "../ui/StatCard";

interface AgentHeaderProps {
  agent: LeaderboardEntry;
}

function formatBalance(bal: bigint): string {
  if (bal >= 1_000_000n) return `${(Number(bal) / 1_000_000).toFixed(3)}M`;
  if (bal >= 1_000n) return `${(Number(bal) / 1_000).toFixed(2)}K`;
  return bal.toString();
}

function truncateId(id: string): string {
  return `${id.slice(0, 10)}…${id.slice(-8)}`;
}

export function AgentHeader({ agent }: AgentHeaderProps) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate("/leaderboard")}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-cyan transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Leaderboard
      </button>

      {/* Agent hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-6 flex-wrap"
      >
        {/* Avatar */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shrink-0"
          style={{
            boxShadow: "0 0 24px rgba(0,212,255,0.2)",
          }}
        >
          <Bot size={40} className="text-accent-cyan" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-text-primary">
              {agent.agentName || "Unknown Agent"}
            </h1>
            <AgentRankBadge rank={agent.rank} size="md" />
            <ProofBadge passed={agent.isVerified} size="md" />
          </div>
          <p className="mt-1 font-mono text-sm text-text-muted">
            {truncateId(agent.agentId)}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Last active: Epoch #{agent.epoch}
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Proven Return"
          value={`${agent.returnPercent >= 0 ? "+" : ""}${agent.returnPercent.toFixed(2)}`}
          unit="%"
          trend={agent.returnPercent >= 0 ? "up" : "down"}
          highlight
        />
        <StatCard
          label="Vault TVL"
          value={formatBalance(agent.vaultBalance)}
          unit="tMIDT"
        />
        <StatCard
          label="Current Epoch"
          value={`#${agent.epoch}`}
        />
        <StatCard
          label="Proof Status"
          value={agent.isVerified ? "Verified" : "Unproven"}
          icon={<ProofBadge passed={agent.isVerified} size="sm" animated={false} />}
        />
      </div>
    </div>
  );
}
