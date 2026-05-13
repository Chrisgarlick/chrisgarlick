#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Setup Nginx + SSL for chrisgarlick.com
# Run as root on the droplet
#
# Usage: ssh root@your-droplet "bash -s" < deploy/setup-nginx.sh
# ═══════════════════════════════════════════════════════════

set -euo pipefail

DOMAIN="chrisgarlick.com"
EMAIL="chris@chrisgarlick.com"

echo "══════════════════════════════════════"
echo "  Nginx + SSL Setup"
echo "══════════════════════════════════════"
echo ""

# ── 1. Install Nginx + Certbot ──
echo "→ Installing Nginx & Certbot..."
apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable nginx

# ── 2. Temp config for SSL cert ──
echo "→ Creating temp config for SSL..."
cat > /etc/nginx/sites-available/${DOMAIN}-temp << 'EOF'
server {
    listen 80;
    server_name chrisgarlick.com www.chrisgarlick.com;
    location /.well-known/acme-challenge/ { allow all; }
    location / { return 200 'Setting up...'; add_header Content-Type text/plain; }
}
EOF

ln -sf /etc/nginx/sites-available/${DOMAIN}-temp /etc/nginx/sites-enabled/${DOMAIN}
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ── 3. Get SSL cert ──
echo "→ Obtaining SSL certificate..."
certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

# ── 4. Security headers snippet ──
echo "→ Creating security headers snippet..."
mkdir -p /etc/nginx/snippets
cat > /etc/nginx/snippets/security-headers.conf << 'HEADERSEOF'
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src 'self' https://www.googletagmanager.com; frame-ancestors 'self';" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
HEADERSEOF

# ── 5. Full Nginx config ──
echo "→ Writing production Nginx config..."
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINXEOF'
server {
    listen 80;
    server_name chrisgarlick.com www.chrisgarlick.com;

    if ($host = www.chrisgarlick.com) {
        return 301 https://chrisgarlick.com$request_uri;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    http2 on;
    server_name www.chrisgarlick.com;

    ssl_certificate /etc/letsencrypt/live/chrisgarlick.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chrisgarlick.com/privkey.pem;

    return 301 https://chrisgarlick.com$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name chrisgarlick.com;

    ssl_certificate /etc/letsencrypt/live/chrisgarlick.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chrisgarlick.com/privkey.pem;

    # SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Hide server version
    server_tokens off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src 'self' https://www.googletagmanager.com; frame-ancestors 'self';" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 1000;

    # Media uploads
    client_max_body_size 50M;

    # Static files root
    root /var/www/chrisgarlick/dist/client;

    # Redirect /blog/* → /article/*
    location /blog/ {
        rewrite ^/blog/(.*)$ /article/$1 permanent;
    }
    location = /blog {
        return 301 /article;
    }

    # Static media files
    location /media/ {
        alias /var/www/chrisgarlick/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        include /etc/nginx/snippets/security-headers.conf;
    }

    # Rebuild webhook → proxy to rebuild service
    location = /api/rebuild {
        proxy_pass http://127.0.0.1:3006/rebuild;
        proxy_set_header Authorization $http_authorization;
        proxy_read_timeout 120s;
    }

    # API → proxy to CMS
    location /api/ {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin → proxy to CMS
    location /admin {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Contact form → proxy to Astro SSR
    location /contact/submit {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache Astro hashed assets
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        include /etc/nginx/snippets/security-headers.conf;
    }

    # Everything else → static files
    location / {
        try_files $uri $uri/index.html $uri.html =404;
        add_header Cache-Control "public, max-age=3600";
        include /etc/nginx/snippets/security-headers.conf;
    }

    error_page 404 /404.html;
}
NGINXEOF

# ── 5. Activate ──
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-available/${DOMAIN}-temp
nginx -t && systemctl reload nginx

echo ""
echo "══════════════════════════════════════"
echo "  Nginx + SSL ready"
echo "  https://chrisgarlick.com"
echo "══════════════════════════════════════"
