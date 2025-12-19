# Quick Reference - TypeScript & ESLint Commands

## 🚀 Most Used Commands

```bash
# Run linting
npm run lint

# Auto-format code
npm run format

# Check formatting
npm run format:check

# Fix linting issues
npm run lint -- --fix

# Start development server
npm run dev
```

---

## 📋 Command Explanations

### `npm run lint`

- **What it does**: Checks all TypeScript/JavaScript files for code quality issues
- **When to use**: Before committing, during development
- **Output**: Lists all linting errors and warnings
- **Exit code**: 0 if no errors, 1 if errors found

### `npm run format`

- **What it does**: Auto-formats all files according to Prettier rules
- **When to use**: To fix formatting issues, before committing
- **Output**: Lists all files that were formatted
- **Note**: Modifies files in place

### `npm run format:check`

- **What it does**: Checks if files are formatted correctly
- **When to use**: To verify formatting without changing files
- **Output**: Lists files that need formatting
- **Note**: Does NOT modify files

### `npm run lint -- --fix`

- **What it does**: Automatically fixes auto-fixable linting issues
- **When to use**: When lint errors can be auto-corrected
- **Output**: Shows fixed issues and remaining errors
- **Note**: Some issues require manual fixes

---

## 🔍 Common Linting Issues & Fixes

### Unused Variable

```typescript
// Error: 'userId' is assigned a value but never used
const userId = getUserId();
const userName = getUserName();
return userName;

// Fix: Remove unused variable
const userName = getUserName();
return userName;
```

### Console Statement

```typescript
// Warning: Unexpected console statement
console.log("Debug:", data);

// Fix: Remove or comment out
// console.log("Debug:", data);
```

### Missing Semicolon

```typescript
// Error: Missing semicolon
const name = "John";

// Fix: Add semicolon (or run npm run format)
const name = "John";
```

### Wrong Quote Style

```typescript
// Error: Strings must use double quote
const message = "Hello";

// Fix: Use double quotes (or run npm run format)
const message = "Hello";
```

### Implicit Any

```typescript
// Error: Parameter 'data' implicitly has an 'any' type
function process(data) {
  return data.value;
}

// Fix: Add explicit type
function process(data: { value: string }) {
  return data.value;
}
```

---

## 🪝 Pre-Commit Hook Behavior

### What Happens When You Commit?

1. **You run**: `git commit -m "your message"`
2. **Husky triggers**: `.husky/pre-commit` hook
3. **lint-staged runs**: Only on staged files
4. **ESLint runs**: `eslint --fix` on `.ts`, `.tsx`, `.js`, `.jsx`
5. **Prettier runs**: `prettier --write` on all staged files
6. **Commit proceeds**: If no unfixable errors
7. **Commit blocked**: If there are errors you must fix manually

### If Commit Fails

```bash
# 1. Check what failed
npm run lint

# 2. Try auto-fixing
npm run lint -- --fix
npm run format

# 3. Re-stage files
git add .

# 4. Commit again
git commit -m "your message"
```

---

## 🎨 Prettier Rules

| Setting         | Value      | Meaning                              |
| --------------- | ---------- | ------------------------------------ |
| `singleQuote`   | `false`    | Use double quotes `"`                |
| `semi`          | `true`     | Always use semicolons `;`            |
| `tabWidth`      | `2`        | Use 2 spaces for indentation         |
| `trailingComma` | `"es5"`    | Add trailing commas where valid      |
| `printWidth`    | `80`       | Wrap lines at 80 characters          |
| `arrowParens`   | `"always"` | Always use parens in arrow functions |

---

## 🎯 ESLint Rules Quick Reference

| Rule                                 | Level   | Description                                 |
| ------------------------------------ | ------- | ------------------------------------------- |
| `no-console`                         | `warn`  | Warns about console statements              |
| `semi`                               | `error` | Requires semicolons                         |
| `quotes`                             | `error` | Requires double quotes                      |
| `no-unused-vars`                     | `warn`  | Warns about unused variables                |
| `prefer-const`                       | `error` | Requires const for non-reassigned variables |
| `@typescript-eslint/no-explicit-any` | `warn`  | Warns about explicit any usage              |

---

## 💡 Quick Tips

### Speed Up Linting

```bash
# Lint only specific files
npx eslint path/to/file.ts

# Lint only changed files
git diff --name-only | grep -E '\.(ts|tsx|js|jsx)$' | xargs npx eslint
```

### Format Only Specific Files

```bash
# Format one file
npx prettier --write path/to/file.ts

# Format specific directory
npx prettier --write "components/**/*.tsx"
```

### Bypass Pre-Commit Hook (Emergency Only!)

```bash
# NOT RECOMMENDED - Only use in emergencies
git commit -m "emergency fix" --no-verify
```

---

## 🔧 Troubleshooting Quick Fixes

### "Husky not installed"

```bash
npm run prepare
```

### "ESLint not found"

```bash
npm install
```

### "Prettier conflicts with ESLint"

```bash
# Already configured! Both work together via eslint-config-prettier
```

### "Pre-commit hook not executable"

```bash
chmod +x .husky/pre-commit
```

---

## 📊 Understanding Lint Output

```bash
/path/to/file.tsx
  9:11  warning  'userId' is assigned a value but never used  @typescript-eslint/no-unused-vars
  ^^^^   ^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  Line   Level    Error Message                             Rule Name
```

- **Line**: Where the issue is located
- **Level**: `error` (must fix) or `warning` (should fix)
- **Message**: What's wrong
- **Rule**: ESLint rule that triggered

---

## ✅ Pre-Commit Checklist

Before committing, ensure:

- [ ] `npm run lint` passes (or only warnings)
- [ ] `npm run format:check` passes
- [ ] All TypeScript errors resolved
- [ ] No console.log statements (unless needed)
- [ ] All imports used
- [ ] All variables used

---

## 🎓 Learning Path

1. **Day 1**: Learn basic commands (`lint`, `format`)
2. **Day 2**: Understand common errors and how to fix
3. **Day 3**: Set up IDE integration (auto-format on save)
4. **Day 4**: Practice with pre-commit hooks
5. **Week 2**: Master TypeScript strict mode rules

---

**Keep this handy for quick reference! 📌**
