#!/usr/bin/env bash
set -euo pipefail

RECOVERY_ROOT="${RECOVERY_ROOT:-/srv/ferramenta-clara-recovery}"
SOURCE_REPO="${SOURCE_REPO:-https://github.com/tarasconi-afk/affiliate-system.git}"
MIRROR_PATH="$RECOVERY_ROOT/mirror/affiliate-system.git"
SNAPSHOTS_ROOT="$RECOVERY_ROOT/snapshots"
STATE_SOURCE="$RECOVERY_ROOT/state"
SCRIPTS_ROOT="$RECOVERY_ROOT/scripts"
LOGS_ROOT="$RECOVERY_ROOT/logs"

[[ "$RECOVERY_ROOT" == /* && "$RECOVERY_ROOT" != "/" ]] || {
  echo "invalid recovery root" >&2
  exit 64
}
mkdir -p "$LOGS_ROOT"
log="$LOGS_ROOT/daily-$(date -u +%Y%m%d).log"
exec >>"$log" 2>&1
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] daily recovery start"

exec 9>"$RECOVERY_ROOT/.daily-recovery.lock"
if ! flock -n 9; then
  echo "another daily recovery is running" >&2
  exit 75
fi

"$SCRIPTS_ROOT/update-git-mirror.sh" "$SOURCE_REPO" "$MIRROR_PATH"
node "$SCRIPTS_ROOT/generate-current-state.mjs" \
  --repo "$MIRROR_PATH" \
  --output "$STATE_SOURCE" \
  --ref refs/heads/main
snapshot="$("$SCRIPTS_ROOT/create-recovery-snapshot.sh" "$MIRROR_PATH" "$SNAPSHOTS_ROOT" "$STATE_SOURCE")"
git -C "$MIRROR_PATH" bundle verify "$snapshot/affiliate-system.bundle" >/dev/null
(cd "$snapshot" && sha256sum -c SHA256SUMS >/dev/null)
snapshot_source="$(node -e 'const fs = require("fs"); process.stdout.write(JSON.parse(fs.readFileSync(process.argv[1], "utf8")).source_commit);' "$snapshot/current-state.json")"
bundle_head="$(git bundle list-heads "$snapshot/affiliate-system.bundle" refs/heads/main | cut -d ' ' -f 1)"
if [[ "$snapshot_source" != "$bundle_head" ]]; then
  echo "snapshot source_commit does not match bundle main" >&2
  exit 78
fi

if [[ -e "$RECOVERY_ROOT/latest" && ! -L "$RECOVERY_ROOT/latest" ]]; then
  echo "refusing to replace non-symlink latest" >&2
  exit 76
fi
ln -sfn "snapshots/$(basename "$snapshot")" "$RECOVERY_ROOT/latest"

mapfile -t expired < <(
  find "$SNAPSHOTS_ROOT" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' |
    grep -E '^snapshot-[0-9]{8}T[0-9]{6}Z-[0-9]+$' |
    sort -r |
    tail -n +31 || true
)
for name in "${expired[@]}"; do
  candidate="$SNAPSHOTS_ROOT/$name"
  if [[ "$name" =~ ^snapshot-[0-9]{8}T[0-9]{6}Z-[0-9]+$ && "$(dirname "$candidate")" == "$SNAPSHOTS_ROOT" && -d "$candidate" ]]; then
    rm -rf -- "$candidate"
  else
    echo "refusing unsafe retention target: $candidate" >&2
    exit 77
  fi
done

echo "snapshot=$snapshot"
echo "retention=30"
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] daily recovery success"
