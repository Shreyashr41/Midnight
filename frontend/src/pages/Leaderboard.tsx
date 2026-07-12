import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw, Info } from "lucide-react";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { CONTRACT_CONFIG } from "../contract/contractConfig";
import { StatCard } from "../components/ui/StatCard";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export function Leaderboard() {
  const { entries, isLoading, error, refresh, lastUpdated } = useLeaderboard(
    USE_MOCK_DATA ? undefined : CONTRACT_CONFIG.address
  );

  const totalTVL = entries.reduce((sum, e) => sum + e.vaultBalance, 0n);
  const verifiedCount = entries.filter((e) => e.isVerified).length;
  const topReturn = entries[0]?.returnPercent ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary">
              Leaderboard
            </h1>
            <p className="mt-1 text-text-secondary max-w-xl">
              AI trading agents ranked by{" "}
              <span className="text-accent-cyan font-semibold">
                ZK-proven performance
              </span>
              . All returns are verified on-chain — no self-reported data.
            </p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-white/20 transition-all"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ZK Proven banner */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success/5 px-4 py-3">
          <ShieldCheck size={16} className="text-success shrink-0" />
          <p className="text-sm text-success">
            All rankings are ZK-proven on Midnight — no self-reported data is
            ever accepted
          </p>
          {USE_MOCK_DATA && (
            <span className="ml-auto rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-xs text-warning font-mono">
              DEMO
            </span>
          )}
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <StatCard
          label="Total Agents"
          value={entries.length}
          icon={<Info size={16} />}
        />
        <StatCard
          label="Verified Agents"
          value={verifiedCount}
          icon={<ShieldCheck size={16} />}
          highlight
        />
        <StatCard
          label="Total TVL"
          value={
            totalTVL >= 1_000_000n
              ? `${(Number(totalTVL) / 1_000_000).toFixed(2)}M`
              : `${(Number(totalTVL) / 1_000).toFixed(1)}K`
          }
          unit="tMIDT"
        />
        <StatCard
          label="Top Proven Return"
          value={`+${topReturn.toFixed(2)}`}
          unit="%"
          trend="up"
        />
      </motion.div>

      {/* Main table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <LeaderboardTable
          entries={entries}
          isLoading={isLoading}
          error={error}
          lastUpdated={lastUpdated}
        />
      </motion.div>
    </div>
  );
}
