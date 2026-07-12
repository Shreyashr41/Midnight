import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0a0a0f",
          surface: "#12121a",
          elevated: "#1a1a28",
        },
        accent: {
          cyan: "#00d4ff",
          purple: "#8b5cf6",
          "cyan-dim": "#00d4ff40",
          "purple-dim": "#8b5cf640",
        },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#475569",
        },
        rank: {
          gold: "#fbbf24",
          silver: "#94a3b8",
          bronze: "#cd7f32",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-border":
          "linear-gradient(135deg, rgba(0,212,255,0.3), rgba(139,92,246,0.3))",
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(0,212,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(139,92,246,0.15) 0%, transparent 60%)",
      },
      boxShadow: {
        glass: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glow-cyan": "0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.2)",
        "glow-purple": "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)",
        "glow-green": "0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.2)",
        "glow-gold": "0 0 12px rgba(251,191,36,0.6)",
        "glow-silver": "0 0 12px rgba(148,163,184,0.5)",
        "glow-bronze": "0 0 12px rgba(205,127,50,0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
