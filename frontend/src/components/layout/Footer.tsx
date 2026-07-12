import React from "react";
import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">Alpha Vault</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Privacy-preserving AI trading performance on Midnight
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <a
              href="https://docs.midnight.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-accent-cyan transition-colors"
            >
              <ExternalLink size={12} />
              Midnight Docs
            </a>
            <a
              href="https://1am.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-accent-cyan transition-colors"
            >
              <ExternalLink size={12} />
              1AM Wallet
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-accent-cyan transition-colors"
            >
              <Github size={12} />
              GitHub
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-text-muted text-center">
            Built on{" "}
            <span className="text-accent-cyan">Midnight</span> — ZK privacy for
            everyone. All rankings are ZK-proven, never self-reported.
          </p>
        </div>
      </div>
    </footer>
  );
}
