#!/usr/bin/env bash
# Install WordPress core, activate plugins, and seed content.
# Run from project root once the WP containers are up:
#   bash cms-wp/bootstrap.sh
set -euo pipefail
export MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*'   # stop Git Bash mangling container paths

DC="docker compose -f cms-wp/docker-compose.yml"
CLI="$DC exec -T cli wp"   # wordpress:cli WORKDIR is already /var/www/html

echo "→ installing WordPress core…"
$CLI core install \
  --url=http://localhost:8080 \
  --title=Fineries\ CMS \
  --admin_user=admin \
  --admin_password=Admin12345! \
  --admin_email=admin@fineries.net \
  --skip-email

echo "→ pretty permalinks…"
$CLI rewrite structure '/%postname%/' --hard

echo "→ activating plugins…"
$CLI plugin activate advanced-custom-fields-pro fineries-cms

echo "→ seeding content…"
$CLI eval-file wp-content/plugins/fineries-cms/seed.php

echo "✔ WordPress ready at http://localhost:8080/wp-admin  (admin / Admin12345!)"
echo "  REST: http://localhost:8080/wp-json/fineries/v1/home"
