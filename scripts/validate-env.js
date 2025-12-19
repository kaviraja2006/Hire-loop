#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Environment Validation Script
 * Validates that all required environment variables are present
 * Run this before building to catch configuration issues early
 */

const fs = require("fs");
const path = require("path");

// Required environment variables for all environments
const REQUIRED_VARS = [
  "NODE_ENV",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "DATABASE_URL",
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_APP_URL",
];

// Optional but recommended variables
const RECOMMENDED_VARS = [
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
];

function validateEnvironment() {
  console.log("🔍 Validating environment variables...\n");

  let hasErrors = false;
  const missingRequired = [];
  const missingRecommended = [];

  // Check required variables
  REQUIRED_VARS.forEach((varName) => {
    if (!process.env[varName]) {
      missingRequired.push(varName);
      hasErrors = true;
    }
  });

  // Check recommended variables
  RECOMMENDED_VARS.forEach((varName) => {
    if (!process.env[varName]) {
      missingRecommended.push(varName);
    }
  });

  // Report results
  if (missingRequired.length > 0) {
    console.error("❌ Missing REQUIRED environment variables:");
    missingRequired.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error("");
  }

  if (missingRecommended.length > 0) {
    console.warn("⚠️  Missing RECOMMENDED environment variables:");
    missingRecommended.forEach((varName) => {
      console.warn(`   - ${varName}`);
    });
    console.warn("");
  }

  // Check for placeholder values (common mistake)
  const placeholderPatterns = [
    "your_key_here",
    "your_password_here",
    "your_secret_here",
    "placeholder",
    "example.com",
  ];

  const suspiciousVars = [];
  [...REQUIRED_VARS, ...RECOMMENDED_VARS].forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      placeholderPatterns.forEach((pattern) => {
        if (value.toLowerCase().includes(pattern)) {
          suspiciousVars.push(varName);
        }
      });
    }
  });

  if (suspiciousVars.length > 0) {
    console.warn("⚠️  Variables that appear to contain placeholder values:");
    suspiciousVars.forEach((varName) => {
      console.warn(`   - ${varName}`);
    });
    console.warn("   Please ensure these are set to actual values.\n");
  }

  // Final report
  if (
    !hasErrors &&
    missingRecommended.length === 0 &&
    suspiciousVars.length === 0
  ) {
    console.log("✅ All environment variables are properly configured!\n");
    return true;
  } else if (!hasErrors) {
    console.log("✅ All required variables are set (with some warnings)\n");
    return true;
  } else {
    console.error("❌ Environment validation failed!");
    console.error(
      "   Please check your .env file and ensure all required variables are set.\n"
    );
    console.error("   See .env.example for a template.\n");
    return false;
  }
}

// Check if .env file exists
function checkEnvFileExists() {
  const possibleEnvFiles = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.staging",
    ".env.production",
  ];

  const existingFiles = possibleEnvFiles.filter((file) =>
    fs.existsSync(path.join(process.cwd(), file))
  );

  if (existingFiles.length === 0) {
    console.error("❌ No environment file found!");
    console.error("   Expected one of: " + possibleEnvFiles.join(", "));
    console.error("   Copy .env.example to .env and configure it.\n");
    return false;
  }

  console.log(
    "📄 Found environment file(s): " + existingFiles.join(", ") + "\n"
  );
  return true;
}

// Main execution
if (!checkEnvFileExists()) {
  process.exit(1);
}

if (!validateEnvironment()) {
  process.exit(1);
}

process.exit(0);
