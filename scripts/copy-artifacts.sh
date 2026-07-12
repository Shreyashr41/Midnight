#!/usr/bin/env bash
# copy-artifacts.sh
# Copies compiled Compact contract artifacts from contract/dist/
# to frontend/public/contract/alpha_vault/ so they can be served statically.
#
# Run after: pnpm compile-contract
# Run before: pnpm dev (frontend)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
SRC_DIR="$REPO_ROOT/contract/dist/alpha_vault"
DST_DIR="$REPO_ROOT/frontend/public/contract/alpha_vault"

echo "🔧 Copying contract artifacts..."
echo "   Source: $SRC_DIR"
echo "   Dest:   $DST_DIR"

if [ ! -d "$SRC_DIR" ]; then
  echo "❌ Source directory not found: $SRC_DIR"
  echo "   Run 'pnpm compile-contract' first."
  exit 1
fi

mkdir -p "$DST_DIR"

# Copy all generated files (prover key, verifier key, WASM, JS API)
for artifact in \
  alpha_vault.prover \
  alpha_vault.verifier \
  alpha_vault_bg.wasm \
  alpha_vault.js \
  alpha_vault.d.ts
do
  src_file="$SRC_DIR/$artifact"
  if [ -f "$src_file" ]; then
    cp "$src_file" "$DST_DIR/"
    echo "   ✓ Copied $artifact"
  else
    echo "   ⚠ Missing: $artifact (may be generated under a different name)"
  fi
done

echo ""
echo "✅ Artifacts copied to frontend/public/contract/alpha_vault/"
echo "   FetchZkConfigProvider will load them at /contract/alpha_vault/<name>"
