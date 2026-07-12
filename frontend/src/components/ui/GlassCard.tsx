import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(...inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "green" | "none";
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  glowColor = "none",
  onClick,
}: GlassCardProps) {
  const glowClasses = {
    cyan: "hover:shadow-glow-cyan hover:border-accent-cyan/40",
    purple: "hover:shadow-glow-purple hover:border-accent-purple/40",
    green: "hover:shadow-glow-green hover:border-success/40",
    none: "",
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm",
        "transition-all duration-300",
        glowClasses[glowColor],
        onClick && "cursor-pointer",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        boxShadow:
          "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      onClick={onClick}
    >
      {/* Gradient border overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))",
          padding: "1px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}
