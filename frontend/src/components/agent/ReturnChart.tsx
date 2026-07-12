import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { EpochReturn } from "../../mock/mockData";

interface ReturnChartProps {
  data: EpochReturn[];
  isLoading?: boolean;
}

interface TooltipPayload {
  value: number;
  dataKey: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const cumulative = payload.find((p) => p.dataKey === "cumulativeBps");
  const epoch = payload.find((p) => p.dataKey === "returnBps");

  return (
    <div className="rounded-xl border border-white/15 bg-bg-elevated/95 backdrop-blur-sm px-4 py-3 shadow-glass">
      <p className="text-xs text-text-muted mb-2">Epoch {label}</p>
      {epoch && (
        <p className={`text-sm font-mono ${epoch.value >= 0 ? "text-success" : "text-danger"}`}>
          Epoch return: {epoch.value >= 0 ? "+" : ""}
          {(epoch.value / 100).toFixed(2)}%
        </p>
      )}
      {cumulative && (
        <p className="text-sm font-mono text-accent-cyan">
          Cumulative: +{(cumulative.value / 100).toFixed(2)}%
        </p>
      )}
    </div>
  );
}

export function ReturnChart({ data, isLoading = false }: ReturnChartProps) {
  if (isLoading) {
    return (
      <div className="h-64 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-white/5 bg-white/5">
        <p className="text-text-muted">No return data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="cumulativeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="epoch"
          tick={{ fill: "#475569", fontSize: 11, fontFamily: "monospace" }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "Epoch",
            position: "insideBottom",
            offset: -2,
            fill: "#475569",
            fontSize: 11,
          }}
        />
        <YAxis
          tickFormatter={(v: number) => `${(v / 100).toFixed(0)}%`}
          tick={{ fill: "#475569", fontSize: 11, fontFamily: "monospace" }}
          tickLine={false}
          axisLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />

        {/* Per-epoch return bars (subtle) */}
        <Line
          type="monotone"
          dataKey="returnBps"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
          dot={false}
          strokeDasharray="4 4"
        />

        {/* Cumulative return — glowing line */}
        <Line
          type="monotone"
          dataKey="cumulativeBps"
          stroke="url(#cumulativeGrad)"
          strokeWidth={2.5}
          dot={{
            fill: "#00d4ff",
            stroke: "#00d4ff",
            strokeWidth: 0,
            r: 3,
            filter: "drop-shadow(0 0 4px #00d4ff)",
          }}
          activeDot={{
            fill: "#00d4ff",
            stroke: "#8b5cf6",
            strokeWidth: 2,
            r: 5,
            filter: "drop-shadow(0 0 8px #00d4ff)",
          }}
          filter="drop-shadow(0 0 3px rgba(0,212,255,0.5))"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
