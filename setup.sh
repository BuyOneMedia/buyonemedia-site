#!/bin/bash
# ============================================================
# Buy One Media LLC — buyonemedia.com Server Setup
# Run as root on Hetzner server: 178.156.209.250
# ============================================================

set -e

DOMAIN="buyonemedia.com"
WEBROOT="/var/www/$DOMAIN"
REPO="https://github.com/BuyOneMedia/buyonemedia-site.git"
DEPLOY_SECRET="bom_deploy_$(openssl rand -hex 12)"
DEPLOY_SCRIPT="/usr/local/bin/deploy-buyonemedia.sh"
WEBHOOK_PORT="9001"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   Buy One Media — Server Setup       ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── 1. DETECT WEB SERVER ──────────────────────────────────
echo "▶ Detecting web server..."

NGINX_RUNNING=false
APACHE_RUNNING=false

if systemctl is-active --quiet nginx 2>/dev/null; then
  NGINX_RUNNING=true
  echo "  ✓ Nginx is running"
fi

if systemctl is-active --quiet apache2 2>/dev/null; then
  APACHE_RUNNING=true
  echo "  ✓ Apache2 is running"
fi

if [ "$NGINX_RUNNING" = false ] && [ "$APACHE_RUNNING" = false ]; then
  echo "  ⚠ No web server detected. Installing Nginx..."
  apt-get update -qq && apt-get install -y -qq nginx
  systemctl enable nginx && systemctl start nginx
  NGINX_RUNNING=true
fi

# ── 2. INSTALL DEPENDENCIES ──────────────────────────────
echo ""
echo "▶ Checking dependencies..."

command -v git  >/dev/null 2>&1 || { apt-get install -y -qq git;  echo "  ✓ Installed git"; }
command -v node >/dev/null 2>&1 || echo "  ✓ Node already present"

# Install webhook listener if not present
if ! command -v webhook &>/dev/null; then
  echo "  ▸ Installing webhook listener..."
  apt-get install -y -qq webhook 2>/dev/null || {
    # Fallback: install via Go binary
    wget -q https://github.com/adnanh/webhook/releases/download/2.8.1/webhook-linux-amd64.tar.gz -O /tmp/webhook.tar.gz
    tar -xzf /tmp/webhook.tar.gz -C /usr/local/bin --strip-components=1
    chmod +x /usr/local/bin/webhook
  }
  echo "  ✓ Webhook listener installed"
fi

# ── 3. CREATE WEBROOT & CLONE REPO ───────────────────────
echo ""
echo "▶ Setting up webroot at $WEBROOT..."

mkdir -p "$WEBROOT"

if [ -d "$WEBROOT/.git" ]; then
  echo "  ▸ Repo already cloned, pulling latest..."
  cd "$WEBROOT" && git pull origin main
else
  echo "  ▸ Cloning repo..."
  git clone "$REPO" "$WEBROOT"
fi

# Set ownership
chown -R www-data:www-data "$WEBROOT"
chmod -R 755 "$WEBROOT"
echo "  ✓ Webroot ready"

# ── 4. CREATE DEPLOY SCRIPT ──────────────────────────────
echo ""
echo "▶ Creating auto-deploy script..."

cat > "$DEPLOY_SCRIPT" << 'DEPLOY'
#!/bin/bash
cd /var/www/buyonemedia.com
git pull origin main
chown -R www-data:www-data /var/www/buyonemedia.com
echo "[$(date)] Deployed buyonemedia.com" >> /var/log/buyonemedia-deploy.log
DEPLOY

chmod +x "$DEPLOY_SCRIPT"
echo "  ✓ Deploy script created at $DEPLOY_SCRIPT"

# ── 5. CONFIGURE VHOST ───────────────────────────────────
echo ""
echo "▶ Creating vhost config..."

if [ "$NGINX_RUNNING" = true ]; then

  cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $WEBROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    # Webhook endpoint for auto-deploy
    location /webhook-deploy {
        proxy_pass http://127.0.0.1:$WEBHOOK_PORT/hooks/deploy-buyonemedia;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    access_log /var/log/nginx/${DOMAIN}_access.log;
    error_log  /var/log/nginx/${DOMAIN}_error.log;
}
EOF

  # Enable site
  ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN

  # Test and reload
  nginx -t && systemctl reload nginx
  echo "  ✓ Nginx vhost configured"

fi

if [ "$APACHE_RUNNING" = true ]; then

  cat > /etc/apache2/sites-available/$DOMAIN.conf << EOF
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    DocumentRoot $WEBROOT

    <Directory $WEBROOT>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_error.log
    CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_access.log combined
</VirtualHost>
EOF

  a2ensite $DOMAIN.conf
  systemctl reload apache2
  echo "  ✓ Apache vhost configured"

fi

# ── 6. CONFIGURE WEBHOOK AUTO-DEPLOY ─────────────────────
echo ""
echo "▶ Setting up GitHub webhook listener..."

HOOKS_DIR="/etc/webhook"
mkdir -p "$HOOKS_DIR"

cat > "$HOOKS_DIR/hooks.json" << EOF
[
  {
    "id": "deploy-buyonemedia",
    "execute-command": "$DEPLOY_SCRIPT",
    "command-working-directory": "$WEBROOT",
    "response-message": "Deploying buyonemedia.com...",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "$DEPLOY_SECRET",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
EOF

# Create systemd service for webhook
cat > /etc/systemd/system/webhook-buyonemedia.service << EOF
[Unit]
Description=GitHub Webhook Listener for buyonemedia.com
After=network.target

[Service]
ExecStart=/usr/local/bin/webhook -hooks $HOOKS_DIR/hooks.json -port $WEBHOOK_PORT -verbose
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable webhook-buyonemedia
systemctl start webhook-buyonemedia
echo "  ✓ Webhook listener running on port $WEBHOOK_PORT"

# ── 7. INSTALL CERTBOT / SSL ─────────────────────────────
echo ""
echo "▶ Setting up SSL (Let's Encrypt)..."
if ! command -v certbot &>/dev/null; then
  apt-get install -y -qq certbot
  [ "$NGINX_RUNNING" = true ]  && apt-get install -y -qq python3-certbot-nginx
  [ "$APACHE_RUNNING" = true ] && apt-get install -y -qq python3-certbot-apache
fi

if [ "$NGINX_RUNNING" = true ]; then
  certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email hello@buyonemedia.com --redirect && echo "  ✓ SSL certificate installed" || echo "  ⚠ SSL setup failed — run manually: certbot --nginx -d $DOMAIN"
fi

# ── 8. DONE ───────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  SETUP COMPLETE                                  ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║                                                      ║"
echo "║  Site live at:  http://$DOMAIN          ║"
echo "║  Webroot:       $WEBROOT           ║"
echo "║  Deploy log:    /var/log/buyonemedia-deploy.log      ║"
echo "║                                                      ║"
echo "║  ── GITHUB WEBHOOK SETUP (do this once) ──           ║"
echo "║  Repo: github.com/BuyOneMedia/buyonemedia-site       ║"
echo "║  Settings → Webhooks → Add webhook                   ║"
echo "║                                                      ║"
printf "║  Payload URL:                                        ║\n"
printf "║  http://178.156.209.250/webhook-deploy               ║\n"
printf "║                                                      ║\n"
printf "║  Content type: application/json                      ║\n"
printf "║  Secret: %-43s║\n" "$DEPLOY_SECRET"
echo "║                                                      ║"
echo "║  ── WHAT TO DO NEXT ──                               ║"
echo "║  1. Add webhook in GitHub (details above)            ║"
echo "║  2. Point DNS A record → 178.156.209.250             ║"
echo "║  3. Push any commit to test auto-deploy              ║"
echo "║                                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
