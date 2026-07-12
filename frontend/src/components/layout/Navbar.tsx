import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, LayoutGrid, LogOut, Wallet } from "lucide-react";
import { use1AMWallet } from "../../providers/MidnightProviders";
import { cn } from "../ui/GlassCard";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export function Navbar() {
  const location = useLocation();
  const { isConnected, address, balance, disconnect, connect, connectionState } =
    use1AMWallet();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav
      className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-md"
      style={{ background: "rgba(10,10,15,0.85)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10"
            style={{ boxShadow: "0 0 14px rgba(0,212,255,0.25)" }}
            animate={{ boxShadow: ["0 0 14px rgba(0,212,255,0.25)", "0 0 24px rgba(0,212,255,0.4)", "0 0 14px rgba(0,212,255,0.25)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <ShieldCheck size={20} className="text-accent-cyan" />
          </motion.div>
          <span className="font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
            Alpha Vault
          </span>
          {USE_MOCK_DATA && (
            <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-xs text-warning font-mono">
              DEMO
            </span>
          )}
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink to="/leaderboard" active={isActive("/leaderboard")}>
            <LayoutGrid size={15} />
            Leaderboard
          </NavLink>
        </div>

        {/* Wallet */}
        <div>
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-mono text-xs text-accent-cyan">
                  {truncateAddress(address)}
                </span>
                {balance !== null && (
                  <span className="text-xs text-text-muted">
                    {(Number(balance) / 1e6).toFixed(2)} tMIDT
                  </span>
                )}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-success/30 bg-success/10">
                <Wallet size={16} className="text-success" />
              </div>
              <button
                onClick={disconnect}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-text-muted hover:text-danger hover:border-danger/30 transition-all"
                title="Disconnect"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={connectionState === "connecting"}
              className={cn(
                "flex items-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2",
                "text-sm font-medium text-accent-cyan transition-all",
                "hover:bg-accent-cyan/20 hover:border-accent-cyan/50",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              <Wallet size={15} />
              {connectionState === "connecting" ? "Connecting…" : "Connect 1AM"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-accent-cyan/10 text-accent-cyan"
          : "text-text-secondary hover:text-text-primary hover:bg-white/5"
      )}
    >
      {children}
    </Link>
  );
}
