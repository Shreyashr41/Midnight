import React from "react";
import { motion } from "framer-motion";
import { Wallet, ExternalLink } from "lucide-react";
import { cn } from "./GlassCard";

interface ConnectButtonProps {
  onConnect: () => void;
  isConnecting?: boolean;
  isInstalled?: boolean;
}

export function ConnectButton({
  onConnect,
  isConnecting = false,
  isInstalled = true,
}: ConnectButtonProps) {
  if (!isInstalled) {
    return (
      <a
        href="https://1am.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-6 py-3",
          "border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan",
          "font-semibold transition-all hover:bg-accent-cyan/20 hover:border-accent-cyan/50",
          "text-sm"
        )}
      >
        <ExternalLink size={16} />
        Install 1AM Wallet
      </a>
    );
  }

  return (
    <motion.button
      onClick={onConnect}
      disabled={isConnecting}
      className={cn(
        "relative inline-flex items-center gap-3 rounded-xl px-8 py-4",
        "font-semibold text-base transition-all duration-300",
        "disabled:cursor-not-allowed disabled:opacity-70",
        "overflow-hidden"
      )}
      style={{
        background: "linear-gradient(135deg, #00d4ff20, #8b5cf620)",
        border: "1px solid rgba(0, 212, 255, 0.4)",
        color: "#f1f5f9",
        boxShadow: isConnecting
          ? "0 0 30px rgba(0,212,255,0.4)"
          : "0 0 20px rgba(0,212,255,0.2)",
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      animate={
        !isConnecting
          ? {
              boxShadow: [
                "0 0 20px rgba(0,212,255,0.2)",
                "0 0 35px rgba(0,212,255,0.4)",
                "0 0 20px rgba(0,212,255,0.2)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Shimmer effect */}
      {isConnecting && (
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 50%, transparent 100%)",
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {isConnecting ? (
        <motion.div
          className="h-5 w-5 rounded-full border-2 border-accent-cyan border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <Wallet size={20} className="text-accent-cyan" />
      )}

      <span>
        {isConnecting ? "Connecting..." : "Connect 1AM Wallet"}
      </span>
    </motion.button>
  );
}
