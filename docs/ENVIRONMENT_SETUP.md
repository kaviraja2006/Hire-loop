# Environment Setup Guide

This guide explains how to configure and manage environment-specific builds for the Hire-loop application.

## 📋 Overview

Our application supports three distinct environments:

- **Development** - Local development on your machine
- **Staging** - Pre-production testing environment
- **Production** - Live production environment

Each environment has its own configuration file and uses separate resources (databases, API keys, etc.).

## 🔧 Quick Start

### 1. Initial Setup

```bash
# Copy the example file to create your local environment file
cp .env.example .env.local

# Edit .env.local with your actual credentials
# NEVER commit this file to Git!
```

### 2. Configure Your Environment Variables

Open `.env.local` and replace all placeholder values with your actual credentials:

```bash
# Get Clerk keys from: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Get Database URL from: https://console.neon.tech
DATABASE_URL=postgres://user:password@host/database?sslmode=require
```

### 3. Install Dependencies

```bash
npm install
```

## 🌍 Environment-Specific Builds

### Development Build

For local development:

```bash
# Run development server
npm run dev

# Or run with development env file explicitly
npm run dev:staging
```

### Staging Build

For staging deployment:

```bash
# Build using staging configuration
npm run build:staging

# Start the server
npm start
```

### Production Build

For production deployment:

```bash
# Build using production configuration
npm run build:production

# Start the server
npm start
```

## 📁 Environment Files Explained

| File               | Purpose                                       | Tracked in Git? |
| ------------------ | --------------------------------------------- | --------------- |
| `.env.example`     | Template showing all required variables       | ✅ Yes          |
| `.env.local`       | Your local development secrets                | ❌ No           |
| `.env.development` | Development environment config                | ❌ No           |
| `.env.staging`     | Staging environment config                    | ❌ No           |
| `.env.production`  | Production environment config (template only) | ❌ No           |

## 🔐 Required Environment Variables

### Clerk Authentication

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Public key (safe to expose)
- `CLERK_SECRET_KEY` - Secret key (NEVER expose client-side)

### Database

- `DATABASE_URL` - PostgreSQL connection string

### Application URLs

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_APP_URL` - Frontend application URL

### Optional Settings

- `NEXT_PUBLIC_ENABLE_DEBUG` - Enable debug mode (development only)
- `NEXT_PUBLIC_LOG_LEVEL` - Logging verbosity

## ✅ Validation

Before building, validate your environment configuration:

```bash
npm run validate:env
```

This script checks:

- All required variables are set
- No placeholder values remain
- Environment files exist

## ⚠️ Important Security Notes

1. **NEVER commit real secrets to Git**
   - All `.env.*` files (except `.env.example`) are gitignored
   - Always use placeholder/template values in `.env.example`

2. **Use different credentials for each environment**
   - Development, staging, and production should have separate:
     - Database instances
     - Clerk projects
     - API keys

3. **Client-side vs Server-side variables**
   - Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
   - Never put sensitive data in `NEXT_PUBLIC_` variables

## 🚀 CI/CD Integration

See [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) for details on:

- Storing secrets in GitHub Secrets
- AWS Parameter Store integration
- Azure Key Vault integration

## 🐛 Troubleshooting

### Build fails with missing environment variables

**Solution:** Run `npm run validate:env` to see which variables are missing.

### Changes not reflecting after switching environments

**Solution:** Stop the dev server, switch environment files, and restart:

```bash
# Stop server (Ctrl+C)
npm run build:staging
npm start
```

### Environment variables not loading

**Solution:** Ensure you're using the correct command:

```bash
# ✅ Correct
npm run build:staging

# ❌ Incorrect (uses default .env)
npm run build
```

## 📚 Related Documentation

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Clerk Documentation](https://clerk.com/docs)
- [Neon Database Docs](https://neon.tech/docs)
- [Secrets Management Guide](./SECRETS_MANAGEMENT.md)
