import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, AlertCircle } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "../ui/GlassCard";
import type { VaultPosition, VaultAction } from "../../types/contract";

interface VaultPanelProps {
  agentId: string;
  totalBalance: bigint;
  userPosition: VaultPosition | null;
  isConnected: boolean;
  isLoading: boolean;
  onDeposit: (amount: bigint) => Promise<void>;
  onWithdraw: (amount: bigint) => Promise<void>;
}

function formatBalance(bal: bigint): string {
  if (bal >= 1_000_000n) return `${(Number(bal) / 1_000_000).toFixed(3)}M`;
  if (bal >= 1_000n) return `${(Number(bal) / 1_000).toFixed(2)}K`;
  return bal.toString();
}

export function VaultPanel({
  totalBalance,
  userPosition,
  isConnected,
  isLoading,
  onDeposit,
  onWithdraw,
}: VaultPanelProps) {
  const [action, setAction] = useState<VaultAction>("deposit");
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);

    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setTxError("Enter a valid amount");
      return;
    }

    const amountBigInt = BigInt(Math.floor(parsed * 1_000_000)); // 6 decimals

    setIsPending(true);
    try {
      if (action === "deposit") {
        await onDeposit(amountBigInt);
      } else {
        await onWithdraw(amountBigInt);
      }
      setAmount("");
    } catch (err: unknown) {
      setTxError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
        <span>Vault Position</span>
        {isLoading && (
          <motion.div
            className="h-4 w-4 rounded-full border-2 border-accent-cyan border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        )}
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
            Total TVL
          </p>
          <p className="font-mono font-bold text-text-primary">
            {formatBalance(totalBalance)}{" "}
            <span className="text-xs text-text-muted">tMIDT</span>
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
            Your Position
          </p>
          {userPosition ? (
            <>
              <p className="font-mono font-bold text-accent-cyan">
                {formatBalance(userPosition.deposited)}{" "}
                <span className="text-xs text-text-muted">tMIDT</span>
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {userPosition.sharePercent.toFixed(1)}% share
              </p>
            </>
          ) : (
            <p className="text-sm text-text-muted">—</p>
          )}
        </div>
      </div>

      {/* Action form */}
      {!isConnected ? (
        <p className="text-center text-sm text-text-secondary py-3">
          Connect wallet to deposit or withdraw
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Action toggle */}
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
            {(["deposit", "withdraw"] as VaultAction[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAction(a)}
                className={cn(
                  "flex-1 rounded-md py-2 text-sm font-medium capitalize transition-all",
                  action === a
                    ? a === "deposit"
                      ? "bg-success/20 text-success border border-success/30"
                      : "bg-danger/20 text-danger border border-danger/30"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {a === "deposit" ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <ArrowDownCircle size={14} /> Deposit
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <ArrowUpCircle size={14} /> Withdraw
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Amount input */}
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className={cn(
                "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-20",
                "font-mono text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:border-accent-cyan/50",
                "transition-all"
              )}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted font-mono">
              tMIDT
            </span>
          </div>

          {txError && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2">
              <AlertCircle size={14} className="text-danger shrink-0" />
              <p className="text-xs text-danger">{txError}</p>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isPending || !amount}
            className={cn(
              "w-full rounded-xl py-3 font-semibold text-sm transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              action === "deposit"
                ? "bg-success/20 border border-success/40 text-success hover:bg-success/30"
                : "bg-danger/20 border border-danger/40 text-danger hover:bg-danger/30"
            )}
            whileTap={{ scale: 0.98 }}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Submitting…
              </span>
            ) : (
              <span className="capitalize">{action}</span>
            )}
          </motion.button>
        </form>
      )}
    </GlassCard>
  );
}
