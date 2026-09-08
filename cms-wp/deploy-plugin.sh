#!/usr/bin/env bash
# Deploy the fineries-cms plugin to the live WordPress (Hostinger) over SSH.
# Private key stays local (~/.ssh/fineries_deploy); nothing secret is committed.
# Usage: bash cms-wp/deploy-plugin.sh
set -euo pipefail

SSH_KEY="$HOME/.ssh/fineries_deploy"
SSH_HOST="u598979345@82.25.113.111"
SSH_PORT="65002"
REMOTE_CMS="/home/u598979345/domains/fineries.net/public_html/cms"
REMOTE_PLUGINS="$REMOTE_CMS/wp-content/plugins"
LOCAL_WPPLUGINS="$(cd "$(dirname "$0")/wp-plugins" && pwd)"

SSH="ssh -i $SSH_KEY -p $SSH_PORT -o BatchMode=yes $SSH_HOST"

echo "→ Uploading fineries-cms plugin (excluding *.mp4)…"
tar -C "$LOCAL_WPPLUGINS" --exclude='*.mp4' -czf - fineries-cms \
  | $SSH "tar -C '$REMOTE_PLUGINS' -xzf -"

echo "→ Ensuring plugin active + flushing routes…"
$SSH "wp --path='$REMOTE_CMS' plugin activate fineries-cms; wp --path='$REMOTE_CMS' rewrite flush --hard >/dev/null 2>&1 || true"

echo "→ Deployed version:"
$SSH "wp --path='$REMOTE_CMS' plugin get fineries-cms --field=version"

echo "✓ Done."
