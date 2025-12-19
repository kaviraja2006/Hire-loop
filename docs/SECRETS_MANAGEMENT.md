# Secrets Management Guide

This guide covers secure secret management practices for the Hire-loop application using various cloud platforms.

## 🎯 Core Principles

1. **Never commit secrets to Git** - Use secure storage solutions
2. **Separate secrets per environment** - Development, staging, and production should never share credentials
3. **Rotate secrets regularly** - Change credentials periodically
4. **Limit access** - Only authorized personnel should access production secrets
5. **Audit access** - Track who accesses secrets and when

## 🔐 Secret Management Options

We support three primary secret management solutions:

### Option 1: GitHub Secrets (Recommended for GitHub Actions)

Perfect for CI/CD pipelines using GitHub Actions.

#### Setup Steps

1. **Navigate to Repository Settings**

   ```
   Your Repo → Settings → Secrets and variables → Actions
   ```

2. **Add Repository Secrets**

   Click "New repository secret" and add each secret:

   ```
   Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_STAGING
   Value: pk_live_xxxxx

   Name: CLERK_SECRET_KEY_STAGING
   Value: sk_live_xxxxx

   Name: DATABASE_URL_STAGING
   Value: postgres://user:pass@host/db
   ```

3. **Add Environment-Specific Secrets**

   Create separate environments:
   - `staging` environment with staging secrets
   - `production` environment with production secrets

4. **Use in Workflows**

   Reference secrets in GitHub Actions:

   ```yaml
   - name: Build Application
     env:
       NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_PRODUCTION }}
       CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY_PRODUCTION }}
       DATABASE_URL: ${{ secrets.DATABASE_URL_PRODUCTION }}
     run: npm run build:production
   ```

#### Pros & Cons

✅ **Pros:**

- Free for GitHub repositories
- Native integration with GitHub Actions
- Easy to set up and manage
- Environment-based access control

❌ **Cons:**

- GitHub-specific (not portable)
- Limited to CI/CD usage
- No secret versioning

---

### Option 2: AWS Systems Manager Parameter Store

Best for applications deployed on AWS infrastructure.

#### Setup Steps

1. **Install AWS CLI**

   ```bash
   # macOS
   brew install awscli

   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

2. **Configure AWS Credentials**

   ```bash
   aws configure
   # AWS Access Key ID: YOUR_ACCESS_KEY
   # AWS Secret Access Key: YOUR_SECRET_KEY
   # Default region: us-east-1
   ```

3. **Store Secrets as SecureString Parameters**

   ```bash
   # Store staging secrets
   aws ssm put-parameter \
     --name "/hireloop/staging/clerk/publishable-key" \
     --value "pk_live_xxxxx" \
     --type "SecureString"

   aws ssm put-parameter \
     --name "/hireloop/staging/clerk/secret-key" \
     --value "sk_live_xxxxx" \
     --type "SecureString"

   aws ssm put-parameter \
     --name "/hireloop/staging/database/url" \
     --value "postgres://user:pass@host/db" \
     --type "SecureString"
   ```

4. **Retrieve Secrets in Application**

   Create a helper script `scripts/load-aws-secrets.js`:

   ```javascript
   const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
   const fs = require("fs");

   async function loadSecrets(environment) {
     const client = new SSMClient({
       region: process.env.AWS_REGION || "us-east-1",
     });

     const secrets = [
       "clerk/publishable-key",
       "clerk/secret-key",
       "database/url",
     ];

     let envContent = "";

     for (const secret of secrets) {
       const command = new GetParameterCommand({
         Name: `/hireloop/${environment}/${secret}`,
         WithDecryption: true,
       });

       const response = await client.send(command);
       const envVarName = secret.toUpperCase().replace(/\//g, "_");
       envContent += `${envVarName}=${response.Parameter.Value}\n`;
     }

     fs.writeFileSync(".env.local", envContent);
   }

   loadSecrets(process.argv[2] || "staging");
   ```

5. **Use in CI/CD**

   ```yaml
   - name: Load secrets from AWS
     run: |
       npm install @aws-sdk/client-ssm
       node scripts/load-aws-secrets.js production

   - name: Build
     run: npm run build:production
   ```

#### Pros & Cons

✅ **Pros:**

- Free tier available (10,000 parameters)
- Encrypted at rest
- Fine-grained IAM permissions
- Parameter versioning
- Works across any CI/CD platform

❌ **Cons:**

- Requires AWS account and setup
- More complex than GitHub Secrets
- AWS-specific

---

### Option 3: Azure Key Vault

Ideal for applications deployed on Azure or using Microsoft ecosystem.

#### Setup Steps

1. **Install Azure CLI**

   ```bash
   # macOS
   brew install azure-cli

   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **Login to Azure**

   ```bash
   az login
   ```

3. **Create Key Vault**

   ```bash
   # Create resource group
   az group create --name hireloop-rg --location eastus

   # Create key vault
   az keyvault create \
     --name hireloop-vault \
     --resource-group hireloop-rg \
     --location eastus
   ```

4. **Store Secrets**

   ```bash
   # Store staging secrets
   az keyvault secret set \
     --vault-name hireloop-vault \
     --name staging-clerk-publishable-key \
     --value "pk_live_xxxxx"

   az keyvault secret set \
     --vault-name hireloop-vault \
     --name staging-clerk-secret-key \
     --value "sk_live_xxxxx"

   az keyvault secret set \
     --vault-name hireloop-vault \
     --name staging-database-url \
     --value "postgres://user:pass@host/db"
   ```

5. **Retrieve Secrets**

   ```bash
   # Get a secret
   az keyvault secret show \
     --vault-name hireloop-vault \
     --name staging-clerk-secret-key \
     --query value -o tsv
   ```

6. **Use in CI/CD**

   For GitHub Actions with Azure:

   ```yaml
   - name: Azure Login
     uses: azure/login@v1
     with:
       creds: ${{ secrets.AZURE_CREDENTIALS }}

   - name: Get secrets from Key Vault
     run: |
       echo "CLERK_SECRET_KEY=$(az keyvault secret show --vault-name hireloop-vault --name production-clerk-secret-key --query value -o tsv)" >> .env.production
       echo "DATABASE_URL=$(az keyvault secret show --vault-name hireloop-vault --name production-database-url --query value -o tsv)" >> .env.production

   - name: Build
     run: npm run build:production
   ```

#### Pros & Cons

✅ **Pros:**

- Highly secure and compliant
- Secret versioning and lifecycle management
- RBAC and access policies
- Audit logging
- Supports hardware security modules (HSM)

❌ **Cons:**

- Requires Azure subscription (paid)
- More complex setup
- Azure-specific

---

## 🔄 Secret Rotation Best Practices

### When to Rotate

- **Regularly**: Every 90 days for production
- **After team changes**: When employees leave
- **After incidents**: If there's any suspected compromise
- **Before major releases**: As part of deployment preparation

### How to Rotate

1. **Generate new credentials** (e.g., new Clerk keys, new database password)
2. **Update secrets** in your chosen secret manager
3. **Deploy updated configuration** to staging first
4. **Verify functionality** in staging
5. **Deploy to production**
6. **Revoke old credentials** after confirming the new ones work

## 🎬 CI/CD Workflow Examples

See our example workflows:

- [`.github/workflows/deploy-staging.yml`](../.github/workflows/deploy-staging.yml)
- [`.github/workflows/deploy-production.yml`](../.github/workflows/deploy-production.yml)

## 🔍 Audit and Monitoring

### Track Secret Access

- **GitHub**: View audit logs in Organization Settings
- **AWS**: Enable CloudTrail for Parameter Store access logs
- **Azure**: Enable diagnostic logging for Key Vault

### Set Up Alerts

Configure alerts for:

- Secret access from unusual locations
- Failed authentication attempts
- Secret modifications
- Unauthorized access attempts

## 📋 Checklist: Before Going to Production

- [ ] All production secrets stored in secure vault (not in code)
- [ ] Separate secrets for dev/staging/production
- [ ] `.env.*` files added to `.gitignore`
- [ ] Team members have appropriate access levels
- [ ] Audit logging enabled
- [ ] Secret rotation schedule established
- [ ] Backup/recovery plan documented
- [ ] Monitoring and alerting configured

## 🆘 Emergency Procedures

### If Secrets Are Accidentally Committed

1. **Do NOT just delete the commit** - it's still in Git history
2. **Immediately rotate ALL exposed secrets**
3. **Use `git filter-branch` or `BFG Repo-Cleaner`** to remove from history
4. **Force push** after cleaning (coordinate with team)
5. **Notify security team** if in organization
6. **Review access logs** for any unauthorized usage

### Example: Remove Secrets from Git History

```bash
# Install BFG Repo-Cleaner
brew install bfg

# Clone a fresh copy
git clone --mirror git@github.com:username/repo.git

# Remove files containing secrets
bfg --delete-files .env.production repo.git

# Cleanup and push
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

## 📚 Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [AWS Parameter Store Best Practices](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-best-practices.html)
- [Azure Key Vault Best Practices](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)
