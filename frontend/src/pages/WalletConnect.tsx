import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, BarChart3, Users } from "lucide-react";
import { ConnectButton } from "../components/ui/ConnectButton";
import { GlassCard } from "../components/ui/GlassCard";
import { use1AMWallet } from "../providers/MidnightProviders";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

const FEATURES = [
  {
    icon: Lock,
    title: "Private Trade Logs",
    description:
      "Agents commit trade history using ZK witnesses. Raw trades are never revealed on-chain — only cryptographic commitments.",
  },
  {
    icon: ShieldCheck,
    title: "Proven Performance",
    description:
      "Returns are proven via zero-knowledge proofs on Midnight. The circuit verifies claims without exposing strategy or positions.",
  },
  {
    icon: BarChart3,
    title: "Verified Leaderboard",
    description:
      "Rankings are based exclusively on on-chain ZK proofs. No self-reporting. No fabrication. Every number is trustless.",
  },
  {
    icon: Users,
    title: "Mock Token Vaults",
    description:
      "Deposit mock tokens into top-performing agent vaults. Withdrawals are always permissioned. No real assets — hackathon demo.",
  },
];

export function WalletConnect() {
  const navigate = useNavigate();
  const { connectionState, connect, isConnected } = use1AMWallet();

  React.useEffect(() => {
    if (isConnected) {
      navigate("/leaderboard");
    }
  }, [isConnected, navigate]);

  const isNotInstalled = connectionState === "not_installed";
  const isConnecting = connectionState === "connecting";

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      {/* Hero background effect */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0,212,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.10) 0%, transparent 60%)",
        }}
      />

      {/* Floating ZK nodes (decorative) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full border border-accent-cyan/20"
          style={{
            width: 8 + i * 6,
            height: 8 + i * 6,
            top: `${15 + i * 12}%`,
            left: `${10 + i * 15}%`,
            opacity: 0.2 - i * 0.02,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}

      {/* Main hero content */}
      <motion.div
        className="mx-auto w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo mark */}
        <motion.div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent-cyan/30 bg-accent-cyan/10"
          style={{ boxShadow: "0 0 40px rgba(0,212,255,0.3), 0 0 80px rgba(0,212,255,0.1)" }}
          animate={{ boxShadow: ["0 0 40px rgba(0,212,255,0.3), 0 0 80px rgba(0,212,255,0.1)", "0 0 60px rgba(0,212,255,0.5), 0 0 100px rgba(0,212,255,0.15)", "0 0 40px rgba(0,212,255,0.3), 0 0 80px rgba(0,212,255,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShieldCheck size={44} className="text-accent-cyan" />
        </motion.div>

        <motion.h1
          className="text-5xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #00d4ff, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Alpha Vault
          </span>
        </motion.h1>

        <motion.p
          className="mt-3 text-lg text-text-secondary max-w-lg mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          AI trading agents prove their performance with zero-knowledge proofs on{" "}
          <span className="text-accent-cyan font-semibold">Midnight</span> —
          without revealing a single trade.
        </motion.p>

        {USE_MOCK_DATA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
            <span className="text-sm text-warning font-mono font-medium">
              DEMO MODE — Mock data active
            </span>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <ConnectButton
            onConnect={connect}
            isConnecting={isConnecting}
            isInstalled={!isNotInstalled}
          />
        </motion.div>

        {USE_MOCK_DATA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <button
              onClick={() => navigate("/leaderboard")}
              className="text-sm text-text-muted hover:text-accent-cyan transition-colors underline underline-offset-4"
            >
              Skip wallet — browse demo leaderboard →
            </button>
          </motion.div>
        )}

        {connectionState === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-danger"
          />
        )}
      </motion.div>

      {/* Feature cards */}
      <motion.div
        className="mx-auto mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <GlassCard className="p-5 h-full">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-cyan/20 bg-accent-cyan/10">
                  <feature.icon size={18} className="text-accent-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
