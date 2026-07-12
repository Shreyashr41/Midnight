#!/usr/bin/env bash
# setup.sh
# Full dev environment setup for Alpha Vault.
# Installs toolchain, starts Docker services, installs npm deps.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

echo "╔═══════════════════════════════════════════╗"
echo "║   Alpha Vault — Dev Environment Setup     ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# ─── Check prerequisites ────────────────────────────────────────────────────

check_cmd() {
  command -v "$1" &>/dev/null || {
    echo "❌ Required command not found: $1"
    echo "   Please install $2 and re-run this script."
    exit 1
  }
}

check_cmd node   "Node.js ≥ 20 (https://nodejs.org)"
check_cmd pnpm   "pnpm ≥ 9 (npm install -g pnpm)"
check_cmd docker "Docker Desktop (https://docs.docker.com/get-docker/)"

NODE_VERSION=$(node -e "console.log(process.versions.node.split('.')[0])")
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js ≥ 20 required (found $NODE_VERSION)"
  exit 1
fi

echo "✓ Node.js $(node --version)"
echo "✓ pnpm $(pnpm --version)"
echo "✓ Docker $(docker --version | head -1)"
echo ""

# ─── Install Compact toolchain ────────────────────────────────────────────────

echo "1. Checking Compact toolchain..."
if command -v compact &>/dev/null; then
  echo "   ✓ compact $(compact --version 2>/dev/null || echo '(version unknown)')"
else
  echo "   ⚠ 'compact' CLI not found."
  echo "   Install instructions: https://docs.midnight.network/getting-started/installation"
  echo "   The contract will not compile without it, but the frontend demo will still work."
fi
echo ""

# ─── Install 1AM Wallet ────────────────────────────────────────────────────

echo "2. Install 1AM browser extension (if not already installed):"
echo "   https://1am.xyz"
echo "   Required for live wallet integration. Demo mode works without it."
echo ""

# ─── Start Docker services ────────────────────────────────────────────────

echo "3. Starting Docker services (proof-server, devnet)..."
cd "$REPO_ROOT"
if docker compose ps --services 2>/dev/null | grep -q .; then
  echo "   Services already running — skipping."
else
  docker compose up -d
  echo "   ✓ Services started."
  echo "   Waiting 10s for devnet to be ready..."
  sleep 10
fi
echo ""

# ─── Install npm dependencies ──────────────────────────────────────────────

echo "4. Installing dependencies..."
cd "$REPO_ROOT"
pnpm install
echo "   ✓ Dependencies installed."
echo ""

# ─── Compile contract ──────────────────────────────────────────────────────

echo "5. Compiling Compact contract..."
if command -v compact &>/dev/null; then
  cd "$REPO_ROOT/contract"
  pnpm compile || echo "   ⚠ Compile failed — check contract syntax against 'compact' compiler."
  cd "$REPO_ROOT"
  bash scripts/copy-artifacts.sh
else
  echo "   ⚠ Skipped — 'compact' CLI not installed."
fi
echo ""

# ─── Done ──────────────────────────────────────────────────────────────────

echo "╔═══════════════════════════════════════════╗"
echo "║   Setup complete!                          ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  • Start frontend:    cd frontend && pnpm dev"
echo "  • Start bot:         cd bot && pnpm dev"
echo "  • Demo mode (no chain): VITE_USE_MOCK_DATA=true pnpm dev"
echo ""
echo "Open http://localhost:3000 in your browser."
echo "Install 1AM wallet from https://1am.xyz if you haven't already."
