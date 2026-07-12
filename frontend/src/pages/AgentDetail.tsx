import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useProofHistory } from "../hooks/useProofHistory";
import { useAgentVault } from "../hooks/useAgentVault";
import { use1AMWallet } from "../providers/MidnightProviders";
import { AgentHeader } from "../components/agent/AgentHeader";
import { ProofTimeline } from "../components/agent/ProofTimeline";
import { ReturnChart } from "../components/agent/ReturnChart";
import { VaultPanel } from "../components/agent/VaultPanel";
import { GlassCard } from "../components/ui/GlassCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useToast } from "../components/ui/ToastContext";
import { CONTRACT_CONFIG } from "../contract/contractConfig";
import {
  MOCK_EPOCH_RETURNS,
} from "../mock/mockData";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

const ZK_EXPLANATION = [
  {
    step: "1",
    title: "Agent commits trades privately",
    body: "Each trade (timestamp, return, asset) is hashed into a running Pedersen commitment stored as a witness — never revealed on-chain.",
  },
  {
    step: "2",
    title: "Agent generates a ZK proof",
    body: 'The Compact circuit takes the private trade log as witness input, computes the cumulative return in-circuit, and asserts it meets the threshold. The circuit rejects if the claim is false — "proof" is only generated when true.',
  },
  {
    step: "3",
    title: "Only the proof is written on-chain",
    body: "The public ledger records: {epoch, threshold, passed, commitment}. Never raw trades, never strategy details. You can verify the proof; you cannot read the trades.",
  },
  {
    step: "4",
    title: "Leaderboard reflects proven claims only",
    body: "Rankings are ordered by cryptographically proven return. Self-reported numbers are rejected at the contract level.",
  },
];

export function AgentDetail() {
  const { agentId } = useParams<{ agentId: string }>();
  const [searchParams] = useSearchParams();
  const [showExplainer, setShowExplainer] = useState(
    searchParams.get("action") === "deposit"
  );
  const { addToast } = useToast();
  const { isConnected, address } = use1AMWallet();

  const { entries, isLoading: lbLoading } = useLeaderboard(
    USE_MOCK_DATA ? undefined : CONTRACT_CONFIG.address
  );

  const agent = entries.find((e) => e.agentId === agentId);
  const { history, isLoading: histLoading } = useProofHistory(agentId);
  const {
    position,
    totalVaultBalance,
    isLoading: vaultLoading,
    deposit,
    withdraw,
  } = useAgentVault(agentId, address);

  const epochReturns =
    USE_MOCK_DATA && agentId
      ? (MOCK_EPOCH_RETURNS[agentId] ?? [])
      : [];

  const handleDeposit = async (amount: bigint) => {
    addToast({
      type: "pending",
      title: "Submitting deposit…",
      message: "Waiting for transaction confirmation",
    });
    try {
      await deposit(amount);
      addToast({
        type: "success",
        title: "Deposit successful",
        message: `${(Number(amount) / 1_000_000).toFixed(2)} tMIDT deposited`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deposit failed",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleWithdraw = async (amount: bigint) => {
    addToast({
      type: "pending",
      title: "Submitting withdrawal…",
      message: "Waiting for transaction confirmation",
    });
    try {
      await withdraw(amount);
      addToast({
        type: "success",
        title: "Withdrawal successful",
        message: `${(Number(amount) / 1_000_000).toFixed(2)} tMIDT withdrawn`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Withdrawal failed",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  if (lbLoading || !agent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Loading agent data…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Agent header + stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AgentHeader agent={agent} />
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: charts + history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Return chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard className="p-5">
              <h2 className="font-bold text-text-primary mb-4">
                Cumulative Return History
              </h2>
              <ReturnChart data={epochReturns} isLoading={histLoading} />
            </GlassCard>
          </motion.div>

          {/* Proof timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassCard className="p-5">
              <h2 className="font-bold text-text-primary mb-4">
                Proof History
              </h2>
              <ProofTimeline history={history} isLoading={histLoading} />
            </GlassCard>
          </motion.div>

          {/* ZK explainer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlassCard className="overflow-hidden">
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => setShowExplainer((s) => !s)}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle size={16} className="text-accent-purple" />
                  <span className="font-semibold text-text-primary">
                    How ZK Proofs Work Here
                  </span>
                </div>
                {showExplainer ? (
                  <ChevronUp size={16} className="text-text-muted" />
                ) : (
                  <ChevronDown size={16} className="text-text-muted" />
                )}
              </button>

              {showExplainer && (
                <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                  {ZK_EXPLANATION.map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-cyan/30 bg-accent-cyan/10 text-xs font-bold text-accent-cyan">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-sm">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Right column: vault */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VaultPanel
            agentId={agent.agentId}
            totalBalance={totalVaultBalance}
            userPosition={position}
            isConnected={isConnected}
            isLoading={vaultLoading}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
        </motion.div>
      </div>
    </div>
  );
}
