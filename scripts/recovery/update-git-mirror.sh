#!/usr/bin/env bash
set -euo pipefail

SOURCE_REPO="${1:-${SOURCE_REPO:-}}"
MIRROR_PATH="${2:-${MIRROR_PATH:-}}"

if [[ -z "$SOURCE_REPO" || -z "$MIRROR_PATH" ]]; then
  echo "usage: update-git-mirror.sh SOURCE_REPO MIRROR_PATH" >&2
  exit 64
fi

if [[ "$SOURCE_REPO" =~ ^https?://[^/]+@ ]]; then
  echo "refusing a source URL containing embedded credentials" >&2
  exit 65
fi

if [[ -e "$MIRROR_PATH" ]]; then
  if [[ "$(git -C "$MIRROR_PATH" rev-parse --is-bare-repository 2>/dev/null)" != "true" ]]; then
    echo "mirror path exists but is not a bare Git repository: $MIRROR_PATH" >&2
    exit 66
  fi
  git -C "$MIRROR_PATH" remote set-url origin "$SOURCE_REPO"
  git -C "$MIRROR_PATH" remote update --prune
else
  mkdir -p "$(dirname "$MIRROR_PATH")"
  git clone --mirror "$SOURCE_REPO" "$MIRROR_PATH"
fi

git -C "$MIRROR_PATH" fsck --full
git -C "$MIRROR_PATH" show-ref --head >/dev/null
git -C "$MIRROR_PATH" rev-parse --verify refs/heads/main
