#!/usr/bin/env bash
set -euo pipefail

MIRROR_PATH="${1:-${MIRROR_PATH:-}}"
SNAPSHOTS_ROOT="${2:-${SNAPSHOTS_ROOT:-}}"
STATE_SOURCE="${3:-${STATE_SOURCE:-}}"

if [[ -z "$MIRROR_PATH" || -z "$SNAPSHOTS_ROOT" || -z "$STATE_SOURCE" ]]; then
  echo "usage: create-recovery-snapshot.sh MIRROR_PATH SNAPSHOTS_ROOT STATE_SOURCE" >&2
  exit 64
fi

[[ "$(git -C "$MIRROR_PATH" rev-parse --is-bare-repository 2>/dev/null)" == "true" ]] || {
  echo "invalid mirror: $MIRROR_PATH" >&2
  exit 65
}
[[ -f "$STATE_SOURCE/current-state.json" && -f "$STATE_SOURCE/CURRENT_STATE.generated.md" ]] || {
  echo "generated state files are missing from: $STATE_SOURCE" >&2
  exit 66
}

mkdir -p "$SNAPSHOTS_ROOT"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
name="snapshot-${timestamp}-$$"
tmp="$SNAPSHOTS_ROOT/.${name}.tmp"
final="$SNAPSHOTS_ROOT/$name"

cleanup() {
  if [[ -d "$tmp" && "$(dirname "$tmp")" == "$SNAPSHOTS_ROOT" ]]; then
    rm -rf -- "$tmp"
  fi
}
trap cleanup EXIT
mkdir "$tmp"

git -C "$MIRROR_PATH" rev-parse refs/heads/main > "$tmp/HEAD.txt"
git -C "$MIRROR_PATH" for-each-ref --format='%(objectname) %(refname)' | sort > "$tmp/refs.txt"
git -C "$MIRROR_PATH" remote get-url origin > "$tmp/origin.txt"
cp "$STATE_SOURCE/current-state.json" "$tmp/current-state.json"
cp "$STATE_SOURCE/CURRENT_STATE.generated.md" "$tmp/CURRENT_STATE.generated.md"
git -C "$MIRROR_PATH" bundle create "$tmp/affiliate-system.bundle" --all
git -C "$MIRROR_PATH" bundle verify "$tmp/affiliate-system.bundle" >/dev/null

{
  echo "snapshot=$name"
  echo "created_at_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf 'head='
  cat "$tmp/HEAD.txt"
  echo "bundle=affiliate-system.bundle"
} > "$tmp/manifest.txt"

(
  cd "$tmp"
  find . -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS
  sha256sum -c SHA256SUMS >/dev/null
)

mv "$tmp" "$final"
trap - EXIT
echo "$final"
