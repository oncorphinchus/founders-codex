# 🚀 **Digital Ocean Deployment Guide - The Founder's Codex**

## 📋 **Complete Backend Deployment Walkthrough**

This guide will walk you through deploying The Founder's Codex backend API to Digital Ocean using App Platform, which is the easiest and most reliable method.

---

## 🎯 **Prerequisites**

### **What You Need:**
- ✅ Digital Ocean account ([sign up here](https://www.digitalocean.com/))
- ✅ GitHub account (to connect your repository)
- ✅ Your project pushed to GitHub
- ✅ Credit card for Digital Ocean billing

### **Current App Status:**
- ✅ **Backend API**: Production-ready and tested
- ✅ **Database**: PostgreSQL schema complete
- ✅ **Dependencies**: All installed and working
- ⚠️ **Frontend**: React Native has build issues (deploy backend first)

---

## 🌊 **Method 1: Digital Ocean App Platform (Recommended)**

### **Why App Platform?**
- 🔄 **Automatic deployments** from GitHub
- 🎯 **Zero server management** 
- 📈 **Auto-scaling** based on traffic
- 🔒 **Built-in SSL certificates**
- 💾 **Managed PostgreSQL** database
- 💰 **Predictable pricing** (~$12-25/month)

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub** (if not already done):
```bash
cd /Users/phish/Documents/The\ Projeect/founders-codex
git add .
git commit -m "Ready for Digital Ocean deployment"
git push origin main
```

2. **Create production environment file**:
```bash
# Create .env.production (will be configured in DO dashboard)
cat > .env.production << 'EOF'
# These will be set in Digital Ocean App Platform
DB_HOST=${db.HOSTNAME}
DB_PORT=${db.PORT}
DB_USERNAME=${db.USERNAME}
DB_PASSWORD=${db.PASSWORD}
DB_NAME=${db.DATABASE}
NODE_ENV=production
PORT=3000
EOF
```

### **Step 2: Create Digital Ocean App**

1. **Go to Digital Ocean Console**:
   - Visit [cloud.digitalocean.com](https://cloud.digitalocean.com/)
   - Click **"Create"** → **"Apps"**

2. **Connect GitHub Repository**:
   - Choose **"GitHub"** as source
   - Authorize Digital Ocean to access your repositories
   - Select your `founders-codex` repository
   - Choose `main` branch
   - Enable **"Autodeploy"** for automatic updates

3. **Configure App Settings**:
   ```yaml
   Name: founders-codex-api
   Region: Choose closest to your users (e.g., "New York" for US East)
   Branch: main
   Autodeploy: Enabled
   ```

### **Step 3: Configure Build Settings**

1. **App Specification**:
   ```yaml
   # Digital Ocean will auto-detect, but you can customize:
   
   Build Command: npm run build:api
   Run Command: node dist/api/main.*.js
   HTTP Port: 3000
   Environment: Node.js
   Instance Size: Basic ($12/month) or Professional ($24/month)
   Instance Count: 1 (can scale later)
   ```

2. **Add Environment Variables**:
   In the app dashboard, go to **Settings** → **Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=3000
   
   # Database variables will be auto-populated when you add the database
   ```

### **Step 4: Add PostgreSQL Database**

1. **In your App Platform dashboard**:
   - Go to **"Database"** tab
   - Click **"Add Database"**
   - Choose **"PostgreSQL"**

2. **Database Configuration**:
   ```yaml
   Database Name: founders-codex-db
   Version: PostgreSQL 14
   Size: Basic ($15/month)
   Datacenter: Same as your app
   ```

3. **Database will auto-configure these environment variables**:
   ```bash
   DATABASE_URL=${db.DATABASE_URL}
   DB_HOST=${db.HOSTNAME}
   DB_PORT=${db.PORT}
   DB_USERNAME=${db.USERNAME}
   DB_PASSWORD=${db.PASSWORD}
   DB_NAME=${db.DATABASE}
   ```

### **Step 5: Deploy!**

1. **Click "Create Resources"**
   - Digital Ocean will automatically:
     - Build your Node.js application
     - Create the PostgreSQL database
     - Deploy everything
     - Provide HTTPS URLs

2. **Monitor Deployment**:
   - Watch the **"Runtime Logs"** for any issues
   - First deployment takes 5-10 minutes

3. **Get Your URLs**:
   ```bash
   # You'll receive URLs like:
   App URL: https://founders-codex-api-xxxxx.ondigitalocean.app
   Database: Managed internally
   ```

---

## 🔧 **Method 2: Digital Ocean Droplet (Advanced)**

### **When to Use Droplets:**
- 💰 More cost control (starts at $4/month)
- 🔧 Full server control
- ⚙️ Custom configurations needed
- 📊 Multiple applications on one server

### **Step 1: Create Droplet**

1. **Create New Droplet**:
   ```yaml
   Image: Ubuntu 22.04 LTS
   Size: Basic - $12/month (2GB RAM, 1 vCPU)
   Datacenter: Choose nearest region
   Authentication: SSH Key (recommended) or Password
   ```

2. **Connect to your server**:
```bash
ssh root@your_droplet_ip
```

### **Step 2: Server Setup**

1. **Update system and install Node.js**:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Install PM2 for process management
npm install -g pm2

# Install Git
apt install git -y
```

2. **Configure PostgreSQL**:
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE founders_codex;
CREATE USER founders_codex_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE founders_codex TO founders_codex_user;
\q

# Configure PostgreSQL for external connections
nano /etc/postgresql/14/main/postgresql.conf
# Change: listen_addresses = 'localhost' to listen_addresses = '*'

nano /etc/postgresql/14/main/pg_hba.conf
# Add: host founders_codex founders_codex_user 0.0.0.0/0 md5

systemctl restart postgresql
```

### **Step 3: Deploy Application**

1. **Clone your repository**:
```bash
cd /opt
git clone https://github.com/yourusername/founders-codex.git
cd founders-codex
```

2. **Install dependencies and build**:
```bash
npm install
npx nx build api
```

3. **Create production environment**:
```bash
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=founders_codex_user
DB_PASSWORD=your_secure_password
DB_NAME=founders_codex
NODE_ENV=production
PORT=3000
EOF
```

4. **Start with PM2**:
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'founders-codex-api',
    script: 'dist/api/main.*.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '1G',
    instances: 1,
    exec_mode: 'cluster'
  }]
}
EOF

# Start the application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Step 4: Configure Nginx (Reverse Proxy)**

1. **Install and configure Nginx**:
```bash
apt install nginx -y

cat > /etc/nginx/sites-available/founders-codex << 'EOF'
server {
    listen 80;
    server_name your_domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/founders-codex /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

2. **Setup SSL with Let's Encrypt**:
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your_domain.com
```

---

## 🧪 **Testing Your Deployment**

### **Test API Endpoints**:
```bash
# Replace YOUR_APP_URL with your actual URL
export API_URL="https://founders-codex-api-xxxxx.ondigitalocean.app/api"

# Test basic connectivity
curl -X GET "$API_URL/goals?userId=test-user"

# Test goal creation
curl -X POST "$API_URL/goals?userId=test-user" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Launch my startup",
    "type": "KEYSTONE",
    "description": "Build and launch a successful technology startup"
  }'

# Test habit creation
curl -X POST "$API_URL/habits?userId=test-user" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Read one page",
    "cue": "After my morning coffee"
  }'
```

---

## 💰 **Cost Breakdown**

### **App Platform (Recommended)**:
```
🎯 Basic App: $12/month
💾 Basic Database: $15/month
📊 Total: ~$27/month
```

### **Droplet Setup**:
```
💻 Basic Droplet: $12/month
💾 Managed Database: $15/month (optional)
🌐 Domain: $10-15/year
📊 Total: ~$27/month + domain
```

---

## 🔧 **Next Steps After Deployment**

### **1. Domain Setup**:
- Point your domain to Digital Ocean
- Configure custom domain in App Platform
- SSL will be automatically configured

### **2. Monitoring**:
- Set up Digital Ocean monitoring
- Configure alerts for downtime
- Monitor resource usage

### **3. Scaling**:
- Increase app instances during high traffic
- Upgrade database size as data grows
- Consider CDN for static assets

### **4. Security**:
- Implement proper authentication (JWT tokens)
- Set up API rate limiting
- Configure CORS properly for your frontend domain

---

## 🎉 **You're Live!**

Once deployed, your API will be accessible at:
```
https://your-app-name.ondigitalocean.app/api
```

**Example endpoints**:
- `GET /api/goals?userId=YOUR_USER_ID` - Get user's goals
- `POST /api/goals?userId=YOUR_USER_ID` - Create new goal
- `GET /api/habits?userId=YOUR_USER_ID` - Get user's habits
- `POST /api/habits?userId=YOUR_USER_ID` - Create new habit

The Founder's Codex backend is now ready to help users transform their entrepreneurial journey! 🚀

---

## 🆘 **Common Issues & Solutions**

### **Build Failures**:
```bash
# Check build logs in Digital Ocean dashboard
# Common fixes:
- Ensure package.json has correct scripts
- Check Node.js version compatibility
- Verify all dependencies are listed
```

### **Database Connection Issues**:
```bash
# Verify environment variables in App Platform
# Check database status in Digital Ocean dashboard
# Ensure TypeORM configuration matches environment variables
```

### **Performance Issues**:
```bash
# Monitor resource usage
# Consider upgrading app instance size
# Check database query performance
# Implement caching if needed
``` 