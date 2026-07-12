import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { WalletConnect } from "./pages/WalletConnect";
import { Leaderboard } from "./pages/Leaderboard";
import { AgentDetail } from "./pages/AgentDetail";
import { MidnightProviders } from "./providers/MidnightProviders";
import { ZkConfigProvider } from "./providers/ZkConfigProvider";
import { ToastProvider } from "./components/ui/ToastContext";

export default function App() {
  return (
    <MidnightProviders>
      <ZkConfigProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Standalone connect page — no layout chrome */}
              <Route path="/" element={<WalletConnect />} />

              {/* App routes inside full layout */}
              <Route element={<Layout />}>
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/agent/:agentId" element={<AgentDetail />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ZkConfigProvider>
    </MidnightProviders>
  );
}
