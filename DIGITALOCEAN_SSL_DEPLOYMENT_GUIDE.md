# DigitalOcean App Platform Deployment Guide
## Fixing SSL Certificate Issues with Managed PostgreSQL

This guide provides the complete solution for deploying your NestJS application to DigitalOcean App Platform with proper SSL configuration for managed PostgreSQL databases.

---

## 🔧 Updated TypeORM Configuration

The `app.module.ts` has been updated with a robust SSL configuration that handles DigitalOcean's managed database requirements:

### Key Features:
- ✅ **Flexible SSL modes**: Support for `require`, `allow`, and `disable`
- ✅ **CA Certificate support**: Secure connections with proper certificate validation
- ✅ **Fallback options**: Graceful degradation when CA cert is unavailable
- ✅ **Connection pooling**: Optimized for cloud deployment
- ✅ **Detailed logging**: Clear feedback on SSL configuration status

---

## 🗝️ Environment Variables Configuration

### Required Variables

Add these environment variables to your DigitalOcean App Platform:

```bash
# Database Connection (provided by DigitalOcean)
DATABASE_URL=postgresql://username:password@host:port/database

# Environment
NODE_ENV=production

# SSL Configuration
DB_SSL_MODE=require        # Options: require, allow, disable
DB_CA_CERT=               # CA certificate content (see below)
```

### Optional Variables for Fine-tuning
```bash
# Connection Tuning (optional - defaults are provided)
DB_CONNECTION_TIMEOUT=30000
DB_IDLE_TIMEOUT=30000
DB_MAX_CONNECTIONS=10
```

---

## 📋 Step-by-Step DigitalOcean Setup

### Step 1: Get Your CA Certificate

1. **Login to DigitalOcean Console**
2. **Navigate to Databases** → Your PostgreSQL cluster
3. **Go to "Overview" tab**
4. **Download the CA Certificate** or copy the certificate content

The certificate will look like this:
```
-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUTxWKoFN4... (your certificate content)
...
-----END CERTIFICATE-----
```

### Step 2: Configure Environment Variables in App Platform

1. **Go to your App Platform project**
2. **Navigate to Settings → Environment Variables**
3. **Add the following variables:**

| Variable | Value | Type |
|----------|-------|------|
| `NODE_ENV` | `production` | Text |
| `DB_SSL_MODE` | `require` | Text |
| `DB_CA_CERT` | `(paste full certificate)` | Text |

**Important**: When pasting the CA certificate:
- Include the full certificate including `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----`
- Preserve all line breaks and formatting
- No extra spaces or characters

### Step 3: Alternative SSL Configurations

Choose the option that best fits your security requirements:

#### Option A: Secure with CA Certificate (Recommended)
```bash
DB_SSL_MODE=require
DB_CA_CERT=-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUTxWKoFN4...
-----END CERTIFICATE-----
```

#### Option B: SSL without Certificate Validation (Less Secure)
```bash
DB_SSL_MODE=require
# Don't set DB_CA_CERT - will use rejectUnauthorized: false
```

#### Option C: Disable SSL (Development Only)
```bash
DB_SSL_MODE=disable
# SSL will be completely disabled
```

---

## 🚀 Deployment Process

### Step 1: Update Your Code
The TypeORM configuration in `app.module.ts` is already updated with the new SSL handling.

### Step 2: Set Environment Variables
Configure all required environment variables in DigitalOcean App Platform dashboard.

### Step 3: Deploy
```bash
# Commit your changes
git add .
git commit -m "fix: update SSL configuration for DigitalOcean deployment"
git push origin main

# DigitalOcean will automatically redeploy
```

### Step 4: Monitor Deployment
Watch the build logs for these confirmation messages:
```
🔧 Database Configuration:
NODE_ENV: production
Is Production: true
DATABASE_URL exists: true
🔐 Using provided CA certificate for secure database connection
🏭 Using production database config for DigitalOcean: {
  ssl: 'enabled',
  hasCaCert: true,
  sslMode: 'require'
}
```

---

## 🔍 Troubleshooting

### Issue 1: Still Getting SSL Certificate Errors

**Symptoms:**
```
Error: self-signed certificate in certificate chain
```

**Solutions:**
1. **Verify CA Certificate**: Ensure the complete certificate is copied correctly
2. **Check Environment Variables**: Verify `DB_CA_CERT` is set properly
3. **Try Option B**: Temporarily use SSL without certificate validation:
   ```bash
   DB_SSL_MODE=require
   # Remove DB_CA_CERT variable
   ```

### Issue 2: Connection Timeouts

**Symptoms:**
```
Error: connect ETIMEDOUT
```

**Solutions:**
1. **Check Database Status**: Ensure your managed database is running
2. **Verify Network Access**: Check if App Platform can reach the database
3. **Increase Timeouts**: Add these environment variables:
   ```bash
   DB_CONNECTION_TIMEOUT=60000
   DB_IDLE_TIMEOUT=60000
   ```

### Issue 3: Too Many Connections

**Symptoms:**
```
Error: sorry, too many clients already
```

**Solutions:**
1. **Reduce Pool Size**: Set `DB_MAX_CONNECTIONS=5`
2. **Upgrade Database**: Consider a larger database plan
3. **Check for Connection Leaks**: Review your application code

---

## 🔐 Security Best Practices

### 1. Always Use SSL in Production
```bash
# ✅ Good
DB_SSL_MODE=require

# ❌ Bad (only for development)
DB_SSL_MODE=disable
```

### 2. Use CA Certificate When Possible
```bash
# ✅ Most Secure
DB_SSL_MODE=require
DB_CA_CERT=<full-certificate>

# ⚠️ Less Secure (but sometimes necessary)
DB_SSL_MODE=require
# No DB_CA_CERT (uses rejectUnauthorized: false)
```

### 3. Rotate Certificates Regularly
- Check DigitalOcean for certificate updates
- Update `DB_CA_CERT` when certificates are renewed
- Monitor certificate expiration dates

---

## 🧪 Testing Your SSL Configuration

### Local Testing with Production-like Setup

Create a test script to verify your SSL configuration:

```typescript
// test-db-connection.ts
import { DataSource } from 'typeorm';

const testConnection = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_CA_CERT ? {
      ca: process.env.DB_CA_CERT,
      rejectUnauthorized: true,
      checkServerIdentity: false,
    } : {
      rejectUnauthorized: false,
      checkServerIdentity: false,
    },
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection successful!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

testConnection();
```

Run with:
```bash
npx ts-node test-db-connection.ts
```

---

## 📊 Configuration Matrix

| Environment | SSL Mode | CA Cert | rejectUnauthorized | Use Case |
|-------------|----------|---------|-------------------|----------|
| Development | `disable` | - | - | Local development |
| Staging | `require` | No | `false` | Testing deployment |
| Production | `require` | Yes | `true` | Secure production |
| Production Fallback | `require` | No | `false` | When CA cert issues occur |

---

## 🔄 Migration from Old Configuration

If you're updating from the previous SSL configuration:

### Before:
```typescript
ssl: {
  rejectUnauthorized: false,
  checkServerIdentity: false,
}
```

### After:
```typescript
// Automatically determined based on environment variables
ssl: sslOptions, // Handles CA cert, modes, and fallbacks
```

### Environment Variables to Add:
```bash
DB_SSL_MODE=require
DB_CA_CERT=<your-certificate>
```

---

## 🆘 Emergency Fallback

If you need to deploy quickly and fix SSL issues later:

1. **Set minimal SSL configuration:**
   ```bash
   DB_SSL_MODE=require
   # Don't set DB_CA_CERT
   ```

2. **This will use:** `rejectUnauthorized: false` (less secure but works)

3. **Later, add the CA certificate** for full security

---

## ✅ Verification Checklist

Before deploying, ensure:

- [ ] `NODE_ENV=production` is set
- [ ] `DATABASE_URL` is correctly configured by DigitalOcean
- [ ] `DB_SSL_MODE=require` is set
- [ ] `DB_CA_CERT` contains the full certificate (if using Option A)
- [ ] Environment variables are saved in App Platform
- [ ] Latest code with updated `app.module.ts` is pushed
- [ ] Deployment logs show successful SSL configuration

---

**Your deployment should now work successfully with DigitalOcean managed PostgreSQL!** 🚀

The new configuration provides flexibility, security, and clear logging to help you diagnose and resolve any remaining issues. 