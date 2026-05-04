# AWS Deployment Guide — Solved Financial

## Architecture

```
Browser → CloudFront → S3 (client static files)
Browser → CloudFront → S3 (admin static files)
Browser → Nginx → PM2 → Node.js API (EC2)
Node.js  → MongoDB Atlas (cloud DB)
Node.js  → S3 imperial-ventures-assets (file uploads)
```

---

## One-Time AWS Setup (do this first)

### A. EC2 Instance (API Server)

1. Launch an **EC2** instance:
   - AMI: **Ubuntu 22.04 LTS**
   - Type: `t3.small` (or `t3.micro` for low traffic)
   - Storage: 20 GB gp3
   - Security group inbound rules:
     - Port `22` (SSH) — your IP only
     - Port `80` (HTTP) — anywhere
     - Port `443` (HTTPS) — anywhere

2. SSH into the instance and run the setup script:
   ```bash
   scp -i your-key.pem server/scripts/ec2-setup.sh ubuntu@<EC2_IP>:~/
   ssh -i your-key.pem ubuntu@<EC2_IP>
   chmod +x ec2-setup.sh && ./ec2-setup.sh
   ```
   > Edit the script first to put your actual GitHub repo URL.

3. Fill in `.env` on the server:
   ```bash
   nano /home/ubuntu/app/server/.env
   # paste your values (see server/.env.example)
   pm2 restart solved-financial-api
   ```

4. Install Nginx and set up reverse proxy:
   ```bash
   sudo apt-get install -y nginx
   sudo cp /home/ubuntu/app/server/scripts/nginx.conf /etc/nginx/sites-available/solved-financial
   # Edit the server_name to your EC2 IP or domain
   sudo nano /etc/nginx/sites-available/solved-financial
   sudo ln -s /etc/nginx/sites-available/solved-financial /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

5. (Optional) Set up HTTPS with Let's Encrypt:
   ```bash
   sudo snap install --classic certbot
   sudo certbot --nginx -d api.yourdomain.com
   # Then uncomment the HTTPS block in nginx.conf
   ```

---

### B. S3 Buckets (Client + Admin Static Hosting)

Create **two** S3 buckets:

| Bucket | Purpose |
|--------|---------|
| `solvedfinancial-client` | Customer-facing website |
| `solvedfinancial-admin` | Admin panel |

For each bucket:
1. AWS Console → S3 → Create bucket
2. **Uncheck** "Block all public access"
3. Enable **Static website hosting** (index document: `index.html`, error document: `index.html`)
4. Add bucket policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
     }]
   }
   ```

### C. CloudFront Distributions (Optional but recommended)

For each S3 bucket, create a CloudFront distribution:
1. Origin: your S3 bucket's static website endpoint
2. Default root object: `index.html`
3. Error pages: 403/404 → `/index.html` (200) — required for React Router
4. Note the **Distribution ID** — needed for GitHub secrets

---

### D. IAM User for GitHub Actions

Create an IAM user with these permissions (or use an existing one):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::solvedfinancial-client",
        "arn:aws:s3:::solvedfinancial-client/*",
        "arn:aws:s3:::solvedfinancial-admin",
        "arn:aws:s3:::solvedfinancial-admin/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "*"
    }
  ]
}
```
Save the **Access Key ID** and **Secret Access Key**.

---

## GitHub Repository Setup

### Push code to GitHub

```bash
cd "C:\Users\91798\OneDrive\Desktop\Solved Financial"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/solved-financial.git
git push -u origin main
```

### Add GitHub Secrets

Go to: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | e.g. `eu-north-1` |
| `S3_CLIENT_BUCKET` | e.g. `solvedfinancial-client` |
| `S3_ADMIN_BUCKET` | e.g. `solvedfinancial-admin` |
| `CLOUDFRONT_CLIENT_ID` | CloudFront distribution ID for client |
| `CLOUDFRONT_ADMIN_ID` | CloudFront distribution ID for admin |
| `REACT_APP_API_URL` | e.g. `https://api.yourdomain.com/api` or `http://<EC2_IP>/api` |
| `EC2_HOST` | EC2 public IP or domain |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Contents of your `.pem` key file |

> `CLOUDFRONT_CLIENT_ID` and `CLOUDFRONT_ADMIN_ID` are optional — skip if not using CloudFront.

---

## Deploy

After all secrets are added, every `git push origin main` will:
1. Build and deploy the **client** to S3
2. Build and deploy the **admin** to S3
3. SSH into EC2, pull the latest server code, and reload PM2

You can also trigger it manually from **GitHub → Actions → Deploy to AWS → Run workflow**.

---

## Useful EC2 Commands

```bash
pm2 status                        # see all running processes
pm2 logs solved-financial-api     # live logs
pm2 restart solved-financial-api  # restart server
pm2 reload solved-financial-api   # zero-downtime reload

# Check Nginx
sudo nginx -t                     # test config
sudo systemctl status nginx       # check if running
sudo systemctl reload nginx       # reload after config changes
```
