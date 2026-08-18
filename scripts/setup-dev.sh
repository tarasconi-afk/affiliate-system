#!/usr/bin/env bash
set -euo pipefail

command -v node >/dev/null || { echo "Node.js is required" >&2; exit 1; }
command -v npm >/dev/null || { echo "npm is required" >&2; exit 1; }

echo "Node: $(node --version)"
echo "npm: $(npm --version)"
npm ci
npm run build
npm run qa:images
git status --short

echo "Environment ready. Read AGENTS.md and docs/recovery/AI_HANDOFF.md before changing the project."
echo "Do not push or deploy without explicit human authorization."
