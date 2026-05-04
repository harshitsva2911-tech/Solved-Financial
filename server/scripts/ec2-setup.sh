#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# EC2 first-time setup script
# Run once on a fresh Ubuntu 22.04 EC2 instance as the ubuntu user:
#   chmod +x ec2-setup.sh && ./ec2-setup.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo "==> Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

echo "==> Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> Installing PM2 globally..."
sudo npm install -g pm2

echo "==> Creating PM2 log directory..."
sudo mkdir -p /var/log/pm2
sudo chown ubuntu:ubuntu /var/log/pm2

echo "==> Installing Git..."
sudo apt-get install -y git

echo "==> Cloning repository..."
# Replace YOUR_GITHUB_USERNAME and YOUR_REPO with actual values
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO.git .

echo "==> Installing server dependencies..."
cd server
npm ci --omit=dev

echo "==> Creating .env from example..."
cp .env.example .env
echo ""
echo "!!! IMPORTANT: Edit /home/ubuntu/app/server/.env with your real credentials !!!"
echo "    nano /home/ubuntu/app/server/.env"
echo ""

echo "==> Configuring PM2 to start on system boot..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "==> Starting server with PM2..."
cd /home/ubuntu/app/server
pm2 start ecosystem.config.js --env production
pm2 save

echo ""
echo "==> Setup complete! Server is running."
echo "    Check status: pm2 status"
echo "    View logs:    pm2 logs solved-financial-api"
echo ""
echo "==> Next steps:"
echo "    1. Edit /home/ubuntu/app/server/.env with your real credentials"
echo "    2. pm2 restart solved-financial-api"
echo "    3. Set up Nginx as reverse proxy (see nginx.conf in this directory)"
