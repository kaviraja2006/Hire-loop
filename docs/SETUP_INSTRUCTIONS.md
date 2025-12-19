# Setup Instructions - TypeScript & ESLint Configuration

This guide helps new team members set up the code quality tools on their local machine.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Hire-loop
```

### 2. Install Dependencies

```bash
npm install
```

This will automatically:

- Install all project dependencies
- Set up Husky Git hooks (via the `prepare` script)
- Configure pre-commit hooks

### 3. Verify Setup

```bash
# Check if linting works
npm run lint

# Check if formatting works
npm run format:check
```

---

## 🔧 Configuration Files Overview

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "strict": true, // Enable all strict checks
    "noImplicitAny": true, // No implicit any types
    "noUnusedLocals": true, // Detect unused variables
    "noUnusedParameters": true, // Detect unused parameters
    "forceConsistentCasingInFileNames": true // Consistent file naming
  }
}
```

### ESLint Configuration (`.eslintrc.json`)

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"],
  "rules": {
    "no-console": "warn", // Warn on console.log
    "semi": ["error", "always"], // Require semicolons
    "quotes": ["error", "double"], // Use double quotes
    "prefer-const": "error" // Use const when possible
  }
}
```

### Prettier Configuration (`.prettierrc`)

```json
{
  "singleQuote": false, // Use double quotes
  "semi": true, // Add semicolons
  "tabWidth": 2, // 2 spaces for indentation
  "trailingComma": "es5" // Trailing commas where valid in ES5
}
```

---

## 📝 Available Commands

### Development

```bash
npm run dev                 # Start development server
npm run build              # Build for production
npm start                  # Start production server
```

### Code Quality

```bash
npm run lint               # Check for linting errors
npm run format             # Auto-format all files
npm run format:check       # Check if files are formatted correctly
```

### Environment-Specific

```bash
npm run dev:staging        # Run dev with staging environment
npm run build:staging      # Build with staging environment
npm run build:production   # Build with production environment
```

---

## 🪝 Pre-Commit Hooks

### How It Works

When you try to commit code, Husky will automatically:

1. Run `lint-staged` on your staged files
2. Run ESLint with auto-fix
3. Run Prettier to format code
4. Block the commit if there are unfixable errors

### What Gets Checked

```json
{
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix", // Fix linting issues
    "prettier --write" // Format code
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write" // Format config files
  ]
}
```

### Testing Pre-Commit Hooks

```bash
# Make a change to a file
echo "const test = 'hello'" >> test.ts

# Stage the file
git add test.ts

# Try to commit (hook will run)
git commit -m "test: checking pre-commit hooks"
```

---

## 🐛 Troubleshooting

### Husky Hooks Not Running?

```bash
# Reinstall Husky hooks
npm run prepare

# Make sure .husky/pre-commit is executable
chmod +x .husky/pre-commit
```

### ESLint Errors?

```bash
# Try auto-fixing
npm run lint -- --fix

# If that doesn't work, manually fix the reported issues
```

### Prettier Formatting Issues?

```bash
# Format all files
npm run format

# Format specific file
npx prettier --write path/to/file.ts
```

### Pre-Commit Hook Fails?

1. Check the error message in the terminal
2. Run `npm run lint` to see what needs fixing
3. Fix the issues manually or run `npm run lint -- --fix`
4. Re-stage your files: `git add .`
5. Try committing again

---

## 💡 Best Practices

### Writing Type-Safe Code

```typescript
// ❌ Bad - implicit any
function processData(data) {
  return data.map((item) => item.value);
}

// ✅ Good - explicit types
function processData(data: Array<{ value: string }>): string[] {
  return data.map((item) => item.value);
}
```

### Avoiding Unused Variables

```typescript
// ❌ Bad - unused variable
const userId = getUserId();
const userName = getUserName();
return userName;

// ✅ Good - only declare what you use
const userName = getUserName();
return userName;
```

### Console Statements

```typescript
// ❌ Bad - console.log in code
console.log("User data:", userData);

// ✅ Good - remove or use proper logging
// Use environment-aware logging or remove before commit
```

---

## 🎯 IDE Integration

### VS Code Setup (Recommended)

1. **Install Extensions**:
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)

2. **Configure Settings** (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

3. **Benefits**:
   - Auto-format on save
   - See linting errors inline
   - Auto-fix on save

---

## 📚 Learning Resources

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)

### ESLint

- [ESLint Getting Started](https://eslint.org/docs/latest/use/getting-started)
- [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)

### Prettier

- [Prettier Docs](https://prettier.io/docs/en/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Git Hooks

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)

---

## ✅ Checklist for New Team Members

- [ ] Cloned repository
- [ ] Ran `npm install`
- [ ] Verified Husky is installed (`.husky/pre-commit` exists)
- [ ] Ran `npm run lint` successfully
- [ ] Ran `npm run format` successfully
- [ ] Tested pre-commit hook with a test commit
- [ ] Installed VS Code extensions (ESLint & Prettier)
- [ ] Configured VS Code settings for auto-format
- [ ] Read this setup guide completely
- [ ] Ready to start coding! 🚀

---

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages carefully
3. Ask in the team chat/channel
4. Create an issue in the repository

---

**Happy coding with clean, type-safe code! 🎉**
