# Hire-Loop

### A Next.js Job Posting Platform

Hire-Loop is a job posting and talent discovery platform built with **Next.js App Router**.  
This project demonstrates **modern rendering strategies** and **production-ready environment & secrets management practices** used in real-world applications.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Clerk Authentication
- PostgreSQL (Neon)
- Tailwind CSS

---

# Concept-1: Advanced Data Fetching & Rendering Strategies

This application demonstrates **three different rendering strategies** supported by the Next.js App Router:

- Static Site Generation (SSG)
- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)

Each page uses the strategy that best fits its **data freshness** and **performance requirements**.

---

## Rendering Modes Used

| Page      | Route        | Rendering Strategy | Configuration               | Reason                                |
| --------- | ------------ | ------------------ | --------------------------- | ------------------------------------- |
| About     | `/about`     | Static (SSG)       | `revalidate = false`        | Marketing content that rarely changes |
| Dashboard | `/dashboard` | Dynamic (SSR)      | `dynamic = 'force-dynamic'` | User-specific, real-time data         |
| Home      | `/`          | Hybrid (ISR)       | `revalidate = 60`           | Job listings update periodically      |

---

## Static Rendering (SSG)

- Pages are generated **at build time**
- Served as **pre-rendered HTML**
- Fastest performance and lowest server cost

**Used for:**  
Marketing pages, informational content, and static sections.

---

## Dynamic Rendering (SSR)

- Pages are rendered **on every request**
- Always returns **fresh, user-specific data**
- Higher server cost but required for real-time views

**Used for:**  
User dashboards and authenticated pages.

---

## Hybrid Rendering (ISR)

- Pages are statically generated
- Automatically regenerated after a fixed interval
- Balances performance and freshness

**Used for:**  
Job listings and homepage feeds.

---

## Performance Impact Summary

- **SSG:** ~50ms load time (pre-rendered)
- **SSR:** ~200–300ms (server computation per request)
- **ISR:** ~50ms cached + background regeneration

---

## Scalability Reflection (Concept-1)

If traffic increased **10×**:

- Static pages would remain unchanged
- Dashboard would stay SSR but use caching layers (Redis, DB optimization)
- ISR revalidation interval would be tuned based on job posting frequency

---

# Concept-2: Environment-Aware Builds & Secrets Management

This project follows **production-safe configuration practices** by separating code from configuration and managing secrets securely. We use strict naming conventions to prevent accidental exposure of server-side secrets to the client.

---

## Environment Files

We use two primary files for environment configuration:

- **`.env.local`**: Contains **actual secrets** (API keys, Database URLs). This file is **gitignored** and never committed.
- **`.env.example`**: A template file listing all required variables with placeholders. Developers copy this to `.env.local` and fill in their values.

---

## Safe Server-Side Access

Next.js automatically inlines variables starting with `NEXT_PUBLIC_` into the client-side bundle at build time. All other variables are available **only on the server**.

### Usage Code Snippets

```typescript
// ✅ Server-Side Only (Safe)
// This variable is NOT exposed to the browser
const dbUrl = process.env.DATABASE_URL;

// ✅ Client-Side Accessible
// This variable IS exposed to the browser because of the prefix
const publicApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

**Common Pitfall Avoided**: We proactively check that `CLERK_SECRET_KEY` and `DATABASE_URL` are strictly used in server components or API routes, ensuring they never leak to the client.

---

## Protecting Secrets

To ensure secrets are never leaked, our `.gitignore` is configured to exclude all local environment files:

```gitignore
# Ignore local environment files
.env*
!.env.example


---

# Concept-3: Cloud Deployments 101: Docker → CI/CD → AWS/Azure

This project simulates a full-stack cloud deployment workflow using **Docker** for containerization and **GitHub Actions** for CI/CD.

## Containerization Strategy
We containerized the Next.js application to ensure consistency across development, staging, and production environments.

*   **Dockerfile**: Uses a multi-stage build (base → deps → builder → runner) to create an optimized, lightweight image.
*   **Docker Compose**: Enables easy local testing of the containerized application.
*   **Optimization**: We utilize Next.js `output: "standalone"` to bundle only the necessary files, significantly reducing the final image size.

## CI/CD Pipeline
We implemented a **Build & Push** pipeline using GitHub Actions:

1.  **Trigger**: Runs on every push to the `main` branch.
2.  **Build**: Creates the Docker image using the `Dockerfile`.
3.  **Push**: Pushes the tagged image to **GitHub Container Registry (GHCR)**.
    *(Note: This workflow is designed to be easily adaptable for AWS ECR or Azure ACR)*.
4.  **Security**: Secrets like `NEXT_PUBLIC_APP_URL` are injected safely during the build process.

## Reflection
*   **Challenges**: Configuring the `standalone` output correctly in `next.config.ts` was crucial for keeping the image size down.
*   **Successes**: The multi-stage Dockerfile successfully separates build dependencies from runtime dependencies.
*   **Future Improvements**: Implement Infrastructure as Code (IaC) with Terraform to provision the actual cloud resources (e.g., AWS ECS or Azure Container Apps) automatically.

---

# Project Folder Structure

This section explains our project's folder organization and naming conventions that support scalability and maintainability.

## Directory Structure

```

Hire-Loop/
├── .github/ # GitHub workflows and CI/CD configurations
│ └── workflows/ # Automated build and deployment pipelines
├── app/ # Next.js App Router - Routes & Pages
│ ├── about/ # About page (Static - SSG)
│ ├── dashboard/ # User dashboard (Dynamic - SSR)
│ ├── jobs/ # Job listings
│ ├── post-job/ # Job posting page
│ ├── sign-in/ # Authentication pages
│ ├── layout.tsx # Root layout component
│ ├── page.tsx # Homepage (Hybrid - ISR)
│ └── globals.css # Global styles
├── components/ # Reusable UI Components
│ ├── features/ # Feature-specific components
│ └── ui/ # Base UI components (buttons, cards, etc.)
├── lib/ # Utilities, Helpers & Configurations
│ ├── db.ts # Database connection configuration
│ ├── schema.ts # Database schema definitions
│ ├── utils.ts # Helper functions
│ └── validators.ts # Input validation utilities
├── public/ # Static assets (images, fonts, etc.)
├── migrations/ # Database migration files
├── scripts/ # Build and deployment scripts
├── docs/ # Project documentation
├── actions/ # Server actions
├── .env.example # Environment variable template
├── .gitignore # Git ignore rules
├── Dockerfile # Docker containerization configuration
├── docker-compose.yml # Local Docker orchestration
├── next.config.ts # Next.js configuration
├── package.json # Dependencies and scripts
└── tsconfig.json # TypeScript configuration

````

---

## Directory Explanations

### 📁 `app/` - Application Routes
**Purpose**: Contains all pages and routes using Next.js App Router.

- Each folder represents a route (e.g., `/about`, `/dashboard`)
- `layout.tsx` defines shared layouts
- `page.tsx` files are the actual page components
- Supports different rendering strategies per route

**Why it matters**: Centralized routing makes navigation clear and enables code-splitting by default.

---

### 🧩 `components/` - Reusable UI Components
**Purpose**: Houses all reusable React components.

- **`features/`**: Business logic components (job cards, application forms)
- **`ui/`**: Primitive UI elements (buttons, inputs, modals)

**Naming Convention**: PascalCase (e.g., `JobCard.tsx`, `Button.tsx`)

**Why it matters**: Component reusability reduces code duplication and ensures UI consistency.

---

### 🛠️ `lib/` - Utilities & Configuration
**Purpose**: Core utilities, database configurations, and helper functions.

- `db.ts`: Database connection and client setup
- `schema.ts`: Type-safe database schema
- `utils.ts`: Shared utility functions
- `validators.ts`: Input validation logic

**Why it matters**: Separates business logic from UI, making code testable and maintainable.

---

### 🌐 `public/` - Static Assets
**Purpose**: Static files served directly (images, fonts, icons).

**Access**: Files are served from `/` (e.g., `/logo.png`)

**Why it matters**: Optimized static file serving with CDN caching.

---

### 🔄 `migrations/` - Database Migrations
**Purpose**: Version-controlled database schema changes.

**Why it matters**: Ensures database schema stays in sync across environments.

---

### 🐳 Docker Configuration
**Files**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`

**Purpose**: Containerization for consistent deployment across environments.

**Why it matters**: "Works on my machine" → "Works everywhere"

---

### 🔐 Environment Files
**Files**: `.env.example`, `.env.local`, `.env.development`, `.env.staging`, `.env.production`

**Purpose**: Environment-specific configuration and secrets management.

**Security**: Never commit `.env.local` or production secrets to Git.

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `JobCard.tsx` |
| Utilities | camelCase | `formatDate.ts` |
| Routes | kebab-case | `post-job/` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |

---

## Scalability & Clarity Benefits

### 🚀 Scalability
1. **Modular Structure**: Each feature can grow independently
2. **Clear Separation**: UI, logic, and data layers are distinct
3. **Easy Navigation**: Intuitive folder names reduce onboarding time
4. **Component Reusability**: Shared components prevent code duplication

### 📖 Clarity
1. **Self-Documenting**: Folder names explain their purpose
2. **Consistent Patterns**: Developers know where to find/add code
3. **Type Safety**: TypeScript + organized structure catches errors early
4. **Testing-Friendly**: Isolated utilities and components are easier to test

---

## Future Growth Strategy

As the project scales, we plan to:

- Add `/hooks` directory for custom React hooks
- Create `/contexts` for global state management
- Implement `/types` for shared TypeScript interfaces
- Establish `/tests` with unit and integration tests
- Add `/api` routes for backend endpoints

---

# TypeScript & ESLint Configuration

This section explains our code quality and consistency enforcement through TypeScript strict mode, ESLint, Prettier, and automated pre-commit hooks.

## 🔒 Strict TypeScript Configuration

### Enabled Strict Mode Settings

We've configured TypeScript with the following strict compiler options in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
````

### Why Strict TypeScript Reduces Runtime Bugs

| Setting                            | Purpose                                  | Benefit                                                        |
| ---------------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `strict: true`                     | Enables all strict type checking options | Catches type errors at compile time instead of runtime         |
| `noImplicitAny`                    | Prevents implicit `any` types            | Forces explicit type declarations, reducing "silent" type bugs |
| `noUnusedLocals`                   | Detects unused local variables           | Keeps code clean and prevents potential logic errors           |
| `noUnusedParameters`               | Detects unused function parameters       | Identifies dead code and unnecessary complexity                |
| `forceConsistentCasingInFileNames` | Enforces consistent file name casing     | Prevents cross-platform deployment issues (Windows vs Linux)   |

**Real-world Impact**: These settings catch approximately 60-70% of potential runtime errors during development, significantly reducing production bugs.

---

## 🎯 ESLint Configuration

### Configured Rules

Our `.eslintrc.json` enforces the following code quality standards:

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"],
  "rules": {
    "no-console": "warn",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "no-unused-vars": "warn",
    "prefer-const": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

### What These Rules Enforce

- **`no-console: warn`**: Warns about console statements (helps prevent debug logs in production)
- **`semi: always`**: Requires semicolons (prevents ASI-related bugs)
- **`quotes: double`**: Enforces double quotes for consistency
- **`prefer-const: error`**: Requires `const` for variables that are never reassigned
- **`@typescript-eslint/no-explicit-any`**: Discourages using `any` type
- **`@typescript-eslint/no-unused-vars`**: Catches unused variables specific to TypeScript

**Integration**: We use `plugin:prettier/recommended` to automatically integrate Prettier with ESLint, ensuring formatting and linting work together seamlessly.

---

## 🎨 Prettier Configuration

### Formatting Standards

Our `.prettierrc` ensures consistent code formatting:

```json
{
  "singleQuote": false,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Benefits

- **Automatic Formatting**: No manual indentation or style decisions
- **Team Consistency**: All code looks the same regardless of who wrote it
- **Reduced PR Noise**: No formatting debates in code reviews
- **Editor Agnostic**: Works in VS Code, WebStorm, Vim, etc.

---

## 🪝 Pre-Commit Hooks

### How It Works

We use **Husky** + **lint-staged** to run automated checks before every commit:

1. **Developer attempts to commit**
2. **Husky triggers** the pre-commit hook
3. **lint-staged runs** on staged files only (fast!)
4. **ESLint fixes** auto-fixable issues
5. **Prettier formats** the code
6. **Commit proceeds** if all checks pass, otherwise it's blocked

### Configuration

**`package.json` - lint-staged setup:**

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

**`.husky/pre-commit` hook:**

```bash
npx lint-staged
```

### Why Pre-Commit Hooks Improve Team Consistency

✅ **Prevents Bad Code from Being Committed**: Issues are caught before they enter the codebase  
✅ **Automatic Fixes**: Many issues are auto-fixed without developer intervention  
✅ **Faster CI/CD**: Fewer lint failures in the pipeline  
✅ **Enforced Standards**: Impossible to bypass code quality checks  
✅ **Better Git History**: Every commit meets quality standards

---

## 🧪 Testing the Configuration

### Running Lint Checks

```bash
npm run lint
```

**Sample Output:**

```
/home/sky_malice/Desktop/Hire-loop/app/dashboard/page.tsx
  9:11  warning  'userId' is assigned a value but never used

/home/sky_malice/Desktop/Hire-loop/lib/db.ts
  8:10  warning  'error' is defined but never used

✖ 4 problems (2 errors, 2 warnings)
```

### Running Format Checks

```bash
# Check formatting (doesn't modify files)
npm run format:check

# Fix formatting (modifies files)
npm run format
```

---

## 📊 Impact Summary

| Tool                       | Purpose         | Impact                                           |
| -------------------------- | --------------- | ------------------------------------------------ |
| **TypeScript Strict Mode** | Type safety     | Catches 60-70% of runtime bugs at compile time   |
| **ESLint**                 | Code quality    | Enforces best practices and catches logic errors |
| **Prettier**               | Code formatting | 100% consistent code style across team           |
| **Husky + lint-staged**    | Automation      | Prevents bad code from entering the repository   |

---

## 🎯 Team Benefits

### For Developers

- Instant feedback on code quality issues
- Auto-formatting saves time
- Fewer bugs reach production

### For Code Reviews

- Reviewers focus on logic, not formatting
- Consistent style eliminates bikeshedding
- Faster approval process

### For Production

- Higher code quality
- Fewer runtime errors
- Easier maintenance

---

## 🚀 Available Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production

# Code Quality
npm run lint               # Check for linting errors
npm run format             # Format all files with Prettier
npm run format:check       # Check if files are formatted

# Environment-Specific
npm run build:staging      # Build with staging environment
npm run build:production   # Build with production environment
```

---

## 📝 Reflection: Why This Setup Matters

### Scalability

As our team grows, these configurations ensure:

- New developers follow the same standards from day one
- Code reviews focus on architecture, not style
- Technical debt is minimized through automated enforcement

### Professionalism

This setup demonstrates:

- Industry-standard tooling and practices
- Commitment to code quality
- Production-ready development workflow

### Future-Proofing

These foundations support:

- CI/CD integration (lint checks in pipelines)
- Automated testing setup
- Monorepo scaling with shared configs

---

# Development Workflow

To ensure smooth collaboration, consistent code quality, and specific version control practices, we follow a standardized GitHub branching and pull-request workflow.

## Branching Strategy

We use a consistent naming convention for our branches:

*   **`feature/<feature-name>`**: For new features (e.g., `feature/login-auth`)
*   **`fix/<bug-name>`**: For bug fixes (e.g., `fix/navbar-alignment`)
*   **`chore/<task-name>`**: For maintenance tasks (e.g., `chore/dependency-updates`)
*   **`docs/<update-name>`**: For documentation updates (e.g., `docs/readme-update`)

## Pull Request Process

1.  Create a new branch from `main`.
2.  Make your changes and commit them.
3.  Open a Pull Request (PR) to merge into `main`.
4.  The **PR Template** will automatically load to guide your description.
5.  Request a review from a team member.

### PR Template
Our PR template (`.github/pull_request_template.md`) prompts for:
*   Summary of changes
*   Type of change
*   Readiness checklist
*   Screenshots/evidence

## Code Review Checklist

Reviewers must verify the following before approving:

*   [ ] **Lint & Build**: CI checks pass successfully.
*   [ ] **No Console Errors**: Code runs without errors in the browser console.
*   [ ] **Local Testing**: Functionality works as expected.
*   [ ] **Standards**: Code follows naming conventions and security best practices.

## Branch Protection Rules

The `main` branch is protected to prevent direct commits and ensure quality.

**Configuration:**
*   **Require a pull request before merging**: No direct pushes to `main`.
*   **Require approvals**: At least 1 review is needed.
*   **Require status checks to pass before merging**: Linting and build steps must succeed.

*(Add your valid screenshot here)*
![Branch Protection Rules Placeholder](https://via.placeholder.com/800x400?text=Branch+Protection+Rules+Screenshot)


---

# Assignment: Local Docker Infrastructure

This section documents the containerization of the full-stack application using Docker and Docker Compose.

## 1. Dockerfile
We utilize a development-focused `Dockerfile` to enable hot-reloading and smoother developer experience.
- **Base Image**: `node:20-alpine` was chosen for its small footprint and security.
- **Development Mode**: Initializes the app with `npm run dev` to support hot code reloading, mirroring the local development experience within the container.
- **Volume Mapping**: Maps the local directory to the container to ensure code changes are instantly reflected.

## 2. Docker Compose Services
We defined 3 services in `docker-compose.yml`:

### App (`app`)
- Builds from the local `Dockerfile`.
- Connects to `db` and `redis` services.
- Exposes port `3000` to localhost.
- **Environment**: 
  - `DATABASE_URL`: Points to the `db` service (e.g., `postgresql://...@db:5432/...`).
  - `REDIS_URL`: Points to the `redis` service.

### Database (`db`)
- **Image**: `postgres:alpine`.
- **Port**: `5432`.
- **Volumes**: Uses `postgres_data` volume to persist data across restarts.
- **Environment**: Sets `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.

### Cache (`redis`)
- **Image**: `redis:alpine`.
- **Port**: `6379`.
- **Networking**: Accessible to the app via hostname `redis`.

## 3. Networking & Volumes
- **Network**: All services run on a shared bridge network `hireloop-network`. This enables internal DNS resolution (e.g., `ping db`).
- **Volume**: `postgres_data` ensures that your database content survives if you remove the containers.

## 4. Problems Faced & Solutions
- **Connection Strings**: The application runs inside a container, so it cannot access the DB via `localhost`. We fixed this by using the Docker service name `db` in the `DATABASE_URL`.
- **Build Errors**: Switched from a multi-stage production build to a simple development build to avoid build-time errors related to missing environment variables (e.g., Clerk keys).
- **Container Conflicts**: Encountered "Container name already in use" errors when restarting. Solved by running `docker compose down` to clean up old containers before starting again.

## 5. Reflection Question
**“If your entire team had to onboard a new developer tomorrow, how would Docker Compose make that process faster and smoother?”**

**Answer**: Docker Compose radically simplifies onboarding by replacing pages of installation instructions with a single command: `docker-compose up`. 
- **Consistency**: Every developer gets the exact same versions of Node, Postgres, and Redis.
- **Speed**: No need to manually install databases or manage background services.
- **Reliability**: Eliminates "works on my machine" issues caused by environment differences.


