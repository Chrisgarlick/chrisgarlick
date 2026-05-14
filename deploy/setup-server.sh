#!/bin/bash
# ═══════════════════════════════════════════════════════════
# SETUP SERVER — Deploy chrisgarlick.com on a fresh Ubuntu droplet
# Run as root on the droplet AFTER nuke-server.sh
#
# Usage: ssh root@your-droplet "bash -s" < deploy/setup-server.sh
#
# Prerequisites:
#   - Fresh Ubuntu 22.04+ droplet
#   - DNS A record: chrisgarlick.com → droplet IP
#   - DNS A record: www.chrisgarlick.com → droplet IP
# ═══════════════════════════════════════════════════════════

set -euo pipefail

DOMAIN="chrisgarlick.com"
APP_DIR="/var/www/chrisgarlick"
APP_USER="deploy"
DB_NAME="cms"
DB_USER="cms"
DB_PASS=$(openssl rand -base64 24)
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_SECRET=$(openssl rand -base64 32)
API_KEY="cms_live_$(openssl rand -hex 32)"

echo "══════════════════════════════════════"
echo "  SETUP SERVER — $DOMAIN"
echo "══════════════════════════════════════"
echo ""

# ── 1. System updates ──
echo "→ Updating system..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl unzip git build-essential

# ── 2. Create deploy user ──
echo "→ Creating deploy user..."
if ! id "$APP_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$APP_USER"
  mkdir -p /home/$APP_USER/.ssh
  cp /root/.ssh/authorized_keys /home/$APP_USER/.ssh/ 2>/dev/null || true
  chown -R $APP_USER:$APP_USER /home/$APP_USER/.ssh
  chmod 700 /home/$APP_USER/.ssh
  chmod 600 /home/$APP_USER/.ssh/authorized_keys 2>/dev/null || true
fi

# ── 3. Install Bun ──
echo "→ Installing Bun..."
if ! command -v bun &>/dev/null; then
  curl -fsSL https://bun.sh/install | bash
  ln -sf /root/.bun/bin/bun /usr/local/bin/bun
  ln -sf /root/.bun/bin/bunx /usr/local/bin/bunx
fi
echo "  Bun $(bun --version)"

# ── 4. Install PostgreSQL 16 ──
echo "→ Installing PostgreSQL 16..."
if ! command -v psql &>/dev/null; then
  apt-get install -y gnupg2
  echo "deb http://apt.postgresql.org/pub/repos/apt noble-pgdg main" > /etc/apt/sources.list.d/pgdg.list
  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/pgdg.gpg
  apt-get update -y
  apt-get install -y postgresql-16
fi
systemctl enable postgresql
systemctl start postgresql

# Create database and user
echo "→ Creating database..."
su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'\" | grep -q 1 || psql -c \"CREATE USER $DB_USER WITH PASSWORD '$DB_PASS'\""
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='$DB_NAME'\" | grep -q 1 || psql -c \"CREATE DATABASE $DB_NAME OWNER $DB_USER\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER\""

# ── 5. Install Redis 7 ──
echo "→ Installing Redis..."
if ! command -v redis-server &>/dev/null; then
  apt-get install -y redis-server
fi
systemctl enable redis-server
systemctl start redis-server

# ── 6. Install Nginx ──
echo "→ Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx

# ── 7. Install Certbot ──
echo "→ Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

# ── 8. Create app directory ──
echo "→ Setting up app directory..."
mkdir -p $APP_DIR
mkdir -p $APP_DIR/media
chown -R $APP_USER:$APP_USER $APP_DIR

# ── 9. Write environment file ──
echo "→ Writing .env..."
cat > $APP_DIR/.env << ENVEOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
REDIS_URL=redis://localhost:6379
JWT_SECRET=$JWT_SECRET
REFRESH_TOKEN_SECRET=$REFRESH_SECRET
SITE_URL=https://$DOMAIN
ADMIN_URL=https://$DOMAIN/admin
MEDIA_PATH=$APP_DIR/media
CMS_API_URL=http://localhost:3005/api
CMS_UPDATE_CHANNEL=production
API_KEY=$API_KEY
NODE_ENV=production
PORT=3005
ENVEOF
chown $APP_USER:$APP_USER $APP_DIR/.env
chmod 600 $APP_DIR/.env

# ── 10. Configure Nginx ──
echo "→ Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINXEOF'
server {
    listen 80;
    server_name chrisgarlick.com www.chrisgarlick.com;

    # Redirect www to non-www
    if ($host = www.chrisgarlick.com) {
        return 301 https://chrisgarlick.com$request_uri;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name www.chrisgarlick.com;

    # SSL certs will be added by certbot
    ssl_certificate /etc/letsencrypt/live/chrisgarlick.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chrisgarlick.com/privkey.pem;

    return 301 https://chrisgarlick.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chrisgarlick.com;

    # SSL certs will be added by certbot
    ssl_certificate /etc/letsencrypt/live/chrisgarlick.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chrisgarlick.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 1000;

    # Media uploads
    client_max_body_size 50M;

    # Static media files — serve directly
    location /media/ {
        alias /var/www/chrisgarlick/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Everything else → proxy to Bun
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# ── 11. Get SSL cert (HTTP only first, then enable HTTPS) ──
echo "→ Getting SSL certificate..."
# Temporarily use a simple HTTP config for certbot
cat > /etc/nginx/sites-available/${DOMAIN}-temp << TEMPEOF
server {
    listen 80;
    server_name chrisgarlick.com www.chrisgarlick.com;
    root /var/www/html;
    location /.well-known/acme-challenge/ { allow all; }
    location / { return 200 'Setting up...'; add_header Content-Type text/plain; }
}
TEMPEOF
ln -sf /etc/nginx/sites-available/${DOMAIN}-temp /etc/nginx/sites-enabled/$DOMAIN
nginx -t && systemctl reload nginx

certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email chris@chrisgarlick.com

# Switch to full config now that certs exist
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-available/${DOMAIN}-temp
nginx -t && systemctl reload nginx

# ── 11b. Kritano CMS-managed redirects ──
# Kritano writes exact-path redirects to a snippet file on every admin save and
# reloads nginx via passwordless sudo. The main nginx config `include`s this file.
echo "→ Setting up Kritano CMS-managed redirects..."
SNIPPET_PATH="/etc/nginx/snippets/kritano-redirects.conf"
touch "$SNIPPET_PATH"
chown $APP_USER:$APP_USER "$SNIPPET_PATH"
chmod 644 "$SNIPPET_PATH"

# Allow the CMS user to validate and reload nginx without a password
cat > /etc/sudoers.d/cms-nginx << SUDOEOF
$APP_USER ALL=(root) NOPASSWD: /usr/sbin/nginx -t, /usr/sbin/nginx -s reload
SUDOEOF
chmod 440 /etc/sudoers.d/cms-nginx

# Append the env var to .env if not already present
if ! grep -q '^NGINX_REDIRECTS_SNIPPET=' "$APP_DIR/.env" 2>/dev/null; then
  echo "NGINX_REDIRECTS_SNIPPET=$SNIPPET_PATH" >> "$APP_DIR/.env"
  chown $APP_USER:$APP_USER "$APP_DIR/.env"
fi

# ── 12. Create systemd service ──
echo "→ Creating systemd service..."
cat > /etc/systemd/system/chrisgarlick.service << SERVICEEOF
[Unit]
Description=Chris Garlick CMS
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/local/bin/bun run start
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICEEOF

systemctl daemon-reload
systemctl enable chrisgarlick

# ── 13. Create deploy script ──
echo "→ Creating deploy helper..."
cat > /usr/local/bin/deploy-site << 'DEPLOYEOF'
#!/bin/bash
set -euo pipefail

APP_DIR="/var/www/chrisgarlick"
APP_USER="deploy"

echo "→ Pulling latest code..."
cd $APP_DIR
sudo -u $APP_USER git pull origin main

echo "→ Installing dependencies..."
sudo -u $APP_USER bun install --frozen-lockfile

echo "→ Running migrations..."
sudo -u $APP_USER bun run migrate

echo "→ Building..."
sudo -u $APP_USER bun run build

echo "→ Restarting service..."
systemctl restart chrisgarlick

echo "→ Done! Site is live."
DEPLOYEOF
chmod +x /usr/local/bin/deploy-site

# ── 14. Setup auto-renewal for SSL ──
echo "→ Setting up SSL auto-renewal..."
systemctl enable certbot.timer

# ── 15. Configure firewall ──
echo "→ Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "══════════════════════════════════════════════════════"
echo "  SERVER READY"
echo "══════════════════════════════════════════════════════"
echo ""
echo "  Next steps:"
echo ""
echo "  1. Clone your repo:"
echo "     su - $APP_USER"
echo "     git clone https://github.com/YOUR/chrisgarlick.git $APP_DIR"
echo "     cd $APP_DIR"
echo ""
echo "  2. Copy the .env (already written):"
echo "     # .env is at $APP_DIR/.env"
echo ""
echo "  3. Install deps & build:"
echo "     bun install"
echo "     bun run migrate"
echo "     bun run build"
echo ""
echo "  4. Add a production start script to package.json:"
echo "     \"start\": \"cms start\""
echo ""
echo "  5. Start the service:"
echo "     sudo systemctl start chrisgarlick"
echo ""
echo "  6. Import content via IO plugin"
echo ""
echo "  7. Future deploys:"
echo "     sudo deploy-site"
echo ""
echo "  Credentials saved to: $APP_DIR/.env"
echo "  API Key: $API_KEY"
echo "  DB Password: $DB_PASS"
echo ""
echo "  SAVE THESE — they won't be shown again."
echo "══════════════════════════════════════════════════════"
