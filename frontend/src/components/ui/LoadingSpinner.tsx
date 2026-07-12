import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function LoadingSpinner({ size = "md", label }: LoadingSpinnerProps) {
  const dims = { sm: 32, md: 48, lg: 64 };
  const d = dims[size];

  // Hexagon path for ZK-themed spinner
  const hex = (cx: number, cy: number, r: number): string => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return `M ${pts.join(" L ")} Z`;
  };

  const cx = d / 2;
  const r = d * 0.38;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.svg
        width={d}
        height={d}
        viewBox={`0 0 ${d} ${d}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <motion.path
          d={hex(cx, cx, r)}
          fill="none"
          stroke="url(#spinGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${r * 2} ${r * 4}`}
          animate={{
            strokeDashoffset: [0, -(r * 6)],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx={cx}
          cy={cx}
          r={r * 0.3}
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          opacity={0.6}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </motion.svg>
      {label && (
        <p className="text-sm text-text-secondary animate-pulse">{label}</p>
      )}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/5 bg-white/5 overflow-hidden ${className}`}
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s linear infinite",
        }}
      />
    </div>
  );
}
