#!/bin/bash
# ═══════════════════════════════════════════════════════════
# NUKE SERVER — Clean reset of a Digital Ocean Ubuntu droplet
# Run as root on the droplet BEFORE deploying new site
#
# Usage: ssh root@your-droplet "bash -s" < deploy/nuke-server.sh
# ═══════════════════════════════════════════════════════════

set -euo pipefail

echo "══════════════════════════════════════"
echo "  NUKE SERVER — Full clean reset"
echo "══════════════════════════════════════"
echo ""

# Safety check
read -p "This will DESTROY everything on this server. Type 'NUKE' to confirm: " CONFIRM
if [ "$CONFIRM" != "NUKE" ]; then
  echo "Aborted."
  exit 1
fi

echo ""
echo "→ Stopping all services..."
systemctl stop nginx 2>/dev/null || true
systemctl stop php*-fpm 2>/dev/null || true
systemctl stop mysql 2>/dev/null || true
systemctl stop mariadb 2>/dev/null || true
systemctl stop apache2 2>/dev/null || true
systemctl stop postgresql 2>/dev/null || true
systemctl stop redis-server 2>/dev/null || true
systemctl stop chrisgarlick 2>/dev/null || true
pm2 kill 2>/dev/null || true

echo "→ Removing old web stack..."
apt-get purge -y php* mysql* mariadb* apache2* libapache2* 2>/dev/null || true
apt-get autoremove -y 2>/dev/null || true

echo "→ Removing old site files..."
rm -rf /var/www/html
rm -rf /var/www/chrisgarlick
rm -rf /var/www/*
rm -rf /etc/nginx/sites-enabled/*
rm -rf /etc/nginx/sites-available/*

echo "→ Removing old databases..."
# Drop MySQL/MariaDB data
rm -rf /var/lib/mysql
# Drop any existing Postgres data (will reinstall fresh)
apt-get purge -y postgresql* 2>/dev/null || true
rm -rf /var/lib/postgresql
rm -rf /etc/postgresql

echo "→ Removing old SSL certs (will regenerate)..."
rm -rf /etc/letsencrypt/live/chrisgarlick.com
rm -rf /etc/letsencrypt/archive/chrisgarlick.com
rm -rf /etc/letsencrypt/renewal/chrisgarlick.com.conf

echo "→ Cleaning up..."
apt-get autoremove -y
apt-get clean

echo ""
echo "══════════════════════════════════════"
echo "  Server nuked. Ready for fresh setup."
echo "  Run: deploy/setup-server.sh"
echo "══════════════════════════════════════"
